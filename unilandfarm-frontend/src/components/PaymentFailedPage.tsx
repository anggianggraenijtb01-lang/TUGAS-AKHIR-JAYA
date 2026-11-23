import React from 'react';
import { Order } from '../types';
import { UniLandLogo } from './UniLandLogo';

interface PaymentFailedPageProps {
  order: Order;
  reason?: string;
  onRetryPayment: (order: Order) => void;
  onBackToPricing: () => void;
  onBackToDashboard: () => void;
}

export const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({
  order,
  reason,
  onRetryPayment,
  onBackToPricing,
  onBackToDashboard,
}) => {
  const isExpired = reason?.toLowerCase().includes('expired') || reason?.toLowerCase().includes('kedaluwarsa');
  const isCancelled = reason?.toLowerCase().includes('batal') || order.status === 'CANCELLED';

  const title = isExpired
    ? 'Waktu Pembayaran Telah Habis'
    : isCancelled
    ? 'Pembayaran Telah Dibatalkan'
    : 'Transaksi Belum Berhasil Diproses';

  const description =
    reason ||
    'Penyedia pembayaran tidak dapat menyelesaikan transaksi ini. Tagihan Anda belum dipotong. Anda dapat mencoba kembali dengan metode pembayaran lain atau memesan ulang.';

  return (
    <div style={{ backgroundColor: '#FAF8F2', minHeight: '100vh', color: '#202720', padding: '40px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          <UniLandLogo size="md" variant="light" onClick={onBackToDashboard} style={{ cursor: 'pointer' }} />
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          {/* Failed Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#FEE2E2',
              border: '2px solid #FCA5A5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '2.2rem',
              color: '#DC2626',
            }}
          >
            ✕
          </div>

          <span
            style={{
              display: 'inline-block',
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {isExpired ? 'KEDALUWARSA' : isCancelled ? 'DIBATALKAN' : 'TRANSAKSI GAGAL'}
          </span>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#202720',
              marginBottom: '8px',
            }}
          >
            {title}
          </h1>

          <p style={{ color: '#62685E', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            {description}
          </p>

          {/* Reference Info */}
          <div
            style={{
              background: '#FAF8F2',
              border: '1px solid #ECE7D9',
              borderRadius: '14px',
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: '28px',
              fontSize: '0.86rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#62685E' }}>Nomor Pesanan Terkait:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#202720' }}>
                {order.orderReference}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#62685E' }}>Paket yang Dipilih:</span>
              <span style={{ fontWeight: 600, color: '#202720' }}>{order.planName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#62685E' }}>Status Akhir:</span>
              <span style={{ fontWeight: 700, color: '#DC2626' }}>Tidak Ada Tagihan Aktif</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onRetryPayment(order)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: '#304432',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(48, 68, 50, 0.25)',
              }}
            >
              🔄 Ulangi Pembayaran
            </button>

            <button
              onClick={onBackToPricing}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: '#FAF8F2',
                border: '1px solid #D5CDB8',
                color: '#202720',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Pilih Paket Lain
            </button>
          </div>
        </div>

        {/* Support helper */}
        <div style={{ textAlign: 'center', color: '#62685E', fontSize: '0.82rem' }}>
          Butuh bantuan mengenai transaksi Anda? Hubungi tim dukungan pelanggan kami via WhatsApp di{' '}
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20UNI-LANDFARM,%20saya%20butuh%20bantuan%20terkait%20transaksi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#687A4D', fontWeight: 600, textDecoration: 'underline' }}
          >
            0812-3456-7890
          </a>
        </div>
      </div>
    </div>
  );
};
