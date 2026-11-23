import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  refreshToken,
  changePassword,
} from '@controllers/authController';
import { authenticate } from '@middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

// ----------------------------------------------------------------
// Validasi input (express-validator)
// ----------------------------------------------------------------
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ max: 150 }).withMessage('Nama maksimal 150 karakter'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .matches(/[A-Z]/).withMessage('Password harus mengandung huruf kapital')
    .matches(/[0-9]/).withMessage('Password harus mengandung angka'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Nama usaha maksimal 200 karakter'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

// ----------------------------------------------------------------
// Public Routes (tidak perlu login)
// ----------------------------------------------------------------

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

// ----------------------------------------------------------------
// Protected Routes (wajib login)
// ----------------------------------------------------------------

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

// PATCH /api/auth/profile
router.patch(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().isLength({ max: 150 }),
    body('phoneNumber').optional().trim().isMobilePhone('id-ID'),
    body('businessName').optional().trim().isLength({ max: 200 }),
  ],
  updateProfile
);

// POST /api/auth/change-password
router.post(
  '/change-password',
  authenticate,
  [
    body('oldPassword').notEmpty().withMessage('Password lama wajib diisi'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password baru minimal 8 karakter')
      .matches(/[A-Z]/).withMessage('Harus ada huruf kapital')
      .matches(/[0-9]/).withMessage('Harus ada angka'),
  ],
  changePassword
);

export default router;
