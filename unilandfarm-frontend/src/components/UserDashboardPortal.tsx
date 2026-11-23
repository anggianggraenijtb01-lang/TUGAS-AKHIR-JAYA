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
              height: '132px',
              borderRadius: '15px',
              overflow: 'hidden',
              position: 'relative',
              background: 'linear-gradient(135deg, #0d2818 0%, #1b4d2e 100%)',
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
                background: 'linear-gradient(180deg, rgba(10,20,14,0.35) 0%, rgba(10,20,14,0.65) 100%)',
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
                  color: '#0b1710',
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
                  background: isPublished ? 'rgba(22, 163, 74, 0.92)' : 'rgba(245, 158, 11, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  fontWeight: 700,
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
                    background: '#ffffff',
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
                  background: 'rgba(11, 23, 16, 0.65)',
                  backdropFilter: 'blur(6px)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 500,
                }}
              >
                {page.category || 'UMKM Nusantara'}
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
                fontWeight: 600,
                color: '#0b1710',
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
                color: '#5b6960',
                margin: 0,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {page.description || 'Website profil dan katalog produk resmi UMKM.'}
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
            className="eloq-btn-grey"
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
            className="eloq-btn-outline"
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
      <aside
        style={{
          width: '248px',
          background: 'linear-gradient(165deg, #18261a 0%, #233726 55%, #2b422d 100%)',
          color: '#E0EAE2',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          boxSizing: 'border-box',
          padding: '22px 16px',
          flexShrink: 0,
          zIndex: 40,
          boxShadow: '8px 0 32px rgba(24, 38, 26, 0.12)',
        }}
      >
        <div>
          {/* Logo UNI-LANDFARM */}
          <div
            style={{ padding: '0 8px', marginBottom: '26px', cursor: 'pointer' }}
            onClick={onBackToHome}
            title="Kembali ke Beranda Publik"
          >
            <UniLandLogo size="md" variant="dark" />
          </div>

          {/* 4 Clean Sidebar Navigation Items */}
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
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)'
                      : 'transparent',
                    boxShadow: isActive ? '0 8px 20px rgba(24, 38, 26, 0.45)' : 'none',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                    fontWeight: isActive ? 600 : 500,
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
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <span style={{ color: isActive ? '#d3e8bc' : 'rgba(255,255,255,0.65)', display: 'flex' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        background: isActive ? 'rgba(255, 255, 255, 0.22)' : 'rgba(163, 194, 133, 0.18)',
                        color: isActive ? '#FFFFFF' : '#d3e8bc',
                        fontSize: '0.7rem',
                        fontWeight: 700,
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
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="eloq-pulse-dot" />
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#ffffff' }}>
              Agentic AI Studio
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.68)', margin: '0 0 10px', lineHeight: 1.4 }}>
            Buat website atau jadwal promo otomatis dengan AI.
          </p>
          <button
            onClick={() => onCreateNewWebsite()}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(24, 38, 26, 0.35)',
            }}
          >
            + Website AI Baru
          </button>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT AREA (Compact & Flush Footer Layout)
          ============================================================ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, boxSizing: 'border-box' }}>
        <div style={{ flex: 1, padding: '22px 28px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#1c2d1f', letterSpacing: '-0.02em' }}>
              {activeTab === 'dashboard' && 'Dashboard UMKM'}
              {activeTab === 'website-saya' && 'Kelola Website Saya'}
              {activeTab === 'template' && 'Katalog Template'}
              {activeTab === 'token' && 'Token & Top-Up'}
              {activeTab === 'notifikasi' && 'Notifikasi Sistem'}
              {activeTab === 'profil' && 'Profil & Pengaturan Akun'}
            </h1>
            <p style={{ margin: '3px 0 0', color: '#5d6759', fontSize: '0.82rem' }}>
              Selamat datang kembali, <strong>{currentUser.name}</strong> •{' '}
              {currentUser.businessName || 'Usaha Digital UMKM'}
            </p>
          </div>

          {/* Right Header: Notification Badge & Profile Pill with Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }} ref={profileMenuRef}>
            {/* Notification Button */}
            <button
              onClick={() => setActiveTab('notifikasi')}
              title="Buka Notifikasi"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #D5CDB8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                color: '#102B22',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#102B22')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#D5CDB8')}
            >
              <Bell size={16} />
              {unreadNotifCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '7px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#F4C744',
                    border: '1.5px solid #FFFFFF',
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
                border: isProfileMenuOpen ? '1px solid #102B22' : '1px solid #D5CDB8',
                borderRadius: '9999px',
                padding: '3px 12px 3px 5px',
                cursor: 'pointer',
                userSelect: 'none',
                boxShadow: isProfileMenuOpen ? '0 2px 8px rgba(16, 43, 34, 0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#102B22',
                  color: '#F4C744',
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {(currentUser.name || 'U').substring(0, 1).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#102B22' }}>
                {currentUser.name}
              </span>
              <ChevronDown
                size={13}
                color="#687A4D"
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
                  width: '250px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid rgba(16, 43, 34, 0.12)',
                  boxShadow: '0 12px 32px rgba(16, 43, 34, 0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  padding: '8px',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                {/* User info mini header */}
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #F0ECE1' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#102B22' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#687A4D', marginTop: '2px' }}>
                    {currentUser.email || currentUser.phoneNumber || 'Akun UMKM Terverifikasi'}
                  </div>
                </div>

                {/* Token Balance inside Dropdown */}
                <div
                  style={{
                    background: '#FAF8F3',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    margin: '8px 0',
                    border: '1px solid #EDE8DA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Coins size={15} color="#B45309" />
                    <div>
                      <div style={{ fontSize: '0.64rem', color: '#687A4D', fontWeight: 600 }}>Saldo Token</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#102B22' }}>
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
                      background: '#F4C744',
                      color: '#102B22',
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

            {/* Modern Studio Bento Metric Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '26px',
              }}
            >
              {/* Card 1: Total Website */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '22px 24px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  boxShadow: '0 10px 28px rgba(24, 38, 26, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#5d6759', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Website
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #eef4eb 0%, #dce8d4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#233726',
                    }}
                  >
                    <Globe size={17} />
                  </div>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 600, color: '#1c2d1f', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                  {totalWebsites}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#5d6759', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#3d5a37', fontWeight: 600 }}>● {publishedCount} Live</span>
                  <span>•</span>
                  <span>{draftCount} Draft</span>
                </div>
              </div>

              {/* Card 2: Saldo Token AI (Highlighted Olive-Forest Studio Card) */}
              <div
                style={{
                  background: 'linear-gradient(145deg, #1d2e20 0%, #2b442f 52%, #48663b 100%)',
                  color: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '22px 24px',
                  border: '1px solid rgba(163, 194, 133, 0.28)',
                  boxShadow: '0 16px 36px -8px rgba(24, 38, 26, 0.38)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Saldo Token AI
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fde047',
                    }}
                  >
                    <Coins size={17} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontSize: '2.1rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                    {tokenBalance}{' '}
                    <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'rgba(255,255,255,0.72)' }}>Token</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('token')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.94)',
                      color: '#233726',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    Top-Up ↗
                  </button>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.72)', marginTop: '8px' }}>
                  Siap digunakan untuk asisten AI &amp; CMS
                </div>
              </div>

              {/* Card 3: Notifikasi Aktif */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  padding: '22px 24px',
                  border: '1px solid rgba(35, 55, 38, 0.08)',
                  boxShadow: '0 10px 28px rgba(24, 38, 26, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#5d6759', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Pemberitahuan
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #eef4eb 0%, #dce8d4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#233726',
                    }}
                  >
                    <Bell size={17} />
                  </div>
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 600, color: '#1c2d1f', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                  {unreadNotifCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#5d6759', marginTop: '8px' }}>
                  {unreadNotifCount > 0 ? 'Pesan belum dibaca' : 'Semua pesan telah dibaca'}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Websites */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div className="eloq-dot-label">
                  <span className="eloq-dot" />
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0b1710', margin: 0, letterSpacing: '-0.02em' }}>
                    Daftar Website Usaha Anda
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {pages.length > 0 && (
                    <button
                      onClick={() => setActiveTab('website-saya')}
                      className="eloq-btn-outline"
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.8rem',
                      }}
                    >
                      Lihat Semua ({pages.length}) →
                    </button>
                  )}
                  <button
                    onClick={() => onCreateNewWebsite()}
                    className="eloq-btn-grey"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.82rem',
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
                    Belum Ada Website yang Dibuat
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#62685E', margin: '0 0 16px', maxWidth: '380px', marginInline: 'auto' }}>
                    Mulai perkenalkan produk UMKM Anda dengan membuat website landing page instan menggunakan template siap pakai.
                  </p>
                  <button
                    onClick={() => setActiveTab('template')}
                    className="eloq-btn-grey"
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
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1c2d1f', margin: 0 }}>
                  Semua Website Anda ({pages.length})
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#5d6759', margin: '3px 0 0' }}>
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
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setWebsiteFilter('all')}
                  style={{
                    background: websiteFilter === 'all' ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)' : '#FFFFFF',
                    color: websiteFilter === 'all' ? '#FFFFFF' : '#304432',
                    border: websiteFilter === 'all' ? 'none' : '1px solid #D5CDB8',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: websiteFilter === 'all' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  Semua ({totalWebsites})
                </button>
                <button
                  onClick={() => setWebsiteFilter('published')}
                  style={{
                    background: websiteFilter === 'published' ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)' : '#FFFFFF',
                    color: websiteFilter === 'published' ? '#FFFFFF' : '#304432',
                    border: websiteFilter === 'published' ? 'none' : '1px solid #D5CDB8',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: websiteFilter === 'published' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  Terpublikasi ({publishedCount})
                </button>
                <button
                  onClick={() => setWebsiteFilter('draft')}
                  style={{
                    background: websiteFilter === 'draft' ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)' : '#FFFFFF',
                    color: websiteFilter === 'draft' ? '#FFFFFF' : '#304432',
                    border: websiteFilter === 'draft' ? 'none' : '1px solid #D5CDB8',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: websiteFilter === 'draft' ? 700 : 500,
                    cursor: 'pointer',
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
                  gap: '6px',
                  background: '#FFFFFF',
                  border: '1px solid #D5CDB8',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  width: '220px',
                }}
              >
                <Search size={14} color="#687A4D" />
                <input
                  type="text"
                  placeholder="Cari website..."
                  value={websiteSearchQuery}
                  onChange={(e) => setWebsiteSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.78rem',
                    width: '100%',
                    background: 'transparent',
                    color: '#102B22',
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
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
                Katalog Template Website
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#687A4D', margin: '4px 0 0' }}>
                Pilih template desain yang sesuai dengan kategori bisnis Anda.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {templateCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTemplateCategory(cat)}
                  style={{
                    background: selectedTemplateCategory === cat ? 'linear-gradient(135deg, #233726 0%, #3d5a37 50%, #6E8854 100%)' : '#FFFFFF',
                    color: selectedTemplateCategory === cat ? '#FFFFFF' : '#304432',
                    border: selectedTemplateCategory === cat ? 'none' : '1px solid #D5CDB8',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: selectedTemplateCategory === cat ? 700 : 500,
                    cursor: 'pointer',
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
                    border: '1px solid rgba(35, 55, 38, 0.1)',
                    boxShadow: '0 8px 24px rgba(24, 38, 26, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                          background: '#E5E0D0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#5d6759',
                        }}
                      >
                        <Layout size={36} />
                      </div>
                    )}

                    <div style={{ padding: '18px 20px 10px' }}>
                      <span
                        style={{
                          background: '#eef4eb',
                          color: '#3d5a37',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        {tpl.category}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1c2d1f', margin: '8px 0 4px' }}>
                        {tpl.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#5d6759', margin: 0, lineHeight: 1.45 }}>
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '12px 20px 18px' }}>
                    <button
                      onClick={() => onCreateNewWebsite(tpl)}
                      className="eloq-btn-grey"
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
            DASHBOARD FOOTER (Unified Compact Olive-Forest Footer)
            ============================================================ */}
        <footer
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(160deg, #1c2d1f 0%, #142217 60%, #0d170f 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '18px 28px',
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
                Token &amp; Top-Up
              </button>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Bantuan%20UNI-LANDFARM"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#d3e8bc', textDecoration: 'none', fontWeight: 600 }}
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
            background: 'rgba(0,0,0,0.5)',
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
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
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

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
              Keluar dari Akun?
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#62685E', margin: '0 0 20px', lineHeight: 1.45 }}>
              Apakah Anda yakin ingin mengakhiri sesi kerja? Sesi Anda akan ditutup dengan aman.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #D5CDB8',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  color: '#202720',
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
