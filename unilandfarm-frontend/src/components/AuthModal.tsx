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
        backgroundColor: 'rgba(16, 43, 34, 0.65)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '36px 32px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(16, 43, 34, 0.1)',
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
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            color: '#64748B',
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
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#102B22',
              marginBottom: '6px',
            }}
          >
            {mode === 'login' ? 'Masuk ke Akun Toko' : 'Daftar Akun Baru'}
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
            {mode === 'login'
              ? 'Kelola landing page dan gunakan Agentic AI untuk bisnis UMKM Anda.'
              : 'Daftar gratis untuk mulai mengelola website bisnis Anda.'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            background: '#F5F2EA',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid rgba(123, 75, 40, 0.12)',
          }}
        >
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            type="button"
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#1c2d1f' : '#6b7266',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Masuk
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            type="button"
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#1c2d1f' : '#6b7266',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Daftar Baru
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#DC2626',
              fontSize: '0.82rem',
              marginBottom: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Alamat Email
              </label>
              <input
                type="email"
                required
                placeholder="nama@bisnis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Kata Sandi
              </label>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 80%, #c98a2c 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(35, 55, 38, 0.3), 0 0 12px rgba(229, 172, 50, 0.2)',
                cursor: 'pointer',
              }}
            >
              Masuk ke Akun
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Nama Usaha / Toko
              </label>
              <input
                type="text"
                placeholder="Nama Usaha Anda"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Alamat Email
              </label>
              <input
                type="email"
                required
                placeholder="nama@bisnis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Kata Sandi
              </label>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #1f3021 0%, #354a32 45%, #6E8854 80%, #c98a2c 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(35, 55, 38, 0.3), 0 0 12px rgba(229, 172, 50, 0.2)',
                cursor: 'pointer',
              }}
            >
              Daftar Sekarang
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
