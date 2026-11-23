import { z } from 'zod';
import dotenv from 'dotenv';

// Muat file .env ke dalam process.env
dotenv.config();

// ============================================================
// Skema Validasi Environment Variables (Zod)
// Akan throw error deskriptif saat startup jika ada yang kosong/salah
// ============================================================
const envSchema = z.object({
  // Server
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database
  DATABASE_URL: z
    .string({ required_error: 'DATABASE_URL wajib diisi di file .env' })
    .url('DATABASE_URL harus berformat URL yang valid (mysql://...)'),

  // JWT
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET wajib diisi di file .env' })
    .min(32, 'JWT_SECRET minimal 32 karakter untuk keamanan'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z
    .string({ required_error: 'JWT_REFRESH_SECRET wajib diisi di file .env' })
    .min(32, 'JWT_REFRESH_SECRET minimal 32 karakter'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Gemini AI
  GEMINI_API_KEY: z
    .string({ required_error: 'GEMINI_API_KEY wajib diisi di file .env' })
    .min(10, 'GEMINI_API_KEY tidak valid'),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),

  // Google OAuth (opsional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Midtrans (opsional tapi diperlukan untuk payment)
  MIDTRANS_SERVER_KEY: z.string().optional(),
  MIDTRANS_CLIENT_KEY: z.string().optional(),
  MIDTRANS_IS_PRODUCTION: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),

  // Xendit (opsional)
  XENDIT_SECRET_KEY: z.string().optional(),
  XENDIT_WEBHOOK_TOKEN: z.string().optional(),

  // File Upload
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z
    .string()
    .default('5')
    .transform((val) => parseInt(val, 10)),

  // URLs
  APP_BASE_URL: z.string().default('http://localhost:5000'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

// Tipe hasil validasi (inferensi otomatis dari Zod schema)
export type Env = z.infer<typeof envSchema>;

// Jalankan validasi saat module dimuat
const _parsedEnv = envSchema.safeParse(process.env);

if (!_parsedEnv.success) {
  console.error('❌ KONFIGURASI .env TIDAK VALID!\n');
  console.error('Perbaiki error berikut sebelum menjalankan server:\n');

  const errors = _parsedEnv.error.flatten().fieldErrors;
  Object.entries(errors).forEach(([field, messages]) => {
    console.error(`  • ${field}: ${messages?.join(', ')}`);
  });

  console.error('\n📄 Salin .env.example menjadi .env lalu isi nilainya.\n');
  process.exit(1);
}

// Export env yang sudah tervalidasi & ter-type dengan aman
export const env: Env = _parsedEnv.data;
