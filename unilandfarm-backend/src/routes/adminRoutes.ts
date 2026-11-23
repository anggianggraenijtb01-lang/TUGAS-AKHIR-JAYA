import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  resetUserPassword,
  getAllLandingPages,
  takedownLandingPage,
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPendingTransactions,
  verifyTransaction,
  rejectTransaction,
  getTransactionStats,
  sendNotification,
  broadcastNotification,
} from '@controllers/adminController';
import { authenticate, requireAdmin } from '@middlewares/authMiddleware';
import { body, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { env } from '@config/env';

// ----------------------------------------------------------------
// Multer config untuk upload thumbnail template
// ----------------------------------------------------------------
const thumbnailStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(env.UPLOAD_DIR, 'templates'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `template-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Thumbnail harus berformat JPG, PNG, atau WebP'));
  },
});

const router = Router();

// Semua route admin: wajib login + role ADMIN
router.use(authenticate, requireAdmin);

// ----------------------------------------------------------------
// DASHBOARD
// ----------------------------------------------------------------
// GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

// ================================================================
// MANAJEMEN PENGGUNA
// ================================================================

// GET /api/admin/users?page=1&limit=20&search=&status=
router.get('/users', getAllUsers);

// GET /api/admin/users/:id
router.get('/users/:id', [param('id').notEmpty()], getUserById);

// PATCH /api/admin/users/:id/status
router.patch(
  '/users/:id/status',
  [
    param('id').notEmpty(),
    body('status')
      .notEmpty()
      .isIn(['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'])
      .withMessage('Status tidak valid'),
    body('reason').optional().trim().isLength({ max: 500 }),
  ],
  updateUserStatus
);

// POST /api/admin/users/:id/reset-password
router.post(
  '/users/:id/reset-password',
  [param('id').notEmpty()],
  resetUserPassword
);

// ================================================================
// MANAJEMEN LANDING PAGE (MODERASI & PUBLIKASI)
// ================================================================

// GET /api/admin/publications?page=1&limit=20&status=PUBLISHED
router.get('/publications', getAllLandingPages);

// POST /api/admin/publications/:id/takedown
router.post(
  '/publications/:id/takedown',
  [
    param('id').notEmpty(),
    body('reason').trim().notEmpty().withMessage('Alasan takedown wajib diisi'),
  ],
  takedownLandingPage
);

// ================================================================
// MANAJEMEN TEMPLATE
// ================================================================

// GET /api/admin/templates
router.get('/templates', getAllTemplates);

// POST /api/admin/templates
router.post(
  '/templates',
  uploadThumbnail.single('thumbnail'),
  [
    body('name').trim().notEmpty().withMessage('Nama template wajib diisi'),
    body('category').trim().notEmpty().withMessage('Kategori wajib diisi'),
    body('sectionsJson')
      .notEmpty()
      .custom((val: string) => {
        try { JSON.parse(val); return true; }
        catch { throw new Error('sectionsJson harus berupa JSON string yang valid'); }
      }),
    body('tokenCost')
      .optional()
      .isInt({ min: 0 }).withMessage('Token cost minimal 0'),
  ],
  createTemplate
);

// PUT /api/admin/templates/:id
router.put(
  '/templates/:id',
  uploadThumbnail.single('thumbnail'),
  [
    param('id').notEmpty(),
    body('name').optional().trim().notEmpty(),
    body('tokenCost').optional().isInt({ min: 0 }),
  ],
  updateTemplate
);

// DELETE /api/admin/templates/:id
router.delete(
  '/templates/:id',
  [param('id').notEmpty()],
  deleteTemplate
);

// ================================================================
// VERIFIKASI TRANSAKSI
// ================================================================

// GET /api/admin/transactions?status=PENDING
router.get('/transactions', getPendingTransactions);

// GET /api/admin/transactions/stats
router.get('/transactions/stats', getTransactionStats);

// POST /api/admin/transactions/:id/verify
router.post(
  '/transactions/:id/verify',
  [
    param('id').notEmpty(),
    body('note').optional().trim().isLength({ max: 500 }),
  ],
  verifyTransaction
);

// POST /api/admin/transactions/:id/reject
router.post(
  '/transactions/:id/reject',
  [
    param('id').notEmpty(),
    body('reason').trim().notEmpty().withMessage('Alasan penolakan wajib diisi'),
  ],
  rejectTransaction
);

// ================================================================
// NOTIFIKASI
// ================================================================

// POST /api/admin/notifications/send
// Kirim notifikasi ke satu pengguna
router.post(
  '/notifications/send',
  [
    body('recipientId').notEmpty().withMessage('ID penerima wajib diisi'),
    body('title').trim().notEmpty().withMessage('Judul notifikasi wajib diisi'),
    body('message').trim().notEmpty().withMessage('Isi pesan wajib diisi'),
    body('type')
      .optional()
      .isIn(['INFO', 'PROMO', 'WARNING', 'SYSTEM', 'TRANSACTION', 'AI_RESULT']),
    body('actionUrl').optional().trim().isURL(),
  ],
  sendNotification
);

// POST /api/admin/notifications/broadcast
// Kirim notifikasi ke semua pengguna sekaligus
router.post(
  '/notifications/broadcast',
  [
    body('title').trim().notEmpty().withMessage('Judul notifikasi wajib diisi'),
    body('message').trim().notEmpty().withMessage('Isi pesan wajib diisi'),
    body('type')
      .optional()
      .isIn(['INFO', 'PROMO', 'WARNING', 'SYSTEM']),
  ],
  broadcastNotification
);

export default router;
