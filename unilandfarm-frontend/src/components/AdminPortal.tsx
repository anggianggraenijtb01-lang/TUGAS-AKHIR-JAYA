import React, { useState, useMemo } from 'react';
import { LandingPage, Template, Transaction, User, Plan } from '../types';
import { initialRegisteredUsers, RegisteredUserRecord } from '../services/mockData';
import { UniLandLogo } from './UniLandLogo';
import {
  LayoutGrid,
  Users,
  Globe,
  Layout,
  Coins,
  Calendar,
  Bell,
  Activity,
  Settings,
  UserIcon,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  LogOut,
} from './icons/LucideIcons';

interface AdminPortalProps {
  currentUser?: User | null;
  pages: LandingPage[];
  templates: Template[];
  transactions: Transaction[];
  plans?: Plan[];
  onTakedownPage: (pageId: string, reason: string) => void;
  onVerifyTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onSendBroadcast: (title: string, message: string) => void;
  onLogout?: () => void;
  onOpenPublicView?: (slug: string) => void;
  onOpenCms?: (page: LandingPage) => void;
  onBackToHome?: () => void;
}

export type AdminMenuView =
  | 'dashboard'
  | 'users'
  | 'websites'
  | 'templates'
  | 'tokens'
  | 'plans'
  | 'schedules'
  | 'ai-studio'
  | 'analytics'
  | 'notifications'
  | 'logs'
  | 'settings'
  | 'profile';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  pages: initialPages,
  templates: initialTemplates,
  transactions: initialTransactions,
  plans: initialPlans = [],
  onTakedownPage,
  onVerifyTransaction,
  onRejectTransaction,
  onSendBroadcast,
  onLogout,
  onOpenPublicView,
  onOpenCms,
  onBackToHome,
}) => {
  // Navigation & UI State
  const [activeMenu, setActiveMenu] = useState<AdminMenuView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Data States
  const [pages, setPages] = useState<LandingPage[]>(initialPages);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>(initialRegisteredUsers);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  // Time Period Filters
  const [activityChartPeriod, setActivityChartPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [chartMetric, setChartMetric] = useState<'users' | 'websites' | 'ai' | 'tokens'>('users');

  // Modals States
  const [selectedUserDetail, setSelectedUserDetail] = useState<RegisteredUserRecord | null>(null);
  const [userStatusModal, setUserStatusModal] = useState<{ user: RegisteredUserRecord; nextStatus: 'ACTIVE' | 'SUSPENDED'; reason: string } | null>(null);
  const [takedownModal, setTakedownModal] = useState<{ page: LandingPage; reason: string } | null>(null);
  const [viewProofModal, setViewProofModal] = useState<string | null>(null);
  const [verifyRejectModal, setVerifyRejectModal] = useState<{ tx: Transaction; action: 'verify' | 'reject'; note: string } | null>(null);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', priority: 'INFO' as 'INFO' | 'PROMO' | 'WARNING' });
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({ name: '', category: 'Kuliner & F&B', desc: '', tokenCost: 15 });
  const [manualTokenAdjustModal, setManualTokenAdjustModal] = useState<{ userId: string; amount: number; reason: string } | null>(null);

  // Filter States for Specific Pages
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');
  const [userPlanFilter, setUserPlanFilter] = useState<string>('ALL');

  const [websiteSearch, setWebsiteSearch] = useState('');
  const [websiteStatusFilter, setWebsiteStatusFilter] = useState<string>('ALL');

  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<string>('ALL');

  // Trigger Toast Helper
  const showToast = (title: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ title, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------------------
  // Handlers for Admin Operations
  // ----------------------------------------------------------------
  const handleConfirmUserStatus = () => {
    if (!userStatusModal) return;
    const { user, nextStatus, reason } = userStatusModal;
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    showToast(
      `Status pengguna ${user.name} berhasil diubah ke ${nextStatus === 'ACTIVE' ? 'Aktif' : 'Ditangguhkan'}. Alasan: "${reason || 'Tindakan administratif'}"`,
      nextStatus === 'ACTIVE' ? 'success' : 'warning'
    );
    setUserStatusModal(null);
  };

  const handleConfirmTakedown = () => {
    if (!takedownModal || !takedownModal.reason.trim()) return;
    const { page, reason } = takedownModal;
    onTakedownPage(page.id, reason);
    setPages((prev) =>
      prev.map((p) => (p.id === page.id ? { ...p, publishStatus: 'SUSPENDED' } : p))
    );
    showToast(`Website "${page.title}" berhasil ditangguhkan/takedown. Alasan: ${reason}`, 'warning');
    setTakedownModal(null);
  };

  const handleConfirmTransactionAction = () => {
    if (!verifyRejectModal) return;
    const { tx, action, note } = verifyRejectModal;
    if (action === 'verify') {
      onVerifyTransaction(tx.id);
      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? { ...t, status: 'SUCCESS', adminNote: note } : t))
      );
      // Credit token to registered user if found
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === tx.userId ? { ...u, tokenBalance: u.tokenBalance + tx.tokenAmount } : u))
      );
      showToast(`Transaksi ${tx.invoiceCode} terverifikasi! Token +${tx.tokenAmount} telah ditambahkan.`, 'success');
    } else {
      onRejectTransaction(tx.id);
      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? { ...t, status: 'REJECTED', adminNote: note } : t))
      );
      showToast(`Transaksi ${tx.invoiceCode} ditolak. Catatan: ${note || 'Bukti transfer tidak sesuai.'}`, 'warning');
    }
    setVerifyRejectModal(null);
  };

  const handleManualTokenSubmit = () => {
    if (!manualTokenAdjustModal || !manualTokenAdjustModal.reason.trim()) {
      alert('Alasan penyesuaian saldo wajib diisi untuk catatan audit sistem.');
      return;
    }
    const { userId, amount, reason } = manualTokenAdjustModal;
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tokenBalance: Math.max(0, u.tokenBalance + amount) } : u))
    );
    showToast(`Penyesuaian saldo (${amount > 0 ? '+' : ''}${amount} Token) berhasil dicatat. Alasan: ${reason}`, 'info');
    setManualTokenAdjustModal(null);
  };

  const handleSendBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;
    onSendBroadcast(broadcastForm.title, broadcastForm.message);
    showToast(`Pengumuman broadcast berhasil disebarkan ke seluruh pelaku UMKM!`, 'success');
    setBroadcastForm({ title: '', message: '', priority: 'INFO' });
  };

  const handleCreateTemplate = () => {
    if (!newTemplateData.name) return;
    const newTpl: Template = {
      id: `tpl_custom_${Date.now()}`,
      name: newTemplateData.name,
      category: newTemplateData.category,
      description: newTemplateData.desc,
      tokenCost: newTemplateData.tokenCost,
      isActive: true,
      usageCount: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      sectionsJson: [],
    };
    setTemplates([newTpl, ...templates]);
    setIsNewTemplateModalOpen(false);
    setNewTemplateData({ name: '', category: 'Kuliner & F&B', desc: '', tokenCost: 15 });
    showToast(`Template master "${newTpl.name}" berhasil ditambahkan ke katalog.`, 'success');
  };

  // ----------------------------------------------------------------
  // Filtered Lists
  // ----------------------------------------------------------------
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.businessName && u.businessName.toLowerCase().includes(userSearch.toLowerCase()));
      const matchStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
      const matchPlan = userPlanFilter === 'ALL' || u.planId === userPlanFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [registeredUsers, userSearch, userStatusFilter, userPlanFilter]);

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(websiteSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(websiteSearch.toLowerCase()) ||
        (p.businessName && p.businessName.toLowerCase().includes(websiteSearch.toLowerCase()));
      const matchStatus = websiteStatusFilter === 'ALL' || p.publishStatus === websiteStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [pages, websiteSearch, websiteStatusFilter]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.invoiceCode.toLowerCase().includes(txSearch.toLowerCase()) ||
        t.packageName.toLowerCase().includes(txSearch.toLowerCase());
      const matchStatus = txStatusFilter === 'ALL' || t.status === txStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, txSearch, txStatusFilter]);

  // Menu items metadata
  const menuList: { id: AdminMenuView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { id: 'users', label: 'Pengguna', icon: <Users size={18} /> },
    { id: 'websites', label: 'Website', icon: <Globe size={18} /> },
    { id: 'templates', label: 'Template', icon: <Layout size={18} /> },
    { id: 'tokens', label: 'Transaksi & Token', icon: <Coins size={18} /> },
    { id: 'schedules', label: 'Jadwal AI', icon: <Calendar size={18} /> },
    { id: 'notifications', label: 'Notifikasi', icon: <Bell size={18} /> },
    { id: 'logs', label: 'Log Aktivitas', icon: <Activity size={18} /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings size={18} /> },
    { id: 'profile', label: 'Profil Admin', icon: <UserIcon size={18} /> },
  ];

  const currentMenuMeta = menuList.find((m) => m.id === activeMenu) || menuList[0];

  // Admin Role Guard Check
  if (currentUser && currentUser.role !== 'ADMIN') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(16, 43, 34, 0.08)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Shield size={28} color="#DC2626" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#102B3F', margin: '0 0 8px' }}>
            Akses Terbatas
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#557184', lineHeight: 1.6, margin: '0 0 24px' }}>
            Portal internal ini hanya dapat diakses oleh Administrator Sistem UNI-LANDFARM yang terotorisasi.
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              background: '#102B3F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="eloq-page"
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      {/* ============================================================
          TOAST NOTIFICATION FLOATING
          ============================================================ */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background:
              toastMessage.type === 'warning'
                ? '#F59E0B'
                : toastMessage.type === 'info'
                ? '#11331f'
                : '#16A34A',
            color: '#FFFFFF',
            borderRadius: '14px',
            padding: '12px 20px',
            boxShadow: '0 14px 34px rgba(11, 23, 16, 0.24)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.86rem',
            fontWeight: 600,
          }}
        >
          {toastMessage.type === 'warning' ? (
            <AlertTriangle size={18} color="#FFFFFF" />
          ) : toastMessage.type === 'info' ? (
            <Activity size={18} color="#FFFFFF" />
          ) : (
            <CheckCircle2 size={18} color="#FFFFFF" />
          )}
          <span>{toastMessage.title}</span>
        </div>
      )}

      {/* ============================================================
          1. SIDEBAR ADMIN (Modern Deep Forest Olive Studio)
          ============================================================ */}
      <aside
        style={{
          width: isSidebarCollapsed ? '78px' : '252px',
          background: 'linear-gradient(180deg, #102B3F 0%, #0A1C2A 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '8px 0 32px rgba(10, 28, 42, 0.25)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width 0.25s ease',
          zIndex: 100,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Top: Brand & Admin Identity */}
        <div>
          {/* Logo & Admin Panel Badge */}
          <div
            style={{
              padding: isSidebarCollapsed ? '18px 10px' : '20px 18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={onBackToHome}
              title="Kembali ke Beranda"
            >
              <UniLandLogo size={isSidebarCollapsed ? 'sm' : 'md'} variant="dark" />
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                title="Ciutkan Sidebar"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ‹
              </button>
            )}
          </div>

          {/* Admin User Identity Card */}
          {!isSidebarCollapsed ? (
            <div
              style={{
                padding: '12px 14px',
                margin: '14px 14px 10px',
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#183C57',
                  color: '#C6F36B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(16, 43, 63, 0.4)',
                }}
              >
                AD
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Super Admin'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#C6F36B', marginTop: '2px' }}>
                  <span className="eloq-pulse-dot" style={{ width: '6px', height: '6px', background: '#C6F36B' }} />
                  <span>Admin Operasional</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                title="Perluas Sidebar"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                ›
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <nav
            style={{
              padding: isSidebarCollapsed ? '8px 8px' : '6px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              maxHeight: 'calc(100vh - 280px)',
              overflowY: 'auto',
            }}
          >
            {menuList.map((m) => {
              const isActive = activeMenu === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveMenu(m.id);
                    setIsMobileDrawerOpen(false);
                  }}
                  title={m.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isSidebarCollapsed ? '10px 0' : '10px 14px',
                    justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '13px',
                    border: isActive ? '1px solid rgba(198, 243, 107, 0.45)' : '1px solid transparent',
                    background: isActive
                      ? '#183C57'
                      : 'transparent',
                    boxShadow: isActive ? '0 8px 20px rgba(16, 43, 63, 0.5)' : 'none',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'left',
                    width: '100%',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                    }
                  }}
                >
                  <span style={{ color: isActive ? '#C6F36B' : 'rgba(255,255,255,0.65)', display: 'flex' }}>
                    {m.icon}
                  </span>
                  {!isSidebarCollapsed && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.label}
                    </span>
                  )}
                  {isActive && !isSidebarCollapsed && (
                    <span
                      style={{
                        position: 'absolute',
                        right: '12px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#C6F36B',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Home & Logout */}
        <div
          style={{
            padding: isSidebarCollapsed ? '16px 8px' : '14px 14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              title="Lihat Website Publik"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: isSidebarCollapsed ? '9px 0' : '9px 12px',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '11px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              <Globe size={15} />
              {!isSidebarCollapsed && <span>Halaman Utama</span>}
            </button>
          )}

          <button
            onClick={() => {
              if (onLogout) onLogout();
              else if (onBackToHome) onBackToHome();
            }}
            title="Keluar dari Panel Admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: isSidebarCollapsed ? '9px 0' : '9px 12px',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              borderRadius: '11px',
              background: 'rgba(239, 68, 68, 0.14)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              color: '#FCA5A5',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <LogOut size={15} />
            {!isSidebarCollapsed && <span>Keluar Admin</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT WRAPPER: TOP HEADER + WORKSPACE PAGES
          ============================================================ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* ============================================================
            2. HEADER UTAMA (Glassmorphic Studio Header)
            ============================================================ */}
        <header
          style={{
            height: '72px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(35, 55, 38, 0.08)',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            flexShrink: 0,
          }}
        >
          {/* Left: Breadcrumbs & Page Titles */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#557184', marginBottom: '2px' }}>
              <span>Admin Studio</span>
              <span>/</span>
              <span style={{ color: '#102B3F', fontWeight: 600 }}>{currentMenuMeta.label}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#102B3F', letterSpacing: '-0.025em' }}>
              {activeMenu === 'dashboard'
                ? 'Overview Platform'
                : currentMenuMeta.label}
            </div>
          </div>

          {/* Right: Global Search, Notif Bell, Admin Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Global Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F8FAF7',
                border: '1px solid rgba(85, 113, 132, 0.16)',
                borderRadius: '9999px',
                padding: '7px 14px',
                width: '230px',
              }}
            >
              <Search size={14} color="#557184" />
              <input
                type="text"
                placeholder="Cari pengguna, website..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.8rem',
                  color: '#102B3F',
                  width: '100%',
                }}
              />
            </div>

            {/* Notification Bell with Badge */}
            <div
              onClick={() => setActiveMenu('notifications')}
              title="Notifikasi Operasional"
              style={{
                position: 'relative',
                cursor: 'pointer',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid rgba(85, 113, 132, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#102B3F',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  background: '#C6F36B',
                  color: '#102B3F',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
              >
                {transactions.filter((t) => t.status === 'PENDING').length + 1}
              </span>
            </div>

            {/* Admin Avatar Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '4px 12px 4px 5px',
                background: '#ffffff',
                border: '1px solid rgba(85, 113, 132, 0.16)',
                borderRadius: '9999px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#183C57',
                  color: '#C6F36B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                }}
              >
                AD
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#102B3F' }}>
                  Super Admin
                </div>
                <div style={{ fontSize: '0.65rem', color: '#557184' }}>Verified</div>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
            VIEW CONTENT CONTAINER
            ============================================================ */}
        <div style={{ flex: 1, padding: '24px 28px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {/* ============================================================
              1. DASHBOARD VIEW (RINGKASAN & OPERASIONAL)
              ============================================================ */}
          {activeMenu === 'dashboard' && (
            <div>
              {/* 4 SUMMARY STAT CARDS IN ONE CLEAN 4-COLUMN ROW */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {/* A. Total Pengguna */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    border: '1px solid rgba(85, 113, 132, 0.12)',
                    boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#557184', letterSpacing: '0.05em' }}>TOTAL PENGGUNA</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF7D5', color: '#102B3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={17} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#102B3F', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                      {registeredUsers.length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#102B3F', marginTop: '8px', fontWeight: 600 }}>
                      <span style={{ color: '#102B3F' }}>● {registeredUsers.filter((u) => u.status === 'ACTIVE').length} Aktif</span>
                      {registeredUsers.some((u) => u.status === 'SUSPENDED') && (
                        <span style={{ color: '#DC2626' }}>• {registeredUsers.filter((u) => u.status === 'SUSPENDED').length} Suspend</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* B. Total Website */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    border: '1px solid rgba(85, 113, 132, 0.12)',
                    boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#557184', letterSpacing: '0.05em' }}>TOTAL WEBSITE MIKRO</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF7D5', color: '#102B3F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={17} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#102B3F', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                      {pages.length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '8px' }}>
                      <span style={{ color: '#102B3F', fontWeight: 600 }}>
                        ● {pages.filter((p) => p.publishStatus === 'PUBLISHED').length} Live
                      </span>
                      <span style={{ color: '#557184' }}>• {pages.filter((p) => p.publishStatus === 'DRAFT').length} Draft</span>
                    </div>
                  </div>
                </div>

                {/* C. Total Token Beredar (Highlighted Deep Navy SaaS Card) */}
                <div
                  style={{
                    background: 'linear-gradient(145deg, #102B3F 0%, #183C57 100%)',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    border: '1px solid rgba(198, 243, 107, 0.3)',
                    boxShadow: '0 16px 36px -8px rgba(16, 43, 63, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>TOKEN BEREDAR</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.14)', color: '#C6F36B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coins size={17} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                      {registeredUsers.reduce((sum, u) => sum + (u.tokenBalance || 0), 0).toLocaleString('id-ID')}
                    </div>
                    <div
                      onClick={() => setActiveMenu('tokens')}
                      style={{ fontSize: '0.75rem', color: '#C6F36B', marginTop: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Kelola Token</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                {/* D. Transaksi Menunggu Verifikasi */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    border: '1px solid rgba(85, 113, 132, 0.12)',
                    boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#557184', letterSpacing: '0.05em' }}>VERIFIKASI TOP-UP</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={17} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#102B3F', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                      {transactions.filter((t) => t.status === 'PENDING').length}{' '}
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#557184' }}>Antrean</span>
                    </div>
                    <div
                      onClick={() => setActiveMenu('tokens')}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#D97706', marginTop: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <span>● Cek Bukti Bayar</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRAFIK AKTIVITAS PLATFORM (Smooth Cubic Bezier Studio Area Chart) */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '26px 28px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  boxShadow: '0 12px 32px rgba(24, 38, 26, 0.04)',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 700, color: '#102B3F', letterSpacing: '-0.02em' }}>
                        Analitik Pertumbuhan Platform
                      </h3>
                      <span
                        style={{
                          background: '#EAF7D5',
                          color: '#102B3F',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        +34.8% Bulan Ini
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#557184' }}>
                      Tren metrik operasional real-time berdasarkan rentang waktu terpilih.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Metric Selectors */}
                    <div style={{ display: 'flex', background: '#F8FAF7', padding: '4px', borderRadius: '999px', border: '1px solid rgba(85, 113, 132, 0.12)' }}>
                      {(['users', 'websites', 'ai', 'tokens'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setChartMetric(m)}
                          style={{
                            background:
                              chartMetric === m
                                ? '#102B3F'
                                : 'transparent',
                            color: chartMetric === m ? '#C6F36B' : '#557184',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '6px 14px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {m === 'users' ? 'Pengguna' : m === 'websites' ? 'Website' : m === 'ai' ? 'AI Request' : 'Token'}
                        </button>
                      ))}
                    </div>

                    {/* Period Switcher */}
                    <div style={{ display: 'flex', background: '#F8FAF7', padding: '4px', borderRadius: '999px', border: '1px solid rgba(85, 113, 132, 0.12)' }}>
                      {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setActivityChartPeriod(p)}
                          style={{
                            background: activityChartPeriod === p ? '#FFFFFF' : 'transparent',
                            color: activityChartPeriod === p ? '#102B3F' : '#557184',
                            border: 'none',
                            borderRadius: '999px',
                            padding: '6px 12px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            boxShadow: activityChartPeriod === p ? '0 2px 6px rgba(16, 43, 63, 0.1)' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          {p === '7d' ? '7 Hari' : p === '30d' ? '30 Hari' : '90 Hari'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Smooth Cubic-Bezier SVG Area Chart */}
                <div style={{ height: '230px', width: '100%', position: 'relative' }}>
                  <svg width="100%" height="195" viewBox="0 0 900 195" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="eloqAdminChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6F36B" stopOpacity="0.35" />
                        <stop offset="65%" stopColor="#C6F36B" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#C6F36B" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="eloqAdminStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#102B3F" />
                        <stop offset="50%" stopColor="#183C57" />
                        <stop offset="100%" stopColor="#84CC16" />
                      </linearGradient>
                    </defs>

                    {/* Subtle Horizontal Grid lines */}
                    <line x1="0" y1="35" x2="900" y2="35" stroke="rgba(85, 113, 132, 0.12)" strokeDasharray="4 4" />
                    <line x1="0" y1="85" x2="900" y2="85" stroke="rgba(85, 113, 132, 0.12)" strokeDasharray="4 4" />
                    <line x1="0" y1="135" x2="900" y2="135" stroke="rgba(85, 113, 132, 0.12)" strokeDasharray="4 4" />
                    <line x1="0" y1="185" x2="900" y2="185" stroke="rgba(85, 113, 132, 0.16)" />

                    {/* Smooth Cubic Bezier Area Fill */}
                    <path
                      d="M 0,165 C 70,160 95,145 150,138 C 210,130 240,95 300,98 C 360,101 390,118 450,92 C 510,66 540,52 600,48 C 660,44 690,58 750,38 C 810,18 855,16 900,12 L 900,185 L 0,185 Z"
                      fill="url(#eloqAdminChartGrad)"
                    />

                    {/* Smooth Cubic Bezier Line */}
                    <path
                      d="M 0,165 C 70,160 95,145 150,138 C 210,130 240,95 300,98 C 360,101 390,118 450,92 C 510,66 540,52 600,48 C 660,44 690,58 750,38 C 810,18 855,16 900,12"
                      fill="none"
                      stroke="url(#eloqAdminStrokeGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Glowing Data Dots */}
                    {[
                      { x: 150, y: 138 },
                      { x: 300, y: 98 },
                      { x: 450, y: 92 },
                      { x: 600, y: 48 },
                      { x: 750, y: 38 },
                      { x: 900, y: 12 },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="7" fill="rgba(198, 243, 107, 0.35)" />
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#102B3F" strokeWidth="2.5" />
                      </g>
                    ))}
                  </svg>

                  {/* X-Axis labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#557184', fontSize: '0.75rem', fontWeight: 500, marginTop: '8px' }}>
                    <span>1 Okt</span>
                    <span>5 Okt</span>
                    <span>10 Okt</span>
                    <span>15 Okt</span>
                    <span>20 Okt</span>
                    <span>25 Okt</span>
                    <span style={{ color: '#102B3F', fontWeight: 800 }}>Hari Ini</span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMNS: AKTIVITAS TERBARU & RINGKASAN TOKEN/AI */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '24px',
                  marginBottom: '28px',
                }}
              >
                {/* Left: Aktivitas Terbaru Timeline */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid #E7E6DE',
                    boxShadow: '0 4px 16px rgba(24, 38, 26, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#102B3F' }}>
                      Aktivitas Terbaru
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#102B3F', fontWeight: 700 }}>● Real-time</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { icon: '🌐', title: 'Website "Kopi Robusta Slamet" Dipublikasikan', user: 'Budi Santoso', time: '12 menit lalu', tag: 'PUBLISH' },
                      { icon: '💳', title: 'Top-Up 200 Token via QRIS Berhasil', user: 'Dewi Sartika', time: '45 menit lalu', tag: 'PAYMENT' },
                      { icon: '✨', title: 'Generasi Konten AI Katalog 3 Varian', user: 'Ratna Anindya', time: '2 jam lalu', tag: 'AI_STUDIO' },
                      { icon: '👥', title: 'Pendaftaran Akun Baru UMKM', user: 'Eko Prasetyo (Bibit Buah)', time: '4 jam lalu', tag: 'NEW_USER' },
                      { icon: '🛡️', title: 'Verifikasi Mutasi Bank BCA Selesai', user: 'Admin System', time: '5 jam lalu', tag: 'VERIFY' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F8FAF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#102B3F' }}>{item.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#557184', marginTop: '2px' }}>
                            {item.user} • <span style={{ color: '#557184' }}>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Ringkasan Penggunaan Token & AI */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid rgba(85, 113, 132, 0.12)',
                    boxShadow: '0 4px 16px rgba(16, 43, 63, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#102B3F' }}>
                      Distribusi Layanan AI & Gateway
                    </h3>
                    <span
                      onClick={() => setActiveMenu('ai-studio')}
                      style={{ fontSize: '0.76rem', color: '#102B3F', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Detail →
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Feature 1 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#102B3F' }}>Headline & Banner Studio</span>
                        <span style={{ fontWeight: 700, color: '#102B3F' }}>42% (14.280 Token)</span>
                      </div>
                      <div style={{ height: '8px', background: '#F0ECE1', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #102B3F, #183C57)' }} />
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#102B3F' }}>Katalog & Deskripsi Produk</span>
                        <span style={{ fontWeight: 700, color: '#D97706' }}>35% (11.900 Token)</span>
                      </div>
                      <div style={{ height: '8px', background: '#F0ECE1', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '35%', height: '100%', background: '#F59E0B' }} />
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#102B3F' }}>Jadwal Promo & Content Scheduler</span>
                        <span style={{ fontWeight: 700, color: '#102B3F' }}>15% (5.100 Token)</span>
                      </div>
                      <div style={{ height: '8px', background: '#F0ECE1', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '15%', height: '100%', background: '#C6F36B' }} />
                      </div>
                    </div>

                    {/* Gateway Status Badge row */}
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '12px 14px',
                        background: '#F8FAF7',
                        borderRadius: '12px',
                        border: '1px solid rgba(85, 113, 132, 0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#102B3F' }}>
                        Integrasi Pembayaran QRIS / VA
                      </div>
                      <span style={{ background: '#EAF7D5', color: '#102B3F', padding: '3px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                        ● Midtrans Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABEL PERHATIAN OPERASIONAL: TRANSAKSI BUTUH VERIFIKASI */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px 28px',
                  border: '1px solid rgba(85, 113, 132, 0.12)',
                  boxShadow: '0 4px 16px rgba(16, 43, 63, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#102B3F' }}>
                      Transaksi Memerlukan Verifikasi Manual
                    </h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#557184' }}>
                      Daftar transfer rekening bank manual yang melampirkan foto struk bukti pembayaran.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveMenu('tokens')}
                    className="btn-outline-navy"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.78rem',
                    }}
                  >
                    Buka Seluruh Transaksi →
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(85, 113, 132, 0.16)', color: '#557184' }}>
                        <th style={{ padding: '10px 14px' }}>Invoice</th>
                        <th style={{ padding: '10px 14px' }}>Paket Token</th>
                        <th style={{ padding: '10px 14px' }}>Nominal</th>
                        <th style={{ padding: '10px 14px' }}>Metode</th>
                        <th style={{ padding: '10px 14px' }}>Bukti Struk</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Aksi Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter((t) => t.status === 'PENDING')
                        .slice(0, 4)
                        .map((tx) => (
                          <tr key={tx.id} style={{ borderBottom: '1px solid rgba(85, 113, 132, 0.08)' }}>
                            <td style={{ padding: '14px', fontWeight: 700, color: '#102B3F' }}>
                              {tx.invoiceCode}
                            </td>
                            <td style={{ padding: '14px', color: '#102B3F' }}>
                              <span style={{ fontWeight: 700 }}>+{tx.tokenAmount} Token</span>
                              <div style={{ fontSize: '0.72rem', color: '#557184' }}>{tx.packageName}</div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: 800, color: '#102B3F' }}>
                              Rp {tx.amountPaid.toLocaleString('id-ID')}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                                {tx.paymentMethod}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              {tx.proofImageUrl ? (
                                <button
                                  onClick={() => setViewProofModal(tx.proofImageUrl || null)}
                                  style={{
                                    background: '#F8FAF7',
                                    border: '1px solid rgba(85, 113, 132, 0.2)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    color: '#102B3F',
                                  }}
                                >
                                  📷 Lihat Struk
                                </button>
                              ) : (
                                <span style={{ color: '#557184', fontSize: '0.72rem' }}>Tidak ada</span>
                              )}
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                  onClick={() => setVerifyRejectModal({ tx, action: 'verify', note: 'Mutasi valid' })}
                                  style={{
                                    background: '#C6F36B',
                                    color: '#102B3F',
                                    border: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '999px',
                                    fontWeight: 800,
                                    fontSize: '0.76rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  ✓ Setujui
                                </button>
                                <button
                                  onClick={() => setVerifyRejectModal({ tx, action: 'reject', note: 'Bukti transfer tidak valid' })}
                                  style={{
                                    background: 'transparent',
                                    color: '#EF4444',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    fontWeight: 700,
                                    fontSize: '0.76rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Tolak
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              2. MANAJEMEN PENGGUNA VIEW
              ============================================================ */}
          {activeMenu === 'users' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 28px',
                border: '1px solid #E7E6DE',
                boxShadow: '0 4px 16px rgba(16, 43, 34, 0.04)',
              }}
            >
              {/* Filter & Search Bar Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                    Daftar Pengguna Platform ({filteredUsers.length})
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                    Kelola status akun UMKM, verifikasi, dan pantau website milik pengguna.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Cari nama, email, toko..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      width: '210px',
                    }}
                  />

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="ACTIVE">Aktif (Active)</option>
                    <option value="SUSPENDED">Ditangguhkan (Suspended)</option>
                    <option value="PENDING_VERIFICATION">Menunggu Verifikasi</option>
                  </select>

                  <select
                    value={userPlanFilter}
                    onChange={(e) => setUserPlanFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="ALL">Semua Paket</option>
                    <option value="plan_starter">Starter UMKM</option>
                    <option value="plan_pro">Paket Pro</option>
                    <option value="plan_business">Paket Bisnis</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #E7E6DE', color: '#6D786F' }}>
                      <th style={{ padding: '12px 14px' }}>Pengguna</th>
                      <th style={{ padding: '12px 14px' }}>Email & Kontak</th>
                      <th style={{ padding: '12px 14px' }}>Paket Layanan</th>
                      <th style={{ padding: '12px 14px' }}>Website</th>
                      <th style={{ padding: '12px 14px' }}>Saldo Token</th>
                      <th style={{ padding: '12px 14px' }}>Status Akun</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F0EFEA' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: '#183C57',
                                color: '#C6F36B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.84rem',
                                flexShrink: 0,
                              }}
                            >
                              {u.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#102B3F' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#557184' }}>{u.businessName || 'Profil Mikro'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px', color: '#18251F' }}>
                          <div>{u.email}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8FA295' }}>{u.phoneNumber}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              background: u.planId === 'plan_business' ? '#F3E8FF' : u.planId === 'plan_pro' ? '#FEF9E7' : '#F3F4F6',
                              color: u.planId === 'plan_business' ? '#7E22CE' : u.planId === 'plan_pro' ? '#B45309' : '#374151',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                            }}
                          >
                            {u.planName}
                          </span>
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#173C2E' }}>
                          {u.websitesCount} Website
                        </td>
                        <td style={{ padding: '14px', fontWeight: 800, color: '#18251F' }}>
                          {u.tokenBalance} ⚡
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              background: u.status === 'ACTIVE' ? '#DCFCE7' : u.status === 'SUSPENDED' ? '#FEE2E2' : '#FEF3C7',
                              color: u.status === 'ACTIVE' ? '#15803D' : u.status === 'SUSPENDED' ? '#B91C1C' : '#B45309',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            {u.status === 'ACTIVE' ? '● Aktif' : u.status === 'SUSPENDED' ? '✕ Ditangguhkan' : '⏳ Verifikasi'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedUserDetail(u)}
                              style={{
                                background: '#F7F5EF',
                                border: '1px solid #D8D7CE',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Detail
                            </button>

                            {u.status === 'ACTIVE' ? (
                              <button
                                onClick={() => setUserStatusModal({ user: u, nextStatus: 'SUSPENDED', reason: '' })}
                                style={{
                                  background: 'transparent',
                                  color: '#EF4444',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Tangguhkan
                              </button>
                            ) : (
                              <button
                                onClick={() => setUserStatusModal({ user: u, nextStatus: 'ACTIVE', reason: '' })}
                                style={{
                                  background: '#16A34A',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Aktifkan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              3. MANAJEMEN WEBSITE VIEW
              ============================================================ */}
          {activeMenu === 'websites' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 28px',
                border: '1px solid #E7E6DE',
                boxShadow: '0 4px 16px rgba(16, 43, 34, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                    Daftar Website Terdaftar ({filteredPages.length})
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                    Pantau website pengguna, buka pratinjau live, atau lakukan moderasi konten.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Cari judul website, domain..."
                    value={websiteSearch}
                    onChange={(e) => setWebsiteSearch(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                      outline: 'none',
                      width: '220px',
                    }}
                  />

                  <select
                    value={websiteStatusFilter}
                    onChange={(e) => setWebsiteStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PUBLISHED">Aktif (Published)</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SUSPENDED">Ditangguhkan (Takedown)</option>
                  </select>
                </div>
              </div>

              {/* Websites Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #E7E6DE', color: '#6D786F' }}>
                      <th style={{ padding: '12px 14px' }}>Nama Website</th>
                      <th style={{ padding: '12px 14px' }}>Pemilik Toko</th>
                      <th style={{ padding: '12px 14px' }}>Domain / Slug</th>
                      <th style={{ padding: '12px 14px' }}>Statistik Kunjungan</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Aksi Moderasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map((pg) => (
                      <tr key={pg.id} style={{ borderBottom: '1px solid #F0EFEA' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: '#18251F' }}>{pg.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#6D786F' }}>{pg.category || 'Usaha Umum'}</div>
                        </td>
                        <td style={{ padding: '14px', color: '#18251F' }}>
                          {pg.businessName || 'Pemilik Toko'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            onClick={() => onOpenPublicView && onOpenPublicView(pg.slug)}
                            title="Buka pratinjau publik"
                            style={{
                              color: '#173C2E',
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            uniland.id/{pg.slug} ↗
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 700, color: '#18251F' }}>
                            {pg.viewCount || 240} views
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6D786F' }}>
                            {pg.uniqueVisitors || 120} pengunjung unik
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              background: pg.publishStatus === 'PUBLISHED' ? '#DCFCE7' : pg.publishStatus === 'SUSPENDED' ? '#FEE2E2' : '#F3F4F6',
                              color: pg.publishStatus === 'PUBLISHED' ? '#15803D' : pg.publishStatus === 'SUSPENDED' ? '#B91C1C' : '#4B5563',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            {pg.publishStatus === 'PUBLISHED' ? '● Live Online' : pg.publishStatus === 'SUSPENDED' ? '✕ Takedown' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => onOpenPublicView && onOpenPublicView(pg.slug)}
                              style={{
                                background: '#F7F5EF',
                                border: '1px solid #D8D7CE',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              👁️ Pratinjau
                            </button>

                            {onOpenCms && (
                              <button
                                onClick={() => onOpenCms(pg)}
                                style={{
                                  background: '#FEF9E7',
                                  color: '#B45309',
                                  border: '1px solid #FDE68A',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                ⚙️ CMS
                              </button>
                            )}

                            {pg.publishStatus !== 'SUSPENDED' && (
                              <button
                                onClick={() => setTakedownModal({ page: pg, reason: '' })}
                                style={{
                                  background: 'transparent',
                                  color: '#EF4444',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                Takedown
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              4. MANAJEMEN TEMPLATE VIEW
              ============================================================ */}
          {activeMenu === 'templates' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                    Manajemen Template Website ({templates.length})
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                    Kelola ketersediaan desain template industri bagi pelaku UMKM.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewTemplateModalOpen(true)}
                  className="eloq-btn-grey"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.82rem',
                  }}
                >
                  <span>+</span>
                  <span>Tambah Template Master</span>
                </button>
              </div>

              {/* Template Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E7E6DE',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(16, 43, 34, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ height: '140px', background: '#F7F5EF', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={tpl.thumbnailUrl || '/assets/coffee_thumb.jpg'}
                          alt={tpl.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(23, 60, 46, 0.9)',
                            color: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                          }}
                        >
                          {tpl.category}
                        </span>
                      </div>

                      <div style={{ padding: '16px 18px 10px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#18251F', marginBottom: '4px' }}>
                          {tpl.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#6D786F', lineHeight: 1.45, marginBottom: '10px' }}>
                          {tpl.description || 'Template modern untuk bisnis UMKM yang siap dikustomisasi.'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#8FA295' }}>
                          <span>Dipakai oleh: <strong style={{ color: '#18251F' }}>{tpl.usageCount || 120} UMKM</strong></span>
                          <span>Biaya: <strong style={{ color: '#173C2E' }}>{tpl.tokenCost || 15} Token</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '12px 18px 16px', borderTop: '1px solid #F0EFEA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: tpl.isActive ? '#16A34A' : '#9CA3AF', fontWeight: 700 }}>
                        {tpl.isActive ? '● Aktif Digunakan' : '○ Dinonaktifkan'}
                      </span>

                      <button
                        onClick={() => {
                          setTemplates((prev) =>
                            prev.map((t) => (t.id === tpl.id ? { ...t, isActive: !t.isActive } : t))
                          );
                          showToast(`Status template "${tpl.name}" berhasil diperbarui.`, 'info');
                        }}
                        style={{
                          background: '#F7F5EF',
                          border: '1px solid #D8D7CE',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {tpl.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              5. MANAJEMEN PAKET VIEW
              ============================================================ */}
          {activeMenu === 'plans' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 28px',
                border: '1px solid #E7E6DE',
                boxShadow: '0 4px 16px rgba(16, 43, 34, 0.04)',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                  Manajemen Paket Berlangganan Platform
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                  Atur tarif langganan, kuota website aktif, dan batas token berkala bagi pengguna.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {plans.map((pl) => (
                  <div
                    key={pl.id}
                    style={{
                      background: '#F7F5EF',
                      borderRadius: '16px',
                      padding: '22px',
                      border: '1px solid #E7E6DE',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#102B3F' }}>{pl.name}</span>
                        {pl.badge && (
                          <span style={{ background: '#C6F36B', color: '#102B3F', padding: '2px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                            {pl.badge}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#102B3F', marginBottom: '8px' }}>
                        Rp {pl.monthlyPrice.toLocaleString('id-ID')} <span style={{ fontSize: '0.75rem', color: '#557184', fontWeight: 400 }}>/ bulan</span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: '#6D786F', lineHeight: 1.45, marginBottom: '16px' }}>
                        {pl.description}
                      </p>

                      <div style={{ borderTop: '1px solid #E7E6DE', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#18251F' }}>
                        <div>🌐 Batas Website: <strong>{String(pl.limits.websites)}</strong></div>
                        <div>⚡ Kuota Token: <strong>{String(pl.limits.tokens)} Token / bln</strong></div>
                        <div>🎨 Template: <strong>{pl.limits.templates === 'all' ? 'Semua Kategori' : 'Standar'}</strong></div>
                        <div>🔗 Custom Domain: <strong>{pl.limits.customDomain ? 'Didukung (.id/.com)' : 'Tidak'}</strong></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <button
                        onClick={() => alert(`Pengaturan tarif & kuota ${pl.name} membutuhkan konfirmasi otoritas Superadmin.`)}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #D8D7CE',
                          padding: '8px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          color: '#173C2E',
                          cursor: 'pointer',
                        }}
                      >
                        ⚙️ Edit Batas &amp; Kuota
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              6. MANAJEMEN TOKEN VIEW
              ============================================================ */}
          {activeMenu === 'tokens' && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px 28px',
                border: '1px solid #E7E6DE',
                boxShadow: '0 4px 16px rgba(16, 43, 34, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                    Riwayat Transaksi &amp; Peredaran Token
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                    Kelola verifikasi top-up token dan pantau peredaran token AI platform.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setManualTokenAdjustModal({ userId: registeredUsers[0]?.id || 'usr_umkm_01', amount: 50, reason: '' })}
                    className="eloq-btn-grey"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.78rem',
                    }}
                  >
                    + Penyesuaian Saldo Manual
                  </button>

                  <select
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D8D7CE',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PENDING">Menunggu Verifikasi</option>
                    <option value="SUCCESS">Berhasil (Success)</option>
                    <option value="REJECTED">Ditolak (Rejected)</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #E7E6DE', color: '#6D786F' }}>
                      <th style={{ padding: '12px 14px' }}>Invoice</th>
                      <th style={{ padding: '12px 14px' }}>Paket &amp; Token</th>
                      <th style={{ padding: '12px 14px' }}>Nominal</th>
                      <th style={{ padding: '12px 14px' }}>Metode</th>
                      <th style={{ padding: '12px 14px' }}>Tanggal</th>
                      <th style={{ padding: '12px 14px' }}>Bukti Struk</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #F0EFEA' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#18251F' }}>
                          {tx.invoiceCode}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ fontWeight: 800, color: '#173C2E' }}>+{tx.tokenAmount} Token</span>
                          <div style={{ fontSize: '0.72rem', color: '#6D786F' }}>{tx.packageName}</div>
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#18251F' }}>
                          Rp {tx.amountPaid.toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '14px', color: '#6D786F' }}>
                          {tx.paymentMethod}
                        </td>
                        <td style={{ padding: '14px', color: '#6D786F' }}>
                          {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {tx.proofImageUrl ? (
                            <button
                              onClick={() => setViewProofModal(tx.proofImageUrl || null)}
                              style={{
                                background: '#F7F5EF',
                                border: '1px solid #D8D7CE',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                              }}
                            >
                              📷 Struk
                            </button>
                          ) : (
                            <span style={{ color: '#8FA295', fontSize: '0.72rem' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              background: tx.status === 'SUCCESS' ? '#DCFCE7' : tx.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                              color: tx.status === 'SUCCESS' ? '#15803D' : tx.status === 'REJECTED' ? '#B91C1C' : '#B45309',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          {tx.status === 'PENDING' ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                onClick={() => setVerifyRejectModal({ tx, action: 'verify', note: 'Mutasi valid' })}
                                style={{
                                  background: '#16A34A',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => setVerifyRejectModal({ tx, action: 'reject', note: 'Bukti transfer tidak sesuai' })}
                                style={{
                                  background: 'transparent',
                                  color: '#EF4444',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#8FA295' }}>Selesai</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              7. AI CONTENT STUDIO & PEMANTAUAN AI VIEW
              ============================================================ */}
          {activeMenu === 'ai-studio' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                  AI Content Studio &amp; Status Mesin AI
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                  Pemantauan kinerja model AI (Gemini 2.0 Flash engine), konsumsi token, dan latensi respons.
                </p>
              </div>

              {/* Status Engine Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E7E6DE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>STATUS ENGINE AI</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>● Online Optimal</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6D786F', marginTop: '4px' }}>Gemini Cloud Engine 2.0</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E7E6DE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>RATA-RATA LATENSI</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18251F', marginTop: '6px' }}>
                    1.28 detik
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#16A34A', marginTop: '4px' }}>99.9% di bawah 2 detik</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E7E6DE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>TOTAL PERMINTAAN</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18251F', marginTop: '6px' }}>
                    2.890 request
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6D786F', marginTop: '4px' }}>Bulan Oktober 2026</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: '14px', border: '1px solid #E7E6DE' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>SUCCESS RATE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A', marginTop: '6px' }}>
                    99.8%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6D786F', marginTop: '4px' }}>Hanya 6 kali retry</div>
                </div>
              </div>

              {/* Log Generasi AI Terakhir */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px', border: '1px solid #E7E6DE' }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.96rem', fontWeight: 800, color: '#18251F' }}>
                  Log Permintaan Generasi Konten Terkini
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { store: 'Kopi Robusta Slamet', type: 'Hero Headline & Copy', status: 'SUCCESS', cost: 5, latency: '1.1s', time: '5 menit lalu' },
                    { store: 'Sambal Bu Dewi', type: 'Katalog Varian Produk', status: 'SUCCESS', cost: 10, latency: '1.4s', time: '14 menit lalu' },
                    { store: 'Greenora Natural', type: 'Penyusunan Jadwal Promo', status: 'SUCCESS', cost: 8, latency: '1.2s', time: '30 menit lalu' },
                    { store: 'Batik Loka Nusantara', type: 'Rephrase & Tone Friendly', status: 'SUCCESS', cost: 3, latency: '0.9s', time: '1 jam lalu' },
                  ].map((lg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F7F5EF', borderRadius: '10px', fontSize: '0.8rem' }}>
                      <div>
                        <strong style={{ color: '#18251F' }}>{lg.store}</strong>
                        <span style={{ color: '#6D786F' }}> — {lg.type}</span>
                        <div style={{ fontSize: '0.72rem', color: '#8FA295' }}>{lg.time}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                          ✓ Sukses ({lg.latency})
                        </span>
                        <span style={{ fontWeight: 800, color: '#173C2E' }}>-{lg.cost} Token</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              8. ANALITIK PLATFORM VIEW
              ============================================================ */}
          {activeMenu === 'analytics' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#18251F' }}>
                  Analitik &amp; Pertumbuhan Platform
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6D786F' }}>
                  Metrik adopsi UMKM, rasio publikasi website, dan pendapatan top-up token.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {/* Card 1: Distribusi Industri UMKM */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px', border: '1px solid #E7E6DE' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '0.94rem', fontWeight: 800, color: '#18251F' }}>
                    Kategori UMKM Terbanyak
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Pertanian &amp; Kopi Lereng Gunung</span>
                        <strong>38% (542 UMKM)</strong>
                      </div>
                      <div style={{ height: '7px', background: '#F0EFEA', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '38%', height: '100%', background: '#173C2E' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Kuliner &amp; Makanan Ringan (F&amp;B)</span>
                        <strong>32% (456 UMKM)</strong>
                      </div>
                      <div style={{ height: '7px', background: '#F0EFEA', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '32%', height: '100%', background: '#F9C80E' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Herbal, Minyak Atsiri &amp; Madu</span>
                        <strong>18% (257 UMKM)</strong>
                      </div>
                      <div style={{ height: '7px', background: '#F0EFEA', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '18%', height: '100%', background: '#10B981' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>Fashion &amp; Batik Kriya Nusantara</span>
                        <strong>12% (171 UMKM)</strong>
                      </div>
                      <div style={{ height: '7px', background: '#F0EFEA', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '12%', height: '100%', background: '#8B5CF6' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Conversion Funnel */}
                <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px', border: '1px solid #E7E6DE' }}>
                  <h4 style={{ margin: '0 0 16px', fontSize: '0.94rem', fontWeight: 800, color: '#18251F' }}>
                    Konversi Pendaftaran ke Website Aktif
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem' }}>
                    <div style={{ padding: '10px 14px', background: '#F7F5EF', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>1. Akun Terdaftar</span>
                      <strong>1.428 UMKM (100%)</strong>
                    </div>
                    <div style={{ padding: '10px 14px', background: '#F7F5EF', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>2. Mulai Edit di CMS</span>
                      <strong>1.120 UMKM (78.4%)</strong>
                    </div>
                    <div style={{ padding: '10px 14px', background: '#DCFCE7', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#166534' }}>
                      <span>3. Berhasil Publikasi Live</span>
                      <strong>942 Website (65.9%)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              9. NOTIFIKASI & BROADCAST VIEW
              ============================================================ */}
          {activeMenu === 'notifications' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {/* Form Broadcast Pengumuman */}
              <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1px solid #E7E6DE' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#18251F' }}>
                  Kirim Broadcast ke Seluruh UMKM
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '0.78rem', color: '#6D786F' }}>
                  Pesan broadcast akan muncul di lonceng notifikasi dashboard toko seluruh pengguna.
                </p>

                <form onSubmit={handleSendBroadcastAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                      Judul Pengumuman
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: ✨ Fitur Baru AI Content Scheduler Telah Rilis!"
                      value={broadcastForm.title}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                      Kategori Pesan
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['INFO', 'PROMO', 'WARNING'] as const).map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setBroadcastForm({ ...broadcastForm, priority: pr })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #D8D7CE',
                            background: broadcastForm.priority === pr ? '#173C2E' : '#FFFFFF',
                            color: broadcastForm.priority === pr ? '#FFFFFF' : '#18251F',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pr === 'INFO' ? 'ℹ️ Informasi' : pr === 'PROMO' ? '🎁 Promo / Diskon' : '⚠️ Peringatan'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                      Isi Pesan Pengumuman
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan isi pengumuman atau instruksi untuk pelaku UMKM..."
                      value={broadcastForm.message}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="eloq-btn-grey"
                    style={{
                      padding: '11px',
                      fontSize: '0.84rem',
                      width: '100%',
                    }}
                  >
                    📢 Sebarkan Pengumuman Sekarang
                  </button>
                </form>
              </div>

              {/* Notifikasi Kejadian Masuk untuk Admin */}
              <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1px solid #E7E6DE' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#18251F' }}>
                  Pemberitahuan Sistem Admin
                </h3>
                <p style={{ margin: '0 0 18px', fontSize: '0.78rem', color: '#6D786F' }}>
                  Kejadian penting yang membutuhkan pemantauan atau tindak lanjut.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#92400E' }}>⚠️ 1 Transaksi Transfer Manual Menunggu</strong>
                      <span style={{ fontSize: '0.7rem', color: '#B45309' }}>10 mnt lalu</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#78350F' }}>
                      Invoice INV-20261015-0109 senilai Rp 25.000 mengunggah struk BCA.
                    </div>
                  </div>

                  <div style={{ padding: '12px 14px', background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#166534' }}>✓ Backup Database Harian Sukses</strong>
                      <span style={{ fontSize: '0.7rem', color: '#15803D' }}>03:00 WIB</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#14532D' }}>
                      Snapshot PostgreSQL dan file assets aman tersimpan di secure storage.
                    </div>
                  </div>

                  <div style={{ padding: '12px 14px', background: '#F7F5EF', border: '1px solid #E7E6DE', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#18251F' }}>ℹ️ Kuota API AI Terpantau Stabil</strong>
                      <span style={{ fontSize: '0.7rem', color: '#6D786F' }}>Kemarin</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#6D786F' }}>
                      Tersedia 450.000 quota tokens untuk model generative Gemini.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              10. PENGATURAN SISTEM & AUDIT LOG VIEW
              ============================================================ */}
          {activeMenu === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Konfigurasi Platform */}
              <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px 28px', border: '1px solid #E7E6DE' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#18251F' }}>
                  Konfigurasi Operasional Platform
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '0.8rem', color: '#6D786F' }}>
                  Pengaturan parameter global aplikasi UNI-LANDFARM.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#F7F5EF', borderRadius: '12px', border: '1px solid #E7E6DE' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>BONUS TOKEN PENDAFTARAN</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#173C2E', marginTop: '6px' }}>25 Token</div>
                    <div style={{ fontSize: '0.72rem', color: '#8FA295', marginTop: '2px' }}>Diberikan otomatis untuk UMKM baru</div>
                  </div>

                  <div style={{ padding: '16px', background: '#F7F5EF', borderRadius: '12px', border: '1px solid #E7E6DE' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>KUOTA WEBSITE GRATIS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#173C2E', marginTop: '6px' }}>1 Website Aktif</div>
                    <div style={{ fontSize: '0.72rem', color: '#8FA295', marginTop: '2px' }}>Paket Starter UMKM</div>
                  </div>

                  <div style={{ padding: '16px', background: '#F7F5EF', borderRadius: '12px', border: '1px solid #E7E6DE' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6D786F', fontWeight: 700 }}>MODE PEMELIHARAAN</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16A34A', marginTop: '6px' }}>OFF (Live Normal)</div>
                    <div style={{ fontSize: '0.72rem', color: '#8FA295', marginTop: '2px' }}>Sistem berjalan 100% online</div>
                  </div>
                </div>
              </div>

              {/* Audit Log Keamanan */}
              <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px 28px', border: '1px solid #E7E6DE' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#18251F' }}>
                  Audit Log Tindakan Administratif
                </h3>
                <p style={{ margin: '0 0 18px', fontSize: '0.8rem', color: '#6D786F' }}>
                  Pencatatan riwayat aksi sensitif demi keamanan dan transparansi platform.
                </p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #E7E6DE', color: '#6D786F' }}>
                        <th style={{ padding: '10px 12px' }}>Admin</th>
                        <th style={{ padding: '10px 12px' }}>Aksi Tindakan</th>
                        <th style={{ padding: '10px 12px' }}>Objek Sasaran</th>
                        <th style={{ padding: '10px 12px' }}>Waktu</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { admin: 'Superadmin HQ', action: 'VERIFY_PAYMENT', target: 'INV-20261012-0042 (+200 Token)', time: '2026-10-12 10:18 WIB', status: 'SUCCESS' },
                        { admin: 'Superadmin HQ', action: 'UPDATE_USER_STATUS', target: 'Rudi Hartono (SUSPENDED)', time: '2026-10-10 14:22 WIB', status: 'SUCCESS' },
                        { admin: 'Superadmin HQ', action: 'BROADCAST_ANNOUNCEMENT', target: 'Seluruh Pengguna UMKM', time: '2026-10-08 09:00 WIB', status: 'SUCCESS' },
                        { admin: 'System Audit', action: 'DB_DAILY_BACKUP', target: 'PostgreSQL Snapshot AWS S3', time: '2026-10-22 03:00 WIB', status: 'SUCCESS' },
                      ].map((log, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F0EFEA' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#18251F' }}>{log.admin}</td>
                          <td style={{ padding: '12px' }}>
                            <code style={{ background: '#F7F5EF', padding: '2px 6px', borderRadius: '4px', fontSize: '0.74rem' }}>
                              {log.action}
                            </code>
                          </td>
                          <td style={{ padding: '12px', color: '#18251F' }}>{log.target}</td>
                          <td style={{ padding: '12px', color: '#6D786F' }}>{log.time}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ color: '#16A34A', fontWeight: 800 }}>✓ {log.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            ADMIN FOOTER (Unified Deep Navy SaaS Footer)
            ============================================================ */}
        <footer
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(180deg, #102B3F 0%, #0A1C2A 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 28px',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <UniLandLogo size="sm" variant="dark" />

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
              <button
                type="button"
                onClick={() => setActiveMenu('dashboard')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu('users')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Pengguna
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu('websites')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Website Mikro
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu('templates')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Template
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu('tokens')}
                style={{ background: 'transparent', border: 'none', color: '#C6F36B', cursor: 'pointer', fontSize: '0.8rem', padding: 0, fontWeight: 700 }}
              >
                Transaksi &amp; Token
              </button>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              &copy; {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* ============================================================
          MODALS SECTION (Clean, accessible, confirmed actions)
          ============================================================ */}

      {/* 1. Modal Detail Pengguna */}
      {selectedUserDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#18251F' }}>
                Profil Pengguna UMKM
              </h3>
              <button onClick={() => setSelectedUserDetail(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6D786F' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Nama Pemilik:</span>
                <strong style={{ color: '#18251F' }}>{selectedUserDetail.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Nama Usaha:</span>
                <strong style={{ color: '#18251F' }}>{selectedUserDetail.businessName || 'Usaha UMKM'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Email:</span>
                <span style={{ color: '#18251F' }}>{selectedUserDetail.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Nomor WhatsApp:</span>
                <span style={{ color: '#18251F' }}>{selectedUserDetail.phoneNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Paket Langganan:</span>
                <span style={{ fontWeight: 700, color: '#173C2E' }}>{selectedUserDetail.planName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EFEA', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Saldo Token:</span>
                <strong style={{ color: '#18251F' }}>{selectedUserDetail.tokenBalance} Token</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                <span style={{ color: '#6D786F' }}>Terdaftar Sejak:</span>
                <span style={{ color: '#6D786F' }}>{selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleDateString('id-ID') : '-'}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedUserDetail(null)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Ubah Status Pengguna (Konfirmasi & Alasan Wajib) */}
      {userStatusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800, color: userStatusModal.nextStatus === 'SUSPENDED' ? '#EF4444' : '#16A34A' }}>
              {userStatusModal.nextStatus === 'SUSPENDED' ? '⚠️ Konfirmasi Penangguhan Akun' : '✓ Konfirmasi Pengaktifan Akun'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#6D786F', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin mengubah status akun <strong>{userStatusModal.user.name}</strong> ({userStatusModal.user.email}) menjadi <strong>{userStatusModal.nextStatus}</strong>?
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                Alasan Tindakan Administratif (Wajib diisi):
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan alasan penangguhan atau pengaktifan..."
                value={userStatusModal.reason}
                onChange={(e) => setUserStatusModal({ ...userStatusModal, reason: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setUserStatusModal(null)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmUserStatus}
                style={{
                  background: userStatusModal.nextStatus === 'SUSPENDED' ? '#EF4444' : '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Konfirmasi Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Takedown Website */}
      {takedownModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800, color: '#EF4444' }}>
              🛡️ Moderasi &amp; Takedown Website
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#6D786F', lineHeight: 1.5 }}>
              Website <strong>"{takedownModal.page.title}"</strong> (uniland.id/{takedownModal.page.slug}) akan dinonaktifkan dari akses publik.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                Alasan Takedown / Pelanggaran (Wajib diisi):
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Mengandung indikasi penipuan, pelanggaran hak cipta, atau produk terlarang..."
                value={takedownModal.reason}
                onChange={(e) => setTakedownModal({ ...takedownModal, reason: e.target.value })}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setTakedownModal(null)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmTakedown}
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Takedown Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Lihat Bukti Transfer */}
      {viewProofModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '440px', width: '100%', padding: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#18251F' }}>
                Bukti Struk Transfer Bank
              </h3>
              <button onClick={() => setViewProofModal(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6D786F' }}>✕</button>
            </div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E7E6DE', maxHeight: '380px' }}>
              <img src={viewProofModal} alt="Bukti Transfer" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button
                onClick={() => setViewProofModal(null)}
                style={{ background: '#173C2E', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Verifikasi / Tolak Transaksi */}
      {verifyRejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800, color: verifyRejectModal.action === 'verify' ? '#16A34A' : '#EF4444' }}>
              {verifyRejectModal.action === 'verify' ? '✓ Verifikasi Pembayaran Sukses' : '✕ Tolak Bukti Pembayaran'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#6D786F', lineHeight: 1.5 }}>
              Invoice <strong>{verifyRejectModal.tx.invoiceCode}</strong> sebesar <strong>Rp {verifyRejectModal.tx.amountPaid.toLocaleString('id-ID')}</strong> ({verifyRejectModal.tx.packageName})
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '6px' }}>
                Catatan Verifikasi Admin:
              </label>
              <textarea
                rows={3}
                placeholder="Catatan untuk riwayat audit dan notifikasi..."
                value={verifyRejectModal.note}
                onChange={(e) => setVerifyRejectModal({ ...verifyRejectModal, note: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setVerifyRejectModal(null)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmTransactionAction}
                style={{
                  background: verifyRejectModal.action === 'verify' ? '#16A34A' : '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {verifyRejectModal.action === 'verify' ? 'Setujui & Tambah Token' : 'Tolak Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Penyesuaian Saldo Manual */}
      {manualTokenAdjustModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '460px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800, color: '#173C2E' }}>
              ⚡ Penyesuaian Saldo Token Manual
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#6D786F' }}>
              Tindakan ini memerlukan pencatatan alasan resmi dan otorisasi Superadmin.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>
                  Pilih Pengguna UMKM:
                </label>
                <select
                  value={manualTokenAdjustModal.userId}
                  onChange={(e) => setManualTokenAdjustModal({ ...manualTokenAdjustModal, userId: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                >
                  {registeredUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} — {u.businessName} (Saldo: {u.tokenBalance})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>
                  Jumlah Token (+ untuk menambah, - untuk mengurangi):
                </label>
                <input
                  type="number"
                  value={manualTokenAdjustModal.amount}
                  onChange={(e) => setManualTokenAdjustModal({ ...manualTokenAdjustModal, amount: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>
                  Alasan Penyesuaian Saldo (Wajib):
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Kompensasi gangguan teknis atau bonus program kemitraan..."
                  value={manualTokenAdjustModal.reason}
                  onChange={(e) => setManualTokenAdjustModal({ ...manualTokenAdjustModal, reason: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setManualTokenAdjustModal(null)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleManualTokenSubmit}
                style={{ background: '#173C2E', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Simpan Penyesuaian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Tambah Template Master */}
      {isNewTemplateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '18px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1.1rem', fontWeight: 800, color: '#173C2E' }}>
              Tambah Template Master Baru
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>Nama Template:</label>
                <input
                  type="text"
                  placeholder="Contoh: Agrowisata Buah Petik Sendiri"
                  value={newTemplateData.name}
                  onChange={(e) => setNewTemplateData({ ...newTemplateData, name: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>Kategori Industri:</label>
                <select
                  value={newTemplateData.category}
                  onChange={(e) => setNewTemplateData({ ...newTemplateData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                >
                  <option value="Kuliner & F&B">Kuliner & F&B</option>
                  <option value="Perkebunan & Kopi">Perkebunan & Kopi</option>
                  <option value="Kesehatan & Herbal">Kesehatan & Herbal</option>
                  <option value="Fashion & Kriya">Fashion & Kriya</option>
                  <option value="Jasa & Edukasi">Jasa & Edukasi</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>Biaya Token Pembukaan:</label>
                <input
                  type="number"
                  value={newTemplateData.tokenCost}
                  onChange={(e) => setNewTemplateData({ ...newTemplateData, tokenCost: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#18251F', marginBottom: '4px' }}>Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan gaya layout dan fitur bawaan template..."
                  value={newTemplateData.desc}
                  onChange={(e) => setNewTemplateData({ ...newTemplateData, desc: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid #D8D7CE', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsNewTemplateModalOpen(false)}
                style={{ background: '#F7F5EF', border: '1px solid #D8D7CE', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleCreateTemplate}
                style={{ background: '#173C2E', color: '#FFFFFF', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Simpan Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPortal;
