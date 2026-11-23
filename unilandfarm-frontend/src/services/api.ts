import {
  LandingPage,
  Section,
  AiGenerateRequest,
  MagicRephraseRequest,
  Transaction,
  User,
  Plan,
  Subscription,
  Order,
  BillingInterval,
  PaymentMethod,
} from '../types';
import { initialLandingPages, initialCurrentUser, subscriptionPlans, initialSubscriptions } from './mockData';

const API_BASE = '/api';

// Helper to check if backend is reachable
let isBackendLive: boolean | null = null;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    const data = await res.json();
    isBackendLive = data.success === true;
    return isBackendLive;
  } catch {
    isBackendLive = false;
    return false;
  }
}

// Local Storage keys for offline/fallback persistence
const STORAGE_PAGES_KEY = 'uniland_pages_v6';
const STORAGE_USER_KEY = 'uniland_user_v2';

export function getLocalPages(): LandingPage[] {
  const saved = localStorage.getItem(STORAGE_PAGES_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Ensure Greenora demo page is present and at the top
        const hasGreenora = parsed.some((p: any) => p.slug === 'greenora' || p.id === 'page_greenora_01');
        const greenora = initialLandingPages.find((p) => p.slug === 'greenora');
        if (!hasGreenora && greenora) {
          return [greenora, ...parsed];
        }
        return parsed;
      }
    } catch {
      // fallback
    }
  }
  return initialLandingPages;
}

export function saveLocalPages(pages: LandingPage[]) {
  localStorage.setItem(STORAGE_PAGES_KEY, JSON.stringify(pages));
}

export function getLocalUser(): User {
  const saved = localStorage.getItem(STORAGE_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return initialCurrentUser;
}

export function saveLocalUser(user: User) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

// ============================================================
// AI GENERATION SERVICE
// ============================================================
export async function generateLandingPageAi(req: AiGenerateRequest): Promise<LandingPage> {
  // If backend is up, call real Gemini backend
  if (isBackendLive) {
    try {
      const token = localStorage.getItem('uniland_jwt');
      const res = await fetch(`${API_BASE}/ai/generate-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (e) {
      console.warn('Backend call failed, generating with smart local engine:', e);
    }
  }

  // Realistic Smart Generation Engine
  await new Promise((resolve) => setTimeout(resolve, 2400)); // Simulate thinking

  const slug = req.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newPage: LandingPage = {
    id: `page_${Date.now()}`,
    userId: 'usr_umkm_01',
    templateId: req.templateId || 'tpl_kopi',
    title: `${req.businessName} — Solusi Terbaik ${req.category}`,
    slug: `${slug}-${Math.floor(Math.random() * 899 + 100)}`,
    publishStatus: 'DRAFT',
    businessName: req.businessName,
    category: req.category,
    description: req.description,
    tone: req.tone,
    whatsappNumber: '081234567890',
    whatsappMessage: `Halo ${req.businessName}, saya melihat produk Anda di website dan ingin bertanya detail.`,
    viewCount: 0,
    uniqueVisitors: 0,
    tokenConsumed: 10,
    metaTitle: `${req.businessName} | ${req.category} Terpercaya`,
    metaDescription: req.description.slice(0, 150),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: `sec_hero_${Date.now()}`,
        sectionType: 'HERO',
        label: 'Hero Utama',
        sortOrder: 0,
        isVisible: true,
        contentJson: {
          badge: `🌿 Kualitas Unggul ${req.category}`,
          headline: `${req.businessName}: Hadirkan Produk Terbaik Langsung ke Tangan Anda`,
          subheadline: req.description,
          primaryCtaText: 'Hubungi Kami via WhatsApp',
          secondaryCtaText: 'Jelajahi Produk Kami',
          heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
        },
      },
      {
        id: `sec_features_${Date.now()}`,
        sectionType: 'FEATURES',
        label: 'Keunggulan Produk',
        sortOrder: 1,
        isVisible: true,
        contentJson: {
          title: 'Mengapa Harus Memilih Kami?',
          subtitle: `Komitmen ${req.businessName} untuk memberikan kepuasan maksimal.`,
          features: [
            {
              icon: '✨',
              title: 'Kualitas Teruji & Terpilih',
              desc: 'Diproduksi dan disortir dengan standar ketat untuk hasil terbaik.',
            },
            {
              icon: '🚀',
              title: 'Pengiriman Cepat & Aman',
              desc: 'Packing rapi dan pengiriman terpercaya hingga alamat tujuan.',
            },
            {
              icon: '💬',
              title: 'Pelayanan Ramah & Responsif',
              desc: 'Konsultasi gratis langsung via WhatsApp dengan tim kami.',
            },
          ],
        },
      },
      {
        id: `sec_catalog_${Date.now()}`,
        sectionType: 'CATALOG',
        label: 'Katalog Produk & Paket',
        sortOrder: 2,
        isVisible: true,
        contentJson: {
          title: 'Pilihan Produk Favorit',
          subtitle: 'Dapatkan penawaran terbaik untuk pesanan Anda hari ini.',
          items: [
            {
              name: `Paket Hemat ${req.businessName}`,
              price: 'Rp 45.000',
              image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=80',
              badge: 'Paling Laris',
              desc: 'Pilihan tepat untuk mencoba kualitas unggulan kami pertama kali.',
            },
            {
              name: `Paket Lengkap Keluarga`,
              price: 'Rp 95.000',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
              badge: 'Best Value',
              desc: 'Porsi lebih banyak dengan bonus kemasan eksklusif.',
            },
          ],
        },
      },
      {
        id: `sec_testimonials_${Date.now()}`,
        sectionType: 'TESTIMONIALS',
        label: 'Testimoni Pembeli',
        sortOrder: 3,
        isVisible: true,
        contentJson: {
          title: 'Apa Kata Pelanggan Kami?',
          subtitle: 'Ulasan jujur dari pembeli yang telah merasakan manfaatnya.',
          testimonials: [
            {
              quote: `Produk dari ${req.businessName} benar-benar sesuai ekspektasi. Kualitas terjamin dan respon penjual sangat cepat!`,
              author: 'Siti Rahmawati',
              role: 'Pelanggan Setia',
              rating: 5,
            },
            {
              quote: 'Sudah repeat order 3 kali. Keluarga di rumah sangat suka. Pasti akan pesan lagi bulan depan.',
              author: 'Agus Wijaya',
              role: 'Pecinta Kuliner Sehat',
              rating: 5,
            },
          ],
        },
      },
      {
        id: `sec_faq_${Date.now()}`,
        sectionType: 'FAQ',
        label: 'Tanya Jawab (FAQ)',
        sortOrder: 4,
        isVisible: true,
        contentJson: {
          title: 'Pertanyaan yang Sering Muncul',
          faqs: [
            {
              q: 'Bagaimana cara melakukan pemesanan?',
              a: 'Cukup klik tombol WhatsApp di halaman ini, kirimkan daftar pesanan Anda, dan kami akan segera memprosesnya.',
            },
            {
              q: 'Apakah bisa kirim ke luar kota?',
              a: 'Bisa! Kami bekerja sama dengan berbagai ekspedisi kilat terpercaya ke seluruh Indonesia.',
            },
          ],
        },
      },
      {
        id: `sec_contact_${Date.now()}`,
        sectionType: 'CONTACT',
        label: 'Kontak & Info Pemesanan',
        sortOrder: 5,
        isVisible: true,
        contentJson: {
          title: `Hubungi ${req.businessName}`,
          address: 'Sentra Agrobisnis & UMKM Indonesia',
          phone: '0812-3456-7890',
          email: `kontak@${slug}.id`,
          hours: 'Senin - Minggu: 07.00 - 21.00 WIB',
        },
      },
    ],
  };

  return newPage;
}

// ============================================================
// AI MAGIC BUTTON REPHRASE
// ============================================================
export async function executeMagicAi(req: MagicRephraseRequest): Promise<string> {
  if (isBackendLive) {
    try {
      const endpoint =
        req.mode === 'extend'
          ? '/ai/extend'
          : req.mode === 'shorten'
          ? '/ai/shorten'
          : req.mode === 'tone'
          ? '/ai/change-tone'
          : '/ai/rephrase';

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (data.success && data.data?.result) {
        return data.data.result;
      }
    } catch {
      // fallback
    }
  }

  // Smart local copy enhancer
  await new Promise((r) => setTimeout(r, 600));

  const text = req.text.trim();
  if (req.mode === 'extend') {
    return `${text} — Dihadirkan dengan standar mutu tertinggi, dipetik langsung dari sumber terpercaya untuk memberikan pengalaman cita rasa dan kepuasan tiada tanding bagi Anda dan keluarga.`;
  }
  if (req.mode === 'shorten') {
    return text.split(/[.,]/)[0] + ' berkualitas unggul siap kirim ke tempat Anda.';
  }
  if (req.mode === 'tone') {
    if (req.tone === 'fun') {
      return `Bikin harimu makin seru dan nagih dengan ${text}! Wajib cobain sekarang juga 🤩✨`;
    }
    if (req.tone === 'formal') {
      return `Kami senantiasa berkomitmen menghadirkan produk yang berdaya saing tinggi: ${text}.`;
    }
    return `Yuk nikmati ${text} yang ramah di kantong dan sehat untuk semua! 🌿`;
  }

  // Default rephrase
  return `Nikmati keistimewaan ${text} dengan kualitas terjaga dan aroma khas yang menggugah selera.`;
}

// ============================================================
// SUBSCRIPTION & PAYMENT API SERVICES
// ============================================================

const STORAGE_ORDERS_KEY = 'uniland_orders_v1';
const STORAGE_SUB_KEY = 'uniland_subscription_v1';

export async function getSubscriptionPlans(): Promise<Plan[]> {
  if (isBackendLive) {
    try {
      const res = await fetch(`${API_BASE}/transactions/plans`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch {
      // fallback to local seed data
    }
  }
  return subscriptionPlans;
}

export async function getMySubscription(): Promise<Subscription> {
  const saved = localStorage.getItem(STORAGE_SUB_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return initialSubscriptions[0];
}

export async function saveMySubscription(sub: Subscription): Promise<void> {
  localStorage.setItem(STORAGE_SUB_KEY, JSON.stringify(sub));
}

export function getMyOrders(): Order[] {
  const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return [
    {
      id: 'ord_101',
      userId: 'usr_umkm_01',
      planId: 'plan_pro',
      planName: 'Paket Pro UMKM',
      orderReference: 'INV-20261012-0042',
      amount: 59000,
      currency: 'IDR',
      billingInterval: 'monthly',
      paymentMethod: 'QRIS',
      status: 'SUCCESS',
      createdAt: '2026-10-12T10:15:00Z',
    },
    {
      id: 'ord_102',
      userId: 'usr_umkm_01',
      planId: 'plan_pro',
      planName: 'Paket Pro UMKM',
      orderReference: 'INV-20261015-0109',
      amount: 59000,
      currency: 'IDR',
      billingInterval: 'monthly',
      paymentMethod: 'MANUAL_TRANSFER',
      status: 'PENDING',
      createdAt: '2026-10-15T14:30:00Z',
      expiredAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    },
  ];
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
}

export async function createOrder(req: {
  userId: string;
  planId: string;
  billingInterval: BillingInterval;
  paymentMethod: PaymentMethod;
}): Promise<Order> {
  const plan = subscriptionPlans.find((p) => p.id === req.planId) || subscriptionPlans[1];
  const authoritativeAmount =
    req.billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  // If backend is active, send request to server
  if (isBackendLive) {
    try {
      const token = localStorage.getItem('uniland_jwt');
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          packageId: req.planId,
          billingInterval: req.billingInterval,
          paymentMethod: req.paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return {
          id: data.data.id,
          userId: req.userId,
          planId: req.planId,
          planName: plan.name,
          orderReference: data.data.invoiceCode,
          amount: Number(data.data.amountPaid),
          currency: 'IDR',
          billingInterval: req.billingInterval,
          paymentMethod: req.paymentMethod,
          status: data.data.status || 'PENDING',
          createdAt: data.data.createdAt,
          expiredAt: data.data.expiredAt,
        };
      }
    } catch (e) {
      console.warn('Backend order call failed, creating local order:', e);
    }
  }

  // Authoritative server-equivalent local order generation
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderRef = `INV-${dateStr}-${randCode}`;

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    userId: req.userId,
    planId: plan.id,
    planName: plan.name,
    orderReference: orderRef,
    amount: authoritativeAmount,
    currency: 'IDR',
    billingInterval: req.billingInterval,
    paymentMethod: req.paymentMethod,
    status: authoritativeAmount === 0 ? 'SUCCESS' : 'PENDING',
    createdAt: new Date().toISOString(),
    expiredAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  };

  const currentOrders = getMyOrders();
  saveOrders([newOrder, ...currentOrders]);

  // If Free plan, immediately activate
  if (authoritativeAmount === 0) {
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      userId: req.userId,
      planId: plan.id,
      planName: plan.name,
      status: 'ACTIVE',
      billingInterval: req.billingInterval,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      renewalMode: 'MANUAL',
    };
    saveMySubscription(newSub);
  }

  return newOrder;
}

export async function verifyOrderStatus(orderRef: string): Promise<Order | null> {
  const orders = getMyOrders();
  const order = orders.find((o) => o.orderReference === orderRef);
  if (!order) return null;

  // If already SUCCESS or expired
  return order;
}

export async function confirmOrderPaymentSuccess(orderRef: string): Promise<Order | null> {
  const orders = getMyOrders();
  const target = orders.find((o) => o.orderReference === orderRef);
  if (!target) return null;

  const updatedOrders: Order[] = orders.map((o) =>
    o.orderReference === orderRef ? { ...o, status: 'SUCCESS' as const } : o
  );
  saveOrders(updatedOrders);

  const plan = subscriptionPlans.find((p) => p.id === target.planId) || subscriptionPlans[1];
  const durationDays = target.billingInterval === 'yearly' ? 365 : 30;

  const newSub: Subscription = {
    id: `sub_${Date.now()}`,
    userId: target.userId,
    planId: plan.id,
    planName: plan.name,
    status: 'ACTIVE',
    billingInterval: target.billingInterval,
    startsAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString(),
    renewalMode: 'MANUAL',
  };
  saveMySubscription(newSub);

  return { ...target, status: 'SUCCESS' };
}

export async function uploadTransferProof(
  orderRef: string,
  proofDataUrl: string
): Promise<boolean> {
  const orders = getMyOrders();
  const target = orders.find((o) => o.orderReference === orderRef);
  if (!target) return false;

  const updatedOrders = orders.map((o) =>
    o.orderReference === orderRef ? { ...o, proofImageUrl: proofDataUrl } : o
  );
  saveOrders(updatedOrders);
  return true;
}

