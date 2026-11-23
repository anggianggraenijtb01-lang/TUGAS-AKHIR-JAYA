import { Router } from 'express';
import {
  generateLandingPage,
  rephraseText,
  extendText,
  shortenText,
  changeTone,
  generateSection,
} from '@controllers/aiController';
import { authenticate, requireClient } from '@middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

// Semua route AI hanya untuk Client yang sudah login
router.use(authenticate, requireClient);

// ----------------------------------------------------------------
// POST /api/ai/generate-page
// Generate full landing page via AI dari hasil kuesioner
// ----------------------------------------------------------------
router.post(
  '/generate-page',
  [
    body('businessName').trim().notEmpty().withMessage('Nama usaha wajib diisi'),
    body('category').trim().notEmpty().withMessage('Kategori usaha wajib diisi'),
    body('description')
      .trim()
      .notEmpty().withMessage('Deskripsi usaha wajib diisi')
      .isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
    body('tone')
      .optional()
      .isIn(['profesional', 'friendly', 'fun', 'formal', 'casual'])
      .withMessage('Tone tidak valid'),
    body('templateId').optional().isString(),
  ],
  generateLandingPage
);

// ----------------------------------------------------------------
// POST /api/ai/rephrase
// Rephrase teks via AI Magic Button ✨
// ----------------------------------------------------------------
router.post(
  '/rephrase',
  [
    body('text').trim().notEmpty().withMessage('Teks wajib diisi'),
    body('landingPageId').notEmpty().withMessage('Landing page ID wajib diisi'),
  ],
  rephraseText
);

// ----------------------------------------------------------------
// POST /api/ai/extend
// Perpanjang teks via AI Magic Button ✨
// ----------------------------------------------------------------
router.post(
  '/extend',
  [
    body('text').trim().notEmpty().withMessage('Teks wajib diisi'),
    body('landingPageId').notEmpty().withMessage('Landing page ID wajib diisi'),
  ],
  extendText
);

// ----------------------------------------------------------------
// POST /api/ai/shorten
// Perpendek teks via AI Magic Button ✨
// ----------------------------------------------------------------
router.post(
  '/shorten',
  [
    body('text').trim().notEmpty().withMessage('Teks wajib diisi'),
    body('landingPageId').notEmpty().withMessage('Landing page ID wajib diisi'),
  ],
  shortenText
);

// ----------------------------------------------------------------
// POST /api/ai/change-tone
// Ubah tone teks via AI Magic Button ✨
// ----------------------------------------------------------------
router.post(
  '/change-tone',
  [
    body('text').trim().notEmpty().withMessage('Teks wajib diisi'),
    body('tone')
      .notEmpty()
      .isIn(['profesional', 'friendly', 'fun', 'formal', 'casual'])
      .withMessage('Tone harus salah satu: profesional, friendly, fun, formal, casual'),
    body('landingPageId').notEmpty().withMessage('Landing page ID wajib diisi'),
  ],
  changeTone
);

// ----------------------------------------------------------------
// POST /api/ai/generate-section
// Generate satu section baru dengan AI
// ----------------------------------------------------------------
router.post(
  '/generate-section',
  [
    body('landingPageId').notEmpty().withMessage('Landing page ID wajib diisi'),
    body('sectionType')
      .notEmpty()
      .isIn(['HERO','FEATURES','CATALOG','TESTIMONIALS','FAQ','CONTACT','GALLERY','PRICING_TABLE','CUSTOM'])
      .withMessage('Tipe section tidak valid'),
    body('prompt').optional().trim(),
  ],
  generateSection
);

export default router;
