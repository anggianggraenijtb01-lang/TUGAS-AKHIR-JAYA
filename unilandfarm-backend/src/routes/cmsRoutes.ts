import { Router } from 'express';
import {
  getLandingPages,
  getLandingPageById,
  createLandingPage,
  saveSections,
  updateSection,
  reorderSections,
  toggleSectionVisibility,
  deleteSection,
  addSection,
} from '@controllers/cmsController';
import { authenticate, requireClient } from '@middlewares/authMiddleware';
import { body, param } from 'express-validator';

const router = Router();

// Semua route CMS hanya untuk Client yang sudah login
router.use(authenticate, requireClient);

// ----------------------------------------------------------------
// GET /api/cms/pages
// Ambil semua landing page milik user yang sedang login
// ----------------------------------------------------------------
router.get('/pages', getLandingPages);

// ----------------------------------------------------------------
// GET /api/cms/pages/:id
// Ambil detail landing page beserta sections-nya
// ----------------------------------------------------------------
router.get(
  '/pages/:id',
  [param('id').notEmpty().withMessage('ID landing page tidak valid')],
  getLandingPageById
);

// ----------------------------------------------------------------
// POST /api/cms/pages
// Buat landing page baru (manual, bukan via AI)
// ----------------------------------------------------------------
router.post(
  '/pages',
  [
    body('title').trim().notEmpty().withMessage('Judul landing page wajib diisi'),
    body('templateId').optional().isString(),
  ],
  createLandingPage
);

// ----------------------------------------------------------------
// PUT /api/cms/pages/:id/sections
// Simpan (overwrite) seluruh sections sekaligus — dipakai setelah AI generate
// ----------------------------------------------------------------
router.put(
  '/pages/:id/sections',
  [
    param('id').notEmpty(),
    body('sections').isArray({ min: 1 }).withMessage('Sections harus berupa array dan tidak boleh kosong'),
  ],
  saveSections
);

// ----------------------------------------------------------------
// PATCH /api/cms/pages/:pageId/sections/:sectionId
// Update satu section (inline edit dari WYSIWYG editor)
// ----------------------------------------------------------------
router.patch(
  '/pages/:pageId/sections/:sectionId',
  [
    param('pageId').notEmpty(),
    param('sectionId').notEmpty(),
    body('contentJson').optional().isObject(),
    body('styleJson').optional().isObject(),
    body('label').optional().trim().isLength({ max: 150 }),
  ],
  updateSection
);

// ----------------------------------------------------------------
// PATCH /api/cms/pages/:id/sections/reorder
// Drag & drop reorder — kirim array [{id, sortOrder}]
// ----------------------------------------------------------------
router.patch(
  '/pages/:id/sections/reorder',
  [
    param('id').notEmpty(),
    body('orders')
      .isArray({ min: 1 })
      .withMessage('Orders harus berupa array [{id, sortOrder}]'),
  ],
  reorderSections
);

// ----------------------------------------------------------------
// PATCH /api/cms/pages/:pageId/sections/:sectionId/visibility
// Show/hide section
// ----------------------------------------------------------------
router.patch(
  '/pages/:pageId/sections/:sectionId/visibility',
  [
    param('pageId').notEmpty(),
    param('sectionId').notEmpty(),
    body('isVisible').isBoolean().withMessage('isVisible harus boolean'),
  ],
  toggleSectionVisibility
);

// ----------------------------------------------------------------
// POST /api/cms/pages/:id/sections
// Tambah section baru secara manual
// ----------------------------------------------------------------
router.post(
  '/pages/:id/sections',
  [
    param('id').notEmpty(),
    body('sectionType')
      .notEmpty()
      .isIn(['HERO','FEATURES','CATALOG','TESTIMONIALS','FAQ','CONTACT','GALLERY','PRICING_TABLE','CUSTOM']),
    body('label').trim().notEmpty().withMessage('Label section wajib diisi'),
    body('contentJson').isObject().withMessage('contentJson harus berupa object'),
  ],
  addSection
);

// ----------------------------------------------------------------
// DELETE /api/cms/pages/:pageId/sections/:sectionId
// Hapus satu section
// ----------------------------------------------------------------
router.delete(
  '/pages/:pageId/sections/:sectionId',
  [param('pageId').notEmpty(), param('sectionId').notEmpty()],
  deleteSection
);

export default router;
