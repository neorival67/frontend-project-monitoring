"use client";

/**
 * Component: NotificationPanel
 * Panel dropdown notifikasi yang muncul saat menekan ikon lonceng di Navbar.
 */

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, FolderCheck, UserPlus, Info, X } from "lucide-react";
import { useNotifications, type Notification } from "@/infrastructure/providers/NotificationProvider";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "project_closed")
    return (
      <div className="notif-icon notif-icon--closed">
        <FolderCheck size={14} />
      </div>
    );
  if (type === "project_joined")
    return (
      <div className="notif-icon notif-icon--joined">
        <UserPlus size={14} />
      </div>
    );
  return (
    <div className="notif-icon notif-icon--info">
      <Info size={14} />
    </div>
  );
}

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={panelRef} className="notif-panel" id="notification-panel">
      {/* Header */}
      <div className="notif-panel-header">
        <div>
          <h3 className="notif-panel-title">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="notif-badge-count">{unreadCount} belum dibaca</span>
          )}
        </div>
        <div className="notif-panel-actions">
          {unreadCount > 0 && (
            <button
              className="notif-action-btn"
              title="Tandai semua sudah dibaca"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="notif-action-btn notif-action-btn--danger"
              title="Hapus semua"
              onClick={clearAll}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button className="notif-action-btn" title="Tutup" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="notif-panel-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <Bell size={28} className="notif-empty-icon" />
            <p>Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              className={`notif-item ${!n.isRead ? "notif-item--unread" : ""}`}
              onClick={() => markAsRead(n.id)}
            >
              <NotifIcon type={n.type} />
              <div className="notif-item-content">
                <p className="notif-item-title">{n.title}</p>
                <p className="notif-item-msg">{n.message}</p>
                <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
              </div>
              {!n.isRead && <span className="notif-unread-dot" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
