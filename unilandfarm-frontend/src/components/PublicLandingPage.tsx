import React, { useState } from 'react';
import { User, Template, Plan, BillingInterval } from '../types';
import { UniLandLogo } from './UniLandLogo';
import {
  Sparkles,
  MessageCircle,
  Globe,
  Layers,
  Smartphone,
  Eye,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sliders,
  Shield,
  Clock,
  Layout,
  User as UserIcon,
  Users,
  Calendar,
  Briefcase,
  Menu,
  X,
} from './icons/LucideIcons';

interface PublicLandingPageProps {
  currentUser: User | null;
  templates: Template[];
  plans?: Plan[];
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenDashboard?: () => void;
  onOpenAiWizard: (prefillName?: string) => void;
  onSelectPlan?: (plan: Plan, interval: BillingInterval) => void;
  onOpenPublicView: (slug: string) => void;
  onUseTemplate: (template: Template) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  currentUser,
  templates,
  onOpenAuth,
  onOpenDashboard,
  onOpenAiWizard,
  onOpenPublicView,
  onUseTemplate,
}) => {
  const [activeNav, setActiveNav] = useState('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showcaseCategory, setShowcaseCategory] = useState<'all' | 'portfolio' | 'organization' | 'event' | 'service'>('all');
  const [promptInput, setPromptInput] = useState('Buatkan website portofolio UX designer modern...');

  // Smooth scroll helper
  const scrollTo = (id: string, navKey: string) => {
    setActiveNav(navKey);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Core Showcase Micro-Webs (Section 5.6)
  const showcases = [
    {
      id: 'showcase-portfolio',
      category: 'portfolio',
      categoryLabel: 'Personal Portfolio',
      icon: <UserIcon size={16} />,
      title: 'Alex Pratama — Senior Product Designer',
      tagline: 'Portofolio interaktif dengan highlight studi kasus, keahlian desain, dan tautan kolaborasi.',
      slug: 'alex-pratama',
      themeBadge: 'Minimal Dark & Mint',
      accentColor: '#C6F36B',
      heroPreview: 'Membantu startup mendesain pengalaman digital yang berdampak nyata.',
      stats: '8 Tahun Pengalaman • 24 Proyek Selesai',
      chips: ['Case Studies', 'Interactive Resume', 'Contact Form', 'Skills Radar'],
    },
    {
      id: 'showcase-org',
      category: 'organization',
      categoryLabel: 'Organization Profile',
      icon: <Users size={16} />,
      title: 'Komunitas Hijau Nusantara',
      tagline: 'Halaman resmi pergerakan pelestarian lingkungan, program penanaman pohon, dan laporan donasi.',
      slug: 'hijau-nusantara',
      themeBadge: 'Clean Forest Eco',
      accentColor: '#102B3F',
      heroPreview: 'Bersama mewujudkan hutan kota yang asri dan berkelanjutan di seluruh Indonesia.',
      stats: '12.000+ Relawan • 45 Kota',
      chips: ['Visi & Misi', 'Program Aktif', 'Galeri Kegiatan', 'Pendaftaran Relawan'],
    },
    {
      id: 'showcase-event',
      category: 'event',
      categoryLabel: 'Event Landing Page',
      icon: <Calendar size={16} />,
      title: 'Nusantara Tech Summit 2026',
      tagline: 'Landing page konferensi teknologi dengan jadwal rundown, profil pembicara, dan registrasi tiket.',
      slug: 'tech-summit-2026',
      themeBadge: 'High-Impact Vibrant',
      accentColor: '#F59E0B',
      heroPreview: 'Masa depan AI, cloud architecture, dan inovasi digital Indonesia.',
      stats: '2 Hari • 30 Pembicara • 1.500 Peserta',
      chips: ['Rundown Acara', 'Profil Speaker', 'Lokasi & Peta', 'Form Pendaftaran'],
    },
    {
      id: 'showcase-service',
      category: 'service',
      categoryLabel: 'Professional Service Profile',
      icon: <Briefcase size={16} />,
      title: 'Studio Karsa Kreasi',
      tagline: 'Profil agensi konsultan branding dan digital presence untuk bisnis yang sedang bertumbuh.',
      slug: 'karsa-kreasi',
      themeBadge: 'Editorial Slate & Warm',
      accentColor: '#7B4B28',
      heroPreview: 'Membangun identitas brand yang memikat, autentik, dan siap bersaing di pasar global.',
      stats: '98% Kepuasan Klien • 150+ Brand',
      chips: ['Layanan Unggulan', 'Metodologi Kerja', 'Testimoni Klien', 'Booking Konsultasi'],
    },
  ];

  const filteredShowcases =
    showcaseCategory === 'all'
      ? showcases
      : showcases.filter((s) => s.category === showcaseCategory);

  return (
    <div className="saas-page" style={{ backgroundColor: '#F8FAF7', color: '#102B3F' }}>
      {/* ============================================================
          5.1 NAVBAR (Sticky, Responsive, Active Navigation)
         ============================================================ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(248, 250, 247, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(85, 113, 132, 0.14)',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          className="saas-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => scrollTo('hero-section', 'beranda')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <UniLandLogo size="md" variant="light" showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.2rem',
            }}
            className="hidden md:flex"
          >
            {[
              { key: 'beranda', label: 'Beranda', target: 'hero-section' },
              { key: 'fitur', label: 'Fitur', target: 'feature-section' },
              { key: 'cara-kerja', label: 'Cara Kerja', target: 'how-it-works-section' },
              { key: 'contoh', label: 'Contoh Website', target: 'showcase-section' },
              { key: 'tentang', label: 'Tentang', target: 'problem-section' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.target, item.key)}
                className={`eloq-nav-link ${activeNav === item.key ? 'active' : ''}`}
                style={{
                  fontSize: '0.94rem',
                  fontWeight: activeNav === item.key ? 700 : 500,
                  color: activeNav === item.key ? '#102B3F' : '#557184',
                  padding: '6px 0',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Actions / CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {currentUser ? (
              <button
                onClick={() => (onOpenDashboard ? onOpenDashboard() : onOpenAuth('login'))}
                className="btn-navy"
                style={{
                  padding: '0.62rem 1.35rem',
                  fontSize: '0.88rem',
                }}
              >
                <Layout size={16} />
                <span>Buka Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#102B3F',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: '999px',
                  }}
                  className="hidden sm:inline-block"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAiWizard()}
                  className="btn-lime"
                  style={{
                    padding: '0.62rem 1.35rem',
                    fontSize: '0.88rem',
                  }}
                >
                  <Sparkles size={16} />
                  <span>Mulai Gratis</span>
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(85, 113, 132, 0.2)',
                borderRadius: '8px',
                padding: '6px',
                color: '#102B3F',
                cursor: 'pointer',
              }}
              className="flex md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 1.5rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid rgba(85, 113, 132, 0.16)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
            className="flex md:hidden"
          >
            {[
              { key: 'beranda', label: 'Beranda', target: 'hero-section' },
              { key: 'fitur', label: 'Fitur', target: 'feature-section' },
              { key: 'cara-kerja', label: 'Cara Kerja', target: 'how-it-works-section' },
              { key: 'contoh', label: 'Contoh Website', target: 'showcase-section' },
              { key: 'tentang', label: 'Tentang', target: 'problem-section' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.target, item.key)}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  fontSize: '1rem',
                  fontWeight: activeNav === item.key ? 700 : 500,
                  color: activeNav === item.key ? '#102B3F' : '#557184',
                }}
              >
                {item.label}
              </button>
            ))}
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #ECE7D9' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16,43,63,0.2)',
                  fontWeight: 600,
                  color: '#102B3F',
                  background: 'transparent',
                }}
              >
                Masuk ke Akun
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          5.2 HERO SECTION (Master Headline, Subheadline, CTAs & Product Mockup)
         ============================================================ */}
      <section
        id="hero-section"
        className="eloq-hero-surface"
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          paddingBottom: '5.5rem',
        }}
      >
        <div className="eloq-hero-grid-bg" />
        <div className="eloq-aurora-orb-1" />
        <div className="eloq-aurora-orb-2" />
        <div className="eloq-aurora-orb-3" />

        <div
          className="saas-container"
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Pill Badge */}
          <div style={{ marginBottom: '1.4rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: '#EAF7D5',
                border: '1px solid rgba(198, 243, 107, 0.65)',
                color: '#102B3F',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                boxShadow: '0 2px 10px rgba(198, 243, 107, 0.25)',
              }}
            >
              <Sparkles size={15} color="#102B3F" />
              <span>AI-Powered Micro-Web Platform</span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#102B3F',
                }}
              />
              <span style={{ color: '#557184', fontWeight: 600 }}>Tanpa Coding</span>
            </span>
          </div>

          {/* Master Headline (Section 5.2 Requirement) */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#102B3F',
              maxWidth: '920px',
              margin: '0 auto 1.25rem',
            }}
          >
            Website Impianmu,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #102B3F 0%, #183C57 40%, #7B4B28 75%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cukup Ceritakan.
            </span>
          </h1>

          {/* Master Subheadline (Section 5.2 Requirement) */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#557184',
              maxWidth: '720px',
              margin: '0 auto 2.4rem',
              fontWeight: 400,
            }}
          >
            Buat, kelola, dan publikasikan website mikro profesional dengan bantuan AI.
            Tanpa perlu memahami coding.
          </p>

          {/* CTAs (Section 5.2 Requirement) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.1rem',
              marginBottom: '3.75rem',
            }}
          >
            <button
              onClick={() => onOpenAiWizard()}
              className="btn-lime"
              style={{
                padding: '0.95rem 2.2rem',
                fontSize: '1.02rem',
              }}
            >
              <span>Mulai Buat Website</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => scrollTo('how-it-works-section', 'cara-kerja')}
              className="btn-outline-navy"
              style={{
                padding: '0.95rem 2rem',
                fontSize: '1.02rem',
              }}
            >
              <span>Lihat Cara Kerja</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* ============================================================
              VISUAL MOCKUP PRODUK (Section 5.2 Requirement)
              - AI Chat Builder
              - Live Website Preview with Desktop/Mobile Switcher
              - Micro-Web Dashboard stats
             ============================================================ */}
          <div
            style={{
              width: '100%',
              maxWidth: '1080px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1px solid rgba(85, 113, 132, 0.18)',
              boxShadow:
                '0 32px 80px -16px rgba(16, 43, 63, 0.14), 0 8px 24px rgba(16, 43, 63, 0.05)',
              overflow: 'hidden',
              textAlign: 'left',
              position: 'relative',
            }}
          >
            {/* Mockup Browser Window Topbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                backgroundColor: '#F0F5EE',
                borderBottom: '1px solid rgba(85, 113, 132, 0.14)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              {/* URL Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  border: '1px solid rgba(85, 113, 132, 0.16)',
                  fontSize: '0.82rem',
                  color: '#557184',
                  fontFamily: 'monospace',
                }}
              >
                <Globe size={13} color="#102B3F" />
                <span style={{ color: '#102B3F', fontWeight: 600 }}>unilandfarm.id</span>
                <span>/site/alex-creative</span>
                <span
                  style={{
                    backgroundColor: '#EAF7D5',
                    color: '#102B3F',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    marginLeft: '4px',
                  }}
                >
                  LIVE
                </span>
              </div>

              {/* Device Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: previewDevice === 'desktop' ? '#102B3F' : 'transparent',
                    color: previewDevice === 'desktop' ? '#F8FAF7' : '#557184',
                  }}
                >
                  <Layout size={13} />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: previewDevice === 'mobile' ? '#102B3F' : 'transparent',
                    color: previewDevice === 'mobile' ? '#F8FAF7' : '#557184',
                  }}
                >
                  <Smartphone size={13} />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Mockup Main Workspace: Left AI Chat + Right Live Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: previewDevice === 'mobile' ? '1fr 360px' : '380px 1fr',
                minHeight: '440px',
                backgroundColor: '#FAFBF9',
              }}
              className="mockup-grid"
            >
              {/* Left Panel: Conversational AI Builder */}
              <div
                style={{
                  padding: '20px',
                  borderRight: '1px solid rgba(85, 113, 132, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid rgba(85, 113, 132, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: '#102B3F',
                          color: '#C6F36B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Sparkles size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#102B3F' }}>
                          UNI Agentic AI
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                          Online &amp; Siap Bantu
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#F0F5EE',
                        color: '#557184',
                        fontWeight: 600,
                      }}
                    >
                      v2.5
                    </span>
                  </div>

                  {/* Simulated Chat Messages */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* User Message */}
                    <div
                      style={{
                        alignSelf: 'flex-end',
                        backgroundColor: '#102B3F',
                        color: '#F8FAF7',
                        padding: '10px 14px',
                        borderRadius: '14px 14px 2px 14px',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        maxWidth: '90%',
                      }}
                    >
                      "Buatkan website portofolio UX designer modern, dengan showcase studi kasus dan kontak cepat."
                    </div>

                    {/* AI Response */}
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: '#F0F5EE',
                        color: '#102B3F',
                        padding: '12px 14px',
                        borderRadius: '14px 14px 14px 2px',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                        maxWidth: '95%',
                        border: '1px solid rgba(85, 113, 132, 0.12)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700, color: '#102B3F' }}>
                        <CheckCircle2 size={14} color="#10B981" />
                        <span>Website Mikro Berhasil Disusun:</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#557184' }}>
                        • Section Hero &amp; Headline personal<br />
                        • Grid Portofolio (4 Studi Kasus)<br />
                        • Integrasi Tautan Kontak Langsung
                      </div>
                    </div>

                    {/* AI Proposal Action Chip */}
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        backgroundColor: '#EAF7D5',
                        border: '1px solid rgba(198, 243, 107, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: '#102B3F',
                      }}
                    >
                      <span>Perubahan telah diterapkan ke preview live</span>
                      <span style={{ color: '#102B3F', fontWeight: 800 }}>Tersimpan ✓</span>
                    </div>
                  </div>
                </div>

                {/* Input Prompt Box in Mockup */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAF7',
                    border: '1.5px solid rgba(85, 113, 132, 0.18)',
                    marginTop: '16px',
                  }}
                >
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Ketik instruksi revisi..."
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '0.8rem',
                      color: '#102B3F',
                      flex: 1,
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#C6F36B',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#102B3F',
                      cursor: 'pointer',
                    }}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>

              {/* Right Panel: Live Multi-Device Micro-Web Preview */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F3F7F2',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: previewDevice === 'mobile' ? '300px' : '540px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1px solid rgba(85, 113, 132, 0.16)',
                    boxShadow: '0 12px 30px rgba(16, 43, 63, 0.08)',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Micro-Web Nav */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '18px',
                      paddingBottom: '10px',
                      borderBottom: '1px solid rgba(85, 113, 132, 0.1)',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#102B3F' }}>
                      Alex Pratama
                    </div>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        backgroundColor: '#C6F36B',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#102B3F',
                      }}
                    >
                      Hubungi Saya
                    </div>
                  </div>

                  {/* Micro-Web Hero */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#557184',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '4px',
                      }}
                    >
                      Senior Product Designer
                    </div>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#102B3F',
                        lineHeight: 1.25,
                        margin: '0 0 6px',
                      }}
                    >
                      Mendesain Pengalaman Digital yang Berdampak.
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#557184', margin: 0, lineHeight: 1.45 }}>
                      Membantu startup &amp; enterprise menyederhanakan produk kompleks menjadi antarmuka yang elegan.
                    </p>
                  </div>

                  {/* Portfolio Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAF7',
                        border: '1px solid rgba(85, 113, 132, 0.14)',
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>Fintech App</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#102B3F' }}>PayFlow Mobile</div>
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAF7',
                        border: '1px solid rgba(85, 113, 132, 0.14)',
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', color: '#3B82F6', fontWeight: 700 }}>SaaS Platform</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#102B3F' }}>CloudSync UI</div>
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      color: '#557184',
                      paddingTop: '8px',
                      borderTop: '1px dashed rgba(85, 113, 132, 0.2)',
                    }}
                  >
                    <span>✓ Dikelola via UNI-LANDFARM</span>
                    <span style={{ fontWeight: 600, color: '#102B3F' }}>Jakarta, ID</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5.3 PROBLEM SECTION (Master Requirement: Membangun Kehadiran Digital Seharusnya Tidak Rumit)
         ============================================================ */}
      <section
        id="problem-section"
        style={{
          padding: '6rem 0',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(85, 113, 132, 0.12)',
        }}
      >
        <div className="saas-container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 4rem' }}>
            <span
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#7B4B28',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 14px',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              Tantangan Saat Ini
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#102B3F',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem',
              }}
            >
              Membangun Kehadiran Digital Seharusnya Tidak Rumit.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#557184', lineHeight: 1.6, margin: 0 }}>
              Banyak individu, komunitas, dan penyedia layanan terhambat karena proses pembuatan website
              tradisional yang mahal, lambat, dan penuh kendala teknis.
            </p>
          </div>

          {/* 4 Problem vs Solusi Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                num: '01',
                problem: 'Informasi Tersebar Berantakan',
                problemDesc: 'Portofolio, link sosial, jadwal, dan kontak berada di platform berbeda tanpa satu titik temu.',
                solution: 'Satu Micro-Web Terpadu',
                solutionDesc: 'Satukan seluruh eksistensi digital Anda dalam satu link ringkas dan representatif.',
                icon: <Layers size={22} color="#102B3F" />,
              },
              {
                num: '02',
                problem: 'Tergantung pada Developer & Coding',
                problemDesc: 'Membuat website membutuhkan HTML, CSS, atau sewa developer dengan biaya yang mahal.',
                solution: 'Cukup Ceritakan ke AI',
                solutionDesc: 'AI Agentic CMS menyusun struktur, copywriting, dan desain visual secara otomatis.',
                icon: <MessageCircle size={22} color="#102B3F" />,
              },
              {
                num: '03',
                problem: 'Pembaruan Konten Makan Waktu',
                problemDesc: 'Mengedit teks atau foto memakan waktu berjam-jam dan harus mengerti dashboard rumit.',
                solution: 'Revisi Instan via Obrolan',
                solutionDesc: 'Perbarui isi halaman hanya dengan mengetikkan instruksi bahasa Indonesia alami.',
                icon: <RefreshCw size={22} color="#102B3F" />,
              },
              {
                num: '04',
                problem: 'Pengelolaan Teknis yang Pusing',
                problemDesc: 'Hosting, domain, responsivitas ponsel, dan pemeliharaan server sering membingungkan.',
                solution: 'One-Click Live Publishing',
                solutionDesc: 'Langsung terbit dengan subdomain cepat, aman, dan adaptif di layar smartphone.',
                icon: <Zap size={22} color="#102B3F" />,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="saas-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#EAF7D5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        color: 'rgba(85, 113, 132, 0.35)',
                        fontSize: '1.1rem',
                      }}
                    >
                      {card.num}
                    </span>
                  </div>

                  {/* Problem Callout */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#EF4444',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '4px',
                      }}
                    >
                      Kendala Klasik
                    </div>
                    <h3
                      style={{
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        color: '#102B3F',
                        margin: '0 0 6px',
                      }}
                    >
                      {card.problem}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#557184', margin: 0, lineHeight: 1.45 }}>
                      {card.problemDesc}
                    </p>
                  </div>
                </div>

                {/* Solution Box */}
                <div
                  style={{
                    backgroundColor: '#F8FAF7',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(198, 243, 107, 0.45)',
                    marginTop: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#102B3F',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '3px',
                    }}
                  >
                    <CheckCircle2 size={13} color="#10B981" />
                    <span>Solusi UNI-LANDFARM</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#102B3F', marginBottom: '3px' }}>
                    {card.solution}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#557184', lineHeight: 1.4 }}>
                    {card.solutionDesc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5.4 FEATURE SECTION (6 Fitur Unggulan Master Prompt)
         ============================================================ */}
      <section
        id="feature-section"
        style={{
          padding: '6rem 0',
          backgroundColor: '#F8FAF7',
          position: 'relative',
        }}
      >
        <div className="saas-container">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 4rem' }}>
            <span className="badge-lime" style={{ marginBottom: '1rem' }}>
              Fitur Platform
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#102B3F',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem',
              }}
            >
              Dirancang untuk Kecepatan, Kemudahan, dan Kualitas.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#557184', lineHeight: 1.6, margin: 0 }}>
              Semua kapabilitas yang Anda butuhkan untuk membangun, menyesuaikan, dan mempublikasikan
              kehadiran digital yang profesional.
            </p>
          </div>

          {/* 6 Feature Cards (Section 5.4 Requirement) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[
              {
                id: 'feat-1',
                title: 'AI Website Generator',
                desc: 'Generate struktur halaman, tata letak seksi, dan teks profesional secara otomatis dari instruksi bahasa alami.',
                badge: 'Agentic AI Core',
                icon: <Sparkles size={24} color="#102B3F" />,
              },
              {
                id: 'feat-2',
                title: 'Conversational Website Editor',
                desc: 'Revisi teks, ubah skema warna, ganti susunan modul, atau tambahkan seksi baru semudah mengirim pesan obrolan.',
                badge: 'Chat Revisions',
                icon: <MessageCircle size={24} color="#102B3F" />,
              },
              {
                id: 'feat-3',
                title: 'Instant Multi-Device Preview',
                desc: 'Simulasikan tampilan halaman website mikro secara langsung di layar desktop, tablet, dan smartphone sebelum dipublikasikan.',
                badge: 'Live Sync',
                icon: <Eye size={24} color="#102B3F" />,
              },
              {
                id: 'feat-4',
                title: 'One-Click Publishing',
                desc: 'Publikasikan website Anda ke alamat unik dalam hitungan detik. Cepat diakses, aman, dan siap dibagikan ke mana saja.',
                badge: 'Instant Live',
                icon: <Globe size={24} color="#102B3F" />,
              },
              {
                id: 'feat-5',
                title: 'Micro-Web Management',
                desc: 'Pantau status publikasi, kelola beberapa proyek website mikro, simpan riwayat versi, dan pulihkan draft sebelumnya kapan saja.',
                badge: 'Version Control',
                icon: <Layers size={24} color="#102B3F" />,
              },
              {
                id: 'feat-6',
                title: 'Responsive Website Templates',
                desc: 'Koleksi rancangan layout modular yang telah dioptimalkan untuk portofolio, organisasi, profil layanan, dan acara.',
                badge: 'Mobile Optimized',
                icon: <Smartphone size={24} color="#102B3F" />,
              },
            ].map((feature) => (
              <div
                key={feature.id}
                className="saas-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: '#EAF7D5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#102B3F',
                        backgroundColor: '#F0F5EE',
                        padding: '4px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#102B3F',
                      margin: '0 0 0.65rem',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: '#557184',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '1.5rem',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#102B3F',
                    cursor: 'pointer',
                  }}
                  onClick={() => onOpenAiWizard()}
                >
                  <span>Coba Fitur Ini</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5.5 HOW IT WORKS (3 Langkah: 01 Ceritakan, 02 Wujudkan, 03 Bagikan)
         ============================================================ */}
      <section
        id="how-it-works-section"
        style={{
          padding: '6rem 0',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(85, 113, 132, 0.12)',
        }}
      >
        <div className="saas-container">
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 4.5rem' }}>
            <span
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#102B3F',
                backgroundColor: '#EAF7D5',
                padding: '4px 14px',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              Alur Kerja Simpel
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#102B3F',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem',
              }}
            >
              Hanya Butuh Tiga Langkah Mudah.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#557184', lineHeight: 1.6, margin: 0 }}>
              Dari ide di kepala menjadi website mikro profesional yang siap dipublikasikan ke seluruh dunia.
            </p>
          </div>

          {/* 3 Step Flow Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              position: 'relative',
            }}
          >
            {[
              {
                step: '01',
                title: 'Ceritakan',
                subtitle: 'Jelaskan Kebutuhanmu',
                desc: 'Pengguna menjelaskan kebutuhan website melalui percakapan bahasa alami. Sebutkan nama, profil, tujuan, dan konten yang ingin dimuat.',
                tag: 'Input Natural Language',
                highlight: 'Tanpa form rumit',
              },
              {
                step: '02',
                title: 'Wujudkan',
                subtitle: 'AI Menyusun Website',
                desc: 'AI membantu menghasilkan struktur halaman, susunan seksi, konten teks persuasif, dan desain visual yang harmonis seketika.',
                tag: 'Agentic CMS Engine',
                highlight: 'Struktur & Copy Otomatis',
              },
              {
                step: '03',
                title: 'Bagikan',
                subtitle: 'Tinjau & Publikasikan',
                desc: 'Pengguna meninjau preview, menyetujui perubahan, dan mempublikasikan website dengan satu klik untuk mendapatkan URL unik siap pakai.',
                tag: 'One-Click Live',
                highlight: 'Langsung Online & Responsif',
              },
            ].map((stepItem, i) => (
              <div
                key={i}
                className="saas-card"
                style={{
                  padding: '2.5rem 2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Big Step Number Watermark */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    color: 'rgba(16, 43, 63, 0.05)',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {stepItem.step}
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#102B3F',
                      color: '#C6F36B',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {stepItem.step}
                  </div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#7B4B28',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '4px',
                    }}
                  >
                    {stepItem.subtitle}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#102B3F',
                      margin: '0 0 0.85rem',
                    }}
                  >
                    {stepItem.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: '#557184',
                      lineHeight: 1.6,
                      margin: '0 0 1.5rem',
                    }}
                  >
                    {stepItem.desc}
                  </p>

                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#F0F5EE',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#102B3F',
                      display: 'inline-block',
                    }}
                  >
                    ✓ {stepItem.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5.6 SHOWCASE SECTION (Contoh Website Mikro: Portfolio, Org, Event, Service)
         ============================================================ */}
      <section
        id="showcase-section"
        style={{
          padding: '6rem 0',
          backgroundColor: '#F8FAF7',
        }}
      >
        <div className="saas-container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span className="badge-lime" style={{ marginBottom: '1rem' }}>
              Inspirasi &amp; Contoh Nyata
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: '#102B3F',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem',
              }}
            >
              Website Mikro untuk Setiap Kebutuhan.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#557184', lineHeight: 1.6, margin: 0 }}>
              Dari profil personal hingga halaman konferensi, lihat bagaimana UNI-LANDFARM
              membantu menghadirkan identitas digital yang berkelas.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '3rem',
            }}
          >
            {[
              { id: 'all', label: 'Semua Contoh' },
              { id: 'portfolio', label: 'Personal Portfolio' },
              { id: 'organization', label: 'Organization Profile' },
              { id: 'event', label: 'Event Landing Page' },
              { id: 'service', label: 'Professional Service' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setShowcaseCategory(tab.id as any)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: showcaseCategory === tab.id ? '#102B3F' : 'rgba(85, 113, 132, 0.2)',
                  backgroundColor: showcaseCategory === tab.id ? '#102B3F' : '#FFFFFF',
                  color: showcaseCategory === tab.id ? '#F8FAF7' : '#557184',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Showcase Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredShowcases.map((item) => (
              <div
                key={item.id}
                className="saas-card"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Visual Top Preview Frame */}
                <div
                  style={{
                    backgroundColor: '#102B3F',
                    color: '#F8FAF7',
                    padding: '24px',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: item.accentColor,
                      opacity: 0.15,
                      filter: 'blur(30px)',
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#F8FAF7',
                      }}
                    >
                      {item.icon}
                      <span>{item.categoryLabel}</span>
                    </span>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#C6F36B',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                      }}
                    >
                      /site/{item.slug}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#7E97A7', marginBottom: '4px' }}>
                      {item.stats}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.3,
                      }}
                    >
                      "{item.heroPreview}"
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: '1.75rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#102B3F',
                      margin: '0 0 0.5rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#557184',
                      lineHeight: 1.5,
                      margin: '0 0 1.25rem',
                    }}
                  >
                    {item.tagline}
                  </p>

                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                    {item.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.74rem',
                          backgroundColor: '#F0F5EE',
                          color: '#102B3F',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontWeight: 500,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(85, 113, 132, 0.12)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenPublicView(item.slug)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#102B3F',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0,
                      }}
                    >
                      <span>Lihat Demo</span>
                      <ExternalLink size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenAiWizard(item.title)}
                      className="btn-lime"
                      style={{
                        padding: '0.45rem 1.1rem',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span>Gunakan Konsep Ini</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5.7 FINAL CALL TO ACTION (Master Requirement)
          Headline: Saatnya Hadir Secara Digital dengan Cara yang Lebih Mudah.
          CTA: Mulai Bersama UNI-LANDFARM
         ============================================================ */}
      <section
        style={{
          padding: '6rem 0',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div className="saas-container">
          <div
            style={{
              backgroundColor: '#102B3F',
              borderRadius: '36px',
              padding: '4.5rem 2.5rem',
              color: '#F8FAF7',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 60px -12px rgba(16, 43, 63, 0.25)',
            }}
          >
            {/* Ambient Corner Glows */}
            <div
              style={{
                position: 'absolute',
                top: '-40%',
                left: '-20%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                backgroundColor: 'rgba(198, 243, 107, 0.16)',
                filter: 'blur(70px)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-40%',
                right: '-20%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                filter: 'blur(70px)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 5, maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(198, 243, 107, 0.15)',
                    border: '1px solid rgba(198, 243, 107, 0.4)',
                    color: '#C6F36B',
                    padding: '5px 16px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    display: 'inline-block',
                  }}
                >
                  Mulai Langkah Digital Anda Hari Ini
                </span>
              </div>

              {/* Master Headline (Section 5.7 Requirement) */}
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.2rem, 4.4vw, 3.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: '0 0 1.25rem',
                  color: '#F8FAF7',
                }}
              >
                Saatnya Hadir Secara Digital dengan Cara yang Lebih Mudah.
              </h2>

              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'rgba(248, 250, 247, 0.75)',
                  margin: '0 auto 2.5rem',
                  maxWidth: '580px',
                }}
              >
                Ceritakan ide dan identitas Anda. Biarkan AI menyusun website mikro yang siap
                mewakili Anda atau organisasi Anda di internet.
              </p>

              {/* Master CTA (Section 5.7 Requirement) */}
              <button
                onClick={() => onOpenAiWizard()}
                className="btn-lime"
                style={{
                  padding: '1.05rem 2.6rem',
                  fontSize: '1.08rem',
                }}
              >
                <Sparkles size={20} />
                <span>Mulai Bersama UNI-LANDFARM</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  marginTop: '2rem',
                  fontSize: '0.82rem',
                  color: 'rgba(248, 250, 247, 0.6)',
                }}
              >
                <span>✓ Tanpa Kartu Kredit</span>
                <span>✓ Gratis Akun Eksplorasi</span>
                <span>✓ Live dalam 2 Menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5.8 FOOTER (Brand Logo, Tagline, Navigation, Platform, Legal)
         ============================================================ */}
      <footer
        style={{
          backgroundColor: '#0A1C2A',
          color: '#F8FAF7',
          padding: '4.5rem 0 2.5rem',
          borderTop: '1px solid rgba(85, 113, 132, 0.2)',
        }}
      >
        <div className="saas-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '3rem',
              paddingBottom: '3.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Brand Column */}
            <div style={{ maxWidth: '340px' }}>
              <UniLandLogo size="md" variant="dark" showTagline={true} style={{ marginBottom: '14px' }} />
              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'rgba(248, 250, 247, 0.65)',
                  margin: '0 0 1.25rem',
                }}
              >
                Platform pembuatan dan pengelolaan website mikro berbasis AI dengan pendekatan
                Agentic AI Content Management System.
              </p>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#C6F36B',
                  fontWeight: 600,
                }}
              >
                Tagline: Ceritakan. Wujudkan. Bagikan.
              </div>
            </div>

            {/* Product Navigation */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#F8FAF7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1.25rem',
                }}
              >
                Produk
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'AI Website Generator', target: 'feature-section' },
                  { label: 'Conversational Editor', target: 'feature-section' },
                  { label: 'Multi-Device Preview', target: 'hero-section' },
                  { label: 'One-Click Publishing', target: 'feature-section' },
                  { label: 'Micro-Web Management', target: 'feature-section' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.target, 'fitur')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'rgba(248, 250, 247, 0.7)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro-Web Showcase */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#F8FAF7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1.25rem',
                }}
              >
                Contoh Halaman
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Personal Portfolio', cat: 'portfolio' },
                  { label: 'Organization Profile', cat: 'organization' },
                  { label: 'Event Landing Page', cat: 'event' },
                  { label: 'Professional Service', cat: 'service' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowcaseCategory(item.cat as any);
                        scrollTo('showcase-section', 'contoh');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: 'rgba(248, 250, 247, 0.7)',
                        fontSize: '0.86rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform & Academic Info */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#F8FAF7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '1.25rem',
                }}
              >
                Informasi Proyek
              </div>
              <p
                style={{
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  color: 'rgba(248, 250, 247, 0.65)',
                  margin: '0 0 10px',
                }}
              >
                Tugas Akhir Mahasiswa Program Studi Sistem Informasi.
                Fokus pada inovasi Agentic AI CMS untuk efisiensi digital presence.
              </p>
              <div style={{ fontSize: '0.82rem', color: '#7E97A7' }}>
                Status Sistem: <span style={{ color: '#10B981', fontWeight: 600 }}>● Operasional</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div
            style={{
              paddingTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.8rem',
              color: 'rgba(248, 250, 247, 0.5)',
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} UNI-LANDFARM. Hak Cipta Dilindungi Undang-Undang.
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                style={{ background: 'none', border: 'none', color: 'rgba(248,250,247,0.7)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                style={{ background: 'none', border: 'none', color: 'rgba(248,250,247,0.7)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Daftar Baru
              </button>
              <button
                type="button"
                onClick={() => scrollTo('hero-section', 'beranda')}
                style={{ background: 'none', border: 'none', color: '#C6F36B', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Kembali ke Atas ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
