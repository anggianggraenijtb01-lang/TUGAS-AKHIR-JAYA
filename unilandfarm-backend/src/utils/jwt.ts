import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '@config/env';

// ============================================================
// JWT Payload Interface
// ============================================================
export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface JwtRefreshPayload extends JwtPayload {
  id: string;
}

// ============================================================
// Sign — Buat Access Token (jangka pendek)
// ============================================================
export const signAccessToken = (payload: {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
};

// ============================================================
// Sign — Buat Refresh Token (jangka panjang)
// ============================================================
export const signRefreshToken = (payload: { id: string }): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

// ============================================================
// Verify — Validasi Access Token
// ============================================================
export const verifyAccessToken = (token: string): JwtUserPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token sudah kadaluarsa. Silakan login kembali.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token tidak valid.');
    }
    throw new Error('Verifikasi token gagal.');
  }
};

// ============================================================
// Verify — Validasi Refresh Token
// ============================================================
export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtRefreshPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token kadaluarsa. Silakan login kembali.');
    }
    throw new Error('Refresh token tidak valid.');
  }
};

// ============================================================
// Extract Token dari Header Authorization
// ============================================================
export const extractBearerToken = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return token && token.length > 0 ? token : null;
};
