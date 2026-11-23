import React from 'react';
import { User } from '../types';
import { UniLandLogo } from './UniLandLogo';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenTopUp: () => void;
  onOpenAiWizard: () => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
  activeView: string;
  setActiveView: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenTopUp,
  onOpenAiWizard,
  activeView,
  setActiveView,
}) => {
  return (
    <header
      style={{
        position: 'fixed',
        top: '16px',
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          background: 'rgba(14, 25, 17, 0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(110, 136, 84, 0.24)',
          borderRadius: '9999px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          boxShadow: '0 12px 40px rgba(10, 20, 12, 0.45)',
          maxWidth: '960px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <UniLandLogo size="sm" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }} />

        {/* Public Visitor Nav Links */}
        {!currentUser && (
          <>
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
              }}
              className="hide-mobile"
            >
              {[
                { label: 'Home', href: '#home' },
                { label: 'Tentang', href: '#tentang' },
                { label: 'Layanan', href: '#services' },
                { label: 'Tim Ahli', href: '#experts' },
                { label: 'Testimoni', href: '#testimoni' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    color: '#9E9EA8',
                    fontWeight: 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E5AC32')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9EA8')}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onOpenAuthModal('login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E5AC32')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Masuk
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  background: '#E5AC32',
                  color: '#102B3F',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D49A24';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E5AC32';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>Mulai Gratis</span>
              </button>
            </div>
          </>
        )}

        {/* Logged in as Client */}
        {currentUser && currentUser.role === 'CLIENT' && (
          <>
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
              }}
            >
              <button
                onClick={() => setActiveView('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'home' ? '#E5AC32' : '#9E9EA8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Home
              </button>
              <button
                onClick={() => setActiveView('cms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'cms' ? '#E5AC32' : '#9E9EA8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Dashboard CMS
              </button>
              <button
                onClick={() => setActiveView('billing')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'billing' ? '#E5AC32' : '#9E9EA8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Billing & Paket
              </button>
              <button
                onClick={onOpenAiWizard}
                style={{
                  background: 'rgba(229, 172, 50, 0.16)',
                  border: '1px solid rgba(229, 172, 50, 0.35)',
                  color: '#E5AC32',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                ✨ Buat Web AI
              </button>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={onOpenTopUp}
                style={{
                  background: 'rgba(229, 172, 50, 0.16)',
                  border: '1px solid rgba(229, 172, 50, 0.3)',
                  color: '#E5AC32',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
                title="Top Up Token"
              >
                🪙 {currentUser.tokenBalance} Token
              </button>
              <span
                style={{
                  fontSize: '0.82rem',
                  color: '#FFFFFF',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                }}
              >
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9E9EA8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Keluar
              </button>
            </div>
          </>
        )}

        {/* Logged in as Admin */}
        {currentUser && currentUser.role === 'ADMIN' && (
          <>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setActiveView('admin')}
                style={{
                  background: activeView === 'admin' ? 'rgba(229, 172, 50, 0.16)' : 'none',
                  border: 'none',
                  color: activeView === 'admin' ? '#E5AC32' : '#9E9EA8',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                🛡️ Admin Panel
              </button>
              <button
                onClick={() => setActiveView('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'home' ? '#E5AC32' : '#9E9EA8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Landing
              </button>
              <button
                onClick={() => setActiveView('cms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeView === 'cms' ? '#E5AC32' : '#9E9EA8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                CMS
              </button>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#E5AC32',
                  background: 'rgba(229, 172, 50, 0.16)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                }}
              >
                Admin
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9E9EA8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
