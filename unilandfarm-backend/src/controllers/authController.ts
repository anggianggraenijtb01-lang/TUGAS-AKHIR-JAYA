import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '@config/db';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@utils/jwt';

// ============================================================
// POST /api/auth/register
// ============================================================
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, email, password, businessName, phoneNumber } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName: businessName || null,
        phoneNumber: phoneNumber || null,
        role: 'CLIENT',
        status: 'ACTIVE',
        authProvider: 'LOCAL',
      },
      select: {
        id: true, name: true, email: true, role: true,
        status: true, businessName: true, tokenBalance: true, createdAt: true,
      },
    });

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Akun berhasil dibuat. Selamat bergabung di UniLandFarm!',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/auth/login
// ============================================================
export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Email atau password salah.' });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({ success: false, message: 'Akun Anda telah disuspend. Hubungi admin.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Email atau password salah.' });
      return;
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    res.status(200).json({
      success: true,
      message: 'Login berhasil. Selamat datang kembali!',
      data: {
        user: {
          id: user.id, name: user.name, email: user.email,
          role: user.role, status: user.status, businessName: user.businessName,
          avatarUrl: user.avatarUrl, tokenBalance: user.tokenBalance,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat login.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/auth/logout
// ============================================================
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logout berhasil. Sampai jumpa!' });
};

// ============================================================
// POST /api/auth/refresh
// ============================================================
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  if (!token) {
    res.status(400).json({ success: false, message: 'Refresh token tidak ditemukan.' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }
    if (user.status === 'SUSPENDED') {
      res.status(403).json({ success: false, message: 'Akun disuspend.' });
      return;
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const newRefreshToken = signRefreshToken({ id: user.id });

    res.status(200).json({
      success: true,
      message: 'Token berhasil diperbarui.',
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Refresh token tidak valid.';
    res.status(401).json({ success: false, message });
  }
};

// ============================================================
// GET /api/auth/profile
// ============================================================
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, role: true, status: true,
        businessName: true, phoneNumber: true, avatarUrl: true,
        tokenBalance: true, authProvider: true, emailVerifiedAt: true,
        lastLoginAt: true, createdAt: true, updatedAt: true,
        _count: { select: { landingPages: true, transactions: true } },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil profil.' });
  }
};

// ============================================================
// PATCH /api/auth/profile
// ============================================================
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { name, phoneNumber, businessName } = req.body;

  try {
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (businessName !== undefined) updateData.businessName = businessName;

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true, name: true, email: true, phoneNumber: true,
        businessName: true, avatarUrl: true, tokenBalance: true, updatedAt: true,
      },
    });

    res.status(200).json({ success: true, message: 'Profil berhasil diperbarui.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil.' });
  }
};

// ============================================================
// POST /api/auth/change-password
// ============================================================
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, password: true },
    });

    if (!user || !user.password) {
      res.status(400).json({
        success: false,
        message: 'Akun ini menggunakan login Google. Password tidak bisa diubah.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Password lama tidak sesuai.' });
      return;
    }

    if (oldPassword === newPassword) {
      res.status(400).json({ success: false, message: 'Password baru harus berbeda dari password lama.' });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.status(200).json({ success: true, message: 'Password berhasil diubah. Silakan login kembali.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengubah password.' });
  }
};
