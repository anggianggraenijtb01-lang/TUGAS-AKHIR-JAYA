import { Router } from 'express';
import {
  publishPage,
  unpublishPage,
  archivePage,
  getPublicPage,
  regenerateSlug,
  updateWhatsappCta,
} from '@controllers/publishController';
import { authenticate, requireClient } from '@middlewares/authMiddleware';
import { body, param } from 'express-validator';

const router = Router();

// ----------------------------------------------------------------
// Public Route — Tidak perlu login
// GET /api/publish/site/:slug
// Ambil data landing page yang sudah PUBLISHED untuk ditampilkan publik
// ----------------------------------------------------------------
router.get(
  '/site/:slug',
  [param('slug').trim().notEmpty().withMessage('Slug tidak valid')],
  getPublicPage
);

// ----------------------------------------------------------------
// Protected Routes — Wajib login sebagai CLIENT
// ----------------------------------------------------------------
router.use(authenticate, requireClient);

// POST /api/publish/pages/:id/publish
// Ubah status menjadi PUBLISHED & generate URL slug publik
router.post(
  '/pages/:id/publish',
  [
    param('id').notEmpty(),
    body('slug')
      .optional()
      .trim()
      .isSlug().withMessage('Slug hanya boleh mengandung huruf, angka, dan tanda -'),
  ],
  publishPage
);

// POST /api/publish/pages/:id/unpublish
// Tarik kembali ke DRAFT (halaman tidak lagi dapat diakses publik)
router.post(
  '/pages/:id/unpublish',
  [param('id').notEmpty()],
  unpublishPage
);

// POST /api/publish/pages/:id/archive
// Arsipkan landing page
router.post(
  '/pages/:id/archive',
  [param('id').notEmpty()],
  archivePage
);

// PATCH /api/publish/pages/:id/slug
// Regenerate atau custom slug baru
router.patch(
  '/pages/:id/slug',
  [
    param('id').notEmpty(),
    body('slug')
      .optional()
      .trim()
      .isSlug().withMessage('Slug tidak valid'),
  ],
  regenerateSlug
);

// PATCH /api/publish/pages/:id/whatsapp-cta
// Update nomor & pesan WhatsApp sticky CTA
router.patch(
  '/pages/:id/whatsapp-cta',
  [
    param('id').notEmpty(),
    body('whatsappNumber')
      .notEmpty().withMessage('Nomor WhatsApp wajib diisi')
      .matches(/^(\+62|62|0)8[1-9][0-9]{6,10}$/)
      .withMessage('Format nomor WhatsApp Indonesia tidak valid'),
    body('whatsappMessage').optional().trim().isLength({ max: 500 }),
  ],
  updateWhatsappCta
);

export default router;
