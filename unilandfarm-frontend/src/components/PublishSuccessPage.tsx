import React, { useState } from 'react';
import { LandingPage, User } from '../types';
import { UniLandLogo } from './UniLandLogo';
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  LayoutGrid,
  Edit3,
  Globe,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
} from './icons/LucideIcons';

interface PublishSuccessPageProps {
  page: LandingPage;
  currentUser: User | null;
  onOpenPublicView: (slug: string) => void;
  onBackToCms: () => void;
  onBackToDashboard: () => void;
  onBackToHome: () => void;
}

export const PublishSuccessPage: React.FC<PublishSuccessPageProps> = ({
  page,
  currentUser,
  onOpenPublicView,
  onBackToCms,
  onBackToDashboard,
  onBackToHome,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fullUrl = `https://unilandfarm.id/${page.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Halo! Kunjungi website resmi ${page.businessName || page.title} di ${fullUrl} untuk melihat profil usaha dan katalog produk unggulan kami.`
  );
  const waShareUrl = `https://wa.me/?text=${shareText}`;

  const publishTimeFormatted = page.publishedAt
    ? new Date(page.publishedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    : 'Baru saja';

  return (
    <div
      style={{
        backgroundColor: '#FAF8F2',
        minHeight: '100vh',
        color: '#102B3F',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ============================================================
          TOP HEADER
          ============================================================ */}
      <header
        style={{
          height: '68px',
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(48, 68, 50, 0.08)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div onClick={onBackToHome} style={{ cursor: 'pointer' }} title="Kembali ke Beranda">
            <UniLandLogo size="sm" variant="light" />
          </div>
          <span style={{ color: 'rgba(85, 113, 132, 0.2)' }}>|</span>
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>
            Publikasi Sukses
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onBackToCms}
            style={{
              background: '#FAF8F2',
              border: '1px solid rgba(85, 113, 132, 0.2)',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#102B3F',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Edit3 size={14} />
            <span>Edit di CMS</span>
          </button>

          <button
            type="button"
            onClick={onBackToDashboard}
            style={{
              background: '#102B3F',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(16, 43, 34, 0.2)',
            }}
          >
            <LayoutGrid size={14} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* ============================================================
          MAIN BODY CONTAINER
          ============================================================ */}
      <main style={{ flex: 1, padding: '40px 20px 60px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {/* Main Success Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid rgba(48, 68, 50, 0.1)',
              padding: '42px 36px',
              boxShadow: '0 16px 48px rgba(16, 43, 34, 0.08)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '28px',
            }}
          >
            {/* Ambient Top Glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '5px',
                background: 'linear-gradient(90deg, #16A34A 0%, #F4C744 50%, #16A34A 100%)',
              }}
            />

            {/* Celebratory Icon Badge */}
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #DCFCE7 0%, #BBF7D0 100%)',
                border: '3px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '2.5rem',
                color: '#15803D',
                boxShadow: '0 10px 28px rgba(22, 163, 74, 0.22)',
              }}
            >
              🚀
            </div>

            {/* Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#DCFCE7',
                color: '#166534',
                padding: '5px 16px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#16A34A',
                }}
              />
              <span>WEBSITE RESMI MENGUDARA • LIVE ONLINE</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: '#102B3F',
                margin: '0 0 10px',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              Selamat! Website Anda Berhasil Dipublikasikan
            </h1>

            <p
              style={{
                fontSize: '0.94rem',
                color: '#556357',
                maxWidth: '580px',
                margin: '0 auto 28px',
                lineHeight: 1.6,
              }}
            >
              Halaman profil usaha <strong>{page.businessName || page.title}</strong> beserta seluruh katalog produk kini aktif secara langsung dan siap dikunjungi oleh calon pembeli dari seluruh Indonesia.
            </p>

            {/* Live Domain URL Box */}
            <div
              style={{
                background: '#F8FAF7',
                borderRadius: '16px',
                border: '1.5px solid #E6E0D0',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '24px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15803D',
                    flexShrink: 0,
                  }}
                >
                  <Globe size={18} />
                </div>
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.72rem', color: '#687A4D', fontWeight: 600 }}>Tautan Resmi Website Anda:</div>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#102B3F',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    }}
                  >
                    {fullUrl}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    background: copied ? '#15803D' : '#FFFFFF',
                    color: copied ? '#FFFFFF' : '#102B3F',
                    border: '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Lihat Kode QR Website"
                  style={{
                    background: '#FFFFFF',
                    color: '#102B3F',
                    border: '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <QrCode size={15} />
                  <span>QR</span>
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              <button
                type="button"
                onClick={() => onOpenPublicView(page.slug)}
                style={{
                  background: '#F4C744',
                  color: '#102B3F',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px 28px',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(244, 199, 68, 0.35)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>Lihat Website Live</span>
                <ExternalLink size={16} />
              </button>

              <a
                href={waShareUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  padding: '13px 24px',
                  fontSize: '0.94rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <MessageCircle size={17} />
                <span>Bagikan ke WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Website Details & Release Summary */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(48, 68, 50, 0.08)',
              padding: '24px 28px',
              marginBottom: '28px',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#102B3F',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="#15803D" />
              <span>Detail &amp; Ringkasan Rilis Publikasi</span>
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                fontSize: '0.84rem',
              }}
            >
              <div style={{ background: '#F8FAF7', padding: '12px 16px', borderRadius: '12px' }}>
                <span style={{ color: '#687A4D', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>
                  Nama Bisnis / Toko:
                </span>
                <strong style={{ color: '#102B3F' }}>{page.businessName || page.title}</strong>
              </div>

              <div style={{ background: '#F8FAF7', padding: '12px 16px', borderRadius: '12px' }}>
                <span style={{ color: '#687A4D', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>
                  Struktur Konten:
                </span>
                <strong style={{ color: '#102B3F' }}>{(page.sections || []).length} Blok Konten Aktif</strong>
              </div>

              <div style={{ background: '#F8FAF7', padding: '12px 16px', borderRadius: '12px' }}>
                <span style={{ color: '#687A4D', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>
                  Waktu Publikasi:
                </span>
                <strong style={{ color: '#102B3F' }}>{publishTimeFormatted}</strong>
              </div>

              <div style={{ background: '#F8FAF7', padding: '12px 16px', borderRadius: '12px' }}>
                <span style={{ color: '#687A4D', fontSize: '0.74rem', display: 'block', marginBottom: '2px' }}>
                  Status Server Hosting:
                </span>
                <strong style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
                  Aktif &amp; Terintegrasi WA
                </strong>
              </div>
            </div>
          </div>

          {/* Tips Next Steps for UMKM */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(48, 68, 50, 0.08)',
              padding: '24px 28px',
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#102B3F',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <TrendingUp size={18} color="#D97706" />
              <span>3 Langkah Cepat Agar Website Anda Ramai Pembeli</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: '#F8FAF7',
                  padding: '14px 16px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#F4C744',
                    color: '#102B3F',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#102B3F' }}>Pasang di Bio Media Sosial</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#62685E', lineHeight: 1.45 }}>
                    Salin link website Anda dan tempel di bio profil Instagram, TikTok, dan Facebook bisnis agar calon pembeli dapat langsung menjelajahi katalog.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: '#F8FAF7',
                  padding: '14px 16px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#F4C744',
                    color: '#102B3F',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#102B3F' }}>Bagikan ke Status &amp; Grup WhatsApp</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#62685E', lineHeight: 1.45 }}>
                    Gunakan tombol <em>Bagikan ke WhatsApp</em> di atas untuk mengabarkan peluncuran website ke pelanggan setia dan kontak terdekat Anda.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: '#F8FAF7',
                  padding: '14px 16px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#F4C744',
                    color: '#102B3F',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#102B3F' }}>Perbarui Promo &amp; Salinan via Agentic AI</strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#62685E', lineHeight: 1.45 }}>
                    Kapan pun Anda mengadakan diskon mingguan atau menambahkan produk baru, buka kembali CMS Editor dan gunakan bantuan AI untuk menulis narasi promo dalam hitungan detik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Footer Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={onBackToDashboard}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(85, 113, 132, 0.2)',
                borderRadius: '10px',
                padding: '10px 22px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#102B3F',
                cursor: 'pointer',
              }}
            >
              ← Kembali ke Dashboard
            </button>

            <button
              type="button"
              onClick={onBackToCms}
              style={{
                background: '#102B3F',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 24px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Lanjutkan Edit di CMS Editor →
            </button>
          </div>
        </div>
      </main>

      {/* ============================================================
          MODAL KODE QR
          ============================================================ */}
      {showQrModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(16, 43, 34, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowQrModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '380px',
              width: '100%',
              padding: '28px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B3F', margin: '0 0 6px' }}>
              Pindai Kode QR Website
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 20px' }}>
              Arahkan kamera smartphone pelanggan untuk membuka website secara instan.
            </p>

            {/* QR Visual Canvas Box */}
            <div
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 18px',
                background: '#F8FAF7',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  background: '#102B3F',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: '10px',
                }}
              >
                QR: {page.slug}
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#102B3F', fontWeight: 700, marginBottom: '20px' }}>
              {fullUrl}
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              style={{
                width: '100%',
                background: '#102B3F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          LANDING PAGE-STYLE FOREST GREEN FOOTER
          ============================================================ */}
      <footer
        style={{
          background: '#102B3F',
          padding: '24px 20px',
          color: '#FFFFFF',
          textAlign: 'center',
          fontSize: '0.78rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <UniLandLogo size="sm" variant="dark" />
        </div>
        <p style={{ margin: '0 0 8px', color: 'rgba(255, 255, 255, 0.65)' }}>
          Platform Website &amp; Agentic AI CMS untuk Pelaku UMKM Indonesia
        </p>
        <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.72rem' }}>
          &copy; {new Date().getFullYear()} UNI-LANDFARM. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>
    </div>
  );
};
