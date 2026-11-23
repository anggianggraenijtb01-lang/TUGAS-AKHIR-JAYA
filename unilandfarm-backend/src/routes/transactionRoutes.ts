import { Router } from 'express';
import {
  getTokenPackages,
  getSubscriptionPlans,
  getTransactionStatusByReference,
  createTransaction,
  getMyTransactions,
  getTransactionDetail,
  uploadPaymentProof,
  midtransWebhook,
  xenditWebhook,
} from '@controllers/transactionController';
import { authenticate, requireClient } from '@middlewares/authMiddleware';
import { body, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { env } from '@config/env';

// ----------------------------------------------------------------
// Multer config untuk upload bukti bayar
// ----------------------------------------------------------------
const proofStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(env.UPLOAD_DIR, 'payment-proofs'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `proof-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file bukti bayar harus JPG, PNG, atau WebP'));
    }
  },
});

const router = Router();

// ----------------------------------------------------------------
// Public Route — Webhook dari Payment Gateway (tanpa JWT)
// ----------------------------------------------------------------

// POST /api/transactions/webhook/midtrans
router.post('/webhook/midtrans', midtransWebhook);

// POST /api/transactions/webhook/xendit
router.post('/webhook/xendit', xenditWebhook);

// ----------------------------------------------------------------
// Public — Daftar paket token & paket langganan (bisa dilihat tanpa login)
// ----------------------------------------------------------------

// GET /api/transactions/packages
router.get('/packages', getTokenPackages);

// GET /api/transactions/plans
router.get('/plans', getSubscriptionPlans);

// GET /api/transactions/status/:reference
router.get('/status/:reference', getTransactionStatusByReference);

// ----------------------------------------------------------------
// Protected Routes — Wajib login sebagai CLIENT
// ----------------------------------------------------------------
router.use(authenticate, requireClient);

// POST /api/transactions
// Buat transaksi top-up token baru
router.post(
  '/',
  [
    body('packageId').notEmpty().withMessage('Pilih paket token terlebih dahulu'),
    body('paymentMethod')
      .notEmpty()
      .isIn(['VIRTUAL_ACCOUNT', 'QRIS', 'MANUAL_TRANSFER', 'MIDTRANS', 'XENDIT'])
      .withMessage('Metode pembayaran tidak valid'),
  ],
  createTransaction
);

// GET /api/transactions
// Riwayat transaksi milik user yang login
router.get('/', getMyTransactions);

// GET /api/transactions/:id
// Detail satu transaksi
router.get(
  '/:id',
  [param('id').notEmpty()],
  getTransactionDetail
);

// POST /api/transactions/:id/proof
// Upload bukti transfer manual
router.post(
  '/:id/proof',
  [param('id').notEmpty()],
  uploadProof.single('proof'),
  uploadPaymentProof
);

export default router;
