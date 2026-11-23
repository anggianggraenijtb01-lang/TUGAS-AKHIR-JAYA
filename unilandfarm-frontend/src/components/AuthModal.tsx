import React, { useState } from 'react';
import { User } from '../types';
import { initialCurrentUser, adminUser } from '../services/mockData';
import { UniLandLogo } from './UniLandLogo';
import { X, AlertTriangle, CheckCircle2 } from './icons/LucideIcons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
  prefilledBusinessName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  prefilledBusinessName = '',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState(prefilledBusinessName);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Mohon lengkapi alamat email dan kata sandi.');
      return;
    }
    setErrorMsg('');
    if (email.toLowerCase().includes('admin')) {
      onLoginSuccess(adminUser);
    } else {
      const loggedUser: User = {
        ...initialCurrentUser,
        email,
        name: name || initialCurrentUser.name,
      };
      onLoginSuccess(loggedUser);
    }
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Mohon isi semua data untuk pendaftaran.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter.');
      return;
    }
    setErrorMsg('');
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      businessName: businessName || name,
      role: 'CLIENT',
      status: 'ACTIVE',
      tokenBalance: 200,
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(16, 43, 63, 0.65)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px 32px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 24px 60px rgba(16, 43, 63, 0.2)',
          border: '1px solid rgba(85, 113, 132, 0.16)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F0F5EE',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            color: '#557184',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <UniLandLogo size="sm" variant="light" />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#102B3F',
              marginBottom: '6px',
            }}
          >
            {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#557184', margin: 0 }}>
            {mode === 'login'
              ? 'Kelola website mikro Anda dengan bantuan Agentic AI.'
              : 'Daftar gratis untuk mulai membuat website mikro Anda.'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            backgroundColor: '#F0F5EE',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'login' ? '#102B3F' : 'transparent',
              color: mode === 'login' ? '#F8FAF7' : '#557184',
              transition: 'all 0.2s',
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'register' ? '#102B3F' : 'transparent',
              color: mode === 'register' ? '#F8FAF7' : '#557184',
              transition: 'all 0.2s',
            }}
          >
            Daftar
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '16px',
              fontSize: '0.82rem',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <button
              type="submit"
              className="btn-lime"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '6px',
              }}
            >
              Masuk ke Akun
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Nama Website / Usaha
              </label>
              <input
                type="text"
                placeholder="Contoh: Alex Design Studio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#102B3F',
                  marginBottom: '6px',
                }}
              >
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="eloq-auth-input"
              />
            </div>
            <button
              type="submit"
              className="btn-lime"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '6px',
              }}
            >
              Daftar Sekarang
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(85, 113, 132, 0.14)',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#7E97A7',
          }}
        >
          &copy; {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
        </div>
      </div>
    </div>
  );
};
