import React, { useState } from 'react';
import { User } from '../types';
import { initialCurrentUser, adminUser } from '../services/mockData';
import { UniLandLogo } from './UniLandLogo';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, Loader2, Sparkles } from './icons/LucideIcons';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToHome: () => void;
  initialMode?: 'login' | 'register';
  prefilledBusinessName?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToHome,
  initialMode = 'login',
  prefilledBusinessName = '',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState(prefilledBusinessName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google OAuth Social Login simulation
  const handleGoogleLogin = () => {
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Autentikasi Google berhasil. Mengalihkan ke dashboard...');
      setTimeout(() => {
        const googleUser: User = {
          id: 'usr_google_' + Date.now(),
          name: name || 'Pengguna UNI-LANDFARM',
          email: email || 'user@gmail.com',
          businessName: businessName || 'Proyek Website Mikro',
          role: 'CLIENT',
          status: 'ACTIVE',
          tokenBalance: 250,
          createdAt: new Date().toISOString(),
        };
        onLoginSuccess(googleUser);
      }, 500);
    }, 600);
  };

  const handleQuickDemoFill = (type: 'umkm' | 'admin') => {
    setErrorMsg('');
    setMode('login');
    if (type === 'admin') {
      setEmail('admin@unilandfarm.id');
      setPassword('admin123');
    } else {
      setEmail('budi.santoso@kebunlestari.id');
      setPassword('umkm123');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter.');
      return;
    }
    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Silakan masukkan nama lengkap Anda.');
        return;
      }
      if (!businessName.trim()) {
        setErrorMsg('Silakan masukkan nama website atau identitas Anda.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(
        mode === 'login'
          ? 'Masuk berhasil! Membuka sesi kerja...'
          : 'Pendaftaran berhasil! Menyiapkan dashboard...'
      );

      setTimeout(() => {
        if (email.toLowerCase().includes('admin')) {
          onLoginSuccess(adminUser);
        } else {
          const loggedUser: User = {
            ...initialCurrentUser,
            id: mode === 'register' ? `usr_${Date.now()}` : initialCurrentUser.id,
            email,
            name: name || initialCurrentUser.name,
            businessName: businessName || initialCurrentUser.businessName,
          };
          onLoginSuccess(loggedUser);
        }
      }, 500);
    }, 650);
  };

  return (
    <div
      className="saas-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#F8FAF7',
      }}
    >
      <div className="eloq-hero-grid-bg" />
      <div className="eloq-aurora-orb-1" />
      <div className="eloq-aurora-orb-2" />

      {/* Top Header */}
      <header
        className="saas-container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '20px',
          paddingBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div onClick={onBackToHome} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <UniLandLogo size="md" variant="light" />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="btn-outline-navy"
          style={{
            padding: '0.52rem 1.2rem',
            fontSize: '0.84rem',
          }}
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Beranda</span>
        </button>
      </header>

      {/* Main Centered Studio Card */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 20px 48px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div className="eloq-auth-card">
          {/* ============================================================
              LEFT INSET ISLAND: CLEAN VISUAL SHOWCASE (NO EXCESSIVE TEXT)
             ============================================================ */}
          <div
            style={{
              borderRadius: '24px',
              backgroundColor: '#102B3F',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Background Professional Showcase Image */}
            <img
              src="/assets/auth_umkm_products.jpg"
              alt="UNI-LANDFARM Showcase"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: 0.88,
              }}
            />

            {/* Gradient Overlay for Sleek Contrast */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(16, 43, 63, 0.4) 0%, rgba(16, 43, 63, 0.2) 40%, rgba(16, 43, 63, 0.88) 100%)',
              }}
            />

            {/* Top Badge */}
            <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(16, 43, 63, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(198, 243, 107, 0.45)',
                  color: '#C6F36B',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                <Sparkles size={13} color="#C6F36B" />
                <span>UNI-LANDFARM Studio</span>
              </span>
            </div>

            {/* Bottom Minimalist Tagline Overlay (No Wall of Text) */}
            <div style={{ position: 'relative', zIndex: 2, padding: '24px', color: '#F8FAF7' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.25,
                  marginBottom: '6px',
                }}
              >
                Ceritakan. Wujudkan. Bagikan.
              </div>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'rgba(248, 250, 247, 0.82)',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                Platform pembuatan website mikro profesional berbasis AI untuk portofolio, organisasi, dan identitas digital.
              </p>
            </div>
          </div>

          {/* ============================================================
              RIGHT FORM PANEL: CLEAN SAAS FORM
             ============================================================ */}
          <div
            style={{
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Top Mode Segmented Switcher Pill */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#F0F5EE',
                padding: '4px',
                borderRadius: '999px',
                alignSelf: 'flex-start',
                marginBottom: '18px',
                border: '1px solid rgba(85, 113, 132, 0.16)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  padding: '6px 18px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'login' ? '#102B3F' : 'transparent',
                  color: mode === 'login' ? '#F8FAF7' : '#557184',
                  transition: 'all 0.25s ease',
                }}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  padding: '6px 18px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === 'register' ? '#102B3F' : 'transparent',
                  color: mode === 'register' ? '#F8FAF7' : '#557184',
                  transition: 'all 0.25s ease',
                }}
              >
                Daftar Baru
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div style={{ marginBottom: '18px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#102B3F',
                  margin: 0,
                  letterSpacing: '-0.025em',
                }}
              >
                {mode === 'login' ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}
              </h2>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: '#557184',
                  margin: '4px 0 0',
                  lineHeight: 1.45,
                }}
              >
                {mode === 'login'
                  ? 'Masuk untuk mengelola website mikro dan asisten AI Anda.'
                  : 'Daftar gratis untuk mulai mewujudkan website mikro profesional.'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '14px',
                border: '1.5px solid rgba(85, 113, 132, 0.2)',
                background: '#FFFFFF',
                color: '#102B3F',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 8px rgba(16, 43, 63, 0.04)',
                marginBottom: '16px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0 0 16px',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(85, 113, 132, 0.16)' }} />
              <span style={{ fontSize: '0.76rem', color: '#7E97A7', fontWeight: 500 }}>
                atau gunakan email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(85, 113, 132, 0.16)' }} />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  fontSize: '0.82rem',
                  color: '#DC2626',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Feedback */}
            {successMsg && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.28)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                  fontSize: '0.82rem',
                  color: '#15803D',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form
              onSubmit={handleFormSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {mode === 'register' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: '10px',
                  }}
                >
                  <div>
                    <label
                      htmlFor="auth-fullname"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#102B3F',
                        marginBottom: '4px',
                      }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      placeholder="Nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="eloq-auth-input"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="auth-bizname"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#102B3F',
                        marginBottom: '4px',
                      }}
                    >
                      Nama Website / Proyek
                    </label>
                    <input
                      id="auth-bizname"
                      type="text"
                      placeholder="Contoh: Alex Studio"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      disabled={isSubmitting}
                      className="eloq-auth-input"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#102B3F',
                    marginBottom: '4px',
                  }}
                >
                  Alamat Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="eloq-auth-input"
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <label
                    htmlFor="auth-password"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#102B3F',
                    }}
                  >
                    Kata Sandi
                  </label>
                  {mode === 'login' && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#557184',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() => alert('Instruksi reset sandi dapat dikirimkan ke email terdaftar.')}
                    >
                      Lupa sandi?
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="eloq-auth-input"
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#7E97A7',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Credentials */}
              {mode === 'login' && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    paddingTop: '2px',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', color: '#7E97A7' }}>Akses Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('umkm')}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(85, 113, 132, 0.25)',
                      backgroundColor: '#F0F5EE',
                      color: '#102B3F',
                      cursor: 'pointer',
                    }}
                  >
                    Akun Pengguna
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('admin')}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(85, 113, 132, 0.25)',
                      backgroundColor: '#F0F5EE',
                      color: '#102B3F',
                      cursor: 'pointer',
                    }}
                  >
                    Akun Admin
                  </button>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-lime"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '12px 20px',
                  fontSize: '0.96rem',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Memproses...</span>
                  </>
                ) : mode === 'login' ? (
                  <span>Masuk ke Dashboard ↗</span>
                ) : (
                  <span>Daftar Akun Baru ↗</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ============================================================
          FOOTER ON AUTH PAGE (Requested explicitly by user)
         ============================================================ */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#0A1C2A',
          borderTop: '1px solid rgba(85, 113, 132, 0.2)',
          padding: '18px 24px',
          color: '#F8FAF7',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          className="saas-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <UniLandLogo size="sm" variant="dark" />

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(248, 250, 247, 0.7)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: 0,
              }}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: mode === 'login' ? '#C6F36B' : 'rgba(248, 250, 247, 0.7)',
                fontWeight: mode === 'login' ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: 0,
              }}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: mode === 'register' ? '#C6F36B' : 'rgba(248, 250, 247, 0.7)',
                fontWeight: mode === 'register' ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: 0,
              }}
            >
              Daftar Baru
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'rgba(248, 250, 247, 0.5)' }}>
            &copy; {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
