import React, { useState } from 'react';
import { LandingPage, TokenPackage, Template, User } from '../types';
import { Footer } from './Footer';

interface HeroLandingProps {
  pages: LandingPage[];
  templates: Template[];
  tokenPackages: TokenPackage[];
  currentUser: User | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenAiWizard: (prefilledName?: string) => void;
  onOpenCms: (page: LandingPage) => void;
  onOpenPublicView: (slug: string) => void;
  onOpenTopUp: () => void;
  onTogglePublish: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

/* ── 8-Petal Harvest Gold Flower ───── */
const YellowFlower: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 36,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    style={{ display: 'inline-block', flexShrink: 0, ...style }}
  >
    <g transform="translate(18,18)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <rect
          key={i}
          x="-3"
          y="-15"
          width="6"
          height="13"
          rx="3"
          fill={i % 2 === 0 ? '#E5AC32' : '#6E8854'}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="4.5" fill="#E5AC32" />
    </g>
  </svg>
);

/* ── 4-Point Sparkle Star ───── */
const YellowSparkle: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 20,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#E5AC32"
    style={{ display: 'inline-block', flexShrink: 0, ...style }}
  >
    <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
  </svg>
);

/* ── Star Rating ───── */
const FiveStars: React.FC = () => (
  <div style={{ display: 'flex', gap: '3px', color: '#E5AC32', fontSize: '1.05rem' }}>
    {'★★★★★'}
  </div>
);

export const HeroLanding: React.FC<HeroLandingProps> = ({
  pages,
  templates,
  currentUser,
  onOpenAuthModal,
  onOpenAiWizard,
  onOpenCms,
  onOpenPublicView,
}) => {
  const [businessSlugInput, setBusinessSlugInput] = useState('tokosarirasa');
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Setup form states
  const [setupStep, setSetupStep] = useState(1);
  const [websiteName, setWebsiteName] = useState('Dapur Sari Rasa');
  const [subdomain, setSubdomain] = useState('dapursarirasa');
  const [category, setCategory] = useState('Kuliner / Makanan & Minuman');
  const [selectedTemplateName, setSelectedTemplateName] = useState('Modern Dark Pro');
  const [description, setDescription] = useState(
    'Menyediakan aneka katering tumpeng mini, nasi kotak lezat, snack box higienis, dan aneka jajanan pasar siap antar.'
  );

  const services = [
    {
      num: '1',
      title: 'Website & Landing Page Instan',
      desc: 'Punya website profil usaha resmi dan link bio keren siap pasang di Instagram atau TikTok dalam 2 menit tanpa perlu keahlian teknis.',
    },
    {
      num: '2',
      title: 'Katalog Produk Jualan Rapi',
      desc: 'Tampilkan foto menu kuliner, baju, kerajinan tangan, atau produk toko lengkap dengan rincian harga dan pilihan varian yang jelas di HP pembeli.',
    },
    {
      num: '3',
      title: 'WhatsApp Direct Order Checkout',
      desc: 'Pembeli tinggal klik tombol pesan, rincian pesanan dan total harga langsung terkirim otomatis ke chat WhatsApp admin toko Anda tanpa ribet.',
    },
    {
      num: '4',
      title: 'AI Smart Copywriter Otomatis',
      desc: 'Kecerdasan buatan membantu merangkai kata-kata promosi jualan yang menarik, deskripsi produk menggugah selera, dan kalimat ajakan beli yang memikat.',
    },
  ];

  const experts = [
    {
      name: 'Dian Sastrowardoyo',
      role: 'Pendamping Digitalisasi UMKM',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Telah mendampingi lebih dari 2.000 pelaku UMKM daerah untuk go-digital dan memiliki website mandiri yang dipercaya pelanggan.',
    },
    {
      name: 'Arief Budiman',
      role: 'Spesialis Katalog & WhatsApp Checkout',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Merancang alur pemesanan yang sangat ringkas sehingga pembeli usia muda maupun orang tua bisa pesan produk tanpa bingung.',
    },
    {
      name: 'Siti Rahmania, S.Ds',
      role: 'Desainer Identitas Visual UMKM',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      bio: 'Membantu pemilik usaha menata foto produk, logo, dan kemasan agar terlihat seperti brand premium kelas mall.',
    },
    {
      name: 'Farhan Pratama',
      role: 'Ahli Optimasi Website Ringan & Cepat',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Memastikan website toko Anda terbuka dalam hitungan detik meski diakses lewat jaringan internet HP yang sedang lambat.',
    },
    {
      name: 'Maya Anggraini',
      role: 'Konsultan Pemasaran Produk Lokal',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Membimbing bapak & ibu pelaku usaha memanfaatkan media sosial untuk mendatangkan ribuan pengunjung ke website toko.',
    },
    {
      name: 'Bayu Nugroho',
      role: 'Spesialis Integrasi Transaksi',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      bio: 'Mempermudah pencatatan riwayat transaksi dan pengelolaan inventaris produk jualan secara otomatis.',
    },
  ];

  const testimonials = [
    {
      name: 'Ibu Nurhasanah',
      role: 'Owner Katering Dapur Berkah',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      quote:
        '"Awalnya saya gaptek sama sekali dan takut bikin web itu mahal. Tapi pakai UniLand, cuma butuh waktu 2 menit katalog tumpeng mini saya langsung rapi. Pesanan katering kantor sekarang masuk tiap hari lewat WhatsApp!"',
    },
    {
      name: 'Pak Bambang Haryadi',
      role: 'Pengrajin Batik & Anyaman Nusantara',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      quote:
        '"Dulu cuma jualan kalau ada pameran lokal. Sekarang sejak punya website resmi sendiri dari UniLand, pelanggan dari luar pulau jadi percaya dan langsung transfer tanpa ragu. Penjualan naik drastis!"',
    },
    {
      name: 'Mbak Rini Safitri',
      role: 'Owner Frozen Food & Snack Sehat',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      quote:
        '"Tampilannya sangat bersih dan gampang diedit langsung dari HP. Pelanggan senang karena bisa lihat daftar menu lengkap beserta foto dan harga tanpa perlu bolak-balik tanya di chat WA."',
    },
  ];

  const handleSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = businessSlugInput.trim();
    if (!clean) return;
    setWebsiteName(clean);
    setSubdomain(clean.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (!currentUser) {
      onOpenAuthModal('register');
      return;
    }
    document.getElementById('setup-wizard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal('register');
      return;
    }
    onOpenAiWizard(websiteName);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-canvas)' }}>
      {/* ============================================================
          SECTION 1: HERO — WHITE ARCH CARD WITH LAPTOP MOCKUP & STATS
          ============================================================ */}
      <section
        id="home"
        style={{
          position: 'relative',
          paddingBottom: '40px',
        }}
      >
        {/* Large White Arch Card — lengkung khas UniLand */}
        <div
          className="hero-white-card"
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '110px 48px 64px',
            borderRadius: '0 0 56px 56px',
            background: 'linear-gradient(180deg, #FAF8F2 0%, #F5F1E8 100%)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(10, 20, 12, 0.25)',
          }}
        >
          {/* Top-Left Yellow Flower Icon */}
          <div style={{ position: 'absolute', top: '32px', left: '48px', zIndex: 10 }}>
            <YellowFlower size={36} className="spinning-flower" />
          </div>

          {/* Soft yellow & olive decorative accent in bottom left corner matching logo colors */}
          <div
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-120px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #E5AC32 0%, #D49A24 40%, rgba(110, 136, 84, 0.35) 70%, transparent 75%)',
              opacity: 0.9,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              position: 'relative',
              zIndex: 2,
            }}
            className="hero-split-grid"
          >
          {/* Left Column: Pill URL, Bold Title, Subtitle, Dual CTAs */}
          <div style={{ maxWidth: '560px', zIndex: 3 }}>
            {/* Pill Subdomain Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1px solid rgba(35, 55, 38, 0.12)',
                borderRadius: '9999px',
                padding: '6px 16px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(10, 20, 12, 0.04)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#E5AC32',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: '0.84rem',
                  color: '#5B6F5F',
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                uniland.id/toko-kamu
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2.3rem, 3.8vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#1B2B1E',
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Bantu UMKM Punya Website Keren &amp; Siap Jualan Online
            </h1>

            {/* Paragraph / Description */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.68,
                color: '#4E6252',
                marginBottom: '32px',
                fontWeight: 400,
              }}
            >
              Platform pembuatan website dan landing page instan untuk para pelaku UMKM Indonesia. Tampilkan katalog produk rapi, terima orderan langsung lewat WhatsApp, dan buat usahamu makin dipercaya pelanggan — cuma 2 menit tanpa ribet coding.
            </p>

            {/* Dual Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (!currentUser) onOpenAuthModal('register');
                  else document.getElementById('setup-wizard')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#E5AC32',
                  color: '#142217',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 28px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(229, 172, 50, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D49A24';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E5AC32';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Mulai Buat Website UMKM</span>
                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
              </button>

              <button
                onClick={() => {
                  if (pages.length > 0) {
                    onOpenPublicView(pages[0].slug);
                  } else {
                    onOpenPublicView('kopi-robusta-slamet');
                  }
                }}
                style={{
                  background: '#FFFFFF',
                  color: '#1B2B1E',
                  border: '1.5px solid rgba(27, 43, 30, 0.2)',
                  borderRadius: '9999px',
                  padding: '14px 28px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(10, 20, 12, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1B2B1E';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(27, 43, 30, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Lihat Demo
              </button>
            </div>
          </div>

          {/* Right Column: Hero Laptop Mockup with Floating 10 Years Card */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* The Laptop on Desk Photo Mockup */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(10, 20, 12, 0.12)',
              }}
            >
              <img
                src="/assets/hero_laptop_desk.jpg"
                alt="Website UMKM di Laptop"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  transform: 'scale(1.01)',
                }}
              />
            </div>

            {/* Floating "10 Years" Card matching screenshot */}
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                right: '-16px',
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px 26px',
                maxWidth: '240px',
                boxShadow: '0 16px 36px rgba(10, 20, 12, 0.1)',
                border: '1px solid rgba(35, 55, 38, 0.08)',
                zIndex: 10,
              }}
              className="hero-rating-badge"
            >
              <div style={{ display: 'flex', gap: '3px', color: '#E5AC32', fontSize: '1.1rem', marginBottom: '8px' }}>
                {'★★★★★'}
              </div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#1B2B1E',
                  letterSpacing: '-0.02em',
                }}
              >
                10 Years
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#5B6F5F',
                  fontWeight: 500,
                  marginTop: '8px',
                  lineHeight: 1.5,
                }}
              >
                Dedikasi Mendampingi 5.000+ Pelaku UMKM Indonesia Go-Digital
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* ============================================================
            METRICS / STATS BAR (UMKM DIGITAL METRICS)
            ============================================================ */}
        <div className="container" style={{ marginTop: '24px' }}>
          <div
            className="metrics-capsule-grid"
            style={{
              background: '#152219',
              border: '1px solid rgba(110, 136, 84, 0.22)',
              borderRadius: '24px',
              padding: '30px 48px',
              textAlign: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                5000+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#9BB09F', marginTop: '4px' }}>
                Website UMKM Aktif
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(110, 136, 84, 0.16)' }}>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                10+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#9BB09F', marginTop: '4px' }}>
                Tahun Pengalaman
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(110, 136, 84, 0.16)' }}>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                1200+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#9BB09F', marginTop: '4px' }}>
                Produk Lokal Terjual
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(110, 136, 84, 0.16)' }}>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: '#E5AC32',
                }}
              >
                150M+
              </div>
              <div style={{ fontSize: '0.84rem', color: '#9BB09F', marginTop: '4px' }}>
                Total Omzet UMKM
              </div>
            </div>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '0.86rem',
              color: '#8E8E98',
              marginTop: '16px',
              letterSpacing: '0.01em',
            }}
          >
            Membantu pelaku kuliner, fashion, kerajinan, produk olahan, dan toko lokal di seluruh Indonesia berkembang lewat digital.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: TURNING IDEAS INTO MASTERPIECES (MISI UNTUK UMKM)
          ============================================================ */}
      <section id="tentang" style={{ padding: '80px 0' }}>
        <div className="container">
          {/* Top Header Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '48px',
              alignItems: 'flex-start',
              marginBottom: '48px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <YellowSparkle size={22} />
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#F5C518',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Misi Kami Membantu UMKM
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.18,
                  color: '#ffffff',
                }}
              >
                Mengubah Produk Lokal
                <br />
                Menjadi Brand Terpercaya
              </h2>
            </div>

            <div>
              <p
                style={{
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: '#AEAEB8',
                  marginBottom: '16px',
                }}
              >
                Banyak bapak & ibu pelaku usaha memiliki produk yang luar biasa lezat, unik, dan berkualitas tinggi, namun kesulitan menjangkau pelanggan baru karena belum punya website resmi.
              </p>
              <p
                style={{
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: '#AEAEB8',
                }}
              >
                UniLand hadir untuk mempermudah segalanya: dalam 2 menit, tokomu sudah punya website resmi dengan katalog produk jernih, tombol order WhatsApp otomatis, dan siap dipasang di link bio Instagram atau TikTok tanpa biaya mahal.
              </p>
            </div>
          </div>

          {/* Bottom Bento Photo Grid - UMKM Digital Store Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
            }}
          >
            {/* Photo 1: UMKM Online Store & Digital Catalog */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                height: '320px',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80"
                alt="UMKM Digital Storefront"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px',
                }}
              >
                <div>
                  <span
                    style={{
                      background: '#F5C518',
                      color: '#0A0A0C',
                      fontSize: '0.74rem',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '6px',
                    }}
                  >
                    ✦ WEBSITE TOKO INSTAN
                  </span>
                  <div style={{ color: '#ffffff', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.15rem' }}>
                    Katalog Produk Lengkap Siap Beli di Semua Layar HP
                  </div>
                </div>
              </div>
            </div>

            {/* Photo 2: Product Packaging Ready for WhatsApp Orders */}
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                height: '320px',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80"
                alt="Produk UMKM Siap Kirim"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.08)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px',
                }}
              >
                <div>
                  <span
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '6px',
                    }}
                  >
                    💬 LANGSUNG KE WHATSAPP
                  </span>
                  <div style={{ color: '#ffffff', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.15rem' }}>
                    Pesanan Masuk Otomatis Tanpa Potongan Komisi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: OUR SERVICES (LAYANAN UNGGULAN UMKM)
          ============================================================ */}
      <section id="services" style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div
            style={{
              background: '#111115',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '36px',
              padding: '48px',
            }}
          >
            {/* Header */}
            <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  Layanan
                </span>
                <span
                  className="badge-yellow"
                  style={{
                    fontSize: '1.8rem',
                    padding: '2px 14px',
                    borderRadius: '8px',
                  }}
                >
                  Unggulan UMKM
                </span>
              </div>
              <p style={{ fontSize: '0.94rem', color: '#9E9EA8', lineHeight: 1.6 }}>
                Semua fitur dirancang agar bapak & ibu pemilik usaha kuliner, kerajinan, fashion, toko kelontong, maupun agribisnis bisa langsung jualan tanpa repot.
              </p>
            </div>

            {/* 3-Column Bento Inside Services */}
            <div className="services-bento-grid">
              {/* Left Column: 4 Numbered Pill Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {services.map((srv, idx) => {
                  const isActive = selectedServiceIdx === idx;
                  return (
                    <div
                      key={srv.num}
                      onClick={() => setSelectedServiceIdx(idx)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '9999px',
                        background: isActive ? '#1D1D24' : '#141418',
                        border: isActive ? '1.5px solid #F5C518' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isActive ? '#F5C518' : 'rgba(255, 255, 255, 0.1)',
                            color: isActive ? '#0A0A0C' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {srv.num}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.94rem',
                            fontWeight: 700,
                            color: isActive ? '#F5C518' : '#ffffff',
                          }}
                        >
                          {srv.title}
                        </span>
                      </div>
                      {isActive && (
                        <p
                          style={{
                            fontSize: '0.86rem',
                            color: '#AEAEB8',
                            marginTop: '10px',
                            marginLeft: '38px',
                            lineHeight: 1.5,
                          }}
                        >
                          {srv.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Center Column: UMKM Web Interface on Display */}
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  minHeight: '280px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                  alt="Toko Online UMKM"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    background: 'rgba(14, 14, 18, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
                    🛍️ Website Toko & Katalog Digital Resmi
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#8E8E98', marginTop: '2px' }}>
                    Otomatis aktif dan bisa langsung dibagikan ke calon pembeli.
                  </div>
                </div>
              </div>

              {/* Right Column: 2 Action Cards & Yellow Flower */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', padding: '12px 6px' }}>
                  {/* Radiant Yellow Light Bloom (Cahaya Kuning) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '0px',
                      transform: 'translate(10%, -50%)',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(245, 197, 24, 0.75) 0%, rgba(245, 197, 24, 0.3) 45%, rgba(245, 197, 24, 0) 75%)',
                      filter: 'blur(24px)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <YellowFlower size={48} className="spinning-flower" />
                  </div>
                </div>

                {/* Card 1: Meet Our UMKM Experts */}
                <div
                  onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: '#16161B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5C518')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                >
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.94rem' }}>
                    Konsultasi Ahli UMKM
                  </span>
                </div>

                {/* Card 2: See UMKM Templates (Solid Yellow) */}
                <div
                  onClick={() => document.getElementById('template')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: '#F5C518',
                    color: '#0A0A0C',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '0.94rem' }}>
                    Lihat Template Toko
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: MARQUEE TICKER (UMKM BENEFIT PILLARS)
          ============================================================ */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 0',
          background: '#0B0B0E',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div className="marquee-wrapper">
          {/* Track 1 */}
          <div
            className="marquee-content"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
              color: '#ffffff',
              letterSpacing: '-0.01em',
              paddingRight: '36px',
            }}
          >
            {[
              'Website UMKM',
              'Katalog Produk',
              'Order WhatsApp',
              'Tanpa Ribet Coding',
              'Siap Jualan Online',
              'Usaha Maju',
              'Ramah Pemula',
              'Desain Modern',
              'Kuliner & Fashion',
              'Produk Lokal',
            ].map((text, idx) => (
              <React.Fragment key={`m1-${idx}`}>
                <span style={{ transition: 'color 0.2s', cursor: 'default' }}>{text}</span>
                <span className={idx % 2 === 0 ? 'spinning-star' : 'spinning-star-reverse'}>
                  <YellowSparkle size={20} />
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Track 2 (Seamless Infinite Duplicate) */}
          <div
            className="marquee-content"
            aria-hidden="true"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.15rem, 2.4vw, 1.75rem)',
              color: '#ffffff',
              letterSpacing: '-0.01em',
              paddingRight: '36px',
            }}
          >
            {[
              'Website UMKM',
              'Katalog Produk',
              'Order WhatsApp',
              'Tanpa Ribet Coding',
              'Siap Jualan Online',
              'Usaha Maju',
              'Ramah Pemula',
              'Desain Modern',
              'Kuliner & Fashion',
              'Produk Lokal',
            ].map((text, idx) => (
              <React.Fragment key={`m2-${idx}`}>
                <span style={{ transition: 'color 0.2s', cursor: 'default' }}>{text}</span>
                <span className={idx % 2 === 0 ? 'spinning-star' : 'spinning-star-reverse'}>
                  <YellowSparkle size={20} />
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 5: MEET OUR EXPERTS (TIM PENDAMPING UMKM)
          ============================================================ */}
      <section id="experts" style={{ padding: '90px 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                Tim
              </span>
              <span
                className="badge-yellow"
                style={{
                  fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
                  padding: '2px 16px',
                  borderRadius: '8px',
                }}
              >
                Pendamping UMKM
              </span>
            </div>
            <p style={{ fontSize: '0.94rem', color: '#8E8E98', maxWidth: '560px', margin: '0 auto' }}>
              Didukung oleh para praktisi digitalisasi bisnis, desainer kemasan, dan ahli pemasaran produk lokal yang siap membantu usaha Anda naik kelas.
            </p>
          </div>

          {/* 6 Cards Grid (2 rows x 3 columns) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {experts.map((exp) => (
              <div
                key={exp.name}
                className="white-expert-card"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  color: '#0A0A0C',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={exp.image}
                    alt={exp.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #F5C518',
                    }}
                  />
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: '#0A0A0C',
                      }}
                    >
                      {exp.name}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#666672',
                      }}
                    >
                      {exp.role}
                    </span>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#444450',
                  }}
                >
                  {exp.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: TESTIMONIALS (PEMILIK UMKM ASLI INDONESIA)
          ============================================================ */}
      <section id="testimoni" style={{ padding: '40px 0 90px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '28px',
              marginBottom: '32px',
            }}
          >
            {testimonials.slice(0, 2).map((t) => (
              <div
                key={t.name}
                style={{
                  background: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '36px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #F5C518',
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#F5C518', fontWeight: 600 }}>
                      {t.role}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '0.94rem',
                    lineHeight: 1.7,
                    color: '#B0B0BD',
                    fontStyle: 'italic',
                  }}
                >
                  {t.quote}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonialIdx(i)}
                style={{
                  width: activeTestimonialIdx === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: activeTestimonialIdx === i ? '#F5C518' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: READY TO ELEVATE YOUR BRAND? (CTA + SETUP)
          ============================================================ */}
      <section id="cta-elevate" style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div
            style={{
              background: '#121216',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '36px',
              padding: '60px 48px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 0.8fr',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* Left Column: Heading & Attached Input Button */}
              <div>
                <h2
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(2.3rem, 3.8vw, 3.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  Siap Naik Kelas &amp;
                  <br />
                  Punya Website Sendiri?
                </h2>
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: '#9E9EA8',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                    maxWidth: '460px',
                  }}
                >
                  Ketik nama tokomu sekarang dan dapatkan link website profesional yang siap menerima pesanan dari mana saja.
                </p>

                {/* Attached Pill Input Bar */}
                <form
                  onSubmit={handleSlugSubmit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#09090B',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '9999px',
                    padding: '6px 6px 6px 20px',
                    maxWidth: '480px',
                  }}
                >
                  <span style={{ color: '#666672', fontSize: '0.86rem', marginRight: '4px' }}>
                    uniland.id/
                  </span>
                  <input
                    type="text"
                    value={businessSlugInput}
                    onChange={(e) => setBusinessSlugInput(e.target.value)}
                    placeholder="namausahamu"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      flex: 1,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#F5C518',
                      color: '#0A0A0C',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '12px 24px',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#E5B612')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#F5C518')}
                  >
                    Buat Web Sekarang
                  </button>
                </form>
              </div>

              {/* Right Column: Photo of Happy Indonesian Business Owner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  position: 'relative',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=700&auto=format&fit=crop&q=80"
                  alt="Pemilik Usaha UMKM Bahagia"
                  style={{
                    width: '300px',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '28px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>
            </div>

            {/* Seamless Embedded Setup Wizard Below */}
            <div
              id="setup-wizard"
              style={{
                marginTop: '60px',
                paddingTop: '50px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="badge-yellow" style={{ marginBottom: '10px' }}>
                  Pembuat Website UMKM Kilat
                </span>
                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginTop: '8px',
                  }}
                >
                  Konfigurasi Website Usaha Anda
                </h3>
              </div>

              {/* 3 Step Tabs */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '32px',
                }}
              >
                {[
                  { step: 1, label: '1. Pilih Template' },
                  { step: 2, label: '2. Info Usaha' },
                  { step: 3, label: '3. Siap Online' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setSetupStep(s.step)}
                    style={{
                      background: setupStep === s.step ? '#F5C518' : '#18181E',
                      color: setupStep === s.step ? '#0A0A0C' : '#AEAEB8',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '8px 20px',
                      fontSize: '0.84rem',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Step 1: Template Choices */}
              {setupStep === 1 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {templates.slice(0, 4).map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateName(tpl.name)}
                      style={{
                        background: selectedTemplateName === tpl.name ? '#1C1C24' : '#141418',
                        border: selectedTemplateName === tpl.name ? '2px solid #F5C518' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          height: '100px',
                          borderRadius: '10px',
                          background: '#F5C518',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          fontFamily: "'Poppins', sans-serif",
                          marginBottom: '12px',
                        }}
                      >
                        {tpl.name}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>
                        {tpl.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#8E8E98', marginTop: '4px' }}>
                        {tpl.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Business Info */}
              {setupStep === 2 && (
                <div
                  style={{
                    maxWidth: '520px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label style={{ fontSize: '0.84rem', color: '#AEAEB8', display: 'block', marginBottom: '6px' }}>
                      Nama Toko / Usaha Anda
                    </label>
                    <input
                      type="text"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: '#18181E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.84rem', color: '#AEAEB8', display: 'block', marginBottom: '6px' }}>
                      Kategori Produk / Usaha
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: '#18181E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.84rem', color: '#AEAEB8', display: 'block', marginBottom: '6px' }}>
                      Deskripsi Produk Jualan
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: '#18181E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Color & Submit */}
              {setupStep === 3 && (
                <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
                  <p style={{ fontSize: '0.94rem', color: '#AEAEB8', marginBottom: '20px' }}>
                    Website toko <strong>{websiteName}</strong> siap dibuat dengan template <strong>{selectedTemplateName}</strong>!
                  </p>
                  <button
                    onClick={handleFormSubmit}
                    className="btn btn-yellow"
                    style={{
                      padding: '14px 36px',
                      fontSize: '1rem',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    ✨ Buat Website Toko Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: TEMPLATE SHOWCASE (KATEGORI TEMPLATE UMKM)
          ============================================================ */}
      <section id="template" style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-yellow" style={{ marginBottom: '12px' }}>
              Pilihan Desain Toko
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '10px',
              }}
            >
              Template Siap Pakai Untuk Segala Jenis UMKM
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#8E8E98', maxWidth: '560px', margin: '0 auto' }}>
              Cocok untuk katering & kuliner, butik fashion & hijab, kerajinan tangan, produk olahan, jasa lokal, hingga agribisnis.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  background: '#121216',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    height: '160px',
                    background: `linear-gradient(135deg, #1C1C22 0%, #101014 100%)`,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#F5C518',
                      color: '#0A0A0C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                    }}
                  >
                    🛍️
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    {tpl.category}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '8px',
                      }}
                    >
                      {tpl.name}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#8E8E98', lineHeight: 1.5, marginBottom: '16px' }}>
                      {tpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentUser) onOpenAuthModal('register');
                      else {
                        setSelectedTemplateName(tpl.name);
                        document.getElementById('setup-wizard')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '9999px',
                      background: '#1A1A22',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F5C518';
                      e.currentTarget.style.color = '#0A0A0C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1A1A22';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    Gunakan Template Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: PRICING PACKAGES (TERJANGKAU UNTUK UMKM)
          ============================================================ */}
      <section id="harga" style={{ padding: '40px 0 100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-yellow" style={{ marginBottom: '12px' }}>
              Investasi Usaha
            </span>
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginTop: '10px',
              }}
            >
              Paket Website Tanpa Potongan Biaya Penjualan
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'Free UMKM',
                price: 'Rp 0',
                period: '/selamanya',
                desc: 'Cocok untuk pedagang & pemilik usaha baru yang ingin mencoba website jualan pertama.',
                features: ['1 Landing Page Toko', 'Subdomain uniland.id', 'Katalog hingga 5 Produk', 'Checkout WhatsApp Langsung', 'Support Komunitas'],
                isPopular: false,
              },
              {
                title: 'UMKM Juara',
                price: 'Rp 49.000',
                period: '/bulan',
                desc: 'Paling favorit! Lengkap dengan AI copywriter & katalog produk tanpa batas.',
                features: ['3 Website Toko Aktif', 'Bisa Pakai Domain Sendiri (.com / .id)', 'Katalog Produk Tanpa Batas', 'AI Copywriter Jualan Pintar', 'Prioritas WhatsApp Support', 'Statistik Pengunjung'],
                isPopular: true,
              },
              {
                title: 'Juragan Toko',
                price: 'Rp 99.000',
                period: '/bulan',
                desc: 'Untuk bisnis yang bertumbuh dengan cabang dan tim penjualan.',
                features: ['10 Website Toko Aktif', 'Akses Multi-Admin Toko', 'Integrasi Facebook Pixel & TikTok', 'SEO Toko Tingkat Lanjut', 'Backup Harian Otomatis'],
                isPopular: false,
              },
              {
                title: 'Koperasi & Komunitas',
                price: 'Rp 299.000',
                period: '/bulan',
                desc: 'Solusi asosiasi UMKM, koperasi dagang, dan paguyuban usaha.',
                features: ['Website Toko Tanpa Batas', 'Dedicated Account Manager', 'Custom Fitur & Integrasi Khusus', 'Garansi Uptime 99.9%'],
                isPopular: false,
              },
            ].map((pkg) => (
              <div
                key={pkg.title}
                style={{
                  background: pkg.isPopular ? '#181820' : '#121216',
                  border: pkg.isPopular ? '2px solid #F5C518' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {pkg.isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#F5C518',
                      color: '#0A0A0C',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Paling Populer
                  </div>
                )}

                <div>
                  <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    {pkg.title}
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#8E8E98', marginBottom: '20px', lineHeight: 1.5 }}>
                    {pkg.desc}
                  </p>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#F5C518' }}>
                      {pkg.price}
                    </span>
                    <span style={{ fontSize: '0.84rem', color: '#8E8E98' }}>{pkg.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {pkg.features.map((feat) => (
                      <li key={feat} style={{ fontSize: '0.86rem', color: '#CCCCCC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#F5C518' }}>✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenAuthModal('register')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    background: pkg.isPopular ? '#F5C518' : 'transparent',
                    color: pkg.isPopular ? '#0A0A0C' : '#ffffff',
                    border: pkg.isPopular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    fontFamily: "'Poppins', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Pilih Paket
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10: CLIENT'S EXISTING PAGES (IF LOGGED IN)
          ============================================================ */}
      {currentUser && pages.length > 0 && (
        <section style={{ padding: '20px 0 80px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="container">
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '24px',
              }}
            >
              Website Toko Milik Anda ({pages.length})
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {pages.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#141418',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#ffffff' }}>
                      {p.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: p.publishStatus === 'PUBLISHED' ? 'rgba(37, 211, 102, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                        color: p.publishStatus === 'PUBLISHED' ? '#25D366' : '#8E8E98',
                        fontWeight: 700,
                      }}
                    >
                      {p.publishStatus === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#8E8E98', marginBottom: '20px' }}>
                    uniland.id/{p.slug}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onOpenCms(p)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        background: '#F5C518',
                        color: '#0A0A0C',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Edit CMS
                    </button>
                    <button
                      onClick={() => onOpenPublicView(p.slug)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                      }}
                    >
                      Lihat Website
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20UniLand,%20saya%20ingin%20konsultasi%20pembuatan%20website%20UMKM%20saya"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
      >
        <span style={{ fontSize: '1.1rem' }}>💬</span>
        <span>Konsultasi Web UMKM</span>
      </a>

      {/* Footer */}
      <Footer
        onOpenAuth={() => onOpenAuthModal('register')}
        onOpenPricing={() => document.getElementById('harga')?.scrollIntoView({ behavior: 'smooth' })}
      />
    </div>
  );
};
