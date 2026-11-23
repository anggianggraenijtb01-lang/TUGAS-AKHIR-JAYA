import React, { useState } from 'react';
import { Notification } from '../types';
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Info,
  AlertTriangle,
  ExternalLink,
} from './icons/LucideIcons';

interface NotificationsPageViewProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  onNavigateAction?: (actionUrl?: string) => void;
}

export const NotificationsPageView: React.FC<NotificationsPageViewProps> = ({
  notifications,
  onMarkAllRead,
  onMarkOneRead,
  onNavigateAction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [onlyUnread, setOnlyUnread] = useState<boolean>(false);

  // Category Icon & Color helper
  const getCategoryMeta = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return {
          label: 'Transaksi',
          color: '#15803D',
          bg: '#DCFCE7',
          icon: <CreditCard size={15} color="#15803D" />,
        };
      case 'AI_RESULT':
        return {
          label: 'Jadwal & AI',
          color: '#D97706',
          bg: '#FEF3C7',
          icon: <Sparkles size={15} color="#D97706" />,
        };
      case 'WARNING':
        return {
          label: 'Peringatan',
          color: '#B91C1C',
          bg: '#FEE2E2',
          icon: <AlertTriangle size={15} color="#B91C1C" />,
        };
      case 'PROMO':
        return {
          label: 'Promo',
          color: '#7C3AED',
          bg: '#EDE9FE',
          icon: <Sparkles size={15} color="#7C3AED" />,
        };
      default:
        return {
          label: 'Sistem',
          color: '#1E3A2F',
          bg: '#E5E7EB',
          icon: <Info size={15} color="#1E3A2F" />,
        };
    }
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter((n) => {
    const matchCat =
      selectedCategory === 'SEMUA' ||
      (selectedCategory === 'TRANSACTION' && n.type === 'TRANSACTION') ||
      (selectedCategory === 'AI_RESULT' && n.type === 'AI_RESULT') ||
      (selectedCategory === 'SYSTEM' && (n.type === 'SYSTEM' || n.type === 'INFO'));
    const matchRead = !onlyUnread || n.readStatus === 'UNREAD';
    return matchCat && matchRead;
  });

  const unreadCount = notifications.filter((n) => n.readStatus === 'UNREAD').length;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#102B22', margin: 0 }}>
            Pusat Notifikasi
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#687A4D', margin: '4px 0 0' }}>
            Informasi status pembayaran, pembaruan jadwal AI, dan pemberitahuan sistem toko Anda.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D5CDB8',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#102B22',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <Check size={14} />
            <span>Tandai Semua Dibaca ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '12px 18px',
          border: '1px solid #D5CDB8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'SEMUA', label: 'Semua' },
            { id: 'TRANSACTION', label: 'Transaksi' },
            { id: 'AI_RESULT', label: 'Hasil Jadwal & AI' },
            { id: 'SYSTEM', label: 'Pemberitahuan Sistem' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                background: selectedCategory === tab.id ? '#102B22' : 'transparent',
                color: selectedCategory === tab.id ? '#FFFFFF' : '#304432',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: selectedCategory === tab.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toggle Unread Only */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#102B22',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span>Hanya yang belum dibaca</span>
        </label>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1px solid #D5CDB8',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#F7F5EE',
              color: '#687A4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <Bell size={26} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#102B22', margin: '0 0 6px' }}>
            Tidak Ada Notifikasi
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#62685E', margin: 0, maxWidth: '360px', marginInline: 'auto' }}>
            Saat ada kejadian baru seperti persetujuan pembayaran atau eksekusi jadwal konten, Anda akan melihatnya di sini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map((notif) => {
            const isUnread = notif.readStatus === 'UNREAD';
            const catMeta = getCategoryMeta(notif.type);

            return (
              <div
                key={notif.id}
                style={{
                  background: isUnread ? '#FFFFFF' : '#FAF8F4',
                  borderRadius: '14px',
                  padding: '18px 22px',
                  border: isUnread ? '1.5px solid #102B22' : '1px solid #E5E0D0',
                  boxShadow: isUnread ? '0 4px 14px rgba(16, 43, 34, 0.04)' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  {/* Category Pill Icon */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: catMeta.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {catMeta.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span
                        style={{
                          background: catMeta.bg,
                          color: catMeta.color,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {catMeta.label}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#8BA77A' }}>•</span>
                      <span style={{ fontSize: '0.74rem', color: '#687A4D' }}>{notif.createdAt}</span>

                      {isUnread && (
                        <span
                          style={{
                            background: '#F4C744',
                            color: '#102B22',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '9999px',
                          }}
                        >
                          BARU
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#102B22', margin: '0 0 4px' }}>
                      {notif.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#4B5548', margin: 0, lineHeight: 1.45 }}>
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Actions on right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {notif.actionUrl && onNavigateAction && (
                    <button
                      onClick={() => onNavigateAction(notif.actionUrl)}
                      style={{
                        background: '#F7F5EE',
                        border: '1px solid #D5CDB8',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#102B22',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Lihat</span>
                      <ExternalLink size={12} />
                    </button>
                  )}

                  {isUnread && (
                    <button
                      onClick={() => onMarkOneRead(notif.id)}
                      title="Tandai sudah dibaca"
                      style={{
                        background: 'none',
                        border: '1px solid #D5CDB8',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#687A4D',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Check size={12} />
                      <span>Dibaca</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
