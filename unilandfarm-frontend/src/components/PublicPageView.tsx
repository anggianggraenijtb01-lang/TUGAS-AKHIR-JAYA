import React, { useState } from 'react';
import { LandingPage } from '../types';

interface PublicPageViewProps {
  page: LandingPage;
  onBackToApp: () => void;
}

export const PublicPageView: React.FC<PublicPageViewProps> = ({
  page,
  onBackToApp,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Shopping Cart State
  const [cart, setCart] = useState<
    Array<{ name: string; price: string; numPrice: number; qty: number; image?: string }>
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const sections = (page.sections || []).filter((s) => s.isVisible);

  const isCoffee =
    page.slug?.includes('kopi') ||
    page.businessName?.toLowerCase().includes('kopi') ||
    page.category?.toLowerCase().includes('kopi');

  const isGreenora =
    page.slug === 'greenora' ||
    page.businessName?.toLowerCase().includes('greenora') ||
    page.category?.toLowerCase().includes('herbal');

  const isHydro =
    page.slug?.includes('hidroponik') ||
    page.businessName?.toLowerCase().includes('hydro') ||
    page.category?.toLowerCase().includes('pertanian');

  const isCulinary =
    page.slug?.includes('sambal') ||
    page.businessName?.toLowerCase().includes('sambal') ||
    page.category?.toLowerCase().includes('kuliner');

  const formatWaNumber = (phone?: string) => {
    if (!phone) return '6281234567890';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return clean;
  };

  const parseRupiah = (val?: string): number => {
    if (!val) return 0;
    const clean = val.replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  };

  const cleanWaNumber = formatWaNumber(page.whatsappNumber);
  const defaultWaMessage = encodeURIComponent(
    page.whatsappMessage ||
      `Halo ${page.businessName || 'Admin'}, saya tertarik untuk memesan produk Anda.`
  );

  const waLink = `https://wa.me/${cleanWaNumber}?text=${defaultWaMessage}`;

  const handleAddToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          name: item.name,
          price: item.price,
          numPrice: parseRupiah(item.price),
          qty: 1,
          image: item.image,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.numPrice * item.qty, 0);

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert('Mohon isi nama lengkap Anda untuk melanjutkan pesanan.');
      return;
    }

    const itemsSummary = cart
      .map(
        (i) =>
          `• ${i.qty}x ${i.name} (@ ${i.price}) = Rp ${(i.numPrice * i.qty).toLocaleString('id-ID')}`
      )
      .join('\n');

    const formattedMessage = `Halo ${page.businessName || 'Admin'}! 👋
Saya ingin memesan dari website resmi Anda:

📦 *RINCIAN PESANAN:*
${itemsSummary}
----------------------------------------
*TOTAL PEMBELIAN: Rp ${totalCartPrice.toLocaleString('id-ID')}*

📍 *DATA PENERIMA:*
• *Nama Pemesan:* ${customerName}
${customerPhone ? `• *No. WhatsApp:* ${customerPhone}\n` : ''}• *Alamat Pengiriman:* ${customerAddress || '-'}
${customerNotes ? `• *Catatan Khusus:* ${customerNotes}\n` : ''}----------------------------------------
Mohon info ketersediaan stok, total ongkir, dan nomor rekening pembayaran ya. Terima kasih! 🙏`;

    const encoded = encodeURIComponent(formattedMessage);
    window.open(`https://wa.me/${cleanWaNumber}?text=${encoded}`, '_blank');
  };

  // Resolve guaranteed high-res Hero background image
  const getHeroBgImage = (rawHero?: string) => {
    if (isCoffee) return '/assets/coffee_hero_bg.jpg?v=2';
    if (isGreenora) return '/assets/products/greenora-hero.svg';
    if (rawHero && !rawHero.includes('1514432324607') && !rawHero.includes('greenora_hero_photo')) {
      return rawHero.includes('coffee_hero_bg.jpg') ? '/assets/coffee_hero_bg.jpg?v=2' : rawHero;
    }
    return '/assets/coffee_hero_bg.jpg?v=2';
  };

  // Resolve guaranteed high-res Product image (prevents blurry greenora_prod_1..4.png or broken external URLs)
  const resolveProductImage = (rawImg?: string, itemName?: string, idx: number = 0) => {
    const nameLower = (itemName || '').toLowerCase();
    if (rawImg?.includes('greenora_prod_1') || nameLower.includes('serum')) {
      return '/assets/products/serum-wajah.svg';
    }
    if (rawImg?.includes('greenora_prod_2') || nameLower.includes('madu')) {
      return '/assets/products/madu-hutan.svg';
    }
    if (rawImg?.includes('greenora_prod_3') || nameLower.includes('atsiri') || nameLower.includes('oil')) {
      return '/assets/products/minyak-atsiri.svg';
    }
    if (rawImg?.includes('greenora_prod_4') || nameLower.includes('lotion')) {
      return '/assets/products/lotion-alami.svg';
    }
    if (nameLower.includes('wine')) return '/assets/products/kopi-wine.svg';
    if (nameLower.includes('cold brew') || nameLower.includes('blend')) return '/assets/products/kopi-coldbrew.svg';
    if (nameLower.includes('robusta') || nameLower.includes('kopi')) return '/assets/products/kopi-robusta.svg';
    if (nameLower.includes('selada')) return '/assets/products/selada.svg';
    if (nameLower.includes('pakcoy')) return '/assets/products/pakcoy.svg';
    if (nameLower.includes('kale')) return '/assets/products/kale.svg';
    if (nameLower.includes('cumi')) return '/assets/products/sambal-cumi.svg';
    if (nameLower.includes('cakalang') || nameLower.includes('roa')) return '/assets/products/sambal-cakalang.svg';
    if (nameLower.includes('bundling') || nameLower.includes('paket')) return '/assets/products/sambal-bundling.svg';
    if (rawImg && rawImg.startsWith('/assets/products/')) return rawImg;
    const fallbacks = [
      '/assets/products/serum-wajah.svg',
      '/assets/products/madu-hutan.svg',
      '/assets/products/minyak-atsiri.svg',
      '/assets/products/lotion-alami.svg',
    ];
    return fallbacks[idx % fallbacks.length];
  };

  // Resolve guaranteed fallback for product images
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>, idx: number) => {
    const fallbacks = [
      '/assets/products/serum-wajah.svg',
      '/assets/products/madu-hutan.svg',
      '/assets/products/minyak-atsiri.svg',
      '/assets/products/lotion-alami.svg',
    ];
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbacks[idx % fallbacks.length];
  };

  const containerMaxWidth =
    viewportMode === 'mobile' ? '430px' : viewportMode === 'tablet' ? '820px' : '100%';

  return (
    <div
      style={{
        background: viewportMode === 'desktop' ? '#FAF8F3' : '#142018',
        minHeight: '100vh',
        color: '#142217',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ============================================================
          1. STUDIO LIVE PREVIEW TOP BAR (Matches Screenshot 2 Studio Bar)
         ============================================================ */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0d1f14 0%, #153120 50%, #0d1f14 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 120,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(52, 211, 153, 0.16)',
              color: '#34D399',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#34D399',
                boxShadow: '0 0 8px #34D399',
              }}
            />
            LIVE DEMO STOREFRONT
          </span>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              background: 'rgba(255, 255, 255, 0.07)',
              padding: '4px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            🔒 unilandfarm.id/site/{page.slug}
          </span>
        </div>

        {/* Viewport Switcher (Desktop / Tablet / Mobile like Screenshot 2) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.07)',
            padding: '4px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {[
            { id: 'desktop', label: '🖥️ Desktop' },
            { id: 'tablet', label: '📟 Tablet' },
            { id: 'mobile', label: '📱 Mobile' },
          ].map((vp) => (
            <button
              key={vp.id}
              onClick={() => setViewportMode(vp.id as any)}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                background:
                  viewportMode === vp.id
                    ? 'linear-gradient(135deg, #234d32 0%, #2e7d4d 100%)'
                    : 'transparent',
                color: viewportMode === vp.id ? '#ffffff' : 'rgba(255,255,255,0.68)',
                transition: 'all 0.2s ease',
              }}
            >
              {vp.label}
            </button>
          ))}
        </div>

        <button
          onClick={onBackToApp}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #F4C744 0%, #E5A92B 100%)',
            color: '#142217',
            fontWeight: 800,
            fontSize: '0.82rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(244, 199, 68, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <span>←</span>
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* ============================================================
          2. VIEWPORT CANVAS WRAPPER
         ============================================================ */}
      <div
        style={{
          maxWidth: containerMaxWidth,
          margin: viewportMode === 'desktop' ? '0 auto' : '24px auto',
          background: '#FAF8F3',
          minHeight: 'calc(100vh - 56px)',
          borderRadius: viewportMode === 'desktop' ? '0' : '24px',
          overflow: 'hidden',
          boxShadow:
            viewportMode === 'desktop' ? 'none' : '0 30px 80px rgba(0, 0, 0, 0.55)',
          border:
            viewportMode === 'desktop'
              ? 'none'
              : '6px solid rgba(255, 255, 255, 0.14)',
          transition: 'max-width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* STOREFRONT STICKY HEADER (Exact Match to "Kopi Lereng Slamet" in Screenshot 2) */}
        <header
          style={{
            padding: '16px 0',
            borderBottom: '1px solid #EAE4D7',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 80,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 24px',
            }}
          >
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #163824 0%, #275e3d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F4C744',
                  boxShadow: '0 4px 12px rgba(22, 56, 36, 0.2)',
                }}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.18rem',
                  color: '#142217',
                  letterSpacing: '-0.02em',
                }}
              >
                {page.businessName || page.title}
              </span>
            </div>

            {/* Store Navigation Links */}
            {viewportMode === 'desktop' && (
              <nav
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '28px',
                  fontSize: '0.9rem',
                  color: '#556658',
                  fontWeight: 600,
                }}
              >
                <a
                  href="#beranda-toko"
                  style={{
                    color: '#142217',
                    fontWeight: 800,
                    textDecoration: 'none',
                    borderBottom: '2.5px solid #E5A92B',
                    paddingBottom: '4px',
                  }}
                >
                  Beranda
                </a>
                <a
                  href="#keunggulan-toko"
                  style={{ color: '#556658', textDecoration: 'none' }}
                >
                  Keunggulan
                </a>
                <a href="#katalog" style={{ color: '#556658', textDecoration: 'none' }}>
                  Produk
                </a>
                <a href="#ulasan-toko" style={{ color: '#556658', textDecoration: 'none' }}>
                  Tentang &amp; Ulasan
                </a>
                <a href="#kontak-toko" style={{ color: '#556658', textDecoration: 'none' }}>
                  Kontak
                </a>
              </nav>
            )}

            {/* Cart & Order Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                title="Keranjang Belanja"
                style={{
                  background: '#F4F1E8',
                  border: '1px solid #E5DEC9',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  color: '#142217',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span
                  style={{
                    background: '#E5A92B',
                    color: '#142217',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    borderRadius: '999px',
                    padding: '1px 7px',
                  }}
                >
                  {totalCartCount}
                </span>
              </button>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #143622 0%, #1f5435 55%, #2b6f47 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(20, 54, 34, 0.25)',
                }}
              >
                <span>Pesan Sekarang</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </header>

        {/* ============================================================
            3. STOREFRONT SECTIONS
           ============================================================ */}
        <main id="beranda-toko">
          {sections.map((sec) => (
            <section key={sec.id} style={{ position: 'relative' }}>
              {/* 1. HERO SECTION — Full-Bleed Studio Editorial Hero (Matches Screenshot 2 "Kopi Lereng Slamet") */}
              {sec.sectionType === 'HERO' && (
                <div style={{ padding: '24px 24px 12px', maxWidth: '1248px', margin: '0 auto' }}>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '28px',
                      overflow: 'hidden',
                      minHeight: viewportMode === 'mobile' ? '440px' : '500px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 24px 60px rgba(20, 34, 23, 0.16)',
                      border: '1px solid rgba(20, 34, 23, 0.08)',
                      backgroundColor: '#16281c',
                    }}
                  >
                    {/* High-Resolution Full-Bleed Background Image */}
                    <img
                      src={getHeroBgImage(sec.contentJson.heroImage)}
                      alt={sec.contentJson.headline || page.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/coffee_hero_bg.jpg';
                      }}
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

                    {/* Multi-Stop Editorial Dark Gradient Overlay so text is 100% readable and right-side product photo stays bright */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, rgba(10, 22, 14, 0.78) 0%, rgba(14, 30, 19, 0.45) 45%, rgba(14, 30, 19, 0.0) 75%)',
                        zIndex: 2,
                      }}
                    />

                    {/* Main Hero Content Row */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        padding:
                          viewportMode === 'mobile'
                            ? '36px 24px 28px'
                            : '56px 56px 40px',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                      }}
                    >
                      <div style={{ maxWidth: '580px' }}>
                        {/* Golden Shield Badge */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.14)',
                            backdropFilter: 'blur(12px)',
                            color: '#F6CA45',
                            border: '1px solid rgba(246, 202, 69, 0.4)',
                            padding: '6px 16px',
                            borderRadius: '9999px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            marginBottom: '20px',
                          }}
                        >
                          <span>{sec.contentJson.badge || '🛡️ 100% Kualitas Terbaik Nusantara'}</span>
                        </div>

                        {/* Editorial Headline */}
                        <h1
                          style={{
                            fontFamily: isCoffee
                              ? "Georgia, 'Times New Roman', serif"
                              : "'Plus Jakarta Sans', sans-serif",
                            fontSize:
                              viewportMode === 'mobile'
                                ? '2.1rem'
                                : 'clamp(2.4rem, 4.2vw, 3.6rem)',
                            lineHeight: 1.1,
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: '#FFFFFF',
                            marginBottom: '18px',
                            textShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
                          }}
                        >
                          {sec.contentJson.headline || page.title}
                        </h1>

                        {/* Crisp Subheadline */}
                        <p
                          style={{
                            fontSize: viewportMode === 'mobile' ? '0.95rem' : '1.08rem',
                            color: 'rgba(255, 255, 255, 0.88)',
                            lineHeight: 1.6,
                            marginBottom: '30px',
                            maxWidth: '520px',
                          }}
                        >
                          {sec.contentJson.subheadline || page.description}
                        </p>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                          <a
                            href="#katalog"
                            style={{
                              padding: '14px 28px',
                              borderRadius: '9999px',
                              background: 'linear-gradient(135deg, #F6CA45 0%, #E09F1F 100%)',
                              color: '#142217',
                              fontWeight: 800,
                              fontSize: '0.94rem',
                              border: 'none',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              boxShadow: '0 10px 26px rgba(246, 202, 69, 0.35)',
                            }}
                          >
                            <span>{sec.contentJson.primaryCtaText || 'Lihat Produk'}</span>
                            <span>→</span>
                          </a>

                          <a
                            href="#keunggulan-toko"
                            style={{
                              padding: '14px 28px',
                              borderRadius: '9999px',
                              background: 'rgba(255, 255, 255, 0.12)',
                              backdropFilter: 'blur(10px)',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.94rem',
                              border: '1.5px solid rgba(255, 255, 255, 0.35)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            {sec.contentJson.secondaryCtaText || 'Tentang Kami'}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Translucent Trust Bar Inside Hero (Matches Screenshot 2!) */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        background: 'rgba(10, 18, 12, 0.78)',
                        backdropFilter: 'blur(12px)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '18px 40px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(246, 202, 69, 0.18)',
                            color: '#F6CA45',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                          }}
                        >
                          🌿
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                            {isCoffee
                              ? '100% Asli Lereng Slamet'
                              : isGreenora
                              ? '100% Bahan Alami BPOM'
                              : isHydro
                              ? '100% Bebas Pestisida'
                              : '100% Bahan Segar Pilihan'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.68)' }}>
                            Kualitas unggulan teruji
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(246, 202, 69, 0.18)',
                            color: '#F6CA45',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                          }}
                        >
                          🚚
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                            Pengiriman Seluruh Indonesia
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.68)' }}>
                            Packing aman &amp; bergaransi
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(246, 202, 69, 0.18)',
                            color: '#F6CA45',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                          }}
                        >
                          🛡️
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#FFFFFF' }}>
                            Kualitas Terjamin
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.68)' }}>
                            Langsung dari produsen resmi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. FEATURES SECTION ("KEUNGGULAN KAMI — Mengapa Memilih ...?" from Screenshot 2) */}
              {sec.sectionType === 'FEATURES' && (
                <div
                  id="keunggulan-toko"
                  style={{
                    padding: '64px 24px 48px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                  }}
                >
                  <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#C58B1B',
                        marginBottom: '8px',
                      }}
                    >
                      KEUNGGULAN KAMI
                    </div>
                    <h2
                      style={{
                        fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)',
                        fontWeight: 800,
                        color: '#142217',
                        letterSpacing: '-0.025em',
                        marginBottom: '10px',
                      }}
                    >
                      {sec.contentJson.title || `Mengapa Memilih ${page.businessName}?`}
                    </h2>
                    <p style={{ color: '#5A6B5D', fontSize: '0.98rem', lineHeight: 1.6 }}>
                      {sec.contentJson.subtitle ||
                        `Kami menghadirkan produk terbaik dengan proses alami dan standar kualitas tinggi.`}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {(sec.contentJson.features || []).map((feat: any, idx: number) => {
                      const bgTints = ['#E6F2EB', '#F7ECDC', '#E4F4EE'];
                      return (
                        <div
                          key={idx}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '22px',
                            padding: '32px 26px',
                            textAlign: 'center',
                            border: '1px solid #EAE4D7',
                            boxShadow: '0 10px 30px rgba(20, 34, 23, 0.04)',
                          }}
                        >
                          <div
                            style={{
                              width: '58px',
                              height: '58px',
                              borderRadius: '50%',
                              background: bgTints[idx % bgTints.length],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.65rem',
                              margin: '0 auto 18px',
                            }}
                          >
                            {feat.icon || '🌿'}
                          </div>
                          <h4
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              color: '#142217',
                              marginBottom: '8px',
                            }}
                          >
                            {feat.title}
                          </h4>
                          <p
                            style={{
                              fontSize: '0.9rem',
                              color: '#5A6B5D',
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {feat.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. CATALOG SECTION (Luxury Storefront Cards with Verified High-Res Photos) */}
              {sec.sectionType === 'CATALOG' && (
                <div
                  id="katalog"
                  style={{
                    padding: '44px 24px 72px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#1D5634',
                          marginBottom: '6px',
                        }}
                      >
                        KATALOG PRODUK RESMI
                      </div>
                      <h2
                        style={{
                          fontSize: 'clamp(1.65rem, 2.6vw, 2.15rem)',
                          fontWeight: 800,
                          color: '#142217',
                          margin: 0,
                          letterSpacing: '-0.025em',
                        }}
                      >
                        {sec.contentJson.title || 'Produk Unggulan Kami'}
                      </h2>
                      {sec.contentJson.subtitle && (
                        <p style={{ color: '#5A6B5D', fontSize: '0.95rem', marginTop: '6px' }}>
                          {sec.contentJson.subtitle}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setIsCartOpen(true)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '999px',
                        background: '#FFFFFF',
                        border: '1px solid #DCD4C4',
                        color: '#142217',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      🛒 Lihat Keranjang ({totalCartCount})
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(265px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {(sec.contentJson.items || []).map((item: any, idx: number) => {
                      const itemWaMsg = encodeURIComponent(
                        `Halo ${page.businessName || 'Admin'}, saya ingin memesan: ${item.name} (${item.price}). Mohon info ketersediaan stok.`
                      );
                      const itemWaUrl = `https://wa.me/${cleanWaNumber}?text=${itemWaMsg}`;

                      return (
                        <div
                          key={idx}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '22px',
                            overflow: 'hidden',
                            border: '1px solid #EAE4D7',
                            boxShadow: '0 8px 26px rgba(20, 34, 23, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow =
                              '0 18px 38px rgba(20, 34, 23, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              '0 8px 26px rgba(20, 34, 23, 0.05)';
                          }}
                        >
                          {/* Product Photo Container */}
                          <div
                            style={{
                              height: '230px',
                              background: '#F4F1E8',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={resolveProductImage(item.image, item.name, idx)}
                              alt={item.name}
                              onError={(e) => handleImgError(e, idx)}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'rgba(20, 34, 23, 0.85)',
                                backdropFilter: 'blur(8px)',
                                color: '#F6CA45',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '4px 12px',
                                borderRadius: '999px',
                              }}
                            >
                              {item.badge || 'Best Seller'}
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '12px',
                                background: 'rgba(255, 255, 255, 0.92)',
                                color: '#142217',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '3px 9px',
                                borderRadius: '999px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              }}
                            >
                              ★ 5.0
                            </div>
                          </div>

                          {/* Product Info */}
                          <div
                            style={{
                              padding: '20px 22px 22px',
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '14px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  fontSize: '1.08rem',
                                  fontWeight: 800,
                                  color: '#142217',
                                  marginBottom: '6px',
                                }}
                              >
                                {item.name}
                              </h4>
                              <div
                                style={{
                                  fontSize: '1.22rem',
                                  fontWeight: 800,
                                  color: '#1D5634',
                                  marginBottom: '8px',
                                }}
                              >
                                {item.price}
                              </div>
                              {(item.desc || item.description) && (
                                <p
                                  style={{
                                    fontSize: '0.86rem',
                                    color: '#5A6B5D',
                                    lineHeight: 1.5,
                                    margin: 0,
                                  }}
                                >
                                  {item.desc || item.description}
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleAddToCart(item)}
                                style={{
                                  flex: 1,
                                  padding: '11px 16px',
                                  borderRadius: '9999px',
                                  background:
                                    'linear-gradient(135deg, #143622 0%, #1f5435 55%, #2b6f47 100%)',
                                  color: '#FFFFFF',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  boxShadow: '0 6px 16px rgba(20, 54, 34, 0.2)',
                                }}
                              >
                                <span>🛒</span>
                                <span>+ Keranjang</span>
                              </button>

                              <a
                                href={itemWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '11px 14px',
                                  borderRadius: '9999px',
                                  background: '#E8F3EC',
                                  color: '#143622',
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  border: '1px solid #CBE3D3',
                                }}
                                title="Pesan Langsung via WhatsApp"
                              >
                                WA ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. TESTIMONIALS SECTION */}
              {sec.sectionType === 'TESTIMONIALS' && (
                <div
                  id="ulasan-toko"
                  style={{
                    padding: '64px 24px',
                    background: '#F2EFE6',
                    borderTop: '1px solid #E5DEC9',
                    borderBottom: '1px solid #E5DEC9',
                  }}
                >
                  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
                      <div
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#C58B1B',
                          marginBottom: '6px',
                        }}
                      >
                        ULASAN PELANGGAN
                      </div>
                      <h2
                        style={{
                          fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
                          fontWeight: 800,
                          color: '#142217',
                          marginBottom: '8px',
                        }}
                      >
                        {sec.contentJson.title || 'Apa Kata Pelanggan Kami?'}
                      </h2>
                      <p style={{ color: '#5A6B5D', fontSize: '0.95rem' }}>
                        {sec.contentJson.subtitle}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      {(sec.contentJson.testimonials || []).map((t: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '20px',
                            padding: '28px',
                            border: '1px solid #EAE4D7',
                            boxShadow: '0 8px 24px rgba(20, 34, 23, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ marginBottom: '18px' }}>
                            <div
                              style={{
                                color: '#E5A92B',
                                fontSize: '1.05rem',
                                marginBottom: '10px',
                                letterSpacing: '2px',
                              }}
                            >
                              {'★'.repeat(t.rating || 5)}
                            </div>
                            <p
                              style={{
                                fontSize: '0.96rem',
                                color: '#142217',
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              “{t.quote}”
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #143622, #2b6f47)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                              }}
                            >
                              {t.author.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#142217' }}>
                                {t.author}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#5A6B5D' }}>{t.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. FAQ SECTION */}
              {sec.sectionType === 'FAQ' && (
                <div style={{ padding: '64px 24px', maxWidth: '820px', margin: '0 auto' }}>
                  <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <h2
                      style={{
                        fontSize: 'clamp(1.55rem, 2.4vw, 2rem)',
                        fontWeight: 800,
                        color: '#142217',
                        marginBottom: '8px',
                      }}
                    >
                      {sec.contentJson.title || 'Pertanyaan yang Sering Diajukan'}
                    </h2>
                    <p style={{ color: '#5A6B5D', fontSize: '0.94rem' }}>
                      Informasi penting seputar pemesanan dan pengiriman produk.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(sec.contentJson.faqs || []).map((faq: any, idx: number) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #EAE4D7',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            style={{
                              padding: '18px 24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.96rem',
                              color: '#142217',
                            }}
                          >
                            <span>{faq.q}</span>
                            <span
                              style={{
                                fontSize: '1.25rem',
                                color: '#1D5634',
                                fontWeight: 800,
                              }}
                            >
                              {isOpen ? '−' : '+'}
                            </span>
                          </div>

                          {isOpen && (
                            <div
                              style={{
                                padding: '0 24px 20px',
                                color: '#5A6B5D',
                                fontSize: '0.9rem',
                                lineHeight: 1.6,
                                borderTop: '1px solid #F2EFE6',
                                paddingTop: '14px',
                              }}
                            >
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. CONTACT SECTION */}
              {sec.sectionType === 'CONTACT' && (
                <div
                  id="kontak-toko"
                  style={{
                    padding: '48px 24px 64px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #122b1c 0%, #1c462d 100%)',
                      borderRadius: '26px',
                      padding: '44px 32px',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      boxShadow: '0 20px 50px rgba(18, 43, 28, 0.2)',
                    }}
                  >
                    <h3 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '12px' }}>
                      {sec.contentJson.title || `Hubungi ${page.businessName}`}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
                      📍 {sec.contentJson.address}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
                      📞 WhatsApp: {sec.contentJson.phone} • ✉️ {sec.contentJson.email}
                    </p>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '13px 28px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #F6CA45 0%, #E09F1F 100%)',
                        color: '#142217',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>💬 Chat Sekarang di WhatsApp</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )}
            </section>
          ))}
        </main>

        {/* Storefront Footer */}
        <footer
          style={{
            padding: '28px 24px',
            textAlign: 'center',
            color: '#5A6B5D',
            fontSize: '0.82rem',
            borderTop: '1px solid #EAE4D7',
            background: '#FFFFFF',
          }}
        >
          © {new Date().getFullYear()} <strong>{page.businessName || page.title}</strong>. Website
          toko resmi didukung oleh{' '}
          <span style={{ color: '#1D5634', fontWeight: 800 }}>UNI-LANDFARM Studio</span>.
        </footer>
      </div>

      {/* ============================================================
          FLOATING CART & WHATSAPP BUTTONS
         ============================================================ */}
      {totalCartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '78px',
            right: '24px',
            zIndex: 95,
            background: 'linear-gradient(135deg, #F6CA45, #E09F1F)',
            color: '#142217',
            padding: '12px 20px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(224, 159, 31, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🛒</span>
          <span>
            Keranjang ({totalCartCount}) • Rp {totalCartPrice.toLocaleString('id-ID')}
          </span>
        </button>
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
          color: '#FFFFFF',
          padding: '12px 22px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '0.88rem',
          boxShadow: '0 10px 28px rgba(22, 163, 74, 0.4)',
          zIndex: 95,
          textDecoration: 'none',
        }}
      >
        <span>💬 Pesan via WhatsApp</span>
      </a>

      {/* ============================================================
          SHOPPING CART DRAWER
         ============================================================ */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 20, 14, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#FFFFFF',
              color: '#142217',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #EAE4D7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                🛒 Keranjang Pesanan ({totalCartCount})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#F4F1E8',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#5A6B5D' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛍️</div>
                  <p style={{ fontWeight: 700 }}>Keranjang Anda masih kosong.</p>
                  <p style={{ fontSize: '0.85rem' }}>
                    Silakan klik tombol + Keranjang pada produk pilihan Anda.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item, cIdx) => (
                    <div
                      key={item.name}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: '#FAF8F3',
                        border: '1px solid #EAE4D7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => handleImgError(e, cIdx)}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.name}</div>
                        <div style={{ fontSize: '0.84rem', color: '#1D5634', fontWeight: 800 }}>
                          {item.price}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateQty(item.name, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #DCD4C4',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            fontWeight: 800,
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.name, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #DCD4C4',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            fontWeight: 800,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      marginTop: '14px',
                      padding: '16px',
                      borderRadius: '16px',
                      background: '#F4F8F5',
                      border: '1px solid #CFE3D5',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#143622' }}>
                      📍 Data Pengiriman WhatsApp
                    </div>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Penerima *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.86rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp Aktif"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.86rem',
                      }}
                    />
                    <textarea
                      rows={2}
                      placeholder="Alamat Lengkap Pengiriman *"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.86rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Catatan Tambahan (Opsional)"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div
                style={{
                  padding: '20px 24px',
                  borderTop: '1px solid #EAE4D7',
                  background: '#FAF8F3',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#5A6B5D' }}>Total Pesanan:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#143622' }}>
                    Rp {totalCartPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={handleCheckoutWhatsApp}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #143622 0%, #1f5435 55%, #2b6f47 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Kirim Pesanan ke WhatsApp ↗
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
