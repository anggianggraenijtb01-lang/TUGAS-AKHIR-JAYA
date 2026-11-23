import React, { useState, useRef, useEffect } from 'react';
import { User, LandingPage, Template, Transaction, Notification } from '../types';
import { UniLandLogo } from './UniLandLogo';
import { TokenTopUpPage } from './TokenTopUpPage';
import { ProfilePageView } from './ProfilePageView';
import { NotificationsPageView } from './NotificationsPageView';
import {
  LayoutGrid,
  Globe,
  Edit3,
  Layout,
  Coins,
  Bell,
  UserIcon,
  LogOut,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Search,
} from './icons/LucideIcons';

interface UserDashboardPortalProps {
  currentUser: User;
  pages: LandingPage[];
  templates: Template[];
  transactions?: Transaction[];
  notifications?: Notification[];
  onOpenCms: (page: LandingPage) => void;
  onOpenPublicView: (slug: string) => void;
  onCreateNewWebsite: (template?: Template) => void;
  onOpenTopUp: () => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onUpdateUser?: (updated: User) => void;
  onDeletePage?: (pageId: string) => void;
  onTopUpCreated?: (newTx: Transaction) => void;
  onUploadProof?: (txId: string, proofUrl: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onMarkNotificationRead?: (id: string) => void;
}

export type UserSidebarTab =
  | 'dashboard'
  | 'website-saya'
  | 'cms'
  | 'template'
  | 'token'
  | 'notifikasi'
  | 'profil';

export const UserDashboardPortal: React.FC<UserDashboardPortalProps> = ({
  currentUser: initialUser,
  pages,
  templates,
  transactions = [],
  notifications = [],
  onOpenCms,
  onOpenPublicView,
  onCreateNewWebsite,
  onOpenTopUp,
  onLogout,
  onBackToHome,
  onUpdateUser,
  onDeletePage,
  onTopUpCreated,
  onUploadProof,
  onMarkAllNotificationsRead,
  onMarkNotificationRead,
}) => {
  const [activeTab, setActiveTab] = useState<UserSidebarTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('Semua');
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Profile menu dropdown state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Filters for "Website Saya" tab
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [websiteSearchQuery, setWebsiteSearchQuery] = useState('');

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Sync user state updates
  const handleUpdateUserData = (updated: User) => {
    setCurrentUser(updated);
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
  };

  // Real statistics derived from actual user data
  const totalWebsites = pages.length;
  const publishedCount = pages.filter((p) => p.publishStatus === 'PUBLISHED').length;
  const draftCount = pages.filter((p) => p.publishStatus === 'DRAFT').length;
  const tokenBalance = currentUser.tokenBalance;
  const unreadNotifCount = notifications.filter((n) => n.readStatus === 'UNREAD').length;

  // Primary page to edit
  const primaryPage = pages[0] || null;

  // Sidebar navigation menu items: ONLY 4 items (No Notifikasi, No Saldo, No Keluar Akun, No Profil)
  const sidebarNavItems: Array<{ id: UserSidebarTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutGrid size={18} />,
    },
    {
      id: 'website-saya',
      label: 'Website Saya',
      icon: <Globe size={18} />,
      badge: totalWebsites,
    },
    {
      id: 'cms',
      label: 'CMS Editor',
      icon: <Edit3 size={18} />,
    },
    {
      id: 'template',
      label: 'Template',
      icon: <Layout size={18} />,
    },
  ];

  // Template categories filter
  const templateCategories = ['Semua', 'Kuliner & F&B', 'Kesehatan & Herbal', 'Perkebunan & Kopi', 'Fashion & Kriya'];
  const filteredTemplates = templates.filter((tpl) => {
    if (selectedTemplateCategory === 'Semua') return true;
    return tpl.category.toLowerCase().includes(selectedTemplateCategory.toLowerCase());
  });

  // Filtered websites for "Website Saya" tab
  const filteredPages = pages.filter((page) => {
    if (websiteFilter === 'published' && page.publishStatus !== 'PUBLISHED') return false;
    if (websiteFilter === 'draft' && page.publishStatus !== 'DRAFT') return false;
    if (websiteSearchQuery.trim()) {
      const q = websiteSearchQuery.toLowerCase();
      const matchName = (page.businessName || page.title || '').toLowerCase().includes(q);
      const matchSlug = (page.slug || '').toLowerCase().includes(q);
      const matchDesc = (page.description || '').toLowerCase().includes(q);
      return matchName || matchSlug || matchDesc;
    }
    return true;
  });

  // Reusable Aesthetic Studio Website Card (Eloqwnt + Emerald Gradient)
  const renderWebsiteCard = (page: LandingPage, showDelete: boolean = false) => {
    const isPublished = page.publishStatus === 'PUBLISHED';
    const heroSec = (page.sections || []).find((s) => s.sectionType === 'HERO');
    const rawHeroImg = heroSec?.contentJson?.heroImage;
    const previewImg =
      rawHeroImg && !rawHeroImg.includes('greenora_hero_photo') && !rawHeroImg.includes('unsplash.com')
        ? rawHeroImg
        : page.slug.includes('greenora')
        ? '/assets/products/greenora-hero.svg'
        : page.slug.includes('kopi')
        ? '/assets/coffee_hero_bg.jpg?v=2'
        : page.slug.includes('hidroponik')
        ? '/assets/products/hydro-hero.svg'
        : '/assets/products/sambal-hero.svg';

    return (
      <div
        key={page.id}
        style={{
          background: '#FFFFFF',
          borderRadius: '22px',
          padding: '10px',
          border: '1px solid rgba(20, 60, 35, 0.08)',
          boxShadow: '0 10px 30px rgba(15, 42, 25, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 44px rgba(15, 42, 25, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(29, 86, 52, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 42, 25, 0.04)';
          e.currentTarget.style.borderColor = 'rgba(20, 60, 35, 0.08)';
        }}
      >
        {/* Top Visual Preview Frame */}
        <div>
          <div
            onClick={() => onOpenPublicView(page.slug)}
            style={{
              height: '136px',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, #102B3F 0%, #183C57 100%)',
              cursor: 'pointer',
            }}
          >
            <img
              src={previewImg}
              alt={page.businessName || page.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: 0.9,
                transition: 'transform 0.5s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(16,43,63,0.2) 0%, rgba(16,43,63,0.75) 100%)',
              }}
            />

            {/* Floating Domain Pill & Status Badge */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#102B3F',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  maxWidth: '165px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                🔒 {page.slug}.uniland.id
              </span>

              <span
                style={{
                  background: isPublished ? '#C6F36B' : 'rgba(245, 158, 11, 0.92)',
                  color: isPublished ? '#102B3F' : '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: isPublished ? '#102B3F' : '#ffffff',
                  }}
                />
                {isPublished ? 'Live' : 'Draft'}
              </span>
            </div>

            {/* Bottom Category Tag Inside Preview */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                fontSize: '0.7rem',
              }}
            >
              <span
                style={{
                  background: 'rgba(16, 43, 63, 0.8)',
                  backdropFilter: 'blur(6px)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  color: '#C6F36B',
                }}
              >
                {page.category || 'Website Mikro'}
              </span>
              <span style={{ fontWeight: 600, opacity: 0.9 }}>
                {(page.sections || []).length} Blok • {page.viewCount || 0} dilihat
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '14px 8px 10px' }}>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.04rem',
                fontWeight: 700,
                color: '#102B3F',
                margin: '0 0 4px',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              {page.businessName || page.title}
            </h3>

            <p
              style={{
                fontSize: '0.8rem',
                color: '#557184',
                margin: 0,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {page.description || 'Website mikro dan kehadiran digital terpadu.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 4px 2px',
          }}
        >
          <button
            onClick={() => onOpenCms(page)}
            className="btn-navy"
            style={{
              flex: 1,
              padding: '8px 14px',
              fontSize: '0.8rem',
              borderRadius: '12px',
            }}
          >
            <Edit3 size={13} />
            <span>{showDelete ? 'Edit CMS' : 'Buka CMS'}</span>
          </button>

          <button
            onClick={() => onOpenPublicView(page.slug)}
            className="btn-outline-navy"
            style={{
              padding: '8px 13px',
              fontSize: '0.8rem',
              borderRadius: '12px',
            }}
          >
            <Eye size={13} />
            <span>Demo</span>
          </button>

          {showDelete && onDeletePage && (
            <button
              onClick={() => onDeletePage(page.id)}
              title="Hapus Website Ini"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#DC2626',
                borderRadius: '12px',
                padding: '8px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="eloq-page"
      style={{
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* ============================================================
          SIDEBAR NAVIGATION (Modern Floating Deep Forest Olive Studio)
          ============================================================ */}
      {/* ============================================================
          SIDEBAR NAVIGATION (Deep Navy & Fresh Lime SaaS Layout)
          ============================================================ */}
      <aside
        style={{
          width: '252px',
          background: 'linear-gradient(180deg, #102B3F 0%, #0A1C2A 100%)',
          color: '#F8FAF7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(85, 113, 132, 0.2)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxSizing: 'border-box',
          padding: '24px 16px',
          flexShrink: 0,
          zIndex: 40,
          boxShadow: '8px 0 32px rgba(16, 43, 63, 0.18)',
        }}
      >
        <div>
          {/* Logo UNI-LANDFARM */}
          <div
            style={{ padding: '0 8px', marginBottom: '28px', cursor: 'pointer' }}
            onClick={onBackToHome}
            title="Kembali ke Beranda Publik"
          >
            <UniLandLogo size="md" variant="dark" />
          </div>

          {/* Clean Sidebar Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sidebarNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'cms') {
                      if (primaryPage) {
                        onOpenCms(primaryPage);
                      } else {
                        onCreateNewWebsite();
                      }
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '14px',
                    border: isActive ? '1px solid rgba(198, 243, 107, 0.45)' : '1px solid transparent',
                    background: isActive ? '#183C57' : 'transparent',
                    boxShadow: isActive ? '0 8px 20px rgba(16, 43, 63, 0.35)' : 'none',
                    color: isActive ? '#FFFFFF' : 'rgba(248, 250, 247, 0.72)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
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
                      e.currentTarget.style.color = 'rgba(248, 250, 247, 0.72)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <span style={{ color: isActive ? '#C6F36B' : 'rgba(248,250,247,0.65)', display: 'flex' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        background: isActive ? '#C6F36B' : 'rgba(198, 243, 107, 0.2)',
                        color: isActive ? '#102B3F' : '#C6F36B',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Studio Card inside Sidebar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#C6F36B',
                boxShadow: '0 0 10px #C6F36B',
              }}
            />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>
              Agentic AI Studio
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'rgba(248,250,247,0.68)', margin: '0 0 12px', lineHeight: 1.45 }}>
            Buat website mikro atau rancang struktur konten baru dalam hitungan detik.
          </p>
          <button
            onClick={() => onCreateNewWebsite()}
            className="btn-lime"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '0.78rem',
              boxShadow: '0 4px 14px rgba(198, 243, 107, 0.4)',
            }}
          >
            + Website AI Baru
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA (Compact & Flush Footer Layout)
          ============================================================ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box', backgroundColor: '#F8FAF7' }}>
        <div style={{ flex: 1, padding: '24px 32px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(85, 113, 132, 0.14)',
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#102B3F', letterSpacing: '-0.025em' }}>
              {activeTab === 'dashboard' && 'Dashboard Pengguna'}
              {activeTab === 'website-saya' && 'Kelola Website Mikro'}
              {activeTab === 'template' && 'Katalog Template'}
              {activeTab === 'token' && 'Saldo AI & Top-Up'}
              {activeTab === 'notifikasi' && 'Notifikasi Sistem'}
              {activeTab === 'profil' && 'Profil & Pengaturan Akun'}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#557184', fontSize: '0.84rem' }}>
              Selamat datang kembali, <strong>{currentUser.name}</strong> •{' '}
              {currentUser.businessName || 'Kehadiran Digital'}
            </p>
          </div>

          {/* Right Header: Notification Badge & Profile Pill with Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }} ref={profileMenuRef}>
            {/* Notification Button */}
            <button
              onClick={() => setActiveTab('notifikasi')}
              title="Buka Notifikasi"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid rgba(85, 113, 132, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                color: '#102B3F',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(16, 43, 63, 0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#102B3F')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(85, 113, 132, 0.2)')}
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '7px',
                    right: '7px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#C6F36B',
                    border: '1.5px solid #102B3F',
                  }}
                />
              )}
            </button>

            {/* Profile Avatar Capsule */}
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              title="Menu Akun & Profil"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: isProfileMenuOpen ? '1.5px solid #102B3F' : '1px solid rgba(85, 113, 132, 0.2)',
                borderRadius: '9999px',
                padding: '4px 14px 4px 5px',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: isProfileMenuOpen ? '0 4px 14px rgba(16, 43, 63, 0.1)' : '0 2px 6px rgba(16, 43, 63, 0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#102B3F',
                  color: '#C6F36B',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {(currentUser.name || 'U').substring(0, 1).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#102B3F' }}>
                {currentUser.name}
              </span>
              <ChevronDown
                size={13}
                color="#557184"
                style={{
                  transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </div>

            {/* Dropdown Menu Popup */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(85, 113, 132, 0.16)',
                  boxShadow: '0 16px 40px rgba(16, 43, 63, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  padding: '10px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {/* User info mini header */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(85, 113, 132, 0.12)' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#102B3F' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#557184', marginTop: '2px' }}>
                    {currentUser.email || currentUser.phoneNumber || 'Akun UMKM Terverifikasi'}
                  </div>
                </div>

                {/* Token Balance inside Dropdown */}
                <div
                  style={{
                    background: '#F8FAF7',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    margin: '8px 0',
                    border: '1px solid rgba(85, 113, 132, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Coins size={15} color="#102B3F" />
                    <div>
                      <div style={{ fontSize: '0.64rem', color: '#557184', fontWeight: 600 }}>Saldo Token</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#102B3F' }}>
                        {tokenBalance} Token
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('token');
                    }}
                    style={{
                      background: '#C6F36B',
                      color: '#102B3F',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Top-Up +
                  </button>
                </div>

                {/* Dropdown Navigation Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('profil');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: '#202720',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F7F5EE')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <UserIcon size={14} color="#687A4D" />
                    <span>Profil &amp; Pengaturan</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('notifikasi');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: '#202720',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F7F5EE')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={14} color="#687A4D" />
                      <span>Notifikasi</span>
                    </div>
                    {unreadNotifCount > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '9999px' }}>
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Logout Divider & Button */}
                <div style={{ borderTop: '1px solid #F0ECE1', paddingTop: '4px', marginTop: '2px' }}>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setShowLogoutConfirmModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: '#B91C1C',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FEE2E2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={14} color="#B91C1C" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            TAB 1: DASHBOARD UMKM
            ============================================================ */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Loading Skeleton if triggered */}
            {isLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div className="skeleton-loading" style={{ height: '90px', borderRadius: '14px' }} />
                <div className="skeleton-loading" style={{ height: '90px', borderRadius: '14px' }} />
                <div className="skeleton-loading" style={{ height: '90px', borderRadius: '14px' }} />
              </div>
            )}

            {/* Error Message with Retry */}
            {fetchError && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontSize: '0.84rem' }}>
                  <AlertTriangle size={16} />
                  <span>{fetchError}</span>
                </div>
                <button
                  onClick={() => {
                    setFetchError(null);
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 500);
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #FCA5A5',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#991B1B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={11} />
                  <span>Coba Lagi</span>
                </button>
              </div>
            )}

            {/* Modern SaaS Bento Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
                marginBottom: '28px',
              }}
            >
              {/* Card 1: Total Website */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px 26px',
                  border: '1px solid rgba(85, 113, 132, 0.14)',
                  boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#557184', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Website Mikro
                  </span>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: '#EAF7D5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#102B3F',
                    }}
                  >
                    <Globe size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#102B3F', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                  {totalWebsites}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#557184', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>● {publishedCount} Live</span>
                  <span>•</span>
                  <span>{draftCount} Draft</span>
                </div>
              </div>

              {/* Card 2: Saldo Token AI (Highlighted Deep Navy & Lime Studio Card) */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #102B3F 0%, #183C57 100%)',
                  color: '#F8FAF7',
                  borderRadius: '22px',
                  padding: '24px 26px',
                  border: '1px solid rgba(198, 243, 107, 0.35)',
                  boxShadow: '0 16px 36px -8px rgba(16, 43, 63, 0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#C6F36B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Saldo Token AI
                  </span>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C6F36B',
                    }}
                  >
                    <Coins size={18} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                    {tokenBalance}{' '}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(248, 250, 247, 0.72)' }}>Token</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('token')}
                    className="btn-lime"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      boxShadow: '0 4px 12px rgba(198, 243, 107, 0.4)',
                    }}
                  >
                    Top-Up ↗
                  </button>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(248, 250, 247, 0.7)', marginTop: '10px' }}>
                  Siap digunakan untuk Agentic AI CMS &amp; copywriter
                </div>
              </div>

              {/* Card 3: Notifikasi Aktif */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '24px 26px',
                  border: '1px solid rgba(85, 113, 132, 0.14)',
                  boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#557184', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Pemberitahuan
                  </span>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: '#F0F5EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#102B3F',
                    }}
                  >
                    <Bell size={18} />
                  </div>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#102B3F', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                  {unreadNotifCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#557184', marginTop: '10px' }}>
                  {unreadNotifCount > 0 ? 'Pesan baru belum dibaca' : 'Semua pesan telah dibaca'}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Websites */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C6F36B', boxShadow: '0 0 10px #C6F36B' }} />
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#102B3F', margin: 0, letterSpacing: '-0.02em' }}>
                    Daftar Website Mikro Anda
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {pages.length > 0 && (
                    <button
                      onClick={() => setActiveTab('website-saya')}
                      className="btn-outline-navy"
                      style={{
                        padding: '7px 15px',
                        fontSize: '0.82rem',
                      }}
                    >
                      Lihat Semua ({pages.length}) →
                    </button>
                  )}
                  <button
                    onClick={() => onCreateNewWebsite()}
                    className="btn-lime"
                    style={{
                      padding: '8px 18px',
                      fontSize: '0.84rem',
                    }}
                  >
                    <Plus size={15} />
                    <span>Buat Website Baru</span>
                  </button>
                </div>
              </div>

              {/* Empty State when no websites */}
              {pages.length === 0 ? (
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    border: '1px solid #D5CDB8',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#F7F5EE',
                      color: '#687A4D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}
                  >
                    <Globe size={24} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#102B3F', margin: '0 0 6px' }}>
                    Belum Ada Website yang Dibuat
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#557184', margin: '0 0 16px', maxWidth: '380px', marginInline: 'auto' }}>
                    Mulai perkenalkan usaha atau profil Anda dengan membuat website mikro instan menggunakan template siap pakai.
                  </p>
                  <button
                    onClick={() => setActiveTab('template')}
                    className="btn-lime"
                    style={{
                      padding: '10px 18px',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span>Pilih Template Sekarang</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {pages.map((page) => renderWebsiteCard(page, false))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: WEBSITE SAYA (Kelola Website Saya)
            ============================================================ */}
        {activeTab === 'website-saya' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B3F', margin: 0 }}>
                  Semua Website Anda ({pages.length})
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#557184', margin: '3px 0 0' }}>
                  Kelola, edit konten, atau pratinjau landing page produk toko Anda.
                </p>
              </div>

              <button
                onClick={() => onCreateNewWebsite()}
                className="eloq-btn-grey"
                style={{
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                }}
              >
                <Plus size={15} />
                <span>Buat Website Baru</span>
              </button>
            </div>

            {/* Filter Pills & Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '18px',
                flexWrap: 'wrap',
              }}
            >
              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setWebsiteFilter('all')}
                  style={{
                    background: websiteFilter === 'all' ? '#102B3F' : '#FFFFFF',
                    color: websiteFilter === 'all' ? '#F8FAF7' : '#557184',
                    border: websiteFilter === 'all' ? '1px solid #102B3F' : '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: websiteFilter === 'all' ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Semua ({totalWebsites})
                </button>
                <button
                  onClick={() => setWebsiteFilter('published')}
                  style={{
                    background: websiteFilter === 'published' ? '#102B3F' : '#FFFFFF',
                    color: websiteFilter === 'published' ? '#C6F36B' : '#557184',
                    border: websiteFilter === 'published' ? '1px solid #102B3F' : '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: websiteFilter === 'published' ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Terpublikasi ({publishedCount})
                </button>
                <button
                  onClick={() => setWebsiteFilter('draft')}
                  style={{
                    background: websiteFilter === 'draft' ? '#102B3F' : '#FFFFFF',
                    color: websiteFilter === 'draft' ? '#F8FAF7' : '#557184',
                    border: websiteFilter === 'draft' ? '1px solid #102B3F' : '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: websiteFilter === 'draft' ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Draft ({draftCount})
                </button>
              </div>

              {/* Search Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(85, 113, 132, 0.2)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  width: '240px',
                }}
              >
                <Search size={15} color="#557184" />
                <input
                  type="text"
                  placeholder="Cari website..."
                  value={websiteSearchQuery}
                  onChange={(e) => setWebsiteSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.82rem',
                    width: '100%',
                    background: 'transparent',
                    color: '#102B3F',
                  }}
                />
              </div>
            </div>

            {/* Websites Grid */}
            {filteredPages.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  border: '1px solid #D5CDB8',
                }}
              >
                <p style={{ fontSize: '0.86rem', color: '#687A4D', margin: 0 }}>
                  Tidak ada website yang sesuai dengan filter atau kata kunci pencarian.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {filteredPages.map((p) => renderWebsiteCard(p, true))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: TEMPLATE
            ============================================================ */}
        {activeTab === 'template' && (
          <div>
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#102B3F', margin: 0 }}>
                Katalog Template Website Mikro
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#557184', margin: '4px 0 0' }}>
                Pilih template profesional yang telah dioptimalkan untuk persona dan industri Anda.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {templateCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTemplateCategory(cat)}
                  style={{
                    background: selectedTemplateCategory === cat ? '#102B3F' : '#FFFFFF',
                    color: selectedTemplateCategory === cat ? '#F8FAF7' : '#557184',
                    border: selectedTemplateCategory === cat ? '1px solid #102B3F' : '1px solid rgba(85, 113, 132, 0.2)',
                    borderRadius: '999px',
                    padding: '7px 18px',
                    fontSize: '0.82rem',
                    fontWeight: selectedTemplateCategory === cat ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(85, 113, 132, 0.16)',
                    boxShadow: '0 8px 24px rgba(16, 43, 63, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div>
                    {tpl.thumbnailUrl ? (
                      <img
                        src={tpl.thumbnailUrl}
                        alt={tpl.name}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '160px',
                          background: '#F0F5EE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#557184',
                        }}
                      >
                        <Layout size={36} />
                      </div>
                    )}

                    <div style={{ padding: '18px 20px 10px' }}>
                      <span
                        style={{
                          background: '#EAF7D5',
                          color: '#102B3F',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          border: '1px solid rgba(198, 243, 107, 0.5)',
                        }}
                      >
                        {tpl.category}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: 700, color: '#102B3F', margin: '10px 0 4px' }}>
                        {tpl.name}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: '#557184', margin: 0, lineHeight: 1.45 }}>
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '12px 20px 18px' }}>
                    <button
                      onClick={() => onCreateNewWebsite(tpl)}
                      className="btn-lime"
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '0.84rem',
                      }}
                    >
                      <span>Gunakan Template Ini</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: TOKEN & TOP-UP DEDICATED VIEW
            ============================================================ */}
        {activeTab === 'token' && (
          <TokenTopUpPage
            currentUser={currentUser}
            tokenPackages={templates.length > 0 ? [
              {
                id: 'pkg_starter',
                name: 'Paket Starter',
                tokenAmount: 100,
                price: 50000,
                description: 'Cocok untuk membuat 1 website awal dan uji coba konten AI.',
                features: ['100 Token AI', 'Akses Semua Template', 'Dukungan Standar'],
              },
              {
                id: 'pkg_umkm',
                name: 'Paket UMKM Aktif',
                tokenAmount: 300,
                price: 120000,
                isPopular: true,
                description: 'Ideal untuk toko yang rutin memperbarui katalog dan promo musiman.',
                features: ['300 Token AI', 'Jadwal Konten AI Otomatis', 'Prioritas Verifikasi'],
              },
              {
                id: 'pkg_pro',
                name: 'Paket Bisnis Pro',
                tokenAmount: 800,
                price: 280000,
                description: 'Untuk UMKM berkembang yang mengelola banyak varian produk.',
                features: ['800 Token AI', 'Otomatisasi Penuh', 'Dukungan WhatsApp Prioritas'],
              },
            ] : []}
            transactions={transactions}
            onTopUpCreated={(newTx) => {
              if (onTopUpCreated) onTopUpCreated(newTx);
            }}
            onUploadProof={(txId, proofUrl) => {
              if (onUploadProof) onUploadProof(txId, proofUrl);
            }}
          />
        )}

        {/* ============================================================
            TAB 5: NOTIFIKASI
            ============================================================ */}
        {activeTab === 'notifikasi' && (
          <NotificationsPageView
            notifications={notifications}
            onMarkAllRead={() => {
              if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
            }}
            onMarkOneRead={(id) => {
              if (onMarkNotificationRead) onMarkNotificationRead(id);
            }}
            onNavigateAction={(actionUrl) => {
              if (actionUrl === 'token') setActiveTab('token');
              else if (actionUrl === 'cms' && primaryPage) onOpenCms(primaryPage);
              else if (actionUrl === 'website-saya') setActiveTab('website-saya');
            }}
          />
        )}

        {/* ============================================================
            TAB 6: PROFIL
            ============================================================ */}
        {activeTab === 'profil' && (
          <ProfilePageView
            currentUser={currentUser}
            onUpdateUser={handleUpdateUserData}
            onLogout={onLogout}
          />
        )}

        </div>

        {/* ============================================================
            DASHBOARD FOOTER (Unified Deep Navy SaaS Footer)
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
                onClick={() => setActiveTab('dashboard')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('website-saya')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Website Saya
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('template')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Template
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('token')}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
              >
                Token &amp; AI
              </button>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Bantuan%20UNI-LANDFARM"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#C6F36B', textDecoration: 'none', fontWeight: 600 }}
              >
                Bantuan WhatsApp ↗
              </a>
            </div>

            <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              &copy; {new Date().getFullYear()} UNI-LANDFARM. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16, 43, 63, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setShowLogoutConfirmModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(16, 43, 63, 0.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <LogOut size={24} />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B3F', margin: '0 0 6px' }}>
              Keluar dari Akun?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#557184', margin: '0 0 20px', lineHeight: 1.45 }}>
              Apakah Anda yakin ingin mengakhiri sesi kerja? Sesi Anda akan ditutup dengan aman.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(85, 113, 132, 0.2)',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  color: '#102B3F',
                }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirmModal(false);
                  onLogout();
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#B91C1C',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
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
