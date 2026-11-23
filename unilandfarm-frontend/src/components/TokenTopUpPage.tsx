import React, { useState } from 'react';
import { User, TokenPackage, PaymentMethod, Transaction, TransactionStatus } from '../types';
import {
  Coins,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  UploadCloud,
  ChevronRight,
  ArrowLeft,
  Eye,
  Info,
  Check,
} from './icons/LucideIcons';

interface TokenTopUpPageProps {
  currentUser: User;
  tokenPackages: TokenPackage[];
  transactions: Transaction[];
  onTopUpCreated: (newTx: Transaction) => void;
  onUploadProof: (txId: string, proofUrl: string) => void;
  onBack?: () => void;
}

export const TokenTopUpPage: React.FC<TokenTopUpPageProps> = ({
  currentUser,
  tokenPackages,
  transactions,
  onTopUpCreated,
  onUploadProof,
  onBack,
}) => {
  // Step: 'overview' | 'checkout' | 'instruction'
  const [activeStep, setActiveStep] = useState<'overview' | 'checkout' | 'instruction'>('overview');
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage>(tokenPackages[1] || tokenPackages[0]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('QRIS');
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'Mandiri' | 'BNI' | 'BRI'>('BCA');
  const [selectedEwallet, setSelectedEwallet] = useState<'GoPay' | 'OVO' | 'DANA'>('GoPay');
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  // File upload state for manual transfer proof
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Receipt Modal State
  const [viewReceiptTx, setViewReceiptTx] = useState<Transaction | null>(null);

  // Helper formatting currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Status badge styling helper
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#DCFCE7',
              color: '#15803D',
            }}
          >
            <CheckCircle2 size={13} color="#15803D" />
            Berhasil
          </span>
        );
      case 'PENDING':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#FEF9C3',
              color: '#854D0E',
            }}
          >
            <Clock size={13} color="#854D0E" />
            Menunggu Verifikasi
          </span>
        );
      case 'REJECTED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#FEE2E2',
              color: '#B91C1C',
            }}
          >
            <XCircle size={13} color="#B91C1C" />
            Ditolak
          </span>
        );
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#F3F4F6',
              color: '#4B5563',
            }}
          >
            {status}
          </span>
        );
    }
  };

  // Start checkout with a selected package
  const handleSelectPackageToBuy = (pkg: TokenPackage) => {
    setSelectedPkg(pkg);
    setActiveStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create unique transaction
  const handleConfirmOrder = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceCode = `INV-${dateStr}-${randSuffix}`;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      invoiceCode,
      packageName: selectedPkg.name,
      tokenAmount: selectedPkg.tokenAmount,
      amountPaid: selectedPkg.price,
      paymentMethod: selectedMethod,
      status: 'PENDING',
      createdAt: now.toISOString(),
    };

    setActiveTransaction(newTx);
    onTopUpCreated(newTx);
    setActiveStep('instruction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // File change handler with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Format file wajib JPG, PNG, atau WebP.');
      return;
    }

    // Validate size (max 5 MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Ukuran file maksimal 5 MB.');
      return;
    }

    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProofPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit proof for verification
  const handleSubmitProof = () => {
    if (!activeTransaction) return;
    if (!proofPreviewUrl) {
      setUploadError('Pilih file bukti pembayaran terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      onUploadProof(activeTransaction.id, proofPreviewUrl);
      setTimeout(() => {
        setActiveStep('overview');
        setUploadSuccess(false);
        setProofFile(null);
        setProofPreviewUrl('');
        setActiveTransaction(null);
      }, 1500);
    }, 800);
  };

  // Filter transactions for this user
  const myTransactions = transactions.filter((t) => t.userId === currentUser.id);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeStep !== 'overview' && (
            <button
              onClick={() => setActiveStep('overview')}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(85, 113, 132, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#202720',
              }}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          )}
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#102B3F', margin: 0 }}>
              {activeStep === 'overview' && 'Kelola Token & Top-Up'}
              {activeStep === 'checkout' && 'Pilih Metode Pembayaran'}
              {activeStep === 'instruction' && 'Instruksi Pembayaran'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#687A4D', margin: '4px 0 0' }}>
              {activeStep === 'overview' && 'Gunakan token untuk otomatisasi konten, generate artikel AI, dan update landing page.'}
              {activeStep === 'checkout' && 'Pilih metode pembayaran resmi yang telah disiapkan.'}
              {activeStep === 'instruction' && 'Selesaikan pembayaran dan unggah bukti transfer untuk diverifikasi admin.'}
            </p>
          </div>
        </div>

        {/* Current Balance Pill */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(85, 113, 132, 0.2)',
            borderRadius: '16px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}
          >
            <Coins size={20} color="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#62685E', fontWeight: 600 }}>Saldo Token Anda</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#102B3F', lineHeight: 1.1 }}>
              {currentUser.tokenBalance}{' '}
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#687A4D' }}>Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STEP 1: OVERVIEW & PACKAGES LIST
          ============================================================ */}
      {activeStep === 'overview' && (
        <div>
          {/* Packages Grid */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B3F', marginBottom: '16px' }}>
              Pilihan Paket Token
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {tokenPackages.map((pkg) => {
                const isPopular = pkg.isPopular;
                return (
                  <div
                    key={pkg.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '28px 24px',
                      border: isPopular ? '2px solid #F4C744' : '1px solid rgba(85, 113, 132, 0.2)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isPopular ? '0 12px 30px rgba(244, 199, 68, 0.16)' : '0 2px 10px rgba(0,0,0,0.02)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {isPopular && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          right: '20px',
                          background: '#F4C744',
                          color: '#202720',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        PALING POPULER
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#102B3F', marginBottom: '6px' }}>
                        {pkg.name}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#62685E', marginBottom: '20px', minHeight: '38px', lineHeight: 1.45 }}>
                        {pkg.description}
                      </p>

                      {/* Token Amount Big Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'baseline',
                          gap: '6px',
                          background: '#F8FAF7',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          marginBottom: '20px',
                          border: '1px solid #E5E0D0',
                        }}
                      >
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#102B3F' }}>
                          {pkg.tokenAmount}
                        </span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#687A4D' }}>Token AI</span>
                      </div>

                      {/* Price */}
                      <div style={{ marginBottom: '22px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#62685E', fontWeight: 600 }}>Biaya Sekali Beli</div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#102B3F' }}>
                          {formatRupiah(pkg.price)}
                        </div>
                      </div>

                      {/* Features List */}
                      <div style={{ borderTop: '1px solid #F0ECE1', paddingTop: '16px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#687A4D', fontWeight: 700, marginBottom: '8px' }}>
                          SUDAH TERMASUK:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {pkg.features.map((feat, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#304432' }}>
                              <Check size={14} color="#16A34A" strokeWidth={3} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPackageToBuy(pkg)}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isPopular ? '#102B3F' : '#F8FAF7',
                        color: isPopular ? '#FFFFFF' : '#102B3F',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>Beli Paket</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction History Section */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B3F', marginBottom: '16px' }}>
              Riwayat Transaksi Top-Up
            </h2>

            {myTransactions.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '40px 24px',
                  textAlign: 'center',
                  border: '1px solid rgba(85, 113, 132, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#F8FAF7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: '#687A4D',
                  }}
                >
                  <CreditCard size={24} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#102B3F', margin: '0 0 6px' }}>
                  Belum Ada Transaksi Top-Up
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#62685E', margin: 0, maxWidth: '380px', marginInline: 'auto' }}>
                  Riwayat transaksi top-up token dan status verifikasinya akan otomatis tercatat di sini.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid rgba(85, 113, 132, 0.2)',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAF7', borderBottom: '1px solid #E5E0D0', color: '#4B5548' }}>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Kode Invoice</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Paket</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Jumlah Token</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Total Biaya</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Metode</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                        <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTransactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#102B3F' }}>
                            {tx.invoiceCode}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#304432' }}>{tx.packageName}</td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#102B3F' }}>
                            +{tx.tokenAmount}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#102B3F' }}>
                            {formatRupiah(tx.amountPaid)}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#687A4D' }}>{tx.paymentMethod}</td>
                          <td style={{ padding: '14px 18px' }}>{renderStatusBadge(tx.status)}</td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <button
                              onClick={() => setViewReceiptTx(tx)}
                              style={{
                                background: '#F8FAF7',
                                border: '1px solid rgba(85, 113, 132, 0.2)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: '#102B3F',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Eye size={13} />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 2: CHECKOUT & PAYMENT METHOD SELECTOR
          ============================================================ */}
      {activeStep === 'checkout' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
          {/* Left Column: Payment Methods */}
          <div>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid rgba(85, 113, 132, 0.2)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#102B3F', marginBottom: '16px' }}>
                Pilih Metode Pembayaran
              </h3>

              {/* Method 1: QRIS */}
              <div
                onClick={() => setSelectedMethod('QRIS')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'QRIS' ? '2px solid #102B3F' : '1px solid #E5E0D0',
                  background: selectedMethod === 'QRIS' ? '#F8FAF7' : '#FFFFFF',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: '#102B3F',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                    }}
                  >
                    QRIS
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#102B3F', fontSize: '0.9rem' }}>
                      QRIS Nasional (BCA, GoPay, OVO, ShopeePay)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#687A4D' }}>
                      Scan barcode melalui aplikasi e-wallet atau mobile banking apa saja.
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: selectedMethod === 'QRIS' ? '5px solid #102B3F' : '2px solid rgba(85, 113, 132, 0.2)',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              {/* Method 2: Virtual Account */}
              <div
                onClick={() => setSelectedMethod('VIRTUAL_ACCOUNT')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'VIRTUAL_ACCOUNT' ? '2px solid #102B3F' : '1px solid #E5E0D0',
                  background: selectedMethod === 'VIRTUAL_ACCOUNT' ? '#F8FAF7' : '#FFFFFF',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: '#1E3A2F',
                      color: '#F4C744',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                    }}
                  >
                    VA
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#102B3F', fontSize: '0.9rem' }}>
                      Virtual Account Bank Otomatis
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#687A4D' }}>
                      BCA, Mandiri, BNI, dan BRI.
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: selectedMethod === 'VIRTUAL_ACCOUNT' ? '5px solid #102B3F' : '2px solid rgba(85, 113, 132, 0.2)',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              {/* Method 3: Transfer Manual Bank */}
              <div
                onClick={() => setSelectedMethod('MANUAL_TRANSFER')}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: selectedMethod === 'MANUAL_TRANSFER' ? '2px solid #102B3F' : '1px solid #E5E0D0',
                  background: selectedMethod === 'MANUAL_TRANSFER' ? '#F8FAF7' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: '#687A4D',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                    }}
                  >
                    TRF
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#102B3F', fontSize: '0.9rem' }}>
                      Transfer Bank Manual (Verifikasi Bukti)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#687A4D' }}>
                      Transfer ke rekening resmi UNI-LANDFARM dan unggah struk transfer.
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: selectedMethod === 'MANUAL_TRANSFER' ? '5px solid #102B3F' : '2px solid rgba(85, 113, 132, 0.2)',
                    background: '#FFFFFF',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(85, 113, 132, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#102B3F', marginBottom: '16px' }}>
                Ringkasan Pesanan
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.86rem' }}>
                <span style={{ color: '#62685E' }}>Paket</span>
                <span style={{ fontWeight: 700, color: '#102B3F' }}>{selectedPkg.name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.86rem' }}>
                <span style={{ color: '#62685E' }}>Jumlah Token</span>
                <span style={{ fontWeight: 800, color: '#102B3F' }}>+{selectedPkg.tokenAmount} Token</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.86rem' }}>
                <span style={{ color: '#62685E' }}>Metode</span>
                <span style={{ fontWeight: 700, color: '#687A4D' }}>{selectedMethod}</span>
              </div>

              <div
                style={{
                  borderTop: '1px solid #E5E0D0',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontWeight: 800, color: '#102B3F', fontSize: '0.96rem' }}>Total Tagihan</span>
                <span style={{ fontWeight: 900, color: '#102B3F', fontSize: '1.4rem' }}>
                  {formatRupiah(selectedPkg.price)}
                </span>
              </div>

              <button
                onClick={handleConfirmOrder}
                style={{
                  width: '100%',
                  background: '#102B3F',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 43, 34, 0.25)',
                }}
              >
                <span>Lanjutkan Pembayaran</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STEP 3: PAYMENT INSTRUCTIONS & PROOF UPLOAD
          ============================================================ */}
      {activeStep === 'instruction' && activeTransaction && (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(85, 113, 132, 0.2)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header info */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#FEF9C3',
                  color: '#854D0E',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  marginBottom: '10px',
                }}
              >
                INVOICE: {activeTransaction.invoiceCode}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#102B3F', margin: '0 0 6px' }}>
                Silakan Selesaikan Pembayaran
              </h2>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#102B3F', marginTop: '4px' }}>
                {formatRupiah(activeTransaction.amountPaid)}
              </div>
            </div>

            {/* Instruction content based on method */}
            {activeTransaction.paymentMethod === 'QRIS' && (
              <div
                style={{
                  background: '#F8FAF7',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E5E0D0',
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#102B3F', marginBottom: '12px' }}>
                  Scan Kode QRIS di Bawah Ini:
                </div>
                {/* Simulated Real QRIS Container */}
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    margin: '0 auto 12px',
                    border: '1px solid rgba(85, 113, 132, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.7rem', color: '#102B3F', marginBottom: '4px' }}>QRIS</div>
                  <div style={{ width: '130px', height: '130px', background: '#202720', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '0.72rem', textAlign: 'center', padding: '8px' }}>
                    [QRIS Barcode Resmi UNI-LANDFARM]
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#687A4D', lineHeight: 1.4 }}>
                  NMID: ID1020261015000 • UNI-LANDFARM DIGITAL
                </div>
              </div>
            )}

            {activeTransaction.paymentMethod === 'VIRTUAL_ACCOUNT' && (
              <div
                style={{
                  background: '#F8FAF7',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E5E0D0',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '0.82rem', color: '#62685E', marginBottom: '6px' }}>Nomor Virtual Account:</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(85, 113, 132, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B3F', letterSpacing: '0.04em' }}>
                    8801 2026 8941 0023
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#687A4D', fontWeight: 700 }}>BCA Virtual Account</span>
                </div>
              </div>
            )}

            {activeTransaction.paymentMethod === 'MANUAL_TRANSFER' && (
              <div
                style={{
                  background: '#F8FAF7',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #E5E0D0',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '0.82rem', color: '#62685E', marginBottom: '6px' }}>Rekening Resmi Transfer:</div>
                <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '8px', border: '1px solid rgba(85, 113, 132, 0.2)' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#102B3F' }}>Bank Central Asia (BCA)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B3F', margin: '4px 0' }}>
                    0351 9882 10
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#687A4D' }}>a.n. PT UNI LANDFARM NUSANTARA</div>
                </div>
              </div>
            )}

            {/* Proof Upload Area */}
            <div style={{ borderTop: '1px solid #E5E0D0', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <UploadCloud size={18} color="#102B3F" />
                <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#102B3F', margin: 0 }}>
                  Unggah Bukti Transfer / Pembayaran
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#62685E', margin: '0 0 14px' }}>
                Format didukung: JPG, PNG, atau WebP (Maksimal 5 MB).
              </p>

              {/* Upload Input */}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#F8FAF7',
                  border: '1px dashed rgba(85, 113, 132, 0.2)',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                }}
              />

              {uploadError && (
                <div style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600, marginTop: '8px' }}>
                  {uploadError}
                </div>
              )}

              {/* Image Preview */}
              {proofPreviewUrl && (
                <div style={{ marginTop: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.76rem', color: '#687A4D', fontWeight: 700, marginBottom: '6px' }}>
                    Pratinjau Bukti:
                  </div>
                  <img
                    src={proofPreviewUrl}
                    alt="Pratinjau Bukti Bayar"
                    style={{
                      maxHeight: '180px',
                      borderRadius: '8px',
                      border: '1px solid rgba(85, 113, 132, 0.2)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Proof Button */}
            {uploadSuccess ? (
              <div
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '14px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                }}
              >
                ✓ Bukti berhasil dikirim! Menunggu verifikasi admin.
              </div>
            ) : (
              <button
                onClick={handleSubmitProof}
                disabled={isUploading || !proofPreviewUrl}
                style={{
                  width: '100%',
                  background: !proofPreviewUrl ? 'rgba(85, 113, 132, 0.2)' : '#102B3F',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: !proofPreviewUrl ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isUploading ? (
                  <span>Mengirim Bukti...</span>
                ) : (
                  <>
                    <UploadCloud size={18} />
                    <span>Kirim Bukti Pembayaran</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          RECEIPT / DETAIL MODAL
          ============================================================ */}
      {viewReceiptTx && (
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
          onClick={() => setViewReceiptTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B3F', margin: 0 }}>
                Rincian Transaksi
              </h3>
              <button
                onClick={() => setViewReceiptTx(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#687A4D' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#F8FAF7', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: '#687A4D' }}>KODE INVOICE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#102B3F' }}>{viewReceiptTx.invoiceCode}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Paket</span>
                <span style={{ fontWeight: 700, color: '#102B3F' }}>{viewReceiptTx.packageName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Jumlah Token</span>
                <span style={{ fontWeight: 800, color: '#102B3F' }}>+{viewReceiptTx.tokenAmount} Token</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Total Biaya</span>
                <span style={{ fontWeight: 800, color: '#102B3F' }}>{formatRupiah(viewReceiptTx.amountPaid)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Metode</span>
                <span style={{ fontWeight: 700, color: '#102B3F' }}>{viewReceiptTx.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Status</span>
                <span>{renderStatusBadge(viewReceiptTx.status)}</span>
              </div>
              {viewReceiptTx.adminNote && (
                <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '8px', color: '#991B1B', fontSize: '0.78rem' }}>
                  <strong>Catatan Admin:</strong> {viewReceiptTx.adminNote}
                </div>
              )}
            </div>

            <button
              onClick={() => setViewReceiptTx(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#102B3F',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
