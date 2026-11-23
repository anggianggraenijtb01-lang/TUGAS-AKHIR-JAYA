import React from 'react';
import { Notification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            <h3 style={{ fontSize: '1.25rem' }}>Pusat Notifikasi</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onMarkAllRead}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.75rem', color: '#34d399' }}
            >
              Tandai Dibaca
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '1.2rem', padding: '2px 8px' }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Belum ada notifikasi baru.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background:
                    notif.readStatus === 'UNREAD'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border:
                    notif.readStatus === 'UNREAD'
                      ? '1px solid rgba(52, 211, 153, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {notif.createdAt}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
