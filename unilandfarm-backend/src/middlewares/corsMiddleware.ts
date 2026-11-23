import cors, { CorsOptions } from 'cors';
import { env } from '@config/env';

// ============================================================
// Daftar origin yang diizinkan mengakses API ini
// ============================================================
const allowedOrigins: string[] = [
  env.CORS_ORIGIN,           // http://localhost:3000 (Next.js dev)
  env.FRONTEND_URL,          // Duplikat aman jika sama
  'http://localhost:3001',   // Fallback port lain saat dev
].filter(Boolean);

// ============================================================
// Konfigurasi CORS
// ============================================================
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Izinkan request tanpa origin (Postman, curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          `CORS: Origin "${origin}" tidak diizinkan. Daftarkan di allowedOrigins.`
        )
      );
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  credentials: true,    // Izinkan cookies & Authorization header
  maxAge: 86400,        // Cache preflight 24 jam
};

export const corsMiddleware = cors(corsOptions);
