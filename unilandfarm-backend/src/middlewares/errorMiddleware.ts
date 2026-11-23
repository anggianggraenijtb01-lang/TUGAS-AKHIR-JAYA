import { Request, Response, NextFunction } from 'express';
import { env } from '@config/env';

// ============================================================
// Custom Application Error Class
// ============================================================
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Pertahankan prototype chain yang benar
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================
// notFound — Handler untuk Route yang Tidak Ditemukan (404)
// ============================================================
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`, 404));
};

// ============================================================
// globalErrorHandler — Middleware Error Terpusat
// Harus didaftarkan PALING TERAKHIR di app.ts
// ============================================================
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Tentukan status code & apakah error ini sudah diantisipasi
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Log error ke console (di production bisa dikirim ke Sentry/Logtail)
  if (env.NODE_ENV === 'development') {
    console.error(`\n❌ [ERROR ${statusCode}] ${req.method} ${req.path}`);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
  } else {
    // Di production: log minimal agar tidak bocor ke client
    if (!isOperational) {
      console.error(`[CRITICAL ERROR] ${err.message}`);
    }
  }

  // Pesan yang dikirim ke client
  const clientMessage =
    isOperational
      ? err.message
      : env.NODE_ENV === 'development'
        ? err.message
        : 'Terjadi kesalahan pada server. Silakan coba lagi.';

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.name,
    }),
  });
};
