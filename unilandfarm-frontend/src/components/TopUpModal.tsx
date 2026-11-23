import React, { useState } from 'react';
import { TokenPackage, PaymentMethod } from '../types';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenPackages: TokenPackage[];
  onPaymentSuccess: (packageData: TokenPackage, method: PaymentMethod) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  tokenPackages,
  onPaymentSuccess,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage>(tokenPackages[1] || tokenPackages[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'pay'>('select');
  const [copiedVa, setCopiedVa] = useState(false);

  if (!isOpen) return null;

  const handleProceedPayment = () => {
    setStep('pay');
  };

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(selectedPkg, paymentMethod);
      onClose();
    }, 1200);
  };

  const handleCopyVa = (val: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '32px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🪙</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>
                Top-Up Token AI UniLandFarm
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Token digunakan untuk Generate Landing Page & Magic Rephrase AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost"
            style={{ fontSize: '1.2rem', padding: '4px 10px' }}
          >
            ✕
          </button>
        </div>

        {/* STEP 1: SELECT PACKAGE & METHOD */}
        {step === 'select' && (
          <div>
            <div className="form-group">
              <label className="form-label">1. Pilih Paket Token</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tokenPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '10px',
                      background:
                        selectedPkg.id === pkg.id
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                      border:
                        selectedPkg.id === pkg.id
                          ? '1px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {pkg.name}
                        </span>
                        {pkg.isPopular && (
                          <span className="badge badge-emerald">Terlaris</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {pkg.tokenAmount} Token AI • Rp{' '}
                        {pkg.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">2. Pilih Metode Pembayaran</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                }}
              >
                {[
                  { id: 'QRIS', label: '📱 QRIS Instant', sub: 'GoPay, OVO, BCA, DANA' },
                  { id: 'VIRTUAL_ACCOUNT', label: '🏦 Virtual Account', sub: 'BCA, Mandiri, BRI' },
                  { id: 'MANUAL_TRANSFER', label: '📄 Transfer Manual', sub: 'Upload bukti transfer' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      background:
                        paymentMethod === m.id
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                      border:
                        paymentMethod === m.id
                          ? '1px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.825rem' }}>{m.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {m.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Pembayaran:
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                  Rp {selectedPkg.price.toLocaleString('id-ID')}
                </div>
              </div>

              <button onClick={handleProceedPayment} className="btn btn-primary">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INVOICE & SIMULATION */}
        {step === 'pay' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total Tagihan:
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#fbbf24',
                  margin: '4px 0 12px',
                }}
              >
                Rp {selectedPkg.price.toLocaleString('id-ID')}
              </div>
              <div className="badge badge-amber">Selesaikan dalam 14:59</div>

              {/* QRIS VIEW */}
              {paymentMethod === 'QRIS' && (
                <div style={{ marginTop: '20px' }}>
                  <div
                    style={{
                      background: '#ffffff',
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      margin: '0 auto',
                    }}
                  >
                    <svg width="180" height="180" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      {/* Corner markers */}
                      <rect x="10" y="10" width="25" height="25" fill="#111827" />
                      <rect x="14" y="14" width="17" height="17" fill="white" />
                      <rect x="17" y="17" width="11" height="11" fill="#111827" />
                      <rect x="65" y="10" width="25" height="25" fill="#111827" />
                      <rect x="69" y="14" width="17" height="17" fill="white" />
                      <rect x="72" y="17" width="11" height="11" fill="#111827" />
                      <rect x="10" y="65" width="25" height="25" fill="#111827" />
                      <rect x="14" y="69" width="17" height="17" fill="white" />
                      <rect x="17" y="72" width="11" height="11" fill="#111827" />
                      {/* Random QR code pixels */}
                      <rect x="42" y="15" width="5" height="5" fill="#111827" />
                      <rect x="50" y="22" width="5" height="5" fill="#111827" />
                      <rect x="42" y="38" width="8" height="8" fill="#111827" />
                      <rect x="55" y="42" width="8" height="8" fill="#111827" />
                      <rect x="68" y="55" width="8" height="8" fill="#111827" />
                      <rect x="25" y="45" width="8" height="8" fill="#111827" />
                      <rect x="45" y="65" width="10" height="10" fill="#111827" />
                      <rect x="65" y="75" width="12" height="12" fill="#111827" />
                    </svg>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                    Scan QRIS ini dengan aplikasi m-Banking atau e-Wallet apa saja
                  </p>
                </div>
              )}

              {/* VIRTUAL ACCOUNT VIEW */}
              {paymentMethod === 'VIRTUAL_ACCOUNT' && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <div className="form-group">
                    <label className="form-label">Nomor Virtual Account BCA</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        readOnly
                        value="8077708123456789"
                        className="form-control"
                        style={{ fontWeight: 700, letterSpacing: '0.05em' }}
                      />
                      <button
                        onClick={() => handleCopyVa('8077708123456789')}
                        className="btn btn-secondary"
                      >
                        {copiedVa ? '✓ Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MANUAL TRANSFER VIEW */}
              {paymentMethod === 'MANUAL_TRANSFER' && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '8px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Rekening Resmi UniLand:
                    </div>
                    <div style={{ fontWeight: 700 }}>Bank BCA: 8830-1928-33</div>
                    <div style={{ fontSize: '0.8rem' }}>a.n. PT UniLand Farm Indonesia</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Bukti Transfer</label>
                    <input type="file" className="form-control" />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setStep('select')} className="btn btn-secondary">
                Ganti Metode
              </button>

              <button
                disabled={isProcessing}
                onClick={handleSimulateSuccess}
                className="btn btn-primary"
                style={{ gap: '8px' }}
              >
                {isProcessing ? '⏳ Memproses...' : '✓ Simulasi Pembayaran Sukses'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
