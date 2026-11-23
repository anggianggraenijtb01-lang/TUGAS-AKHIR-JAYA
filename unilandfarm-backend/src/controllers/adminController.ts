import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import prisma from '@config/db';
import path from 'path';
import { env } from '@config/env';
import fs from 'fs';

// ============================================================
// GET /api/admin/dashboard
// ============================================================
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers, activeUsers, totalPages, publishedPages,
      totalTransactions, pendingTransactions, totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.landingPage.count(),
      prisma.landingPage.count({ where: { publishStatus: 'PUBLISHED' } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: 'PENDING' } }),
      prisma.transaction.aggregate({ where: { status: 'PAID' }, _sum: { amountPaid: true } }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [revenueLastMonth, newUsersThisWeek] = await Promise.all([
      prisma.transaction.aggregate({
        where: { status: 'PAID', updatedAt: { gte: thirtyDaysAgo } },
        _sum: { amountPaid: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers, newThisWeek: newUsersThisWeek },
        landingPages: { total: totalPages, published: publishedPages },
        transactions: {
          total: totalTransactions,
          pending: pendingTransactions,
          totalRevenue: Number(totalRevenue._sum.amountPaid ?? 0),
          revenueLastMonth: Number(revenueLastMonth._sum.amountPaid ?? 0),
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik dashboard.' });
  }
};

// ============================================================
// GET /api/admin/users
// ============================================================
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip  = (page - 1) * limit;
    const search = (req.query.search as string)?.trim() || '';
    const status = req.query.status as string | undefined;

    const where: Parameters<typeof prisma.user.findMany>[0]['where'] = {
      role: 'CLIENT',
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { businessName: { contains: search } },
        ],
      }),
      ...(status && { status: status as 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, status: true,
          businessName: true, phoneNumber: true, tokenBalance: true,
          lastLoginAt: true, createdAt: true,
          _count: { select: { landingPages: true, transactions: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar pengguna.' });
  }
};

// ============================================================
// GET /api/admin/users/:id
// ============================================================
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, role: true, status: true,
        businessName: true, phoneNumber: true, avatarUrl: true,
        tokenBalance: true, authProvider: true, emailVerifiedAt: true,
        lastLoginAt: true, createdAt: true, updatedAt: true,
        _count: { select: { landingPages: true, transactions: true } },
        transactions: {
          take: 5, orderBy: { createdAt: 'desc' },
          select: { id: true, invoiceCode: true, packageName: true, amountPaid: true, status: true, createdAt: true },
        },
        landingPages: {
          take: 5, orderBy: { updatedAt: 'desc' },
          select: { id: true, title: true, publishStatus: true, viewCount: true, updatedAt: true },
        },
      },
    });

    if (!user) { res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' }); return; }
    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
};

// ============================================================
// PATCH /api/admin/users/:id/status
// ============================================================
export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { status, reason } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' }); return; }
    if (user.role === 'ADMIN') { res.status(403).json({ success: false, message: 'Status akun Admin tidak dapat diubah.' }); return; }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: { id: true, name: true, email: true, status: true },
    });

    await prisma.notification.create({
      data: {
        senderId: req.user!.id,
        recipientId: user.id,
        type: status === 'SUSPENDED' ? 'WARNING' : 'INFO',
        target: 'INDIVIDUAL',
        title: status === 'SUSPENDED' ? 'Akun Anda Disuspend' : 'Status Akun Diperbarui',
        message: status === 'SUSPENDED'
          ? `Akun Anda telah disuspend. ${reason ? 'Alasan: ' + reason : 'Hubungi admin untuk informasi lebih lanjut.'}`
          : `Status akun Anda telah diubah menjadi ${status}.`,
      },
    });

    res.status(200).json({ success: true, message: `Status pengguna berhasil diubah menjadi ${status}.`, data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengubah status pengguna.' });
  }
};

// ============================================================
// POST /api/admin/users/:id/reset-password
// ============================================================
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' }); return; }
    if (user.authProvider === 'GOOGLE') {
      res.status(400).json({ success: false, message: 'Akun Google tidak memiliki password lokal.' });
      return;
    }

    const tempPassword = Math.random().toString(36).slice(2, 10) + 'A1!';
    const hashed = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    await prisma.notification.create({
      data: {
        senderId: req.user!.id,
        recipientId: user.id,
        type: 'SYSTEM',
        target: 'INDIVIDUAL',
        title: 'Password Direset oleh Admin',
        message: `Password Anda telah direset. Password sementara: ${tempPassword}. Segera ganti setelah login.`,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Password berhasil direset.',
      data: { tempPassword },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mereset password.' });
  }
};

// ============================================================
// GET /api/admin/publications
// ============================================================
export const getAllLandingPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit  = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip   = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const search = (req.query.search as string)?.trim() || '';

    const where: Parameters<typeof prisma.landingPage.findMany>[0]['where'] = {
      ...(status && { publishStatus: status as 'DRAFT' | 'PUBLISHED' | 'TAKEN_DOWN' }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { slug:  { contains: search } },
          { user:  { name: { contains: search } } },
        ],
      }),
    };

    const [pages, total] = await Promise.all([
      prisma.landingPage.findMany({
        where, skip, take: limit, orderBy: { updatedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, publishStatus: true,
          viewCount: true, tokenConsumed: true, publishedAt: true,
          createdAt: true, updatedAt: true,
          user: { select: { id: true, name: true, email: true, businessName: true } },
          _count: { select: { sections: true } },
        },
      }),
      prisma.landingPage.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: pages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar landing page.' });
  }
};

// ============================================================
// POST /api/admin/publications/:id/takedown
// ============================================================
export const takedownLandingPage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { reason } = req.body;
  try {
    const page = await prisma.landingPage.findUnique({
      where: { id: req.params.id },
      select: { id: true, title: true, userId: true, publishStatus: true },
    });
    if (!page) { res.status(404).json({ success: false, message: 'Landing page tidak ditemukan.' }); return; }
    if (page.publishStatus !== 'PUBLISHED') {
      res.status(400).json({ success: false, message: 'Hanya halaman yang sudah dipublish yang bisa di-takedown.' });
      return;
    }

    await prisma.$transaction([
      prisma.landingPage.update({ where: { id: page.id }, data: { publishStatus: 'TAKEN_DOWN' } }),
      prisma.notification.create({
        data: {
          senderId: req.user!.id,
          recipientId: page.userId,
          type: 'WARNING',
          target: 'INDIVIDUAL',
          title: 'Landing Page Anda Di-Takedown',
          message: `Landing page "${page.title}" telah di-takedown oleh admin. Alasan: ${reason}`,
        },
      }),
    ]);

    res.status(200).json({ success: true, message: 'Landing page berhasil di-takedown.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal melakukan takedown.' });
  }
};

// ============================================================
// GET /api/admin/templates
// ============================================================
export const getAllTemplates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, category: true, thumbnailUrl: true,
        tokenCost: true, isActive: true, usageCount: true, createdAt: true,
      },
    });
    res.status(200).json({ success: true, data: templates });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar template.' });
  }
};

// ============================================================
// POST /api/admin/templates
// ============================================================
export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { name, category, sectionsJson, tokenCost } = req.body;
  const file = req.file;
  try {
    const thumbnailUrl = file ? `${env.APP_BASE_URL}/uploads/templates/${file.filename}` : null;
    const parsedSections = JSON.parse(sectionsJson);

    const template = await prisma.template.create({
      data: {
        name, category,
        sectionsJson: parsedSections,
        tokenCost: tokenCost ? parseInt(tokenCost) : 0,
        thumbnailUrl,
        isActive: true,
      },
    });

    res.status(201).json({ success: true, message: 'Template berhasil dibuat.', data: template });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat template.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// PUT /api/admin/templates/:id
// ============================================================
export const updateTemplate = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { name, tokenCost, isActive, category } = req.body;
  const file = req.file;
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } });
    if (!template) { res.status(404).json({ success: false, message: 'Template tidak ditemukan.' }); return; }

    const updateData: Record<string, unknown> = {};
    if (name     !== undefined) updateData.name     = name;
    if (category !== undefined) updateData.category = category;
    if (tokenCost !== undefined) updateData.tokenCost = parseInt(tokenCost);
    if (isActive  !== undefined) updateData.isActive  = isActive === 'true' || isActive === true;

    if (file) {
      if (template.thumbnailUrl) {
        const oldPath = path.join(env.UPLOAD_DIR, 'templates', path.basename(template.thumbnailUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.thumbnailUrl = `${env.APP_BASE_URL}/uploads/templates/${file.filename}`;
    }

    const updated = await prisma.template.update({ where: { id: req.params.id }, data: updateData });
    res.status(200).json({ success: true, message: 'Template berhasil diperbarui.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal memperbarui template.' });
  }
};

// ============================================================
// DELETE /api/admin/templates/:id
// ============================================================
export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const template = await prisma.template.findUnique({ where: { id: req.params.id } });
    if (!template) { res.status(404).json({ success: false, message: 'Template tidak ditemukan.' }); return; }

    if (template.thumbnailUrl) {
      const filepath = path.join(env.UPLOAD_DIR, 'templates', path.basename(template.thumbnailUrl));
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    await prisma.template.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Template berhasil dihapus.' });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal menghapus template.' });
  }
};

// ============================================================
// GET /api/admin/transactions
// ============================================================
export const getPendingTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit  = Math.min(100, parseInt(req.query.limit as string) || 20);
    const skip   = (page - 1) * limit;
    const status = (req.query.status as string) || 'PENDING';

    const where: Parameters<typeof prisma.transaction.findMany>[0]['where'] = {
      ...(status !== 'ALL' && { status: status as 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED' }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        select: {
          id: true, invoiceCode: true, packageName: true, tokenAmount: true,
          amountPaid: true, paymentMethod: true, status: true,
          proofImageUrl: true, adminNote: true, createdAt: true, updatedAt: true,
          user: { select: { id: true, name: true, email: true, businessName: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar transaksi.' });
  }
};

// ============================================================
// GET /api/admin/transactions/stats
// ============================================================
export const getTransactionStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const startOfMonth    = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [total, thisMonth, lastMonth, byMethod] = await Promise.all([
      prisma.transaction.aggregate({
        where: { status: 'PAID' },
        _sum: { amountPaid: true, tokenAmount: true }, _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { status: 'PAID', updatedAt: { gte: startOfMonth } },
        _sum: { amountPaid: true, tokenAmount: true }, _count: { id: true },
      }),
      prisma.transaction.aggregate({
        where: { status: 'PAID', updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { amountPaid: true }, _count: { id: true },
      }),
      prisma.transaction.groupBy({
        by: ['paymentMethod'],
        where: { status: 'PAID' },
        _count: { id: true }, _sum: { amountPaid: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        allTime:   { revenue: Number(total._sum.amountPaid ?? 0), tokensSold: total._sum.tokenAmount ?? 0, transactionCount: total._count.id },
        thisMonth: { revenue: Number(thisMonth._sum.amountPaid ?? 0), tokensSold: thisMonth._sum.tokenAmount ?? 0, transactionCount: thisMonth._count.id },
        lastMonth: { revenue: Number(lastMonth._sum.amountPaid ?? 0), transactionCount: lastMonth._count.id },
        byPaymentMethod: byMethod.map(m => ({ method: m.paymentMethod, count: m._count.id, revenue: Number(m._sum.amountPaid ?? 0) })),
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik transaksi.' });
  }
};

// ============================================================
// POST /api/admin/transactions/:id/verify
// ============================================================
export const verifyTransaction = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { note } = req.body;
  try {
    const trx = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, tokenBalance: true } } },
    });
    if (!trx) { res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' }); return; }
    if (trx.status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Transaksi sudah berstatus ${trx.status}.` });
      return;
    }

    const newBalance = trx.user.tokenBalance + trx.tokenAmount;

    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: trx.id },
        data: { status: 'PAID', verifiedByAdminId: req.user!.id, verifiedAt: new Date(), adminNote: note || null },
      }),
      prisma.user.update({
        where: { id: trx.userId },
        data: { tokenBalance: { increment: trx.tokenAmount } },
      }),
      prisma.aiTokenLog.create({
        data: {
          userId: trx.userId,
          transactionId: trx.id,
          logType: 'CREDIT',
          tokenAmount: trx.tokenAmount,
          balanceAfter: newBalance,
          description: `Top-up via ${trx.paymentMethod} — ${trx.packageName}`,
        },
      }),
      prisma.notification.create({
        data: {
          senderId: req.user!.id,
          recipientId: trx.userId,
          type: 'TRANSACTION',
          target: 'INDIVIDUAL',
          title: 'Pembayaran Dikonfirmasi ✅',
          message: `Pembayaran ${trx.packageName} (${trx.invoiceCode}) telah dikonfirmasi. ${trx.tokenAmount} token AI telah ditambahkan ke akun Anda.`,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: `Transaksi ${trx.invoiceCode} berhasil diverifikasi. ${trx.tokenAmount} token ditambahkan ke akun pengguna.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memverifikasi transaksi.';
    res.status(500).json({ success: false, message });
  }
};

// ============================================================
// POST /api/admin/transactions/:id/reject
// ============================================================
export const rejectTransaction = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { reason } = req.body;
  try {
    const trx = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      select: { id: true, userId: true, invoiceCode: true, packageName: true, status: true },
    });
    if (!trx) { res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' }); return; }
    if (trx.status !== 'PENDING') {
      res.status(400).json({ success: false, message: `Transaksi sudah berstatus ${trx.status}.` });
      return;
    }

    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: trx.id },
        data: { status: 'FAILED', verifiedByAdminId: req.user!.id, verifiedAt: new Date(), adminNote: reason },
      }),
      prisma.notification.create({
        data: {
          senderId: req.user!.id,
          recipientId: trx.userId,
          type: 'TRANSACTION',
          target: 'INDIVIDUAL',
          title: 'Pembayaran Ditolak ❌',
          message: `Pembayaran ${trx.packageName} (${trx.invoiceCode}) ditolak. Alasan: ${reason}. Silakan hubungi admin untuk bantuan.`,
        },
      }),
    ]);

    res.status(200).json({ success: true, message: `Transaksi ${trx.invoiceCode} berhasil ditolak.` });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal menolak transaksi.' });
  }
};

// ============================================================
// POST /api/admin/notifications/send
// ============================================================
export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { recipientId, title, message, type, actionUrl } = req.body;
  try {
    const recipient = await prisma.user.findUnique({ where: { id: recipientId }, select: { id: true, name: true } });
    if (!recipient) { res.status(404).json({ success: false, message: 'Penerima tidak ditemukan.' }); return; }

    const notification = await prisma.notification.create({
      data: {
        senderId: req.user!.id,
        recipientId,
        type: type || 'INFO',
        target: 'INDIVIDUAL',
        title,
        message,
        actionUrl: actionUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      message: `Notifikasi berhasil dikirim ke ${recipient.name}.`,
      data: notification,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengirim notifikasi.' });
  }
};

// ============================================================
// POST /api/admin/notifications/broadcast
// ============================================================
export const broadcastNotification = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(422).json({ success: false, errors: errors.array() }); return; }

  const { title, message, type } = req.body;
  try {
    const notification = await prisma.notification.create({
      data: {
        senderId: req.user!.id,
        recipientId: null,
        type: type || 'INFO',
        target: 'BROADCAST',
        title,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Notifikasi broadcast berhasil dikirim ke semua pengguna.',
      data: notification,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Gagal mengirim notifikasi broadcast.' });
  }
};

