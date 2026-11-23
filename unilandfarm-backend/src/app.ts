import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Config & Middleware imports
import { env } from '@config/env';
import { corsMiddleware } from '@middlewares/corsMiddleware';
import { notFound, globalErrorHandler } from '@middlewares/errorMiddleware';

// Route imports
import authRoutes from '@routes/authRoutes';
import cmsRoutes from '@routes/cmsRoutes';
import aiRoutes from '@routes/aiRoutes';
import publishRoutes from '@routes/publishRoutes';
import transactionRoutes from '@routes/transactionRoutes';
import adminRoutes from '@routes/adminRoutes';

// ============================================================
// Inisialisasi Express App
// ============================================================
const app: Application = express();

// ============================================================
// SECURITY MIDDLEWARES
// ============================================================

// Helmet: Set security-related HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Izinkan akses gambar/file dari frontend
  })
);

// CORS: Whitelist-based origin control
app.use(corsMiddleware);

// ============================================================
// RATE LIMITING
// ============================================================

// Global limiter — cegah brute-force & DDoS ringan
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,                  // Maksimum 200 request per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak request. Silakan coba lagi dalam 15 menit.',
  },
});

// AI endpoint limiter — lebih ketat karena consumetoken & biaya API
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 15,             // Maksimum 15 request AI per menit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak request AI. Silakan tunggu sebentar.',
  },
});

// Auth limiter — cegah brute-force login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20,                   // 20 percobaan login per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
  },
});

app.use(globalLimiter);

// ============================================================
// BODY PARSING
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// REQUEST LOGGING
// ============================================================
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================================
// STATIC FILE SERVING
// Untuk file yang diupload (gambar produk, bukti bayar, thumbnail)
// ============================================================
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), env.UPLOAD_DIR), {
    maxAge: '7d',       // Cache 7 hari di browser
    etag: true,
  })
);

// ============================================================
// API ROUTES
// ============================================================
const API_PREFIX = '/api';

// Health Check — untuk monitoring uptime
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🌿 UniLandFarm API is running!',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Auth Routes
app.use(`${API_PREFIX}/auth`, authLimiter, authRoutes);

// CMS Routes (Inline Editor)
app.use(`${API_PREFIX}/cms`, cmsRoutes);

// AI Routes (Gemini API — rate limited)
app.use(`${API_PREFIX}/ai`, aiLimiter, aiRoutes);

// Publish Routes
app.use(`${API_PREFIX}/publish`, publishRoutes);

// Transaction & Payment Routes
app.use(`${API_PREFIX}/transactions`, transactionRoutes);

// Admin Uni-Inside Routes
app.use(`${API_PREFIX}/admin`, adminRoutes);

// ============================================================
// 404 & GLOBAL ERROR HANDLER
// Harus selalu didaftarkan PALING TERAKHIR
// ============================================================
app.use(notFound);
app.use(globalErrorHandler);

// ============================================================
// START SERVER
// ============================================================
const startServer = async (): Promise<void> => {
  try {
    // Verifikasi koneksi database sebelum mulai
    const { default: prisma } = await import('@config/db');
    await prisma.$connect();
    console.log('✅ Koneksi database berhasil.');

    app.listen(env.PORT, () => {
      console.log('\n🌿 ========================================');
      console.log(`   UniLandFarm API Server`);
      console.log('   ========================================');
      console.log(`   🚀 Server    : http://localhost:${env.PORT}`);
      console.log(`   📡 API Prefix: http://localhost:${env.PORT}/api`);
      console.log(`   🩺 Health    : http://localhost:${env.PORT}/api/health`);
      console.log(`   🌍 Env       : ${env.NODE_ENV}`);
      console.log('   ========================================\n');
    });
  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
