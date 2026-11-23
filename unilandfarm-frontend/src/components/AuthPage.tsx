import React, { useState } from 'react';
import { User } from '../types';
import { initialCurrentUser, adminUser } from '../services/mockData';
import { UniLandLogo } from './UniLandLogo';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle, Loader2 } from './icons/LucideIcons';

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

  // Google OAuth Social Login
  const handleGoogleLogin = () => {
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Autentikasi Google berhasil. Mengalihkan ke dashboard...');
      setTimeout(() => {
        const googleUser: User = {
          id: 'usr_google_' + Date.now(),
          name: name || 'Mitra UMKM UniLand',
          email: email || 'mitra.umkm@gmail.com',
          businessName: businessName || 'Toko Digital UMKM',
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
        setErrorMsg('Silakan masukkan nama usaha atau toko Anda.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(
        mode === 'login'
          ? 'Masuk berhasil! Membuka sesi kerja...'
          : 'Pendaftaran berhasil! Menyiapkan dashboard toko...'
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
      className="eloq-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Living Background Aurora Orbs & Architectural Grid */}
      <div className="eloq-hero-grid-bg" />
      <div className="eloq-aurora-orb-1" />
      <div className="eloq-aurora-orb-2" />

      {/* Top Minimal Header */}
      <header
        className="eloq-container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '22px',
          paddingBottom: '12px',
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
          className="eloq-btn-outline"
          style={{
            padding: '0.58rem 1.25rem',
            fontSize: '0.86rem',
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
          padding: '16px 20px 44px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div className="eloq-auth-card eloq-reveal-1">
          {/* ============================================================
              LEFT INSET ISLAND: PROFESSIONAL UMKM PRODUCT SHOWCASE IMAGE
             ============================================================ */}
          <div
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(150deg, #18261a 0%, #233726 52%, #3d5a37 100%)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '520px',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.18)',
            }}
          >
            <img
              src="/assets/auth_umkm_products.jpg"
              alt="Produk Pangan & Alami Mitra UMKM Nusantara"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </div>

          {/* ============================================================
              RIGHT FORM PANEL: CLEAN ELOQWNT FORM + GREEN GRADIENT CTA
             ============================================================ */}
          <div
            style={{
              padding: '32px 34px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Top Mode Segmented Switcher Pill */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: '#eef3eb',
                padding: '4px',
                borderRadius: '999px',
                alignSelf: 'flex-start',
                marginBottom: '20px',
                border: '1px solid rgba(61, 90, 55, 0.14)',
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
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    mode === 'login'
                      ? 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 78%, #a87f2e 100%)'
                      : 'transparent',
                  color: mode === 'login' ? '#ffffff' : '#4a554c',
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
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    mode === 'register'
                      ? 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 78%, #a87f2e 100%)'
                      : 'transparent',
                  color: mode === 'register' ? '#ffffff' : '#4a554c',
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
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#0b1710',
                  margin: 0,
                  letterSpacing: '-0.03em',
                }}
              >
                {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Toko Baru'}
              </h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#5b6960',
                  margin: '4px 0 0',
                  lineHeight: 1.45,
                }}
              >
                {mode === 'login'
                  ? 'Masuk untuk mengelola katalog produk dan asisten AI toko Anda.'
                  : 'Lengkapi data singkat di bawah untuk langsung membuat website UMKM.'}
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
                border: '1.5px solid rgba(20, 60, 35, 0.14)',
                background: '#ffffff',
                color: '#0b1710',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 8px rgba(15, 42, 25, 0.04)',
                marginBottom: '16px',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = '#1d5634';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.borderColor = 'rgba(20, 60, 35, 0.14)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
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
              <div style={{ flex: 1, height: '1px', background: 'rgba(20, 60, 35, 0.1)' }} />
              <span style={{ fontSize: '0.76rem', color: '#6c7c72', fontWeight: 500 }}>
                atau gunakan email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(20, 60, 35, 0.1)' }} />
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
                gap: '13px',
              }}
            >
              {mode === 'register' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <label
                      htmlFor="auth-fullname"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#1e3326',
                        marginBottom: '5px',
                      }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      placeholder="Budi Prasetyo"
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
                        color: '#1e3326',
                        marginBottom: '5px',
                      }}
                    >
                      Nama Usaha / Toko
                    </label>
                    <input
                      id="auth-bizname"
                      type="text"
                      placeholder="Kopi Robusta Slamet"
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
                    color: '#1e3326',
                    marginBottom: '5px',
                  }}
                >
                  Alamat Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="nama@bisnis.com"
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
                    marginBottom: '5px',
                  }}
                >
                  <label
                    htmlFor="auth-password"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#1e3326',
                    }}
                  >
                    Kata Sandi
                  </label>
                  {mode === 'login' && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#3d5a37',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        alert(
                          'Untuk keamanan akun UMKM Anda, reset kata sandi dapat dilakukan melalui email terdaftar.'
                        )
                      }
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
                      color: '#6c7c72',
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

              {/* Quick Demo Credentials Helper */}
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
                  <span style={{ fontSize: '0.74rem', color: '#6c7c72' }}>Akses Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('umkm')}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(123, 75, 40, 0.25)',
                      backgroundColor: '#f7f4ed',
                      color: '#422a18',
                      cursor: 'pointer',
                    }}
                  >
                    Akun Mitra UMKM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('admin')}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(123, 75, 40, 0.25)',
                      backgroundColor: '#f7f4ed',
                      color: '#422a18',
                      cursor: 'pointer',
                    }}
                  >
                    Akun Super Admin
                  </button>
                </div>
              )}

              {/* Submit Button with Warm Gold + Deep Pine Gradient */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="eloq-btn-grey"
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '13px 20px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 80%, #c98a2c 100%)',
                  boxShadow:
                    '0 10px 24px -4px rgba(35, 55, 38, 0.42), 0 0 16px rgba(229, 172, 50, 0.22)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Memproses...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <span>↗</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <span>↗</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ============================================================
          BOTTOM FOOTER: UNIFIED WITH ADMIN & LANDING PAGE DESIGN
         ============================================================ */}
      <footer
        style={{
          marginTop: 'auto',
          background: 'linear-gradient(160deg, #1c2d1f 0%, #142217 60%, #0d170f 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 28px',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            maxWidth: '1240px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <UniLandLogo size="sm" variant="dark" />

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.75)',
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
                color: mode === 'login' ? '#ffffff' : 'rgba(255,255,255,0.75)',
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
                color: mode === 'register' ? '#ffffff' : 'rgba(255,255,255,0.75)',
                fontWeight: mode === 'register' ? 700 : 400,
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: 0,
              }}
            >
              Daftar Baru
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            &copy; {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
