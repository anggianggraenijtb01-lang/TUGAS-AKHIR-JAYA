import React from 'react';
import { UniLandLogo } from './UniLandLogo';

interface FooterProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, onOpenPricing }) => {
  return (
    <footer
      style={{
        backgroundColor: 'transparent',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Forest Green Container with Rounded Top Corners */}
      <div
        style={{
          backgroundColor: '#1E2E20',
          color: '#FFFFFF',
          borderRadius: '48px 48px 0 0',
          padding: '64px 28px 36px',
          margin: '0 auto',
          maxWidth: '1280px',
          boxShadow: '0 -8px 30px rgba(10, 20, 12, 0.08)',
        }}
      >
        <div className="container" style={{ padding: 0 }}>
          {/* Top Row: Brand & Mission Statement */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '32px',
              paddingBottom: '48px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Logo */}
            <div style={{ maxWidth: '340px' }}>
              <UniLandLogo size="md" variant="dark" showTagline={true} style={{ marginBottom: '16px' }} />
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.78)',
                  fontWeight: 500,
                }}
              >
                Platform pembuatan website, landing page, dan katalog jualan online instan untuk memajukan seluruh pelaku UMKM Indonesia.
              </p>
            </div>

            {/* Mission quote / summary on the right */}
            <div style={{ maxWidth: '440px' }}>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: '#FFFFFF',
                  marginBottom: '18px',
                }}
              >
                "Membantu para pelaku UMKM, pedagang lokal, kuliner, dan produk kreatif memiliki website mandiri yang profesional dan siap terima pesanan langsung."
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onOpenAuth('register')}
                  style={{
                    padding: '11px 24px',
                    borderRadius: '9999px',
                    background: '#F4C744',
                    color: '#102B3F',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(244, 199, 68, 0.35)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Mulai Buat Web UMKM
                </button>
                <button
                  onClick={onOpenPricing}
                  style={{
                    padding: '11px 24px',
                    borderRadius: '9999px',
                    background: 'transparent',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Lihat Paket
                </button>
              </div>
            </div>
          </div>

          {/* Middle Row: 4 Column Navigation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '36px',
              padding: '48px 0 40px',
            }}
          >
            {/* Services */}
            <div>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Services
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Website & Landing Page', 'Katalog Jualan Online', 'WhatsApp Direct Order', 'AI Copywriter Jualan', 'Profil Toko & Bisnis'].map((item) => (
                  <li key={item}>
                    <a
                      href="#services"
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.72)',
                        transition: 'color 0.2s',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Home', 'Tentang Kami', 'Pilihan Template', 'Tim Ahli', 'Testimoni Klien'].map((item) => (
                  <li key={item}>
                    <a
                      href="#tentang"
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.72)',
                        transition: 'color 0.2s',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Let's Connect */}
            <div>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Let's Connect
              </h4>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '8px' }}>
                halo@unilandfarm.com
              </p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '14px' }}>
                +62 812-3456-7890
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Instagram', 'WhatsApp', 'LinkedIn'].map((social) => (
                  <span
                    key={social}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {social}
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Location
              </h4>
              <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.6 }}>
                Jakarta Selatan, Indonesia
                <br />
                Kawasan Bisnis Mega Kuningan
                <br />
                Gedung Palma One Lt. 8
              </p>
            </div>
          </div>

          {/* Bottom Row: Copyright Bar */}
          <div
            style={{
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.65)',
              fontWeight: 500,
            }}
          >
            <div>© 2026 UniLand Farm Agency. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
