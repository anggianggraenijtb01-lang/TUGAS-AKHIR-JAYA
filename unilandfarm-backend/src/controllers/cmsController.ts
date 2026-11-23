import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '@config/db';

// ============================================================
// GET /api/cms/pages
// Ambil semua landing page milik user yang login
// ============================================================
export const getLandingPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await prisma.landingPage.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, publishStatus: true,
        viewCount: true, tokenConsumed: true, createdAt: true, updatedAt: true,
        _count: { select: { sections: true } },
      },
    });

    res.status(200).json({ success: true, data: pages });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar landing page.' });
  }
};

// ============================================================
// GET /api/cms/pages/:id
// Ambil detail landing page beserta sections
// ============================================================
export const getLandingPageById = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const page = await prisma.landingPage.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
        template: { select: { id: true, name: true, category: true } },
      },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, data: page });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail landing page.' });
  }
};

// ============================================================
// POST /api/cms/pages
// Buat landing page baru (manual)
// ============================================================
export const createLandingPage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { title, templateId } = req.body;

  try {
    // Generate slug unik dari title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // Jika pakai template, salin sections dari template
    let sectionsData: {
      sectionType: string; label: string; sortOrder: number;
      contentJson: object; styleJson?: object;
    }[] = [];

    if (templateId) {
      const template = await prisma.template.findUnique({ where: { id: templateId } });
      if (template && Array.isArray(template.sectionsJson)) {
        sectionsData = (template.sectionsJson as Array<Record<string, unknown>>).map((s, idx) => ({
          sectionType: (s.sectionType as string) || 'CUSTOM',
          label: (s.label as string) || `Section ${idx + 1}`,
          sortOrder: idx,
          contentJson: (s.contentJson as object) || {},
          styleJson: s.styleJson as object | undefined,
        }));
      }
    }

    const page = await prisma.landingPage.create({
      data: {
        userId: req.user!.id,
        templateId: templateId || null,
        title,
        slug,
        publishStatus: 'DRAFT',
        sections: sectionsData.length > 0
          ? { create: sectionsData as Parameters<typeof prisma.landingPage.create>[0]['data']['sections'] extends { create: infer T } ? T : never }
          : undefined,
      },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });

    res.status(201).json({
      success: true,
      message: 'Landing page berhasil dibuat.',
      data: page,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat landing page.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// PUT /api/cms/pages/:id/sections
// Overwrite semua sections (setelah AI generate)
// ============================================================
export const saveSections = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { sections } = req.body;
  const { id } = req.params;

  try {
    // Pastikan page milik user ini
    const page = await prisma.landingPage.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    // Hapus semua sections lama, lalu insert yang baru
    await prisma.$transaction([
      prisma.section.deleteMany({ where: { landingPageId: id } }),
      prisma.section.createMany({
        data: sections.map((s: Record<string, unknown>, idx: number) => ({
          landingPageId: id,
          sectionType: s.sectionType as string,
          label: (s.label as string) || `Section ${idx + 1}`,
          sortOrder: typeof s.sortOrder === 'number' ? s.sortOrder : idx,
          isVisible: s.isVisible !== false,
          contentJson: (s.contentJson as object) || {},
          styleJson: s.styleJson as object | null || null,
        })),
      }),
    ]);

    const updated = await prisma.landingPage.findUnique({
      where: { id },
      include: { sections: { orderBy: { sortOrder: 'asc' } } },
    });

    res.status(200).json({
      success: true,
      message: 'Sections berhasil disimpan.',
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan sections.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// PATCH /api/cms/pages/:pageId/sections/:sectionId
// Update satu section (inline edit WYSIWYG)
// ============================================================
export const updateSection = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { pageId, sectionId } = req.params;
  const { contentJson, styleJson, label } = req.body;

  try {
    // Pastikan page milik user ini
    const page = await prisma.landingPage.findFirst({
      where: { id: pageId, userId: req.user!.id },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (contentJson !== undefined) updateData.contentJson = contentJson;
    if (styleJson !== undefined) updateData.styleJson = styleJson;
    if (label !== undefined) updateData.label = label;

    const section = await prisma.section.update({
      where: { id: sectionId, landingPageId: pageId },
      data: updateData,
    });

    res.status(200).json({ success: true, message: 'Section berhasil diperbarui.', data: section });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui section.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// PATCH /api/cms/pages/:id/sections/reorder
// Reorder sections (drag & drop)
// ============================================================
export const reorderSections = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { orders } = req.body; // [{id: string, sortOrder: number}]

  try {
    const page = await prisma.landingPage.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    await prisma.$transaction(
      orders.map((o: { id: string; sortOrder: number }) =>
        prisma.section.update({
          where: { id: o.id, landingPageId: id },
          data: { sortOrder: o.sortOrder },
        })
      )
    );

    res.status(200).json({ success: true, message: 'Urutan section berhasil diperbarui.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengurutkan sections.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// PATCH /api/cms/pages/:pageId/sections/:sectionId/visibility
// Show/hide section
// ============================================================
export const toggleSectionVisibility = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { pageId, sectionId } = req.params;
  const { isVisible } = req.body;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id: pageId, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    const section = await prisma.section.update({
      where: { id: sectionId, landingPageId: pageId },
      data: { isVisible },
    });

    res.status(200).json({
      success: true,
      message: `Section ${isVisible ? 'ditampilkan' : 'disembunyikan'}.`,
      data: section,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengubah visibilitas section.' });
  }
};

// ============================================================
// POST /api/cms/pages/:id/sections
// Tambah section baru secara manual
// ============================================================
export const addSection = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { sectionType, label, contentJson, styleJson } = req.body;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    // Tentukan sortOrder berikutnya
    const lastSection = await prisma.section.findFirst({
      where: { landingPageId: id },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    const nextSortOrder = (lastSection?.sortOrder ?? -1) + 1;

    const section = await prisma.section.create({
      data: {
        landingPageId: id,
        sectionType,
        label,
        sortOrder: nextSortOrder,
        contentJson,
        styleJson: styleJson || null,
        isVisible: true,
      },
    });

    res.status(201).json({ success: true, message: 'Section berhasil ditambahkan.', data: section });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menambah section.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// DELETE /api/cms/pages/:pageId/sections/:sectionId
// Hapus satu section
// ============================================================
export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { pageId, sectionId } = req.params;

  try {
    const page = await prisma.landingPage.findFirst({ where: { id: pageId, userId: req.user!.id } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' });
      return;
    }

    await prisma.section.delete({ where: { id: sectionId, landingPageId: pageId } });

    res.status(200).json({ success: true, message: 'Section berhasil dihapus.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal menghapus section.' });
  }
};
