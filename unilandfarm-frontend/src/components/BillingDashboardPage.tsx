import React, { useState, useEffect } from 'react';
import { User, Subscription, Order, Plan } from '../types';
import { getMySubscription, getMyOrders, getSubscriptionPlans, saveMySubscription } from '../services/api';
import { UniLandLogo } from './UniLandLogo';

interface BillingDashboardPageProps {
  currentUser: User | null;
  onOpenCheckout: (plan: Plan, interval: 'monthly' | 'yearly') => void;
  onBackToDashboard: () => void;
  onOpenPricing: () => void;
}

export const BillingDashboardPage: React.FC<BillingDashboardPageProps> = ({
  currentUser,
  onOpenCheckout,
  onBackToDashboard,
  onOpenPricing,
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState('');

  useEffect(() => {
    getMySubscription().then(setSubscription);
    setOrders(getMyOrders());
    getSubscriptionPlans().then(setPlans);
  }, []);

  const activePlan = plans.find((p) => p.id === subscription?.planId) || plans[0];

  const handleCancelRenewal = () => {
    if (!subscription) return;
    const updatedSub: Subscription = {
      ...subscription,
      renewalMode: 'MANUAL',
    };
    saveMySubscription(updatedSub);
    setSubscription(updatedSub);
    setShowCancelModal(false);
    setCancelFeedback('Perpanjangan otomatis telah dinonaktifkan. Akses paket Anda tetap aktif hingga tanggal kedaluwarsa.');
  };

  const formattedAmount = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div style={{ backgroundColor: '#FAF8F2', minHeight: '100vh', color: '#202720', padding: '40px 16px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <UniLandLogo size="sm" variant="light" onClick={onBackToDashboard} style={{ cursor: 'pointer' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onBackToDashboard}
              style={{
                background: 'transparent',
                border: '1px solid #D5CDB8',
                borderRadius: '10px',
                padding: '8px 16px',
                color: '#62685E',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              ← Kembali ke Dashboard
            </button>
            <button
              onClick={onOpenPricing}
              style={{
                background: '#304432',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              Lihat Semua Paket
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Langganan & Riwayat Billing
          </h1>
          <p style={{ color: '#62685E', fontSize: '0.92rem', margin: 0 }}>
            Kelola paket langganan aktif, alokasi kapasitas website, dan arsip faktur pembayaran resmi Anda.
          </p>
        </div>

        {cancelFeedback && (
          <div
            style={{
              background: '#DCFCE7',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '0.88rem',
              color: '#166534',
              marginBottom: '24px',
            }}
          >
            ✓ {cancelFeedback}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {/* Current Subscription Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(48, 68, 50, 0.14)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(48, 68, 50, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#687A4D', textTransform: 'uppercase' }}>
                Paket Aktif Saat Ini
              </span>
              <span
                style={{
                  background: subscription?.status === 'ACTIVE' ? '#DCFCE7' : '#FEF3C7',
                  color: subscription?.status === 'ACTIVE' ? '#166534' : '#92400E',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {subscription?.status || 'AKTIF'}
              </span>
            </div>

            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#304432', marginBottom: '6px' }}>
              {subscription?.planName || 'Paket Pro UMKM'}
            </div>

            <p style={{ color: '#62685E', fontSize: '0.85rem', marginBottom: '20px' }}>
              Siklus Pembayaran: <strong>{subscription?.billingInterval === 'yearly' ? 'Tahunan' : 'Bulanan'}</strong>
            </p>

            <div style={{ background: '#FAF8F2', borderRadius: '12px', padding: '16px', fontSize: '0.84rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#62685E' }}>Mulai Berlangganan:</span>
                <span style={{ fontWeight: 600 }}>
                  {subscription?.startsAt ? new Date(subscription.startsAt).toLocaleDateString('id-ID') : 'Hari ini'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#62685E' }}>Kedaluwarsa Pada:</span>
                <span style={{ fontWeight: 700, color: '#304432' }}>
                  {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('id-ID') : '365 Hari ke Depan'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#62685E' }}>Mode Perpanjangan:</span>
                <span style={{ fontWeight: 600 }}>
                  {subscription?.renewalMode === 'AUTO' ? 'Otomatis' : 'Manual / Pengingat Email'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onOpenPricing}
                style={{
                  flex: 1,
                  background: '#F4C744',
                  color: '#202720',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tingkatkan / Ubah Paket
              </button>
              {subscription?.renewalMode === 'AUTO' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #E5DEC9',
                    color: '#991B1B',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Batal Auto-Renew
                </button>
              )}
            </div>
          </div>

          {/* Entitlement & Quotas Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(48, 68, 50, 0.14)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 20px rgba(48, 68, 50, 0.05)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#687A4D', textTransform: 'uppercase', marginBottom: '16px' }}>
              Alokasi & Kapasitas Fitur
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Websites Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                  <span style={{ color: '#202720', fontWeight: 600 }}>Website Publik Aktif</span>
                  <span style={{ fontWeight: 700, color: '#304432' }}>
                    1 / {activePlan?.limits.publishedWebsites === 999 ? 'Unlimited' : activePlan?.limits.publishedWebsites || 5}
                  </span>
                </div>
                <div style={{ height: '8px', background: '#ECE7D9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: '20%', height: '100%', background: '#687A4D', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Token Quota Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
                  <span style={{ color: '#202720', fontWeight: 600 }}>Saldo Token AI</span>
                  <span style={{ fontWeight: 700, color: '#304432' }}>
                    {currentUser?.tokenBalance || 85} / {activePlan?.limits.aiTokensIncluded || 150} Token
                  </span>
                </div>
                <div style={{ height: '8px', background: '#ECE7D9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: '56%', height: '100%', background: '#F4C744', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Feature Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div style={{ background: '#FAF8F2', padding: '10px 12px', borderRadius: '10px', fontSize: '0.78rem' }}>
                  <div style={{ color: '#62685E' }}>Template Industri</div>
                  <div style={{ fontWeight: 700, color: '#304432', marginTop: '2px' }}>
                    {activePlan?.limits.templates === 'all' ? 'Akses Semua (6+)' : 'Template Dasar'}
                  </div>
                </div>

                <div style={{ background: '#FAF8F2', padding: '10px 12px', borderRadius: '10px', fontSize: '0.78rem' }}>
                  <div style={{ color: '#62685E' }}>Agentic AI CMS</div>
                  <div style={{ fontWeight: 700, color: '#304432', marginTop: '2px' }}>
                    {activePlan?.limits.scheduler ? 'Penjadwalan Aktif' : 'Manual Draft'}
                  </div>
                </div>

                <div style={{ background: '#FAF8F2', padding: '10px 12px', borderRadius: '10px', fontSize: '0.78rem' }}>
                  <div style={{ color: '#62685E' }}>Ekspor Kode HTML</div>
                  <div style={{ fontWeight: 700, color: '#304432', marginTop: '2px' }}>
                    {activePlan?.limits.exportHtml ? '✓ Tanpa Batas' : 'Tersedia di Pro'}
                  </div>
                </div>

                <div style={{ background: '#FAF8F2', padding: '10px 12px', borderRadius: '10px', fontSize: '0.78rem' }}>
                  <div style={{ color: '#62685E' }}>Bantuan Teknis</div>
                  <div style={{ fontWeight: 700, color: '#304432', marginTop: '2px' }}>
                    {activePlan?.limits.prioritySupport ? 'Prioritas WhatsApp' : 'Komunitas'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices / Payment History Table */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(48, 68, 50, 0.14)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 4px 20px rgba(48, 68, 50, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Riwayat Transaksi & Faktur
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#62685E' }}>
              Menampilkan {orders.length} pesanan tercatat
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ECE7D9', color: '#62685E', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>No. Faktur</th>
                  <th style={{ padding: '12px 14px' }}>Tanggal</th>
                  <th style={{ padding: '12px 14px' }}>Paket Langganan</th>
                  <th style={{ padding: '12px 14px' }}>Metode</th>
                  <th style={{ padding: '12px 14px' }}>Nominal</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #F0ECE1' }}>
                    <td style={{ padding: '14px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {ord.orderReference}
                    </td>
                    <td style={{ padding: '14px', color: '#62685E' }}>
                      {new Date(ord.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 600 }}>
                      {ord.planName} ({ord.billingInterval === 'yearly' ? 'Tahunan' : 'Bulanan'})
                    </td>
                    <td style={{ padding: '14px', color: '#62685E' }}>
                      {ord.paymentMethod}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#304432' }}>
                      {formattedAmount(ord.amount)}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          background:
                            ord.status === 'SUCCESS'
                              ? '#DCFCE7'
                              : ord.status === 'PENDING'
                              ? '#FEF3C7'
                              : '#FEE2E2',
                          color:
                            ord.status === 'SUCCESS'
                              ? '#166534'
                              : ord.status === 'PENDING'
                              ? '#92400E'
                              : '#991B1B',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {ord.status === 'SUCCESS'
                          ? 'BERHASIL'
                          : ord.status === 'PENDING'
                          ? 'MENUNGGU'
                          : 'GAGAL'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        style={{
                          background: '#FAF8F2',
                          border: '1px solid #D5CDB8',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: '#304432',
                        }}
                      >
                        Lihat Faktur
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Invoice View */}
        {selectedInvoiceOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <UniLandLogo size="sm" variant="light" />
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    color: '#62685E',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ borderBottom: '2px solid #304432', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#687A4D', fontWeight: 700, textTransform: 'uppercase' }}>
                  Faktur Pembayaran Resmi
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#304432' }}>
                  {selectedInvoiceOrder.orderReference}
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <div style={{ color: '#62685E', fontSize: '0.78rem' }}>Diterbitkan Untuk:</div>
                  <div style={{ fontWeight: 700 }}>{currentUser?.name || 'Pelanggan UNI-LANDFARM'}</div>
                  <div style={{ color: '#62685E', fontSize: '0.82rem' }}>{currentUser?.email || 'user@unilandfarm.id'}</div>
                </div>
                <div>
                  <div style={{ color: '#62685E', fontSize: '0.78rem' }}>Tanggal Terbit:</div>
                  <div style={{ fontWeight: 600 }}>{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('id-ID')}</div>
                </div>
              </div>

              <div style={{ background: '#FAF8F2', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span>{selectedInvoiceOrder.planName} ({selectedInvoiceOrder.billingInterval})</span>
                  <span style={{ fontWeight: 700 }}>{formattedAmount(selectedInvoiceOrder.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#62685E' }}>
                  <span>PPN UMKM (0%)</span>
                  <span>Rp 0</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #E5DEC9',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: '#304432',
                  }}
                >
                  <span>Total Tagihan:</span>
                  <span>{formattedAmount(selectedInvoiceOrder.amount)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    background: '#304432',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  🖨️ Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{
                    background: '#FAF8F2',
                    border: '1px solid #D5CDB8',
                    borderRadius: '10px',
                    padding: '12px 18px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Cancel Auto-Renew */}
        {showCancelModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}
            >
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#202720', marginBottom: '8px' }}>
                Nonaktifkan Perpanjangan Otomatis?
              </h3>
              <p style={{ color: '#62685E', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
                Dengan menonaktifkan perpanjangan otomatis:
                <br />• Akses website & fitur paket Anda <strong>tetap aktif penuh</strong> hingga periode berakhir.
                <br />• Kartu atau saldo Anda tidak akan didebit otomatis pada periode berikutnya.
                <br />• Catatan: Tindakan ini bukan pembatalan transaksi lalu / pengembalian dana (refund).
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCancelRenewal}
                  style={{
                    flex: 1,
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Ya, Nonaktifkan Auto-Renew
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  style={{
                    background: '#FAF8F2',
                    border: '1px solid #D5CDB8',
                    borderRadius: '10px',
                    padding: '12px 18px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
