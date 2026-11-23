import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '@config/db';
import { getPageGeneratorModel, getTextAssistantModel, parseGeminiJson } from '@config/gemini';

// ============================================================
// Biaya token per operasi AI
// ============================================================
const TOKEN_COSTS: Record<string, number> = {
  GENERATE_PAGE: 10,
  REPHRASE_TEXT: 1,
  EXTEND_TEXT: 1,
  SHORTEN_TEXT: 1,
  CHANGE_TONE: 1,
  GENERATE_SECTION: 3,
};

// ============================================================
// Helper: Debit token dari user
// ============================================================
const debitToken = async (
  userId: string,
  operationType: string,
  cost: number,
  landingPageId?: string,
  description?: string
): Promise<void> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { tokenBalance: { decrement: cost } },
    select: { tokenBalance: true },
  });

  await prisma.aiTokenLog.create({
    data: {
      userId,
      logType: 'DEBIT',
      operationType: operationType as Parameters<typeof prisma.aiTokenLog.create>[0]['data']['operationType'],
      tokenAmount: cost,
      balanceAfter: user.tokenBalance,
      landingPageId: landingPageId || null,
      description: description || `Operasi AI: ${operationType}`,
    },
  });
};

// ============================================================
// POST /api/ai/generate-page
// Generate full landing page dari kuesioner
// ============================================================
export const generateLandingPage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { businessName, category, description, tone = 'profesional', templateId } = req.body;
  const userId = req.user!.id;
  const COST = TOKEN_COSTS.GENERATE_PAGE;

  try {
    // Cek saldo token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < COST) {
      res.status(402).json({
        success: false,
        message: `Token tidak cukup. Operasi ini membutuhkan ${COST} token. Saldo Anda: ${user?.tokenBalance ?? 0} token.`,
      });
      return;
    }

    // Prompt ke Gemini
    const prompt = `
Kamu adalah AI copywriter profesional untuk UMKM Indonesia. Buat konten landing page yang menarik untuk usaha berikut:

Nama Usaha: ${businessName}
Kategori: ${category}
Deskripsi: ${description}
Tone: ${tone}

Buat landing page dengan sections berikut dalam format JSON array:
[
  {
    "sectionType": "HERO",
    "label": "Hero Utama",
    "sortOrder": 0,
    "contentJson": {
      "headline": "...",
      "subheadline": "...",
      "ctaText": "...",
      "backgroundImage": null
    }
  },
  {
    "sectionType": "FEATURES",
    "label": "Keunggulan Kami",
    "sortOrder": 1,
    "contentJson": {
      "title": "...",
      "items": [{"icon": "...", "title": "...", "description": "..."}]
    }
  },
  {
    "sectionType": "CATALOG",
    "label": "Produk/Layanan",
    "sortOrder": 2,
    "contentJson": {
      "title": "...",
      "items": [{"name": "...", "description": "...", "price": "...", "image": null}]
    }
  },
  {
    "sectionType": "TESTIMONIALS",
    "label": "Testimoni Pelanggan",
    "sortOrder": 3,
    "contentJson": {
      "title": "...",
      "items": [{"name": "...", "rating": 5, "comment": "...", "avatar": null}]
    }
  },
  {
    "sectionType": "FAQ",
    "label": "Pertanyaan Umum",
    "sortOrder": 4,
    "contentJson": {
      "title": "...",
      "items": [{"question": "...", "answer": "..."}]
    }
  },
  {
    "sectionType": "CONTACT",
    "label": "Hubungi Kami",
    "sortOrder": 5,
    "contentJson": {
      "title": "...",
      "address": "...",
      "email": "...",
      "whatsapp": "..."
    }
  }
]

PENTING: Gunakan bahasa Indonesia yang ${tone}. Isi konten harus relevan dengan usaha ${businessName} yang bergerak di bidang ${category}. Kembalikan HANYA JSON array tanpa teks tambahan.
    `.trim();

    const model = getPageGeneratorModel();
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const sections = parseGeminiJson<Array<Record<string, unknown>>>(rawText);

    // Generate slug
    const baseSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Buat landing page & sections dalam transaction
    const landingPage = await prisma.$transaction(async (tx) => {
      const page = await tx.landingPage.create({
        data: {
          userId,
          templateId: templateId || null,
          title: `${businessName} — Landing Page`,
          slug,
          publishStatus: 'DRAFT',
          businessName,
          category,
          description,
          tone,
          tokenConsumed: COST,
          sections: {
            create: sections.map((s, idx) => ({
              sectionType: (s.sectionType as string) || 'CUSTOM',
              label: (s.label as string) || `Section ${idx + 1}`,
              sortOrder: typeof s.sortOrder === 'number' ? s.sortOrder : idx,
              contentJson: (s.contentJson as object) || {},
              styleJson: null,
              isVisible: true,
            })),
          },
        },
        include: { sections: { orderBy: { sortOrder: 'asc' } } },
      });
      return page;
    });

    // Debit token
    await debitToken(userId, 'GENERATE_PAGE', COST, landingPage.id,
      `Generate landing page: ${businessName}`);

    res.status(201).json({
      success: true,
      message: `Landing page berhasil dibuat oleh AI! ${COST} token digunakan.`,
      data: landingPage,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal generate landing page.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// Helper: Text operation (rephrase/extend/shorten/change-tone)
// ============================================================
const handleTextOperation = async (
  req: Request,
  res: Response,
  operationType: string,
  buildPrompt: (text: string) => string,
  successMessage: string
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { text, landingPageId } = req.body;
  const userId = req.user!.id;
  const COST = TOKEN_COSTS[operationType] || 1;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < COST) {
      res.status(402).json({
        success: false,
        message: `Token tidak cukup. Dibutuhkan ${COST} token. Saldo: ${user?.tokenBalance ?? 0}.`,
      });
      return;
    }

    // Pastikan landing page milik user
    const page = await prisma.landingPage.findFirst({
      where: { id: landingPageId, userId },
      select: { id: true },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const model = getTextAssistantModel();
    const result = await model.generateContent(buildPrompt(text));
    const resultText = result.response.text().trim();

    await debitToken(userId, operationType, COST, landingPageId, `AI ${operationType}: ${text.slice(0, 50)}`);

    res.status(200).json({
      success: true,
      message: successMessage,
      data: { original: text, result: resultText, tokenUsed: COST },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : `Gagal melakukan operasi ${operationType}.`;
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/ai/rephrase
// ============================================================
export const rephraseText = (req: Request, res: Response): Promise<void> =>
  handleTextOperation(
    req, res, 'REPHRASE_TEXT',
    (text) => `Tulis ulang teks berikut dengan kalimat yang lebih menarik dan natural dalam bahasa Indonesia. Kembalikan hanya teks hasil penulisan ulang tanpa penjelasan apapun:\n\n${text}`,
    'Teks berhasil ditulis ulang oleh AI.'
  );

// ============================================================
// POST /api/ai/extend
// ============================================================
export const extendText = (req: Request, res: Response): Promise<void> =>
  handleTextOperation(
    req, res, 'EXTEND_TEXT',
    (text) => `Perpanjang dan kembangkan teks berikut menjadi lebih detail dan informatif dalam bahasa Indonesia. Jaga konsistensi tone. Kembalikan hanya teks hasil pengembangan:\n\n${text}`,
    'Teks berhasil dikembangkan oleh AI.'
  );

// ============================================================
// POST /api/ai/shorten
// ============================================================
export const shortenText = (req: Request, res: Response): Promise<void> =>
  handleTextOperation(
    req, res, 'SHORTEN_TEXT',
    (text) => `Persingkat teks berikut menjadi lebih ringkas namun tetap informatif dalam bahasa Indonesia. Kembalikan hanya teks hasil pemadatan:\n\n${text}`,
    'Teks berhasil dipersingkat oleh AI.'
  );

// ============================================================
// POST /api/ai/change-tone
// ============================================================
export const changeTone = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { text, tone, landingPageId } = req.body;
  const userId = req.user!.id;
  const COST = TOKEN_COSTS.CHANGE_TONE;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { tokenBalance: true } });

    if (!user || user.tokenBalance < COST) {
      res.status(402).json({
        success: false,
        message: `Token tidak cukup. Dibutuhkan ${COST} token. Saldo: ${user?.tokenBalance ?? 0}.`,
      });
      return;
    }

    const page = await prisma.landingPage.findFirst({
      where: { id: landingPageId, userId },
      select: { id: true },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const toneMap: Record<string, string> = {
      profesional: 'sangat profesional dan formal',
      friendly: 'ramah dan hangat',
      fun: 'fun, ceria, dan penuh semangat',
      formal: 'formal dan terhormat',
      casual: 'kasual dan santai',
    };

    const model = getTextAssistantModel();
    const prompt = `Ubah tone teks berikut menjadi ${toneMap[tone] || tone} dalam bahasa Indonesia. Kembalikan hanya teks hasil perubahan:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const resultText = result.response.text().trim();

    await debitToken(userId, 'CHANGE_TONE', COST, landingPageId, `Change tone to ${tone}`);

    res.status(200).json({
      success: true,
      message: `Tone teks berhasil diubah menjadi "${tone}".`,
      data: { original: text, result: resultText, tone, tokenUsed: COST },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengubah tone teks.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/ai/generate-section
// Generate satu section baru dengan AI
// ============================================================
export const generateSection = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { landingPageId, sectionType, prompt: customPrompt } = req.body;
  const userId = req.user!.id;
  const COST = TOKEN_COSTS.GENERATE_SECTION;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { tokenBalance: true } });

    if (!user || user.tokenBalance < COST) {
      res.status(402).json({
        success: false,
        message: `Token tidak cukup. Dibutuhkan ${COST} token. Saldo: ${user?.tokenBalance ?? 0}.`,
      });
      return;
    }

    const page = await prisma.landingPage.findFirst({
      where: { id: landingPageId, userId },
      select: { id: true, businessName: true, category: true, tone: true },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const sectionTemplates: Record<string, string> = {
      HERO: `{"headline": "...", "subheadline": "...", "ctaText": "..."}`,
      FEATURES: `{"title": "...", "items": [{"icon": "?", "title": "...", "description": "..."}]}`,
      CATALOG: `{"title": "...", "items": [{"name": "...", "description": "...", "price": "...", "image": null}]}`,
      TESTIMONIALS: `{"title": "...", "items": [{"name": "...", "rating": 5, "comment": "...", "avatar": null}]}`,
      FAQ: `{"title": "...", "items": [{"question": "...", "answer": "..."}]}`,
      CONTACT: `{"title": "...", "address": "...", "email": "...", "whatsapp": "..."}`,
      GALLERY: `{"title": "...", "images": []}`,
      PRICING_TABLE: `{"title": "...", "plans": [{"name": "...", "price": "...", "features": ["..."]}]}`,
      CUSTOM: `{"title": "...", "content": "..."}`,
    };

    const prompt = `
Buat konten section "${sectionType}" untuk landing page bisnis:
Nama: ${page.businessName || 'UMKM Indonesia'}
Kategori: ${page.category || 'umum'}
Tone: ${page.tone || 'profesional'}
${customPrompt ? `Instruksi tambahan: ${customPrompt}` : ''}

Format JSON yang diperlukan:
${sectionTemplates[sectionType] || sectionTemplates.CUSTOM}

Kembalikan HANYA contentJson (object JSON) yang sesuai format di atas, tanpa teks lain.
    `.trim();

    const model = getPageGeneratorModel();
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const contentJson = parseGeminiJson<object>(rawText);

    // Simpan section ke database
    const lastSection = await prisma.section.findFirst({
      where: { landingPageId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const nextSortOrder = (lastSection?.sortOrder ?? -1) + 1;

    const section = await prisma.section.create({
      data: {
        landingPageId,
        sectionType,
        label: `${sectionType.charAt(0) + sectionType.slice(1).toLowerCase()} (AI Generated)`,
        sortOrder: nextSortOrder,
        contentJson,
        isVisible: true,
      },
    });

    await debitToken(userId, 'GENERATE_SECTION', COST, landingPageId,
      `Generate section ${sectionType}`);

    res.status(201).json({
      success: true,
      message: `Section ${sectionType} berhasil dibuat oleh AI. ${COST} token digunakan.`,
      data: { section, tokenUsed: COST },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal generate section.';
    res.status(500).json({ success: false, message });
  }
};
