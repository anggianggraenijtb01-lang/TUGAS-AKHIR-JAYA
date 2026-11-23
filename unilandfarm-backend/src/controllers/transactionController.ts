import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '@config/db';
import path from 'path';
import crypto from 'crypto';
import { env } from '@config/env';

// ============================================================
// Paket token yang tersedia (hardcoded, bisa dipindah ke DB)
// ============================================================
const TOKEN_PACKAGES = [
  { id: 'pkg-starter', name: 'Starter Pack', tokens: 20, price: new Decimal(29000), description: '20 token AI - Cocok untuk mencoba' },
  { id: 'pkg-basic',   name: 'Basic Pack',   tokens: 50, price: new Decimal(59000), description: '50 token AI - Untuk 1-2 landing page' },
  { id: 'pkg-pro',     name: 'Pro Pack',     tokens: 120, price: new Decimal(119000), description: '120 token AI - Untuk UMKM aktif' },
  { id: 'pkg-business',name: 'Business Pack',tokens: 300, price: new Decimal(249000), description: '300 token AI - Untuk bisnis berkembang' },
];

// ============================================================
// Paket Langganan Authoritative (UNI-LANDFARM Plans)
// ============================================================
export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_free',
    name: 'Paket Gratis',
    slug: 'gratis',
    description: 'Cocok untuk UMKM pemula yang baru memulai go-digital tanpa modal.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isFree: true,
    isActive: true,
    features: [
      '1 Website Bisnis Aktif',
      'Akses Template Dasar UMKM',
      'Editor Visual & Manajemen Konten',
      '15 Token AI untuk Pembuatan Halaman',
      'Subdomain resmi (nama-usaha.unilandfarm.id)',
      'Dukungan Komunitas UMKM',
    ],
    limits: {
      websites: 1,
      publishedWebsites: 1,
      tokens: 15,
      aiTokensIncluded: 15,
      templates: 'basic',
      customDomain: false,
      scheduler: false,
      exportHtml: false,
      prioritySupport: false,
    },
  },
  {
    id: 'plan_pro',
    name: 'Paket Pro UMKM',
    slug: 'pro-umkm',
    badge: 'Paling Populer',
    isPopular: true,
    description: 'Pilihan ideal untuk usaha yang ingin tumbuh cepat dengan manajemen konten otomatis.',
    monthlyPrice: 59000,
    yearlyPrice: 590000,
    isFree: false,
    isActive: true,
    features: [
      'Hingga 5 Website Bisnis Aktif',
      'Akses Semua Template Industri Premium (6+)',
      '150 Token AI setiap siklus',
      'Agentic AI Content Scheduler (Jadwal Otomatis)',
      'Visual WYSIWYG Editor Tanpa Batas',
      'Ekspor Kode HTML Mandiri (Self-Hosting)',
      'Integrasi Keranjang Belanja WhatsApp Langsung',
      'Prioritas Dukungan Teknis via WhatsApp',
    ],
    limits: {
      websites: 5,
      publishedWebsites: 5,
      tokens: 150,
      aiTokensIncluded: 150,
      templates: 'all',
      customDomain: true,
      scheduler: true,
      exportHtml: true,
      prioritySupport: true,
    },
  },
  {
    id: 'plan_business',
    name: 'Paket Bisnis',
    slug: 'bisnis',
    description: 'Solusi lengkap untuk brand, agribisnis berkembang, koperasi, dan agensi lokal.',
    monthlyPrice: 149000,
    yearlyPrice: 1490000,
    isFree: false,
    isActive: true,
    features: [
      'Website Bisnis Tanpa Batas (Unlimited)',
      'Akses Seluruh Koleksi Template & Layout Baru',
      '500 Token AI setiap siklus',
      'Agentic AI CMS Multi-Schedule & Conditional Check',
      'Dukungan Custom Domain (.id, .com, .co.id)',
      'Prioritas Akses Jalur Model AI Terbaru',
      'Ekspor Kode HTML & Backup Data Kapan Saja',
      'Dedicated Account Manager 1-on-1',
    ],
    limits: {
      websites: 999,
      publishedWebsites: 999,
      tokens: 500,
      aiTokensIncluded: 500,
      templates: 'all',
      customDomain: true,
      scheduler: true,
      exportHtml: true,
      prioritySupport: true,
    },
  },
];

// Helper: Generate kode invoice unik
const generateInvoiceCode = (): string => {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INV-${ymd}-${rand}`;
};

// ============================================================
// GET /api/transactions/packages
// ============================================================
export const getTokenPackages = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: TOKEN_PACKAGES.map(p => ({
      ...p,
      price: Number(p.price),
    })),
  });
};

// ============================================================
// GET /api/transactions/plans
// ============================================================
export const getSubscriptionPlans = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: SUBSCRIPTION_PLANS,
  });
};

// ============================================================
// GET /api/transactions/status/:reference
// ============================================================
export const getTransactionStatusByReference = async (req: Request, res: Response): Promise<void> => {
  const { reference } = req.params;

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [{ invoiceCode: reference }, { id: reference }],
      },
      select: {
        id: true,
        invoiceCode: true,
        packageName: true,
        amountPaid: true,
        paymentMethod: true,
        status: true,
        expiredAt: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...transaction,
        amountPaid: Number(transaction.amountPaid),
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal memeriksa status transaksi.' });
  }
};

// ============================================================
// POST /api/transactions
// ============================================================
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  const { packageId, billingInterval, paymentMethod } = req.body;
  const userId = req.user!.id;

  try {
    let name = '';
    let tokens = 0;
    let price = new Decimal(0);

    const tokenPkg = TOKEN_PACKAGES.find(p => p.id === packageId);
    if (tokenPkg) {
      name = tokenPkg.name;
      tokens = tokenPkg.tokens;
      price = tokenPkg.price;
    } else {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === packageId);
      if (plan) {
        name = `${plan.name} (${billingInterval === 'yearly' ? 'Tahunan' : 'Bulanan'})`;
        tokens = plan.limits.tokens;
        const rawPrice = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
        price = new Decimal(rawPrice);
      } else {
        res.status(400).json({ success: false, message: 'Paket atau langganan tidak valid.' });
        return;
      }
    }

    const invoiceCode = generateInvoiceCode();

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        invoiceCode,
        packageName: name,
        tokenAmount: tokens,
        amountPaid: price,
        paymentMethod,
        status: Number(price) === 0 ? 'SUCCESS' : 'PENDING',
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    if (Number(price) === 0 && tokens > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { tokenBalance: { increment: tokens } },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat. Selesaikan pembayaran dalam 24 jam.',
      data: {
        ...transaction,
        amountPaid: Number(transaction.amountPaid),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat transaksi.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// GET /api/transactions
// ============================================================
export const getMyTransactions = async (req: Request, res: Response): Promise<void> => {
  const { page = '1', limit = '10', status } = req.query;
  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, parseInt(limit as string));
  const skip = (pageNum - 1) * limitNum;

  try {
    const where: Record<string, unknown> = { userId: req.user!.id };
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true, invoiceCode: true, packageName: true,
          tokenAmount: true, amountPaid: true, paymentMethod: true,
          status: true, proofImageUrl: true, verifiedAt: true,
          expiredAt: true, createdAt: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: transactions.map(t => ({ ...t, amountPaid: Number(t.amountPaid) })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi.' });
  }
};

// ============================================================
// GET /api/transactions/:id
// ============================================================
export const getTransactionDetail = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { ...transaction, amountPaid: Number(transaction.amountPaid) },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail transaksi.' });
  }
};

// ============================================================
// POST /api/transactions/:id/proof
// ============================================================
export const uploadPaymentProof = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    if (transaction.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'Bukti bayar hanya bisa diupload untuk transaksi berstatus PENDING.',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'File bukti bayar tidak ditemukan.' });
      return;
    }

    const proofImageUrl = `${env.APP_BASE_URL}/uploads/payment-proofs/${req.file.filename}`;

    const updated = await prisma.transaction.update({
      where: { id: req.params.id },
      data: { proofImageUrl },
      select: { id: true, invoiceCode: true, status: true, proofImageUrl: true },
    });

    res.status(200).json({
      success: true,
      message: 'Bukti pembayaran berhasil diupload. Admin akan memverifikasi dalam 1x24 jam.',
      data: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengupload bukti bayar.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/transactions/webhook/midtrans
// ============================================================
export const midtransWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = req.body;

    if (!order_id) {
      res.status(400).json({ success: false, message: 'order_id tidak valid.' });
      return;
    }

    // Midtrans SHA512 signature verification
    if (env.MIDTRANS_SERVER_KEY && signature_key) {
      const hashStr = `${order_id}${status_code}${gross_amount}${env.MIDTRANS_SERVER_KEY}`;
      const expectedSig = crypto.createHash('sha512').update(hashStr).digest('hex');
      if (expectedSig !== signature_key) {
        res.status(401).json({ success: false, message: 'Midtrans signature verification failed.' });
        return;
      }
    }

    const transaction = await prisma.transaction.findFirst({
      where: { invoiceCode: order_id },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    let newStatus: 'PENDING' | 'SUCCESS' | 'REJECTED' | 'EXPIRED' = 'PENDING';

    if (transaction_status === 'capture' && fraud_status === 'accept') newStatus = 'SUCCESS';
    else if (transaction_status === 'settlement') newStatus = 'SUCCESS';
    else if (['cancel', 'deny', 'failure'].includes(transaction_status)) newStatus = 'REJECTED';
    else if (transaction_status === 'expire') newStatus = 'EXPIRED';

    if (newStatus === 'SUCCESS' && transaction.status !== 'SUCCESS') {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'SUCCESS', verifiedAt: new Date(), gatewayResponse: req.body },
        }),
        prisma.user.update({
          where: { id: transaction.userId },
          data: { tokenBalance: { increment: transaction.tokenAmount } },
        }),
      ]);
    } else {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: newStatus, gatewayResponse: req.body },
      });
    }

    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Webhook error.' });
  }
};

// ============================================================
// POST /api/transactions/webhook/xendit
// ============================================================
export const xenditWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookToken = req.headers['x-callback-token'];
    if (env.XENDIT_WEBHOOK_TOKEN && webhookToken !== env.XENDIT_WEBHOOK_TOKEN) {
      res.status(401).json({ success: false, message: 'Webhook token tidak valid.' });
      return;
    }

    const { external_id, status } = req.body;

    const transaction = await prisma.transaction.findFirst({
      where: { invoiceCode: external_id },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    if (status === 'PAID' && transaction.status !== 'SUCCESS') {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'SUCCESS', verifiedAt: new Date(), gatewayResponse: req.body },
        }),
        prisma.user.update({
          where: { id: transaction.userId },
          data: { tokenBalance: { increment: transaction.tokenAmount } },
        }),
      ]);
    } else if (status === 'EXPIRED') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'EXPIRED', gatewayResponse: req.body },
      });
    }

    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Webhook error.' });
  }
};
