import React, { useState } from 'react';
import { Plan, BillingInterval, PaymentMethod, User, Order } from '../types';
import { createOrder } from '../services/api';
import { UniLandLogo } from './UniLandLogo';

interface CheckoutPageProps {
  plan: Plan;
  billingInterval: BillingInterval;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onProceedToPayment: (order: Order) => void;
  onBackToPricing: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  plan,
  billingInterval,
  currentUser,
  onOpenAuth,
  onProceedToPayment,
  onBackToPricing,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Authoritative server-side price calculation
  const subtotal = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const taxAmount = 0; // PPN 0% untuk paket UMKM
  const totalAmount = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const order = await createOrder({
        userId: currentUser.id,
        planId: plan.id,
        billingInterval,
        paymentMethod: selectedMethod,
      });

      onProceedToPayment(order);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses pesanan. Silakan coba beberapa saat lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF8F2', minHeight: '100vh', color: '#202720', padding: '40px 16px' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
          <UniLandLogo size="sm" variant="light" onClick={onBackToPricing} style={{ cursor: 'pointer' }} />
          <button
            onClick={onBackToPricing}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#62685E',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Kembali ke Pilihan Paket
          </button>
        </div>

        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          Konfirmasi & Pembayaran Langganan
        </h1>
        <p style={{ color: '#62685E', fontSize: '0.92rem', marginBottom: '32px' }}>
          Tinjau rincian paket pilihan Anda dan pilih metode pembayaran resmi yang aman.
        </p>

        {/* Auth prompt if not logged in */}
        {!currentUser && (
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.92rem' }}>
                Perhatian: Anda belum login ke akun UNI-LANDFARM
              </div>
              <div style={{ fontSize: '0.82rem', color: '#78350F' }}>
                Silakan masuk atau buat akun terlebih dahulu agar paket aktif pada akun bisnis Anda.
              </div>
            </div>
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                background: '#304432',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Masuk / Daftar
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Plan Summary */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(48, 68, 50, 0.12)',
              boxShadow: '0 8px 30px rgba(48, 68, 50, 0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    background: '#F5F2E8',
                    color: '#687A4D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  Paket Terpilih
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#202720' }}>
                  {plan.name}
                </h3>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#304432' }}>
                Periode {billingInterval === 'yearly' ? '1 Tahun' : '1 Bulan'}
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#62685E', lineHeight: 1.5, marginBottom: '20px' }}>
              {plan.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(48, 68, 50, 0.08)', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#304432', textTransform: 'uppercase', marginBottom: '10px' }}>
                Fitur & Batas Akses Termasuk:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', color: '#202720' }}>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Calculation breakdown */}
            <div style={{ background: '#FAF8F2', borderRadius: '14px', padding: '18px', border: '1px solid rgba(48, 68, 50, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#62685E', marginBottom: '8px' }}>
                <span>Harga Langganan ({billingInterval === 'yearly' ? 'Tahunan' : 'Bulanan'})</span>
                <span style={{ fontWeight: 700, color: '#202720' }}>
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#62685E', marginBottom: '12px' }}>
                <span>Pajak (PPN 0%)</span>
                <span>Rp 0</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#202720',
                  borderTop: '1px dashed rgba(48, 68, 50, 0.2)',
                  paddingTop: '12px',
                }}
              >
                <span>Total Tagihan:</span>
                <span style={{ color: '#304432' }}>
                  {totalAmount === 0 ? 'Gratis' : `Rp ${totalAmount.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method Selection */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(48, 68, 50, 0.12)',
              boxShadow: '0 8px 30px rgba(48, 68, 50, 0.05)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#202720', marginBottom: '6px' }}>
              Pilih Metode Pembayaran
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#62685E', marginBottom: '20px' }}>
              Didukung oleh gerbang pembayaran resmi berlisensi Bank Indonesia (Midtrans).
            </p>

            {errorMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#FEE2E2',
                  color: '#991B1B',
                  fontSize: '0.84rem',
                  marginBottom: '16px',
                }}
              >
                ✕ {errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                {
                  id: 'QRIS',
                  name: 'QRIS (Semua E-Wallet & Mobile Banking)',
                  badge: 'Instan & Otomatis',
                  desc: 'BCA, GoPay, OVO, ShopeePay, Dana, LinkAja & bank apa saja yang mendukung scan QRIS.',
                  icon: '📲',
                },
                {
                  id: 'VIRTUAL_ACCOUNT',
                  name: 'Virtual Account Bank Nasional',
                  badge: 'Otomatis 24 Jam',
                  desc: 'BCA, Mandiri, BRI, BNI. Verifikasi otomatis dalam hitungan detik setelah transfer.',
                  icon: '🏦',
                },
                {
                  id: 'MANUAL_TRANSFER',
                  name: 'Transfer Bank Manual',
                  badge: 'Konfirmasi Bukti Bayar',
                  desc: 'Transfer langsung ke rekening Bank Mandiri / BCA resmi kami dengan upload foto bukti transfer.',
                  icon: '📄',
                },
              ].map((m) => {
                const isSelected = selectedMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: isSelected ? '#FAF8F2' : '#FFFFFF',
                      border: isSelected ? '2px solid #304432' : '1px solid rgba(48, 68, 50, 0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#202720' }}>
                          {m.name}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isSelected ? '#304432' : '#F5F2E8',
                          color: isSelected ? '#FFFFFF' : '#687A4D',
                        }}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#62685E', lineHeight: 1.45, marginLeft: '28px' }}>
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#62685E', lineHeight: 1.5, marginBottom: '22px' }}>
              🔒 Transaksi Anda dilindungi enkripsi SSL 256-bit. Data kartu dan kredensial perbankan tidak pernah disimpan di server kami.
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '9999px',
                background: '#304432',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.98rem',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: '0 8px 24px rgba(48, 68, 50, 0.28)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting
                ? 'Memproses Pesanan...'
                : totalAmount === 0
                ? 'Aktivasi Paket Gratis Sekarang'
                : 'Lanjut ke Pembayaran →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
