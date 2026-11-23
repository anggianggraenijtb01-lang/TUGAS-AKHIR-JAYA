import { PrismaClient } from '@prisma/client';
import { env } from './env';

// ============================================================
// Prisma Client Singleton
// Mencegah multiple instance saat hot-reload di development
// ============================================================

// Deklarasi global untuk menyimpan instance di development
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Membuat atau menggunakan kembali instance Prisma Client.
 *
 * Di production: selalu buat instance baru.
 * Di development: gunakan instance dari global scope agar tidak
 * membuat koneksi baru setiap kali hot-reload (ts-node-dev).
 */
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  });
};

export const prisma: PrismaClient =
  env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (global.__prisma ?? (global.__prisma = createPrismaClient()));

// ============================================================
// Graceful Shutdown
// Pastikan koneksi database ditutup dengan bersih saat server berhenti
// ============================================================
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🔌 ${signal} diterima. Menutup koneksi database...`);
  await prisma.$disconnect();
  console.log('✅ Koneksi Prisma ditutup.');
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default prisma;
