import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '@config/db';

// Helper: Generate slug unik
const generateSlug = async (base: string): Promise<string> => {
  const clean = base
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
  const suffix = Date.now().toString(36);
  const slug = `${clean}-${suffix}`;

  const existing = await prisma.landingPage.findUnique({ where: { slug } });
  if (existing) return `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  return slug;
};

// ============================================================
// GET /api/publish/site/:slug
// Ambil landing page publik (untuk render di frontend)
// ============================================================
export const getPublicPage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { slug } = req.params;

  try {
    const page = await prisma.landingPage.findFirst({
      where: { slug, publishStatus: 'PUBLISHED' },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
        user: {
          select: { businessName: true, name: true },
        },
      },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Halaman tidak ditemukan atau belum dipublikasikan.' });
      return;
    }

    // Update viewCount (async, tidak perlu await agar tidak memperlambat response)
    prisma.landingPage.update({
      where: { id: page.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => { /* silent fail */ });

    res.status(200).json({ success: true, data: page });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil halaman.' });
  }
};

// ============================================================
// POST /api/publish/pages/:id/publish
// Ubah status ke PUBLISHED
// ============================================================
export const publishPage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { slug: customSlug } = req.body;

  try {
    const page = await prisma.landingPage.findFirst({
      where: { id, userId: req.user!.id },
      include: { _count: { select: { sections: true } } },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    if (page._count.sections === 0) {
      res.status(400).json({
        success: false,
        message: 'Landing page harus memiliki minimal 1 section sebelum dipublikasikan.',
      });
      return;
    }

    // Tentukan slug akhir
    let finalSlug = page.slug;
    if (customSlug && customSlug !== page.slug) {
      const slugExists = await prisma.landingPage.findFirst({
        where: { slug: customSlug, id: { not: id } },
      });
      if (slugExists) {
        res.status(409).json({ success: false, message: 'Slug sudah digunakan. Coba slug lain.' });
        return;
      }
      finalSlug = customSlug;
    }

    const updated = await prisma.landingPage.update({
      where: { id },
      data: {
        publishStatus: 'PUBLISHED',
        publishedAt: new Date(),
        slug: finalSlug,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Landing page berhasil dipublikasikan!',
      data: { ...updated, publicUrl: `/site/${finalSlug}` },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mempublikasikan halaman.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/publish/pages/:id/unpublish
// Tarik ke DRAFT
// ============================================================
export const unpublishPage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    await prisma.landingPage.update({
      where: { id },
      data: { publishStatus: 'DRAFT', publishedAt: null },
    });

    res.status(200).json({ success: true, message: 'Landing page berhasil ditarik ke Draft.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal unpublish halaman.' });
  }
};

// ============================================================
// POST /api/publish/pages/:id/archive
// Arsipkan landing page
// ============================================================
export const archivePage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    await prisma.landingPage.update({
      where: { id },
      data: { publishStatus: 'ARCHIVED' },
    });

    res.status(200).json({ success: true, message: 'Landing page berhasil diarsipkan.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengarsipkan halaman.' });
  }
};

// ============================================================
// PATCH /api/publish/pages/:id/slug
// Regenerate / custom slug
// ============================================================
export const regenerateSlug = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { slug: customSlug } = req.body;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    let newSlug: string;
    if (customSlug) {
      const exists = await prisma.landingPage.findFirst({
        where: { slug: customSlug, id: { not: id } },
      });
      if (exists) {
        res.status(409).json({ success: false, message: 'Slug sudah digunakan.' });
        return;
      }
      newSlug = customSlug;
    } else {
      newSlug = await generateSlug(page.title);
    }

    const updated = await prisma.landingPage.update({
      where: { id },
      data: { slug: newSlug },
      select: { id: true, slug: true, publishStatus: true },
    });

    res.status(200).json({ success: true, message: 'Slug berhasil diperbarui.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal memperbarui slug.' });
  }
};

// ============================================================
// PATCH /api/publish/pages/:id/whatsapp-cta
// Update nomor & pesan WhatsApp CTA
// ============================================================
export const updateWhatsappCta = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { whatsappNumber, whatsappMessage } = req.body;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const updated = await prisma.landingPage.update({
      where: { id },
      data: {
        whatsappNumber,
        whatsappMessage: whatsappMessage || null,
      },
      select: { id: true, whatsappNumber: true, whatsappMessage: true },
    });

    res.status(200).json({ success: true, message: 'WhatsApp CTA berhasil diperbarui.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal memperbarui WhatsApp CTA.' });
  }
};
