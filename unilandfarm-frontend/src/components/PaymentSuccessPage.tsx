import React from 'react';
import { Order, User } from '../types';
import { UniLandLogo } from './UniLandLogo';

interface PaymentSuccessPageProps {
  order: Order;
  currentUser: User | null;
  onOpenCms: () => void;
  onOpenBilling: () => void;
  onBackToHome: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  order,
  currentUser,
  onOpenCms,
  onOpenBilling,
  onBackToHome,
}) => {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(order.amount);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ backgroundColor: '#FAF8F2', minHeight: '100vh', color: '#202720', padding: '40px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <UniLandLogo size="md" variant="light" onClick={onBackToHome} style={{ cursor: 'pointer' }} />
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(48, 68, 50, 0.12)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 12px 40px rgba(48, 68, 50, 0.08)',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          {/* Success Animated Icon */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#DCFCE7',
              border: '2px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2.4rem',
              color: '#16A34A',
            }}
          >
            ✓
          </div>

          <span
            style={{
              display: 'inline-block',
              background: '#DCFCE7',
              color: '#166534',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            PEMBAYARAN TERVERIFIKASI
          </span>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#304432',
              marginBottom: '8px',
            }}
          >
            Selamat! Langganan Anda Telah Aktif
          </h1>

          <p style={{ color: '#62685E', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 32px' }}>
            Pembayaran telah berhasil kami terima. Akses fitur penuh, kapasitas website baru, dan dukungan Agentic AI CMS
            kini siap digunakan untuk mengembangkan bisnis Anda.
          </p>

          {/* Receipt Breakdown Box */}
          <div
            style={{
              background: '#F5F2E8',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#687A4D',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '14px',
                borderBottom: '1px solid #E5DEC9',
                paddingBottom: '8px',
              }}
            >
              Rincian Transaksi Resmi
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
              <div>
                <div style={{ color: '#62685E', fontSize: '0.8rem' }}>Nomor Pesanan / Faktur</div>
                <div style={{ fontWeight: 700, color: '#202720', fontFamily: 'monospace' }}>
                  {order.orderReference}
                </div>
              </div>

              <div>
                <div style={{ color: '#62685E', fontSize: '0.8rem' }}>Paket Langganan</div>
                <div style={{ fontWeight: 700, color: '#202720' }}>
                  {order.planName} ({order.billingInterval === 'yearly' ? 'Tahunan' : 'Bulanan'})
                </div>
              </div>

              <div>
                <div style={{ color: '#62685E', fontSize: '0.8rem' }}>Total Dibayar</div>
                <div style={{ fontWeight: 800, color: '#304432', fontSize: '1rem' }}>
                  {formattedAmount}
                </div>
              </div>

              <div>
                <div style={{ color: '#62685E', fontSize: '0.8rem' }}>Metode Pembayaran</div>
                <div style={{ fontWeight: 600, color: '#202720' }}>
                  {order.paymentMethod === 'QRIS'
                    ? 'QRIS Mandiri/BCA/GoPay'
                    : order.paymentMethod === 'VA'
                    ? 'Virtual Account Bank'
                    : 'Transfer Bank Manual'}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: '#62685E', fontSize: '0.8rem' }}>Waktu Transaksi</div>
                <div style={{ fontWeight: 600, color: '#202720' }}>{formattedDate}</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenCms}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 24px',
                borderRadius: '12px',
                background: '#304432',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(48, 68, 50, 0.25)',
              }}
            >
              🚀 Buka Dashboard CMS Studio
            </button>

            <button
              onClick={onOpenBilling}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#F4C744',
                color: '#202720',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Lihat Tagihan & Langganan
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', color: '#62685E', fontSize: '0.82rem' }}>
          Tanda terima resmi ini tersimpan otomatis di akun Anda dan dapat diunduh kapan saja di menu Riwayat Billing.
        </div>
      </div>
    </div>
  );
};
