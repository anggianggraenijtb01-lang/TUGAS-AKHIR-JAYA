import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractBearerToken, JwtUserPayload } from '@utils/jwt';
import prisma from '@config/db';

// ============================================================
// Augment Express Request — tambahkan properti user ke req
// ============================================================
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

// ============================================================
// authenticate — Verifikasi JWT Access Token
// Digunakan di semua route yang membutuhkan login
// ============================================================
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token autentikasi tidak ditemukan.',
      });
      return;
    }

    // Verifikasi & decode token
    const decoded = verifyAccessToken(token);

    // Cek apakah user masih aktif di database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Akun tidak ditemukan. Token tidak valid.',
      });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        message: 'Akun Anda telah disuspend. Hubungi admin UniLandFarm.',
      });
      return;
    }

    if (user.status === 'PENDING_VERIFICATION') {
      res.status(403).json({
        success: false,
        message: 'Akun Anda belum diverifikasi. Cek email Anda.',
      });
      return;
    }

    // Simpan data user ke req untuk digunakan controller
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Autentikasi gagal.';
    res.status(401).json({ success: false, message });
  }
};

// ============================================================
// requireAdmin — Pastikan user adalah ADMIN Uni-Inside
// Harus digunakan SETELAH middleware authenticate
// ============================================================
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Autentikasi diperlukan.',
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya Admin Uni-Inside yang diizinkan.',
    });
    return;
  }

  next();
};

// ============================================================
// requireClient — Pastikan user adalah CLIENT UMKM
// Harus digunakan SETELAH middleware authenticate
// ============================================================
export const requireClient = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Autentikasi diperlukan.',
    });
    return;
  }

  if (req.user.role !== 'CLIENT') {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Endpoint ini khusus untuk Client UMKM.',
    });
    return;
  }

  next();
};
