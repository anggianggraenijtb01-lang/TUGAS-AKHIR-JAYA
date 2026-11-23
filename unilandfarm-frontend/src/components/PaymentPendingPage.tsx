import React, { useState, useEffect } from 'react';
import { Order, User } from '../types';
import { verifyOrderStatus, confirmOrderPaymentSuccess, uploadTransferProof } from '../services/api';
import { UniLandLogo } from './UniLandLogo';

interface PaymentPendingPageProps {
  order: Order;
  currentUser: User | null;
  onPaymentSuccess: (order: Order) => void;
  onPaymentFailed: (order: Order, reason: string) => void;
  onBackToDashboard: () => void;
  onBackToPricing: () => void;
}

export const PaymentPendingPage: React.FC<PaymentPendingPageProps> = ({
  order,
  currentUser,
  onPaymentSuccess,
  onPaymentFailed,
  onBackToDashboard,
  onBackToPricing,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSimulatingMidtrans, setIsSimulatingMidtrans] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<string | null>(order.proofImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  // Time remaining countdown (24 hours from createdAt)
  const [timeLeft, setTimeLeft] = useState<string>('23:59:59');

  useEffect(() => {
    const targetTime = order.expiredAt
      ? new Date(order.expiredAt).getTime()
      : new Date(order.createdAt).getTime() + 24 * 3600 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('Waktu Habis');
        clearInterval(interval);
        onPaymentFailed(currentOrder, 'Batas waktu pembayaran telah kedaluwarsa (Expired).');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order, onPaymentFailed, currentOrder]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    setCheckMessage(null);

    try {
      const verified = await verifyOrderStatus(currentOrder.orderReference);
      if (verified) {
        setCurrentOrder(verified);
        if (verified.status === 'SUCCESS') {
          onPaymentSuccess(verified);
          return;
        } else if (verified.status === 'FAILED' || verified.status === 'CANCELLED') {
          onPaymentFailed(verified, 'Transaksi dibatalkan atau ditolak oleh penyedia pembayaran.');
          return;
        } else {
          setCheckMessage(
            'Pembayaran Anda belum terdeteksi. Silakan pastikan transfer/scan QRIS telah berhasil dilakukan lalu cek kembali.'
          );
        }
      } else {
        setCheckMessage('Status pesanan belum diperbarui oleh gateway pembayaran.');
      }
    } catch {
      setCheckMessage('Gagal menghubungi server untuk memverifikasi pembayaran. Silakan coba lagi.');
    } finally {
      setIsChecking(false);
    }
  };

  // Simulate payment confirmation (sandbox/development simulation)
  const handleSimulatePaymentApproval = async () => {
    setIsSimulatingMidtrans(true);
    try {
      const updated = await confirmOrderPaymentSuccess(currentOrder.orderReference);
      if (updated && updated.status === 'SUCCESS') {
        setCurrentOrder(updated);
        onPaymentSuccess(updated);
      }
    } catch {
      alert('Gagal menyimulasikan konfirmasi pembayaran.');
    } finally {
      setIsSimulatingMidtrans(false);
    }
  };

  const handleUploadProofMock = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Convert to mock data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedProof(dataUrl);
      await uploadTransferProof(currentOrder.orderReference, dataUrl);
      setIsUploading(false);
      setCheckMessage('Bukti transfer berhasil diunggah. Menunggu verifikasi tim admin/sistem.');
    };
    reader.readAsDataURL(file);
  };

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(currentOrder.amount);

  return (
    <div style={{ backgroundColor: '#FAF8F2', minHeight: '100vh', color: '#202720', padding: '40px 16px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Brand & Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <UniLandLogo size="sm" variant="light" onClick={onBackToDashboard} style={{ cursor: 'pointer' }} />
          <button
            onClick={onBackToPricing}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#62685E',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Batal & Pilih Paket Lain
          </button>
        </div>

        {/* Status Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(48, 68, 50, 0.12)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 30px rgba(48, 68, 50, 0.06)',
            marginBottom: '24px',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid #ECE7D9',
              marginBottom: '28px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F59E0B',
                    display: 'inline-block',
                  }}
                />
                MENUNGGU PEMBAYARAN
              </div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                Selesaikan Pembayaran Anda
              </h1>
              <p style={{ color: '#62685E', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Nomor Pesanan: <strong style={{ color: '#202720' }}>{currentOrder.orderReference}</strong>
              </p>
            </div>

            <div
              style={{
                textAlign: 'right',
                background: '#FAF8F2',
                padding: '12px 20px',
                borderRadius: '16px',
                border: '1px solid #E5DEC9',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#62685E', fontWeight: 600 }}>Sisa Waktu Pembayaran</div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#C2410C',
                  marginTop: '2px',
                }}
              >
                {timeLeft}
              </div>
            </div>
          </div>

          {/* Amount Due Box */}
          <div
            style={{
              background: '#F5F2E8',
              borderRadius: '18px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', color: '#62685E' }}>Total Tagihan ({currentOrder.planName})</div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#304432',
                }}
              >
                {formattedAmount}
              </div>
            </div>
            <button
              onClick={() => handleCopy(currentOrder.amount.toString(), 'amount')}
              style={{
                background: '#FFFFFF',
                border: '1px solid #D5CDB8',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#304432',
                cursor: 'pointer',
              }}
            >
              {copiedField === 'amount' ? '✓ Tersalin' : 'Salin Nominal'}
            </button>
          </div>

          {/* Payment Method Details */}
          {currentOrder.paymentMethod === 'QRIS' && (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                background: '#FFFFFF',
                border: '1px dashed #687A4D',
                borderRadius: '20px',
                marginBottom: '28px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#304432', marginBottom: '8px' }}>
                Pindai QRIS Menggunakan Aplikasi Pembayaran Favorit
              </div>
              <p style={{ color: '#62685E', fontSize: '0.85rem', marginBottom: '18px' }}>
                Mendukung GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin by Mandiri, dan seluruh e-wallet & m-banking
                berstandar QRIS.
              </p>

              {/* Dynamic QRIS Box */}
              <div
                style={{
                  display: 'inline-block',
                  background: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E5DEC9',
                }}
              >
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://unilandfarm.id/pay/mock-qris-settlement"
                  alt="QRIS Code UNI-LANDFARM"
                  style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
                />
                <div style={{ marginTop: '10px', fontSize: '0.76rem', color: '#62685E', fontWeight: 600 }}>
                  NMID: ID1020039281729 • UNI-LANDFARM
                </div>
              </div>

              <div style={{ marginTop: '20px', color: '#687A4D', fontSize: '0.82rem', fontWeight: 600 }}>
                💡 Tips: Tangkap layar (screenshot) kode QR ini jika membuka dari perangkat ponsel, lalu upload ke menu
                pindai QR aplikasi bank Anda.
              </div>
            </div>
          )}

          {currentOrder.paymentMethod === 'VA' && (
            <div
              style={{
                background: '#FAF8F2',
                border: '1px solid #E5DEC9',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#304432', marginBottom: '14px' }}>
                Nomor Virtual Account Bank (BCA / Mandiri / BNI / BRI)
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #D5CDB8',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#62685E', fontWeight: 600 }}>Nomor VA BCA</div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#202720',
                      letterSpacing: '1px',
                    }}
                  >
                    8277 0812 3456 7890
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('8277081234567890', 'va')}
                  style={{
                    background: '#304432',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedField === 'va' ? '✓ Tersalin' : 'Salin Nomor VA'}
                </button>
              </div>

              <ol style={{ fontSize: '0.84rem', color: '#62685E', paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
                <li>Buka aplikasi m-Banking atau kunjungi ATM terdekat.</li>
                <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                <li>Masukkan kode Virtual Account di atas.</li>
                <li>Pastikan penerima atas nama <strong>UNI-LANDFARM</strong> dan nominal sesuai tagihan.</li>
                <li>Konfirmasi transaksi. Verifikasi berjalan otomatis dalam 1–3 menit.</li>
              </ol>
            </div>
          )}

          {currentOrder.paymentMethod === 'MANUAL' && (
            <div
              style={{
                background: '#FAF8F2',
                border: '1px solid #E5DEC9',
                borderRadius: '20px',
                padding: '24px',
                marginBottom: '28px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#304432', marginBottom: '14px' }}>
                Rekening Resmi Bank BCA
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #D5CDB8',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#62685E', fontWeight: 600 }}>Bank BCA • Kantor Cabang Jakarta</div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: '#202720',
                      letterSpacing: '1px',
                    }}
                  >
                    1234 5678 90
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#687A4D', fontWeight: 600, marginTop: '2px' }}>
                    a.n. PT UNI-LANDFARM TEKNOLOGI INDONESIA
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('1234567890', 'rek')}
                  style={{
                    background: '#304432',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedField === 'rek' ? '✓ Tersalin' : 'Salin Rekening'}
                </button>
              </div>

              {/* Upload Proof */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px dashed #D5CDB8',
                  borderRadius: '12px',
                  padding: '18px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#304432', marginBottom: '6px' }}>
                  Unggah Bukti Transfer (Opsional jika ingin verifikasi kilat)
                </div>
                {uploadedProof ? (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ color: '#16A34A', fontWeight: 700, fontSize: '0.85rem' }}>
                      ✓ Bukti transfer telah terunggah
                    </span>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      background: '#F4C744',
                      color: '#202720',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isUploading ? 'Mengunggah...' : 'Pilih File Bukti Struk / Screenshot'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleUploadProofMock}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Feedback message */}
          {checkMessage && (
            <div
              style={{
                background: checkMessage.includes('berhasil') ? '#DCFCE7' : '#FEF3C7',
                color: checkMessage.includes('berhasil') ? '#166534' : '#92400E',
                border: `1px solid ${checkMessage.includes('berhasil') ? '#86EFAC' : '#FCD34D'}`,
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              {checkMessage}
            </div>
          )}

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '14px 24px',
                borderRadius: '12px',
                background: '#304432',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: isChecking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(48, 68, 50, 0.25)',
              }}
            >
              {isChecking ? 'Sedang Memverifikasi...' : '🔄 Cek Status Pembayaran'}
            </button>

            <button
              onClick={onBackToDashboard}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'transparent',
                border: '1px solid #D5CDB8',
                color: '#62685E',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Bayar Nanti & Buka Dashboard
            </button>
          </div>

          {/* Sandbox Simulation Helper */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px dashed #E5DEC9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#687A4D' }}>
              <strong>Mode Sandbox / Uji Coba:</strong> Anda dapat mensimulasikan notifikasi gateway berhasil untuk
              menguji aktivasi langganan.
            </div>
            <button
              onClick={handleSimulatePaymentApproval}
              disabled={isSimulatingMidtrans}
              style={{
                background: '#687A4D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: isSimulatingMidtrans ? 'not-allowed' : 'pointer',
              }}
            >
              {isSimulatingMidtrans ? 'Memproses Simulasi...' : '⚡ Simulasi Pembayaran Berhasil (Sandbox)'}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div style={{ textAlign: 'center', color: '#62685E', fontSize: '0.82rem' }}>
          🔒 Transaksi dienkripsi 256-bit SSL. Hak cipta &copy; {new Date().getFullYear()} UNI-LANDFARM.
        </div>
      </div>
    </div>
  );
};
