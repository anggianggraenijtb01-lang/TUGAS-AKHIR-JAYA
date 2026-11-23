import React, { useState } from 'react';
import { User } from '../types';
import {
  UserIcon,
  Shield,
  Coins,
  LogOut,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from './icons/LucideIcons';

interface ProfilePageViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

export const ProfilePageView: React.FC<ProfilePageViewProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
}) => {
  // Edit Profile Form State
  const [name, setName] = useState(currentUser.name || '');
  const [businessName, setBusinessName] = useState(currentUser.businessName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Logout Confirmation Modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    setTimeout(() => {
      setIsSavingProfile(false);
      const updated: User = {
        ...currentUser,
        name: name.trim(),
        businessName: businessName.trim(),
        phoneNumber: phoneNumber.trim(),
      };
      onUpdateUser(updated);
      setProfileSuccessMsg('Profil akun berhasil diperbarui!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    }, 600);
  };

  // Handle Password Update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Mohon isi seluruh bidang kata sandi.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordSuccess('Kata sandi berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3500);
    }, 700);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
          Profil Akun &amp; Keamanan
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#687A4D', margin: '4px 0 0' }}>
          Kelola data identitas bisnis, informasi kontak, dan keamanan akun Anda.
        </p>
      </div>

      {/* Account Overview Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #D5CDB8',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Avatar Monogram */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#102B22',
              color: '#F4C744',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.6rem',
            }}
          >
            {(name || currentUser.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
                {name || currentUser.name}
              </h2>
              {/* Role badge (read only) */}
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {currentUser.role === 'ADMIN' ? 'Admin' : 'Mitra UMKM'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#62685E', marginTop: '4px' }}>
              {currentUser.email} • {businessName || currentUser.businessName || 'Toko Digital'}
            </div>
          </div>
        </div>

        {/* Token Balance Pill */}
        <div
          style={{
            background: '#F7F5EE',
            border: '1px solid #E5E0D0',
            borderRadius: '12px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Coins size={20} color="#D97706" />
          <div>
            <div style={{ fontSize: '0.7rem', color: '#687A4D', fontWeight: 600 }}>Saldo Token Aktif</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B22' }}>
              {currentUser.tokenBalance} Token
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Data Profil */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #D5CDB8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <UserIcon size={20} color="#102B22" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
              Informasi Pengguna &amp; Bisnis
            </h3>
          </div>

          {profileSuccessMsg && (
            <div
              style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  fontSize: '0.86rem',
                  color: '#102B22',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                Email (Terdaftar)
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                title="Email akun tidak dapat diubah secara mandiri untuk alasan keamanan."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #E5E0D0',
                  fontSize: '0.86rem',
                  color: '#62685E',
                  background: '#F7F5EE',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#687A4D', marginTop: '4px', display: 'block' }}>
                Email terdaftar di sistem backend.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                Nama Usaha / Toko
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Kopi Robusta Slamet"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  fontSize: '0.86rem',
                  color: '#102B22',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                Nomor WhatsApp Toko
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  fontSize: '0.86rem',
                  color: '#102B22',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              style={{
                marginTop: '10px',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#102B22',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.15s ease',
              }}
            >
              <Check size={16} />
              <span>{isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Keamanan & Ganti Sandi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #D5CDB8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Shield size={20} color="#102B22" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
                Pengaturan Keamanan
              </h3>
            </div>

            {passwordError && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div
                style={{
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D5CDB8',
                    fontSize: '0.86rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D5CDB8',
                    fontSize: '0.86rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#102B22', marginBottom: '6px' }}>
                  Ulangi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #D5CDB8',
                    fontSize: '0.86rem',
                    color: '#102B22',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                style={{
                  marginTop: '8px',
                  padding: '11px 18px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  background: '#F7F5EE',
                  color: '#102B22',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{isSavingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
              </button>
            </form>
          </div>

          {/* Danger Zone: Logout Button */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px 28px',
              border: '1px solid #FCA5A5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#991B1B' }}>Sesi Akun</div>
              <div style={{ fontSize: '0.78rem', color: '#687A4D' }}>
                Akhiri sesi kerja dan keluar dari akun ini.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <LogOut size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B22', margin: '0 0 8px' }}>
              Konfirmasi Keluar Akun
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#62685E', margin: '0 0 24px', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin keluar dari akun <strong>{currentUser.name}</strong>? Anda harus masuk kembali untuk mengelola website Anda.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  color: '#202720',
                }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#B91C1C',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                }}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
