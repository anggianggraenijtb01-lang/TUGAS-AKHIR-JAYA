import React, { useState, useEffect } from 'react';
import {
  LandingPage,
  TokenPackage,
  Template,
  Notification,
  Transaction,
  User,
  PaymentMethod,
  Plan,
  BillingInterval,
  Order,
} from './types';
import {
  initialCurrentUser,
  adminUser,
  initialTemplates,
  tokenPackages,
  initialNotifications,
  initialTransactions,
  subscriptionPlans,
  initialLandingPages,
} from './services/mockData';
import {
  getLocalPages,
  saveLocalPages,
  getLocalUser,
  saveLocalUser,
  checkBackendHealth,
  getSubscriptionPlans,
  createOrder,
} from './services/api';

import { Navbar } from './components/Navbar';
import { PublicLandingPage } from './components/PublicLandingPage';
import { CheckoutPage } from './components/CheckoutPage';
import { PaymentPendingPage } from './components/PaymentPendingPage';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailedPage } from './components/PaymentFailedPage';
import { BillingDashboardPage } from './components/BillingDashboardPage';
import { CmsEditor } from './components/CmsEditor';
import { PublicPageView } from './components/PublicPageView';
import { AiWizardModal } from './components/AiWizardModal';
import { TopUpModal } from './components/TopUpModal';
import { AdminPortal } from './components/AdminPortal';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthPage } from './components/AuthPage';
import { UserDashboardPortal } from './components/UserDashboardPortal';
import { PublishSuccessPage } from './components/PublishSuccessPage';

export type ActiveViewType =
  | 'home'
  | 'dashboard'
  | 'cms'
  | 'admin'
  | 'public'
  | 'auth'
  | 'checkout'
  | 'payment-pending'
  | 'payment-success'
  | 'payment-failed'
  | 'billing'
  | 'publish-success';

export const App: React.FC = () => {
  // Current user & role (null = public visitor on landing page)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('uniland_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Landing pages state
  const [pages, setPages] = useState<LandingPage[]>(() => getLocalPages());

  // Entities
  const [templates] = useState<Template[]>(initialTemplates);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [plans, setPlans] = useState<Plan[]>(subscriptionPlans);

  // Active view
  const [activeView, setActiveView] = useState<ActiveViewType>('home');
  const [activeCmsPage, setActiveCmsPage] = useState<LandingPage | null>(pages[0] || null);
  const [activePublishedPage, setActivePublishedPage] = useState<LandingPage | null>(null);
  const [activePublicSlug, setActivePublicSlug] = useState<string>(pages[0]?.slug || 'kopi-robusta-slamet');

  // Checkout & Payment flow states
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<Plan>(subscriptionPlans[1]);
  const [selectedBillingInterval, setSelectedBillingInterval] = useState<BillingInterval>('monthly');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [paymentFailureReason, setPaymentFailureReason] = useState<string>('');

  // Modals state
  const [isAiWizardOpen, setIsAiWizardOpen] = useState(false);
  const [wizardPrefillName, setWizardPrefillName] = useState('');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Sync to local storage
  useEffect(() => {
    saveLocalPages(pages);
  }, [pages]);

  useEffect(() => {
    if (currentUser) {
      saveLocalUser(currentUser);
    } else {
      localStorage.removeItem('uniland_user_v1');
    }
  }, [currentUser]);

  useEffect(() => {
    checkBackendHealth();
    getSubscriptionPlans().then((loadedPlans) => {
      if (loadedPlans && loadedPlans.length > 0) {
        setPlans(loadedPlans);
      }
    });
  }, []);

  // Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);

    // Check if user had selected a plan before logging in
    const pendingCheckout = localStorage.getItem('uniland_pending_checkout');
    if (pendingCheckout) {
      try {
        const { planId, interval } = JSON.parse(pendingCheckout);
        localStorage.removeItem('uniland_pending_checkout');
        const targetPlan = plans.find((p) => p.id === planId) || subscriptionPlans[1];
        setSelectedCheckoutPlan(targetPlan);
        setSelectedBillingInterval(interval || 'monthly');
        setActiveView('checkout');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } catch {
        localStorage.removeItem('uniland_pending_checkout');
      }
    }

    if (user.role === 'ADMIN') {
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('uniland_user_v1');
    setActiveView('home');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setActiveView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCms = (page: LandingPage) => {
    setActiveCmsPage(page);
    setActiveView('cms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPublicView = (slug: string) => {
    setActivePublicSlug(slug);
    setActiveView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCmsPage = (updatedPage: LandingPage) => {
    const updated = pages.map((p) => (p.id === updatedPage.id ? updatedPage : p));
    setPages(updated);
    setActiveCmsPage(updatedPage);
  };

  const handlePublishPage = (pageId: string) => {
    const updated = pages.map((p) => {
      if (p.id === pageId) {
        return {
          ...p,
          publishStatus: 'PUBLISHED' as const,
          publishedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    setPages(updated);
    if (activeCmsPage?.id === pageId) {
      setActiveCmsPage({
        ...activeCmsPage,
        publishStatus: 'PUBLISHED',
      });
    }
  };

  const handleTogglePublish = (pageId: string) => {
    const updated = pages.map((p) => {
      if (p.id === pageId) {
        const nextStatus =
          p.publishStatus === 'PUBLISHED' ? ('DRAFT' as const) : ('PUBLISHED' as const);
        return {
          ...p,
          publishStatus: nextStatus,
          publishedAt: nextStatus === 'PUBLISHED' ? new Date().toISOString() : undefined,
        };
      }
      return p;
    });
    setPages(updated);
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus landing page ini?')) {
      const updated = pages.filter((p) => p.id !== pageId);
      setPages(updated);
      if (activeCmsPage?.id === pageId) {
        setActiveCmsPage(updated[0] || null);
      }
    }
  };

  const handlePageGenerated = (newPage: LandingPage) => {
    setCurrentUser((prev) =>
      prev ? { ...prev, tokenBalance: Math.max(0, prev.tokenBalance - 10) } : null
    );

    const updated = [newPage, ...pages];
    setPages(updated);

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: `✨ Landing Page "${newPage.businessName}" Siap!`,
      message: 'AI telah berhasil meracik landing page Anda. Buka CMS untuk memoles konten atau mempublikasikannya.',
      type: 'AI_RESULT',
      readStatus: 'UNREAD',
      createdAt: 'Baru saja',
    };
    setNotifications([newNotif, ...notifications]);

    setActiveCmsPage(newPage);
    setActiveView('cms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pricing & Subscription selection
  const handleSelectPlan = async (plan: Plan, interval: BillingInterval) => {
    setSelectedCheckoutPlan(plan);
    setSelectedBillingInterval(interval);

    if (!currentUser) {
      localStorage.setItem(
        'uniland_pending_checkout',
        JSON.stringify({ planId: plan.id, interval })
      );
      handleOpenAuth('register');
      return;
    }

    if (plan.isFree) {
      try {
        const freeOrder = await createOrder({
          userId: currentUser.id,
          planId: plan.id,
          billingInterval: interval,
          paymentMethod: 'QRIS',
        });
        setActiveOrder(freeOrder);
        setActiveView('payment-success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        console.error('Failed to activate free plan:', e);
      }
      return;
    }

    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseTemplate = (template: Template) => {
    if (!currentUser) {
      handleOpenAuth('register');
      return;
    }
    setWizardPrefillName(template.name.replace('Template ', ''));
    setIsAiWizardOpen(true);
  };

  const handlePaymentSuccess = (pkg: TokenPackage, method: PaymentMethod) => {
    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, tokenBalance: prev.tokenBalance + pkg.tokenAmount } : null
      );
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser?.id || 'client-1',
      invoiceCode: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        Math.random() * 8999 + 1000
      )}`,
      packageName: pkg.name,
      tokenAmount: pkg.tokenAmount,
      amountPaid: pkg.price,
      paymentMethod: method,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTx, ...transactions]);

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: `🪙 Top-Up ${pkg.tokenAmount} Token Berhasil!`,
      message: `Pembayaran ${pkg.name} via ${method} terkonfirmasi. Saldo token Anda bertambah.`,
      type: 'TRANSACTION',
      readStatus: 'UNREAD',
      createdAt: 'Baru saja',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleTakedownPage = (pageId: string, reason: string) => {
    const updated = pages.map((p) =>
      p.id === pageId ? { ...p, publishStatus: 'SUSPENDED' as const } : p
    );
    setPages(updated);
    alert(`Landing page berhasil ditakedown. Alasan: ${reason}`);
  };

  const handleVerifyTransaction = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx) return;

    const updated = transactions.map((t) =>
      t.id === txId ? { ...t, status: 'SUCCESS' as const } : t
    );
    setTransactions(updated);

    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, tokenBalance: prev.tokenBalance + tx.tokenAmount } : null
      );
    }
  };

  const handleRejectTransaction = (txId: string) => {
    const updated = transactions.map((t) =>
      t.id === txId ? { ...t, status: 'REJECTED' as const } : t
    );
    setTransactions(updated);
  };

  const handleSendBroadcast = (title: string, message: string) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: title,
      message,
      type: 'INFO',
      readStatus: 'UNREAD',
      createdAt: 'Baru saja',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: 'READ' })));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readStatus: 'READ' } : n))
    );
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
  };

  const handleTopUpCreated = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: `Menunggu Pembayaran: ${newTx.packageName}`,
      message: `Tagihan ${newTx.invoiceCode} telah dibuat. Silakan lakukan transfer sesuai nominal.`,
      type: 'TRANSACTION',
      readStatus: 'UNREAD',
      createdAt: 'Baru saja',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUploadProof = (txId: string, proofUrl: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'PENDING', proofUrl } : t))
    );
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title: 'Bukti Pembayaran Terkirim',
      message: 'Bukti pembayaran Anda telah diunggah dan sedang dalam verifikasi oleh Admin.',
      type: 'TRANSACTION',
      readStatus: 'UNREAD',
      createdAt: 'Baru saja',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotifsCount = notifications.filter((n) => n.readStatus === 'UNREAD').length;
  const currentPublicPage =
    pages.find((p) => p.slug === activePublicSlug) ||
    initialLandingPages.find((p) => p.slug === activePublicSlug) ||
    pages[0];

  const isLightView = [
    'home',
    'auth',
    'checkout',
    'payment-pending',
    'payment-success',
    'payment-failed',
    'billing',
    'publish-success',
  ].includes(activeView);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: isLightView ? '#FAF7F2' : 'var(--bg-dark)',
      }}
    >
      {/* Background Ambient Glow Lights (only on dark views) */}
      {!isLightView && (
        <div className="ambient-glow">
          <div className="ambient-blob-1" />
          <div className="ambient-blob-2" />
          <div className="ambient-blob-3" />
        </div>
      )}



      {/* Conditionally Render Views */}
      {activeView === 'auth' && (
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setActiveView('home')}
          initialMode={authModalMode}
          prefilledBusinessName={wizardPrefillName}
        />
      )}

      {activeView === 'public' && currentPublicPage && (
        <PublicPageView
          page={currentPublicPage}
          onBackToApp={() => setActiveView('home')}
        />
      )}

      {activeView === 'home' && (
        <PublicLandingPage
          currentUser={currentUser}
          templates={templates}
          plans={plans}
          onOpenAuth={handleOpenAuth}
          onOpenDashboard={() => setActiveView('dashboard')}
          onOpenAiWizard={(prefillName?: string) => {
            if (!currentUser) {
              setWizardPrefillName(prefillName || '');
              handleOpenAuth('register');
            } else {
              setWizardPrefillName(prefillName || '');
              setIsAiWizardOpen(true);
            }
          }}
          onSelectPlan={handleSelectPlan}
          onOpenPublicView={handleOpenPublicView}
          onUseTemplate={handleUseTemplate}
        />
      )}

      {/* Render User Dashboard Portal (All 9 Modules) */}
      {activeView === 'dashboard' && currentUser && (
        <UserDashboardPortal
          currentUser={currentUser}
          pages={pages}
          templates={templates}
          transactions={transactions}
          notifications={notifications}
          onOpenCms={handleOpenCms}
          onOpenPublicView={handleOpenPublicView}
          onCreateNewWebsite={(template) => {
            const newSlug = `toko-${Date.now().toString().slice(-4)}`;
            const newPage: LandingPage = {
              id: `pg_${Date.now()}`,
              userId: currentUser.id,
              title: template ? `${template.name} - Toko Baru` : `${currentUser.businessName || 'Toko Baru'}`,
              businessName: currentUser.businessName || 'Toko Digital UMKM',
              slug: newSlug,
              publishStatus: 'PUBLISHED',
              theme: 'emerald-fresh',
              viewCount: 0,
              uniqueVisitors: 0,
              tokenConsumed: 0,
              sections: template ? JSON.parse(JSON.stringify(template.sectionsJson || [])) : JSON.parse(JSON.stringify(pages[0]?.sections || [])),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setPages([newPage, ...pages]);
            handleOpenCms(newPage);
          }}
          onOpenTopUp={() => setIsTopUpOpen(true)}
          onLogout={handleLogout}
          onBackToHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onUpdateUser={handleUpdateUser}
          onDeletePage={handleDeletePage}
          onTopUpCreated={handleTopUpCreated}
          onUploadProof={handleUploadProof}
          onMarkAllNotificationsRead={handleMarkAllRead}
          onMarkNotificationRead={handleMarkNotificationRead}
        />
      )}

      {activeView === 'checkout' && (
        <CheckoutPage
          plan={selectedCheckoutPlan}
          billingInterval={selectedBillingInterval}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onProceedToPayment={(order: Order) => {
            setActiveOrder(order);
            setActiveView('payment-pending');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToPricing={() => {
            setActiveView('home');
            setTimeout(() => {
              const el = document.getElementById('harga');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      )}

      {activeView === 'payment-pending' && activeOrder && (
        <PaymentPendingPage
          order={activeOrder}
          currentUser={currentUser}
          onPaymentSuccess={(order: Order) => {
            setActiveOrder(order);
            setActiveView('payment-success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onPaymentFailed={(order: Order, reason: string) => {
            setActiveOrder(order);
            setPaymentFailureReason(reason);
            setActiveView('payment-failed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToDashboard={() => {
            setActiveView(currentUser?.role === 'ADMIN' ? 'admin' : 'cms');
          }}
          onBackToPricing={() => {
            setActiveView('home');
          }}
        />
      )}

      {activeView === 'payment-success' && activeOrder && (
        <PaymentSuccessPage
          order={activeOrder}
          currentUser={currentUser}
          onOpenCms={() => {
            setActiveView('cms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBilling={() => {
            setActiveView('billing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeView === 'payment-failed' && activeOrder && (
        <PaymentFailedPage
          order={activeOrder}
          reason={paymentFailureReason}
          onRetryPayment={(order: Order) => {
            const plan = plans.find((p) => p.id === order.planId) || plans[1];
            setSelectedCheckoutPlan(plan);
            setSelectedBillingInterval(order.billingInterval);
            setActiveView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToPricing={() => {
            setActiveView('home');
            setTimeout(() => {
              const el = document.getElementById('harga');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onBackToDashboard={() => {
            setActiveView(currentUser?.role === 'ADMIN' ? 'admin' : 'cms');
          }}
        />
      )}

      {activeView === 'billing' && (
        <BillingDashboardPage
          currentUser={currentUser}
          onOpenCheckout={(plan: Plan, interval: 'monthly' | 'yearly') => {
            setSelectedCheckoutPlan(plan);
            setSelectedBillingInterval(interval);
            setActiveView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToDashboard={() => {
            setActiveView('cms');
          }}
          onOpenPricing={() => {
            setActiveView('home');
            setTimeout(() => {
              const el = document.getElementById('harga');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      )}

      {activeView === 'cms' && (activeCmsPage || pages[0]) && (
        <CmsEditor
          page={activeCmsPage || pages[0]}
          onSavePage={handleSaveCmsPage}
          onPublishPage={handlePublishPage}
          onOpenPublicView={handleOpenPublicView}
          onBack={() => setActiveView('home')}
          onPublishSuccess={(publishedPage) => {
            setActivePublishedPage(publishedPage);
            setActiveView('publish-success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeView === 'publish-success' && (activePublishedPage || activeCmsPage || pages[0]) && (
        <PublishSuccessPage
          page={activePublishedPage || activeCmsPage || pages[0]}
          currentUser={currentUser}
          onOpenPublicView={handleOpenPublicView}
          onBackToCms={() => {
            setActiveView('cms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToDashboard={() => {
            setActiveView(currentUser?.role === 'ADMIN' ? 'admin' : 'dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {activeView === 'admin' && (
        <AdminPortal
          currentUser={currentUser}
          pages={pages}
          templates={templates}
          transactions={transactions}
          plans={plans}
          onTakedownPage={handleTakedownPage}
          onVerifyTransaction={handleVerifyTransaction}
          onRejectTransaction={handleRejectTransaction}
          onSendBroadcast={handleSendBroadcast}
          onLogout={handleLogout}
          onOpenPublicView={handleOpenPublicView}
          onOpenCms={(page) => {
            setActiveCmsPage(page);
            setActiveView('cms');
          }}
          onBackToHome={() => setActiveView('home')}
        />
      )}

      {/* MODALS */}
      <AiWizardModal
        isOpen={isAiWizardOpen}
        onClose={() => setIsAiWizardOpen(false)}
        templates={templates}
        onPageGenerated={handlePageGenerated}
        userTokenBalance={currentUser?.tokenBalance || 0}
        initialBusinessName={wizardPrefillName}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        tokenPackages={tokenPackages}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default App;
