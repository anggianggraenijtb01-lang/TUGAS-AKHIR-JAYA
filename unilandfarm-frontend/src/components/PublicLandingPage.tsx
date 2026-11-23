import React, { useState } from 'react';
import { User, Template, Plan, BillingInterval } from '../types';
import { UniLandLogo } from './UniLandLogo';
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Calendar,
  Globe,
  TrendingUp,
} from './icons/LucideIcons';

interface PublicLandingPageProps {
  currentUser: User | null;
  templates: Template[];
  plans: Plan[];
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenDashboard?: () => void;
  onOpenAiWizard: (prefillName?: string) => void;
  onSelectPlan: (plan: Plan, interval: BillingInterval) => void;
  onOpenPublicView: (slug: string) => void;
  onUseTemplate: (template: Template) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  currentUser,
  templates,
  plans,
  onOpenAuth,
  onOpenDashboard,
  onOpenAiWizard,
  onSelectPlan,
  onOpenPublicView,
  onUseTemplate,
}) => {
  const [activeNav, setActiveNav] = useState('beranda');
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [studioTab, setStudioTab] = useState<'cms' | 'dashboard'>('cms');
  const [quickBrandName, setQuickBrandName] = useState('');

  // Real templates mapped directly to initialLandingPages & initialTemplates in mockData.ts
  const templateShowcase = [
    {
      id: 'tpl_kopi',
      name: 'Artisan Coffee & Roastery',
      brandName: 'Kopi Lereng Slamet',
      category: 'Perkebunan & Kopi',
      origin: 'Template Roastery & Perkebunan',
      domain: 'unilandfarm.id/site/kopi-robusta-slamet',
      slug: 'kopi-robusta-slamet',
      description:
        'Template khusus usaha kopi, teh, dan hasil perkebunan dengan katalog varian sangrai dan order grosir via WhatsApp.',
      themeBg: '#1c2d1f',
      themeAccent: '#d3e8bc',
      heroBadge: '100% SINGLE ORIGIN',
      heroHeadline: 'Kopi Asli Petani Lereng Slamet',
      heroSub: 'Dipetik matang, diproses dengan teliti, dikirim segar ke rumah Anda.',
      heroImage: '/assets/coffee_hero_bg.jpg?v=2',
      trustItems: [
        '100% Arabika Lereng Slamet',
        'Pengiriman Seluruh Indonesia',
        'Kualitas Terjamin Petani',
      ],
      highlights: [
        'Katalog Varian Sangrai',
        'Keranjang Order WhatsApp',
        'Profil Kebun & Proses',
        'Otomatisasi Konten AI',
      ],
      products: [
        {
          name: 'Robusta Natural 250g',
          price: 'Rp 45.000',
          tag: 'Best Seller',
          rating: '5.0 • Siap Kirim',
          img: '/assets/products/kopi-robusta.svg',
        },
        {
          name: 'Wine Fermented 250g',
          price: 'Rp 65.000',
          tag: 'Edisi Terbatas',
          rating: '4.9 • Fresh Roast',
          img: '/assets/products/kopi-wine.svg',
        },
        {
          name: 'Cold Brew Blend 500g',
          price: 'Rp 80.000',
          tag: 'Favorit Kafe',
          rating: '5.0 • Grosir',
          img: '/assets/products/kopi-coldbrew.svg',
        },
      ],
    },
    {
      id: 'tpl_madu',
      name: 'Herbal & Natural Skincare',
      brandName: 'Greenora Natural Care',
      category: 'Kesehatan & Herbal',
      origin: 'Template Herbal & Perawatan Alami',
      domain: 'unilandfarm.id/site/greenora',
      slug: 'greenora',
      description:
        'Desain bersih untuk produk herbal, madu murni, dan skincare alami dengan highlight komposisi BPOM.',
      themeBg: '#1f3322',
      themeAccent: '#d3e8bc',
      heroBadge: '100% BAHAN ALAMI PILIHAN',
      heroHeadline: 'Produk Alami untuk Hidup Lebih Sehat',
      heroSub: 'Ekstrak botanikal murni tanpa bahan kimia sintetis, aman untuk perawatan harian.',
      heroImage: '/assets/products/greenora-hero.svg',
      trustItems: [
        '100% Organik BPOM',
        'Gratis Ongkir Nasional',
        'Respon WhatsApp Cepat',
      ],
      highlights: [
        'Etalase Produk & BPOM',
        'Konsultasi & Order WA',
        'Deskripsi Manfaat AI',
        'Tampilan Bersih & Elegan',
      ],
      products: [
        {
          name: 'Serum Wajah Alami',
          price: 'Rp 85.000',
          tag: 'BPOM Resmi',
          rating: '5.0 • Siap Kirim',
          img: '/assets/products/serum-wajah.svg',
        },
        {
          name: 'Madu Hutan Murni',
          price: 'Rp 45.000',
          tag: '100% Murni',
          rating: '4.9 • Best Seller',
          img: '/assets/products/madu-hutan.svg',
        },
        {
          name: 'Minyak Atsiri Herbal',
          price: 'Rp 65.000',
          tag: 'Aromaterapi',
          rating: '5.0 • Murni',
          img: '/assets/products/minyak-atsiri.svg',
        },
      ],
    },
    {
      id: 'tpl_hidroponik',
      name: 'Fresh Urban Farm & Sayur',
      brandName: 'Hijau Hydro Farm',
      category: 'Pertanian Modern',
      origin: 'Template Sayur & Pertanian Segar',
      domain: 'unilandfarm.id/site/sayur-hidroponik-segar',
      slug: 'sayur-hidroponik-segar',
      description:
        'Cocok untuk kebun hidroponik, buah segar, dan supplier pangan dengan fitur paket langganan mingguan.',
      themeBg: '#1c2f20',
      themeAccent: '#d3e8bc',
      heroBadge: 'BEBAS PESTISIDA & HIGIENIS',
      heroHeadline: 'Sayur Hidroponik Segar Panen Setiap Pagi',
      heroSub: 'Diantar langsung dari greenhouse steril ke dapur keluarga Anda.',
      heroImage: '/assets/products/hydro-hero.svg',
      trustItems: [
        'Air Nutrisi Steril',
        '0% Residu Pestisida',
        'Panen Pagi Kirim Siang',
      ],
      highlights: [
        'Katalog Panen Harian',
        'Paket Langganan Mingguan',
        'Format Pesanan WA Instan',
        'Jadwal Promo Panen AI',
      ],
      products: [
        {
          name: 'Selada Romaine 250g',
          price: 'Rp 18.000',
          tag: 'Panen Pagi',
          rating: '5.0 • Renyah',
          img: '/assets/products/selada.svg',
        },
        {
          name: 'Pakcoy Organik 500g',
          price: 'Rp 15.000',
          tag: 'Favorit',
          rating: '4.9 • Segar',
          img: '/assets/products/pakcoy.svg',
        },
        {
          name: 'Kale Curly Superfood',
          price: 'Rp 28.000',
          tag: 'Organik',
          rating: '5.0 • Superfood',
          img: '/assets/products/kale.svg',
        },
      ],
    },
    {
      id: 'tpl_kuliner_olahan',
      name: 'Kuliner Kemasan & Sambal',
      brandName: 'Dapur Sambal Bu Roes',
      category: 'Kuliner & F&B',
      origin: 'Template Kuliner & Oleh-Oleh',
      domain: 'unilandfarm.id/site/sambal-bu-roes-asli',
      slug: 'sambal-bu-roes-asli',
      description:
        'Dirancang untuk usaha kuliner kemasan, frozen food, dan camilan dengan katalog bundling hemat.',
      themeBg: '#261c17',
      themeAccent: '#f3d9b1',
      heroBadge: '100% CABAI SEGAR TANPA PENGAWET',
      heroHeadline: 'Sensasi Pedas Gurih Rempah Nusantara',
      heroSub: 'Dimasak slow-cooked 4 jam dengan potongan cumi dan cakalang melimpah.',
      heroImage: '/assets/products/sambal-hero.svg',
      trustItems: [
        'Cabai Rawit Segar Pilihan',
        'Masak Slow-Cooked 4 Jam',
        'Segel Vakum Anti Tumpah',
      ],
      highlights: [
        'Katalog Varian & Bundling',
        'Checkout Langsung ke WA',
        'Label Level Kepedasan',
        'Teks Promosi Kuliner AI',
      ],
      products: [
        {
          name: 'Sambal Cumi Asin 200g',
          price: 'Rp 38.000',
          tag: 'Terlaris',
          rating: '5.0 • 1.2rb Terjual',
          img: '/assets/products/sambal-cumi.svg',
        },
        {
          name: 'Sambal Cakalang Asap',
          price: 'Rp 42.000',
          tag: 'Pedas Gurih',
          rating: '4.9 • Best Seller',
          img: '/assets/products/sambal-cakalang.svg',
        },
        {
          name: 'Bundling 3 Botol Juara',
          price: 'Rp 105.000',
          tag: 'Hemat 15rb',
          rating: '5.0 • Paket Hemat',
          img: '/assets/products/sambal-bundling.svg',
        },
      ],
    },
  ];

  const filteredShowcase =
    activeCategory === 'Semua'
      ? templateShowcase
      : templateShowcase.filter((t) => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const faqs = [
    {
      q: 'Apakah harus bisa coding untuk membuat website di sini?',
      a: 'Tidak perlu. Cukup pilih template, isi foto produk serta nomor WhatsApp, dan website toko Anda langsung aktif.',
    },
    {
      q: 'Apa fungsi utama fitur Agentic AI CMS?',
      a: 'Membantu Anda menulis deskripsi produk otomatis, merangkai kalimat promosi, dan menjadwalkan pergantian banner diskon.',
    },
    {
      q: 'Bagaimana cara pembeli memesan produk saya?',
      a: 'Saat pembeli klik tombol beli di website, mereka langsung diarahkan ke WhatsApp Anda dengan teks rincian pesanan yang sudah terisi otomatis.',
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Mendukung QRIS instan (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay) dan Virtual Account seluruh bank nasional.',
    },
    {
      q: 'Bisakah saya memakai domain sendiri (.com / .id)?',
      a: 'Bisa. Paket Pro dan Bisnis mendukung integrasi domain kustom serta fitur unduh file HTML mandiri.',
    },
  ];

  const scrollToSection = (id: string, navKey: string) => {
    setActiveNav(navKey);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUseShowcaseTemplate = (item: (typeof templateShowcase)[0]) => {
    const matched =
      templates.find((t) => t.id === item.id) ||
      templates.find((t) => t.category.toLowerCase().includes(item.category.split(' ')[0].toLowerCase())) ||
      templates[0];

    if (matched) {
      onUseTemplate(matched);
    } else {
      onOpenAiWizard(item.brandName);
    }
  };

  const displayPlans: Plan[] =
    plans && plans.length > 0
      ? plans
      : [
          {
            id: 'plan_free',
            name: 'Paket Gratis',
            slug: 'free',
            description: 'Katalog online gratis untuk UMKM baru memulai.',
            monthlyPrice: 0,
            yearlyPrice: 0,
            isFree: true,
            isActive: true,
            limits: {
              websites: 1,
              tokens: 15,
              templates: 'basic',
              customDomain: false,
              scheduler: false,
              exportHtml: false,
              prioritySupport: false,
            },
            features: [
              '1 Website Toko Resmi',
              'Order Langsung ke WhatsApp',
              '15 Token AI Generator',
              'Subdomain & Hosting Cepat',
            ],
          },
          {
            id: 'plan_pro',
            name: 'Paket Pro UMKM',
            slug: 'pro',
            description: 'Katalog profesional & otomatisasi konten AI.',
            monthlyPrice: 59000,
            yearlyPrice: 590000,
            isPopular: true,
            isActive: true,
            limits: {
              websites: 5,
              tokens: 150,
              templates: 'all',
              customDomain: false,
              scheduler: true,
              exportHtml: true,
              prioritySupport: true,
            },
            features: [
              'Hingga 5 Website Toko',
              '150 Token AI & Jadwal Promo',
              'Akses Semua Template Premium',
              'Export File HTML Mandiri',
            ],
          },
          {
            id: 'plan_business',
            name: 'Paket Bisnis Agrobisnis',
            slug: 'business',
            description: 'Solusi skala besar untuk distributor & aneka cabang.',
            monthlyPrice: 149000,
            yearlyPrice: 1490000,
            isActive: true,
            limits: {
              websites: 'unlimited',
              tokens: 450,
              templates: 'all',
              customDomain: true,
              scheduler: true,
              exportHtml: true,
              prioritySupport: true,
            },
            features: [
              'Website Toko Tanpa Batas',
              'Custom Domain (.id / .com)',
              '450 Token AI Otomatisasi',
              'Multi-Admin & Dukungan Prioritas',
            ],
          },
        ];

  return (
    <div className="eloq-page">
      {/* ============================================================
          1. TOP NAVBAR
         ============================================================ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#eef3eb',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(35, 55, 38, 0.12)',
        }}
      >
        <div
          className="eloq-container"
          style={{
            height: '76px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div
            onClick={() => scrollToSection('top-hero', 'beranda')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <UniLandLogo size="md" variant="light" />
          </div>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
            className="hidden md:flex"
          >
            {[
              { key: 'beranda', label: 'Beranda', target: 'top-hero' },
              { key: 'tentang', label: 'Platform', target: 'tentang' },
              { key: 'karya', label: 'Template', target: 'template' },
              { key: 'layanan', label: 'Fitur AI', target: 'fitur' },
              { key: 'harga', label: 'Harga', target: 'harga' },
              { key: 'faq', label: 'FAQ', target: 'faq' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.target, item.key)}
                className={`eloq-nav-link ${activeNav === item.key ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/*Right: Auth & Signature Eloqwnt Pill CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {currentUser ? (
              <button
                onClick={() => onOpenDashboard && onOpenDashboard()}
                className="eloq-btn-black"
                style={{
                  padding: '0.68rem 1.4rem',
                  fontSize: '0.92rem',
                  background: 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)',
                  color: '#ffffff',
                  boxShadow: '0 8px 22px -4px rgba(35, 55, 38, 0.42)',
                }}
              >
                <span>Dashboard</span>
                <span>↗</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="eloq-nav-link"
                  style={{ marginRight: '0.25rem', fontWeight: 500 }}
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAiWizard()}
                  className="eloq-btn-grey"
                  style={{
                    padding: '0.68rem 1.4rem',
                    fontSize: '0.92rem',
                    background: 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)',
                    color: '#ffffff',
                    boxShadow: '0 8px 22px -4px rgba(35, 55, 38, 0.42)',
                  }}
                >
                  <span>Mulai Sekarang</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          2. HERO SECTION (Full-Height Architectural Studio Stage)
         ============================================================ */}
      <section
        id="top-hero"
        className="eloq-hero-surface"
        style={{
          borderRadius: '0 0 40px 40px',
          minHeight: 'calc(94svh - 76px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '6.5rem',
          paddingBottom: '6.5rem',
        }}
      >
        {/* Multi-Layer Architectural Studio Grid & Symmetrical Olive Glows */}
        <div className="eloq-hero-grid-bg" />
        <div className="eloq-aurora-orb-1" />
        <div className="eloq-aurora-orb-2" />
        <div className="eloq-aurora-orb-3" />

        {/* Precision Studio Architectural Geometry Overlay (Concentric Arcs & Crosshair Nodes) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <radialGradient id="heroArchFade" cx="50%" cy="46%" r="54%">
              <stop offset="0%" stopColor="#233726" stopOpacity="0.14" />
              <stop offset="65%" stopColor="#3d5a37" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#233726" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="heroBeamLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E8854" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#6E8854" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="heroBeamRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3d5a37" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3d5a37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Soft Architectural Top Corner Light Beams */}
          <polygon points="0,0 460,0 720,520 0,340" fill="url(#heroBeamLeft)" />
          <polygon points="1440,0 980,0 720,520 1440,340" fill="url(#heroBeamRight)" />

          {/* Concentric Studio Rings Centered Behind Headline */}
          <circle cx="720" cy="370" r="260" stroke="url(#heroArchFade)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="720" cy="370" r="420" stroke="url(#heroArchFade)" strokeWidth="1" />
          <circle cx="720" cy="370" r="590" stroke="url(#heroArchFade)" strokeWidth="1" strokeDasharray="8 10" />
          <ellipse cx="720" cy="790" rx="680" ry="210" stroke="rgba(61, 90, 55, 0.09)" strokeWidth="1" />

          {/* Architectural Frame Lines */}
          <line x1="180" y1="0" x2="180" y2="800" stroke="rgba(35, 55, 38, 0.05)" strokeWidth="1" />
          <line x1="1260" y1="0" x2="1260" y2="800" stroke="rgba(35, 55, 38, 0.05)" strokeWidth="1" />
          <line x1="0" y1="140" x2="1440" y2="140" stroke="rgba(35, 55, 38, 0.045)" strokeWidth="1" />
          <line x1="0" y1="640" x2="1440" y2="640" stroke="rgba(35, 55, 38, 0.045)" strokeWidth="1" />

          {/* Precision Crosshair Markers (+) at Studio Grid Intersections */}
          <g stroke="rgba(61, 90, 55, 0.28)" strokeWidth="1.25" strokeLinecap="round">
            <path d="M175 140 H185 M180 135 V145" />
            <path d="M1255 140 H1265 M1260 135 V145" />
            <path d="M175 640 H185 M180 635 V645" />
            <path d="M1255 640 H1265 M1260 635 V645" />
            <path d="M335 260 H345 M340 255 V265" />
            <path d="M1095 260 H1105 M1100 255 V265" />
          </g>
        </svg>

        <div
          className="eloq-container"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '1040px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Warm Golden Harvest Pill Badge */}
          <div className="eloq-reveal-1" style={{ marginBottom: '1.25rem' }}>
            <span className="eloq-badge-gold">
              ✦ Platform Website Toko &amp; Asisten AI UMKM
            </span>
          </div>

          {/* Monumental Display Headline */}
          <h1
            className="eloq-reveal-2"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.55rem, 5.1vw, 4.65rem)',
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
              color: '#1c2d1f',
              maxWidth: '960px',
              marginBottom: '1.2rem',
            }}
          >
            Partner kreatif &amp; teknologi untuk{' '}
            <span className="eloq-gradient-text">akselerasi brand UMKM lokal</span>
          </h1>

          {/* Clean 1-Sentence Subtitle Below H1 */}
          <p
            className="eloq-reveal-3"
            style={{
              fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
              color: '#4e564c',
              maxWidth: '620px',
              lineHeight: 1.55,
              fontWeight: 400,
              marginBottom: '2.2rem',
              letterSpacing: '-0.015em',
            }}
          >
            Bantu UMKM naik kelas dengan website toko resmi berdaya AI dan pesanan langsung ke WhatsApp tanpa potongan biaya.
          </p>

          {/* CTA Pill Buttons (Pine Forest + Warm Amber Gold) */}
          <div
            className="eloq-reveal-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <button
              onClick={() => onOpenAiWizard()}
              className="eloq-btn-grey"
              style={{
                background: 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 80%, #c98a2c 100%)',
                color: '#ffffff',
                boxShadow:
                  '0 12px 28px -6px rgba(35, 55, 38, 0.42), 0 0 20px rgba(229, 172, 50, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              }}
            >
              <span>Buat Website Sekarang</span>
            </button>
            <button
              onClick={() => scrollToSection('template', 'karya')}
              className="eloq-btn-outline"
              style={{
                borderColor: 'rgba(123, 75, 40, 0.24)',
                color: '#342316',
              }}
            >
              <span>Lihat Template Demo</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. PLATFORM PREVIEW ISLAND (`#tentang` — Ultra-Clean Studio Showcase)
         ============================================================ */}
      <section id="tentang" className="eloq-container" style={{ marginTop: '3.25rem' }}>
        <div className="eloq-island eloq-who-grid" style={{ alignItems: 'center' }}>
          {/* Left: Clean Minimalist Storefront & Analytics Preview */}
          <div
            style={{
              backgroundColor: '#f3f6f1',
              border: '1px solid rgba(35, 55, 38, 0.08)',
              borderRadius: '24px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Top Mode Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#e5ebe1',
                  padding: '4px',
                  borderRadius: '999px',
                }}
              >
                <button
                  onClick={() => setStudioTab('cms')}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      studioTab === 'cms'
                        ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                        : 'transparent',
                    color: studioTab === 'cms' ? '#ffffff' : '#435244',
                    boxShadow:
                      studioTab === 'cms' ? '0 4px 10px rgba(35, 55, 38, 0.22)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Pratinjau Toko
                </button>
                <button
                  onClick={() => setStudioTab('dashboard')}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      studioTab === 'dashboard'
                        ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                        : 'transparent',
                    color: studioTab === 'dashboard' ? '#ffffff' : '#435244',
                    boxShadow:
                      studioTab === 'dashboard' ? '0 4px 10px rgba(35, 55, 38, 0.22)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Analitik Toko
                </button>
              </div>

              <button
                onClick={() => onOpenPublicView('kopi-robusta-slamet')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#233726',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Buka Demo Live ↗
              </button>
            </div>

            {/* Clean Browser Frame */}
            <div
              onClick={() => onOpenPublicView('kopi-robusta-slamet')}
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 14px 34px rgba(24, 38, 26, 0.08)',
                border: '1px solid rgba(35, 55, 38, 0.1)',
              }}
            >
              {/* Minimalist Browser Top Bar */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  borderBottom: '1px solid rgba(35, 55, 38, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                </div>

                <div
                  style={{
                    backgroundColor: '#eef2eb',
                    borderRadius: '999px',
                    padding: '3px 14px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#3d5a37',
                    letterSpacing: '-0.01em',
                  }}
                >
                  kopislamet.uniland.id
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#3d5a37',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6E8854' }} />
                  Online
                </span>
              </div>

              {studioTab === 'cms' ? (
                /* Ultra-Clean Full-Width Storefront Preview */
                <div style={{ backgroundColor: '#ffffff' }}>
                  {/* Store Navigation Row */}
                  <div
                    style={{
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid rgba(35, 55, 38, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #233726 0%, #6E8854 100%)',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                        }}
                      >
                        K
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1c2d1f' }}>
                        Kopi Lereng Slamet
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.7rem', color: '#5d6759', fontWeight: 500 }}>
                      <span style={{ color: '#1c2d1f', fontWeight: 600 }}>Katalog</span>
                      <span>Tentang</span>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)',
                          color: '#ffffff',
                          padding: '4px 11px',
                          borderRadius: '999px',
                          fontSize: '0.66rem',
                          fontWeight: 600,
                        }}
                      >
                        Order WA ↗
                      </span>
                    </div>
                  </div>

                  {/* Clean Architectural Split Hero Banner */}
                  <div
                    style={{
                      margin: '14px 16px 12px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #1c2d1f 0%, #273e2b 55%, #3d5a37 100%)',
                      padding: '18px 20px',
                      display: 'grid',
                      gridTemplateColumns: '1.25fr 0.9fr',
                      gap: '14px',
                      alignItems: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'rgba(255,255,255,0.12)',
                          color: '#d3e8bc',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          marginBottom: '8px',
                          letterSpacing: '0.03em',
                        }}
                      >
                        100% ARABIKA SINGLE ORIGIN
                      </span>
                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          lineHeight: 1.2,
                          letterSpacing: '-0.02em',
                          marginBottom: '6px',
                        }}
                      >
                        Kopi Asli Petani Lereng Slamet
                      </div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: 'rgba(255,255,255,0.78)',
                          lineHeight: 1.45,
                          marginBottom: '12px',
                        }}
                      >
                        Dipetik matang dari ketinggian 1.200 mdpl dan disangrai segar setiap minggu.
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#ffffff',
                          color: '#1c2d1f',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '5px 12px',
                          borderRadius: '999px',
                        }}
                      >
                        Pesan via WhatsApp ↗
                      </span>
                    </div>

                    <div
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        height: '118px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.14)',
                      }}
                    >
                      <img
                        src="/assets/products/kopi-robusta.svg"
                        alt="Kopi Lereng Slamet"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </div>

                  {/* Clean 3-Column Mini Product Catalog */}
                  <div style={{ padding: '4px 16px 16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c2d1f' }}>
                        Katalog Produk Unggulan
                      </span>
                      <span style={{ fontSize: '0.64rem', color: '#5d6759', fontWeight: 500 }}>
                        3 produk ditampilkan
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                      }}
                    >
                      {[
                        { name: 'Robusta Dampit', price: 'Rp 65.000', img: '/assets/products/kopi-robusta.svg' },
                        { name: 'Arabika Wine', price: 'Rp 95.000', img: '/assets/products/kopi-wine.svg' },
                        { name: 'Cold Brew 250ml', price: 'Rp 35.000', img: '/assets/products/kopi-coldbrew.svg' },
                      ].map((prod, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#f8faf7',
                            border: '1px solid rgba(35, 55, 38, 0.08)',
                            borderRadius: '10px',
                            padding: '7px',
                          }}
                        >
                          <div
                            style={{
                              height: '58px',
                              borderRadius: '7px',
                              overflow: 'hidden',
                              backgroundColor: '#eef2eb',
                              marginBottom: '6px',
                            }}
                          >
                            <img
                              src={prod.img}
                              alt={prod.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: '0.66rem',
                              fontWeight: 700,
                              color: '#1c2d1f',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {prod.name}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginTop: '3px',
                            }}
                          >
                            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#3d5a37' }}>
                              {prod.price}
                            </span>
                            <span
                              style={{
                                fontSize: '0.56rem',
                                fontWeight: 700,
                                color: '#233726',
                                backgroundColor: '#e5ebe1',
                                padding: '2px 6px',
                                borderRadius: '999px',
                              }}
                            >
                              + WA
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Clean Minimalist Analytics View */
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                    }}
                  >
                    {[
                      { label: 'PENGUNJUNG', val: '2.340', badge: '+28% bulan ini' },
                      { label: 'PESANAN WA', val: '418', badge: 'Konversi 17,8%' },
                      { label: 'TOKEN AI', val: '250', badge: 'Paket Pro UMKM' },
                    ].map((k, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#f8faf7',
                          borderRadius: '12px',
                          padding: '12px',
                          border: '1px solid rgba(35, 55, 38, 0.08)',
                        }}
                      >
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: '#5d6759', letterSpacing: '0.04em' }}>
                          {k.label}
                        </div>
                        <div
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: '#1c2d1f',
                            margin: '3px 0',
                          }}
                        >
                          {k.val}
                        </div>
                        <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#3d5a37' }}>
                          {k.badge}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      backgroundColor: '#f8faf7',
                      borderRadius: '14px',
                      padding: '14px',
                      border: '1px solid rgba(35, 55, 38, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c2d1f' }}>
                        Statistik Kunjungan &amp; Klik WhatsApp
                      </span>
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          color: '#233726',
                          backgroundColor: '#e5ebe1',
                          padding: '3px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        30 Hari Terakhir
                      </span>
                    </div>
                    <svg viewBox="0 0 400 115" style={{ width: '100%', height: '125px', display: 'block' }}>
                      <defs>
                        <linearGradient id="studioChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6E8854" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#6E8854" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 10 92 C 60 84, 95 58, 140 62 C 185 66, 220 34, 270 30 C 320 26, 355 16, 390 12 L 390 108 L 10 108 Z"
                        fill="url(#studioChartGrad)"
                      />
                      <path
                        d="M 10 92 C 60 84, 95 58, 140 62 C 185 66, 220 34, 270 30 C 320 26, 355 16, 390 12"
                        fill="none"
                        stroke="#3d5a37"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {[
                        [10, 92],
                        [140, 62],
                        [270, 30],
                        [390, 12],
                      ].map(([cx, cy], idx) => (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r="4.5"
                          fill="#FFFFFF"
                          stroke="#233726"
                          strokeWidth="2.5"
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Balanced Value Proposition + Studio Feature Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}>
            <div className="eloq-dot-label">
              <span className="eloq-dot" />
              <span>Platform Toko Online UMKM</span>
            </div>

            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.75rem, 2.5vw, 2.3rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#1c2d1f',
                margin: 0,
              }}
            >
              Website toko profesional, langsung terhubung ke WhatsApp.
            </h2>

            <p
              style={{
                fontSize: '0.96rem',
                lineHeight: 1.5,
                color: '#4b554c',
                maxWidth: '480px',
                margin: 0,
              }}
            >
              Ubah katalog produk Anda menjadi website resmi siap pakai dalam 2 menit. Pembeli langsung memesan via WhatsApp tanpa potongan biaya.
            </p>

            {/* Clean Architectural Highlight List */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.65rem',
                width: '100%',
                padding: '1rem 1.15rem',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(35, 55, 38, 0.04)',
              }}
            >
              {[
                'Katalog produk resmi & rapi',
                'Order langsung ke WhatsApp',
                'Asisten AI pembuat deskripsi',
                '0% komisi penjualan',
              ].map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#233726',
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#e2ebdc',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem' }}>
              <button onClick={() => onOpenAiWizard()} className="eloq-btn-black">
                <span>Coba AI Builder</span>
                <span>↗</span>
              </button>
              {!currentUser && (
                <button onClick={() => onOpenAuth('register')} className="eloq-btn-outline">
                  <span>Daftar Gratis</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. REAL WEBSITE TEMPLATES SHOWCASE (`#template`)
         ============================================================ */}
      <section id="template" className="eloq-container">
        <div className="eloq-section-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="eloq-dot-label">
              <span className="eloq-dot" />
              <span>Template Website Siap Pakai</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['Semua', 'Perkebunan & Kopi', 'Kesehatan & Herbal', 'Pertanian Modern', 'Kuliner & F&B'].map(
                (cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '0.42rem 0.9rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: active ? '1px solid #1d5634' : '1px solid rgba(20,60,35,0.16)',
                        background: active
                          ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                          : '#ffffff',
                        color: active ? '#ffffff' : '#143823',
                        boxShadow: active ? '0 6px 16px rgba(20, 68, 39, 0.28)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {cat}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.85rem, 3vw, 2.65rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#0a0c0a',
            }}
          >
            Pilih desain template nyata sesuai kategori usaha Anda.
          </h2>
        </div>

        <div className="eloq-island">
          <div className="eloq-works-list">
            {filteredShowcase.map((item) => (
              <div key={item.id} className="eloq-work-item">
                {/* Left/Right Alternating Text Column (Enriched with Studio Feature Grid & Subdomain Pill) */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '0.9rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div className="eloq-dot-label" style={{ fontSize: '0.82rem', color: '#233726' }}>
                      <span className="eloq-dot" />
                      <span>{item.origin}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#3d5a37',
                        backgroundColor: '#eef3eb',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                      }}
                    >
                      Siap Pakai
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenPublicView(item.slug)}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(1.7rem, 2.4vw, 2.25rem)',
                      fontWeight: 600,
                      lineHeight: 1.12,
                      letterSpacing: '-0.03em',
                      color: '#1c2d1f',
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.brandName}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.55,
                      color: '#4b554c',
                      maxWidth: '420px',
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Lightweight Highlight Badges (Warm Gold, Coffee Brown & Forest Green) */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxWidth: '420px', margin: '0.2rem 0' }}>
                    {(item.highlights || []).slice(0, 3).map((hl, hIdx) => {
                      const badgeClass =
                        hIdx === 0
                          ? 'eloq-badge-forest'
                          : hIdx === 1
                          ? 'eloq-badge-gold'
                          : 'eloq-badge-brown';
                      return (
                        <span key={hIdx} className={badgeClass}>
                          ✓ {hl}
                        </span>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem', marginTop: '0.15rem' }}>
                    <button
                      onClick={() => handleUseShowcaseTemplate(item)}
                      className="eloq-btn-black"
                      style={{ padding: '0.68rem 1.35rem', fontSize: '0.88rem' }}
                    >
                      <span>Pakai Template</span>
                      <span>↗</span>
                    </button>
                    <button
                      onClick={() => onOpenPublicView(item.slug)}
                      className="eloq-btn-outline"
                      style={{ padding: '0.68rem 1.35rem', fontSize: '0.88rem' }}
                    >
                      <span>Lihat Demo Live</span>
                    </button>
                  </div>
                </div>

                {/* Right/Left Alternating STUDIO-GRADE REAL WEBSITE TEMPLATE BROWSER PREVIEW */}
                <div
                  onClick={() => onOpenPublicView(item.slug)}
                  style={{
                    flex: '0 0 58%',
                    borderRadius: '22px',
                    background: '#f3f6f1',
                    padding: '12px',
                    border: '1px solid rgba(35, 55, 38, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
                    boxShadow: '0 12px 32px rgba(24, 38, 26, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 22px 48px rgba(24, 38, 26, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(24, 38, 26, 0.06)';
                  }}
                >
                  {/* Browser Window Container */}
                  <div
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(35, 55, 38, 0.1)',
                    }}
                  >
                    {/* 1. Minimalist Browser Top Bar */}
                    <div
                      style={{
                        backgroundColor: '#f8faf7',
                        padding: '9px 14px',
                        borderBottom: '1px solid rgba(35, 55, 38, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d5ddd1' }} />
                      </div>
                      <div
                        style={{
                          backgroundColor: '#eef2eb',
                          borderRadius: '999px',
                          padding: '3px 14px',
                          fontSize: '0.68rem',
                          color: '#3d5a37',
                          fontWeight: 600,
                        }}
                      >
                        {item.domain}
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          color: '#3d5a37',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#6E8854' }} />
                        Live Demo
                      </span>
                    </div>

                    {/* 2. Storefront Header Bar */}
                    <div
                      style={{
                        padding: '10px 18px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(35, 55, 38, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #233726 0%, #6E8854 100%)',
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                          }}
                        >
                          {item.brandName.charAt(0)}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1c2d1f' }}>
                          {item.brandName}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.7rem', color: '#5d6759', fontWeight: 500 }}>
                        <span style={{ color: '#1c2d1f', fontWeight: 700 }}>
                          Beranda
                        </span>
                        <span>Katalog</span>
                        <span>Ulasan</span>
                        <span
                          style={{
                            background: 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)',
                            color: '#ffffff',
                            padding: '4px 11px',
                            borderRadius: '999px',
                            fontWeight: 600,
                            fontSize: '0.66rem',
                          }}
                        >
                          Pesan Sekarang
                        </span>
                      </div>
                    </div>

                    {/* 3. Full-Bleed Editorial Storefront Hero */}
                    <div
                      style={{
                        position: 'relative',
                        backgroundColor: item.themeBg,
                        color: '#ffffff',
                        padding: '20px 22px 18px',
                        display: 'grid',
                        gridTemplateColumns: item.id === 'tpl_kopi' ? '1fr' : '1.25fr 0.9fr',
                        gap: '16px',
                        alignItems: 'center',
                        overflow: 'hidden',
                        minHeight: '160px',
                      }}
                    >
                      {item.id === 'tpl_kopi' && (
                        <>
                          <img
                            src={item.heroImage}
                            alt={item.brandName}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              zIndex: 1,
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background:
                                'linear-gradient(90deg, rgba(16, 28, 18, 0.78) 0%, rgba(20, 34, 23, 0.4) 55%, rgba(20, 34, 23, 0.0) 85%)',
                              zIndex: 2,
                            }}
                          />
                        </>
                      )}

                      {/* Left Hero Copy */}
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          maxWidth: item.id === 'tpl_kopi' ? '64%' : '100%',
                        }}
                      >
                        <span
                          style={{
                            alignSelf: 'flex-start',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            backgroundColor: 'rgba(255, 255, 255, 0.14)',
                            border: '1px solid rgba(255, 255, 255, 0.22)',
                            color: item.themeAccent,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {item.heroBadge}
                        </span>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: '1.14rem',
                            fontWeight: 700,
                            lineHeight: 1.18,
                            letterSpacing: '-0.02em',
                            color: '#FFFFFF',
                          }}
                        >
                          {item.heroHeadline}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.42 }}>
                          {item.heroSub}
                        </div>
                        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#FFFFFF',
                              color: '#1c2d1f',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                              padding: '5px 13px',
                              borderRadius: '999px',
                            }}
                          >
                            Beli via WhatsApp ↗
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: 'rgba(255,255,255,0.88)',
                              fontWeight: 600,
                            }}
                          >
                            Mulai {item.products[0]?.price}
                          </span>
                        </div>
                      </div>

                      {/* Right Framed Hero Showcase Image */}
                      {item.id !== 'tpl_kopi' && (
                        <div
                          style={{
                            position: 'relative',
                            zIndex: 3,
                            height: '126px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                            backgroundColor: '#1f3325',
                          }}
                        >
                          <img
                            src={item.heroImage}
                            alt={item.brandName}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/assets/products/greenora-hero.svg';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* 4. 3-Column Trust Bar (Clean Olive Dots, Zero Cartoon Emojis) */}
                    <div
                      style={{
                        backgroundColor: '#f6f8f4',
                        borderBottom: '1px solid rgba(35, 55, 38, 0.08)',
                        padding: '8px 18px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                      }}
                    >
                      {(item.trustItems || []).map((tItem, tIdx) => (
                        <div
                          key={tIdx}
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            color: '#233726',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#6E8854', flexShrink: 0 }} />
                          <span>{tItem}</span>
                        </div>
                      ))}
                    </div>

                    {/* 5. Storefront 3-Product Catalog Grid */}
                    <div style={{ padding: '14px 16px 16px', backgroundColor: '#ffffff' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1c2d1f' }}>
                          Katalog Produk Unggulan
                        </span>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            color: '#233726',
                            backgroundColor: '#eef3eb',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontWeight: 600,
                          }}
                        >
                          Lihat Demo Lengkap ↗
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '10px',
                        }}
                      >
                        {item.products.map((prod, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              backgroundColor: '#f8faf7',
                              borderRadius: '12px',
                              padding: '8px',
                              border: '1px solid rgba(35, 55, 38, 0.08)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '7px',
                            }}
                          >
                            <div
                              style={{
                                height: '116px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                position: 'relative',
                                backgroundColor: '#eef2eb',
                              }}
                            >
                              <img
                                src={prod.img}
                                alt={prod.name}
                                onError={(e) => {
                                  const fallbacks = [
                                    '/assets/products/serum-wajah.svg',
                                    '/assets/products/madu-hutan.svg',
                                    '/assets/products/minyak-atsiri.svg',
                                  ];
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = fallbacks[pIdx % fallbacks.length];
                                }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '6px',
                                  left: '6px',
                                  backgroundColor: 'rgba(28, 45, 31, 0.86)',
                                  color: '#ffffff',
                                  fontSize: '0.55rem',
                                  padding: '2px 7px',
                                  borderRadius: '999px',
                                  fontWeight: 600,
                                }}
                              >
                                {prod.tag}
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: '#1c2d1f',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {prod.name}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.58rem',
                                  color: '#5d6759',
                                  marginTop: '1px',
                                }}
                              >
                                ★ {prod.rating || '5.0 • Siap Kirim'}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginTop: '4px',
                                }}
                              >
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3d5a37' }}>
                                  {prod.price}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.58rem',
                                    backgroundColor: '#e5ebe1',
                                    padding: '2px 7px',
                                    borderRadius: '999px',
                                    color: '#233726',
                                    fontWeight: 700,
                                  }}
                                >
                                  + WA
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. CAPABILITIES ISLAND (`#fitur` — Short & Direct)
         ============================================================ */}
      <section id="fitur" className="eloq-container">
        <div className="eloq-section-header">
          <div className="eloq-dot-label">
            <span className="eloq-dot" />
            <span>Fitur Unggulan</span>
          </div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.85rem, 3vw, 2.65rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#0a0c0a',
            }}
          >
            Semua fitur jualan online dalam satu platform.
          </h2>
        </div>

        <div className="eloq-island" style={{ backgroundColor: 'linear-gradient(155deg, #eef4ea 0%, #e4ede0 52%, #dce7d6 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.15rem' }}>
            {/* 1. Katalog Toko Resmi */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef3eb',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Katalog Toko Resmi
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Tampilan etalase rapi &amp; responsif
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: Product Preview Card */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#eef2eb',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/assets/products/kopi-robusta.svg"
                    alt="Kopi Robusta"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#1c2d1f',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Kopi Robusta Slamet
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#3d5a37' }}>
                    Rp 45.000 • Siap Kirim
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    backgroundColor: '#233726',
                    color: '#ffffff',
                    padding: '4px 9px',
                    borderRadius: '999px',
                    flexShrink: 0,
                  }}
                >
                  + WA
                </span>
              </div>
            </div>

            {/* 2. Asisten AI Penulis Promosi */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef3eb',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Asisten AI Promosi
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Deskripsi otomatis tanpa mikir kata
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: Prompt & Result Bubble */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.64rem',
                    color: '#5a685c',
                  }}
                >
                  <span>✨ Prompt: &quot;Kopi Robusta&quot;</span>
                  <span
                    style={{
                      color: '#233726',
                      fontWeight: 700,
                      backgroundColor: '#e2ebdc',
                      padding: '1px 7px',
                      borderRadius: '999px',
                    }}
                  >
                    2 Detik
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: '#233726',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    backgroundColor: '#ffffff',
                    padding: '6px 9px',
                    borderRadius: '8px',
                    border: '1px solid rgba(35, 55, 38, 0.06)',
                  }}
                >
                  &ldquo;Aroma cokelat karamel khas lereng gunung, disangrai segar setiap minggu.&rdquo;
                </div>
              </div>
            </div>

            {/* 3. Order Langsung ke WhatsApp */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef8f0',
                      color: '#166534',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageCircle size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Order via WhatsApp
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Langsung chat, 0% komisi aplikasi
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: WA Message Bubble */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(34, 197, 94, 0.22)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#166534' }}>Format Order Otomatis</span>
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: '#14532d',
                    backgroundColor: '#ffffff',
                    padding: '6px 9px',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.18)',
                    lineHeight: 1.35,
                  }}
                >
                  &ldquo;Halo Admin, saya mau pesan 2 bks Kopi Slamet ke Jakarta 📦&rdquo;
                </div>
              </div>
            </div>

            {/* 4. Jadwal Promo Otomatis */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef3eb',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Calendar size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Jadwal Promo Otomatis
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Diskon tayang &amp; selesai terjadwal
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: Scheduled Toggle */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c2d1f' }}>
                    Promo Diskon Gajian 15%
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#5a685c' }}>
                    Jumat 18:00 — Minggu 23:59
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    backgroundColor: '#233726',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#86efac' }} />
                  AKTIF
                </span>
              </div>
            </div>

            {/* 5. Domain Sendiri & Google SEO */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef3eb',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Globe size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Domain &amp; Google SEO
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Mudah dicari pembeli di internet
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: Google Search Result Snippet */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.64rem', color: '#3d5a37', fontWeight: 600 }}>
                  <span>🔒 https://kopislamet.id</span>
                  <span style={{ fontSize: '0.55rem', backgroundColor: '#e2ebdc', color: '#233726', padding: '1px 5px', borderRadius: '4px' }}>SSL</span>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1c2d1f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Kopi Lereng Slamet — Toko Resmi Online
                </div>
                <div style={{ fontSize: '0.62rem', color: '#5a685c' }}>
                  ★★★★★ 4.9 • Peringkat #1 di Google
                </div>
              </div>
            </div>

            {/* 6. Laporan Trafik Harian */}
            <div
              onClick={() => onOpenAiWizard()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(35, 55, 38, 0.1)',
                borderRadius: '20px',
                padding: '1.35rem 1.35rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(35, 55, 38, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(35, 55, 38, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(61, 90, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 55, 38, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(35, 55, 38, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#eef3eb',
                      color: '#233726',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp size={17} />
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1c2d1f',
                        margin: 0,
                      }}
                    >
                      Laporan Trafik Real-time
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#5a685c' }}>
                      Pantau klik WA &amp; pengunjung
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#3d5a37', fontWeight: 600 }}>↗</span>
              </div>

              {/* Visual Mini Mockup: Live Metrics with Sparkline */}
              <div
                style={{
                  backgroundColor: '#f8faf7',
                  borderRadius: '14px',
                  padding: '9px 12px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#1c2d1f' }}>
                    418 Order
                  </div>
                  <div style={{ fontSize: '0.64rem', fontWeight: 600, color: '#2e7d32' }}>
                    +28% minggu ini
                  </div>
                </div>
                <div style={{ width: '80px', height: '28px' }}>
                  <svg viewBox="0 0 80 28" style={{ width: '100%', height: '100%', display: 'block' }}>
                    <defs>
                      <linearGradient id="featureSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6E8854" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6E8854" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 22 Q 20 18 40 12 T 80 4 L 80 28 L 0 28 Z" fill="url(#featureSparkGrad)" />
                    <path d="M 0 22 Q 20 18 40 12 T 80 4" fill="none" stroke="#233726" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="80" cy="4" r="3" fill="#6E8854" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. PRICING SECTION (`#harga`)
         ============================================================ */}
      <section id="harga" className="eloq-container">
        <div className="eloq-section-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="eloq-dot-label">
              <span className="eloq-dot" />
              <span>Paket Langganan</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#ffffff',
                padding: '4px',
                borderRadius: '999px',
                alignSelf: 'flex-start',
                border: '1px solid rgba(20,60,35,0.12)',
              }}
            >
              <button
                onClick={() => setBillingInterval('monthly')}
                style={{
                  padding: '0.42rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    billingInterval === 'monthly'
                      ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                      : 'transparent',
                  color: billingInterval === 'monthly' ? '#ffffff' : '#233726',
                }}
              >
                Bulanan
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                style={{
                  padding: '0.42rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    billingInterval === 'yearly'
                      ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                      : 'transparent',
                  color: billingInterval === 'yearly' ? '#ffffff' : '#233726',
                }}
              >
                Tahunan (Hemat 17%)
              </button>
            </div>
          </div>

          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.85rem, 3vw, 2.65rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#0a0c0a',
            }}
          >
            Pilihan paket sesuai skala bisnis Anda.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {displayPlans.map((plan) => {
            const isPopular = Boolean(plan.isPopular);
            const rawPrice =
              billingInterval === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                style={{
                  background: isPopular
                    ? 'linear-gradient(145deg, #18281a 0%, #293d2c 48%, #4a3422 100%)'
                    : '#f7f4ec',
                  color: isPopular ? '#ffffff' : '#1c2d1f',
                  borderRadius: '26px',
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.75rem',
                  border: isPopular
                    ? '1.5px solid rgba(229, 172, 50, 0.42)'
                    : '1px solid rgba(123, 75, 40, 0.16)',
                  boxShadow: isPopular
                    ? '0 22px 48px -10px rgba(15, 52, 30, 0.45), 0 0 24px rgba(229, 172, 50, 0.14)'
                    : '0 8px 24px rgba(35, 55, 38, 0.05)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.35rem',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {plan.name}
                    </h3>
                    {isPopular && (
                      <span
                        style={{
                          padding: '0.28rem 0.85rem',
                          borderRadius: '999px',
                          backgroundColor: '#F59E0B',
                          color: '#1E2E20',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        ★ Paling Populer
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.45,
                      color: isPopular ? 'rgba(255,255,255,0.78)' : '#5a625b',
                    }}
                  >
                    {plan.description}
                  </p>

                  <div
                    style={{
                      padding: '1rem 0',
                      borderTop: isPopular
                        ? '1px solid rgba(255,255,255,0.14)'
                        : '1px solid rgba(123, 75, 40, 0.12)',
                      borderBottom: isPopular
                        ? '1px solid rgba(255,255,255,0.14)'
                        : '1px solid rgba(123, 75, 40, 0.12)',
                    }}
                  >
                    {rawPrice === 0 ? (
                      <div style={{ fontSize: '2.1rem', fontWeight: 600, letterSpacing: '-0.03em' }}>
                        Gratis
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                        <span style={{ fontSize: '2.1rem', fontWeight: 600, letterSpacing: '-0.03em' }}>
                          Rp {rawPrice.toLocaleString('id-ID')}
                        </span>
                        <span
                          style={{
                            fontSize: '0.84rem',
                            color: isPopular ? 'rgba(255,255,255,0.68)' : '#6c7275',
                          }}
                        >
                          / bln
                        </span>
                      </div>
                    )}
                  </div>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    {plan.features.map((feat, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.88rem',
                          color: isPopular ? 'rgba(255,255,255,0.92)' : '#2c3032',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isPopular ? '#F59E0B' : '#526941',
                            flexShrink: 0,
                          }}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(plan, billingInterval)}
                  className={isPopular ? 'eloq-btn-black' : 'eloq-btn-outline'}
                  style={{
                    width: '100%',
                    padding: '0.82rem 1.4rem',
                    fontSize: '0.94rem',
                    ...(isPopular
                      ? {
                          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
                          color: '#1E2E20',
                          fontWeight: 800,
                          border: 'none',
                          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.38)',
                        }
                      : {
                          borderColor: 'rgba(123, 75, 40, 0.28)',
                          color: '#342316',
                        }),
                  }}
                >
                  <span>{rawPrice === 0 ? 'Mulai Gratis' : 'Pilih Paket'}</span>
                  <span>↗</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          8. FAQ ISLAND (`#faq`)
         ============================================================ */}
      <section
        id="faq"
        className="eloq-container"
        style={{ marginTop: '3.25rem', marginBottom: '3.25rem' }}
      >
        <div
          className="eloq-island"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="eloq-dot-label">
              <span className="eloq-dot" />
              <span>Tanya Jawab (FAQ)</span>
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.75rem, 2.6vw, 2.35rem)',
                fontWeight: 500,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: '#0a0c0a',
              }}
            >
              Pertanyaan yang sering diajukan.
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#555b5e', lineHeight: 1.5, maxWidth: '360px' }}>
              Langsung coba buat website toko Anda dengan asisten AI kami.
            </p>
            <div style={{ marginTop: '0.25rem' }}>
              <button onClick={() => onOpenAiWizard()} className="eloq-btn-grey">
                <span>Buka AI Builder</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid rgba(35, 55, 38, 0.1)',
                    padding: '1.1rem 1.35rem',
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 12px rgba(35, 55, 38, 0.03)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: '#1c2d1f',
                      padding: 0,
                    }}
                  >
                    <span>{faq.q}</span>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isOpen
                          ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                          : '#eef3eb',
                        color: isOpen ? '#ffffff' : '#233726',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        flexShrink: 0,
                      }}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      style={{
                        marginTop: '0.75rem',
                        fontSize: '0.9rem',
                        lineHeight: 1.55,
                        color: '#4b554c',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid rgba(35, 55, 38, 0.08)',
                        margin: '0.75rem 0 0',
                      }}
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          9. FOOTER (Deep Forest Olive Architectural Footer)
         ============================================================ */}
      <footer
        style={{
          background: 'linear-gradient(160deg, #1c2d1f 0%, #142217 60%, #0d170f 100%)',
          color: '#ffffff',
          borderRadius: '24px 24px 0 0',
          paddingTop: '2.25rem',
          paddingBottom: '1.5rem',
        }}
      >
        <div className="eloq-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              paddingBottom: '1.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(1.45rem, 2.4vw, 2.1rem)',
                  fontWeight: 500,
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Siap punya website toko resmi hari ini?
              </h2>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '14px',
                padding: '0.65rem 0.75rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                value={quickBrandName}
                onChange={(e) => setQuickBrandName(e.target.value)}
                placeholder="Ketik nama usaha Anda..."
                style={{
                  flex: 1,
                  minWidth: '170px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '999px',
                  padding: '0.55rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => onOpenAiWizard(quickBrandName || undefined)}
                className="eloq-btn-grey"
                style={{
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.84rem',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
                  color: '#1E2E20',
                  fontWeight: 800,
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                }}
              >
                <span>Buat Website</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingTop: '1.25rem',
            }}
          >
            <UniLandLogo size="sm" variant="dark" />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.82rem' }}>
              <button
                onClick={() => scrollToSection('top-hero', 'beranda')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0 }}
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('tentang', 'tentang')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0 }}
              >
                Platform
              </button>
              <button
                onClick={() => scrollToSection('template', 'karya')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0 }}
              >
                Template
              </button>
              <button
                onClick={() => scrollToSection('fitur', 'layanan')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0 }}
              >
                Fitur AI
              </button>
              <button
                onClick={() => scrollToSection('harga', 'harga')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', padding: 0 }}
              >
                Harga
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
              © {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
