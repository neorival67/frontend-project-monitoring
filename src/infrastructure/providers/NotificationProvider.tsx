"use client";

/**
 * NotificationProvider
 * Sistem notifikasi frontend-only (tanpa WebSocket/Docker).
 * Poll API proyek setiap 30 detik untuk mendeteksi:
 *  1. Proyek telah selesai/closing
 *  2. User baru ditambahkan ke tim proyek
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import apiClient from "@/infrastructure/api/apiClient";

export type NotifType = "project_closed" | "project_joined" | "info";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  proyekId?: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const STORAGE_KEY = "app_notifications";
const SEEN_PROJECTS_KEY = "app_seen_projects";
const SEEN_MEMBERS_KEY = "app_seen_members";
const POLL_INTERVAL = 30_000; // 30 detik

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function genId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);
  const seenProjectStatusRef = useRef<Record<string, string>>({});
  const seenMembersRef = useRef<Record<string, string[]>>({});

  // Load dari localStorage setelah mount (avoid SSR mismatch)
  useEffect(() => {
    const saved = loadFromStorage<Notification[]>(STORAGE_KEY, []);
    const seenStatus = loadFromStorage<Record<string, string>>(SEEN_PROJECTS_KEY, {});
    const seenMembers = loadFromStorage<Record<string, string[]>>(SEEN_MEMBERS_KEY, {});
    setNotifications(saved);
    seenProjectStatusRef.current = seenStatus;
    seenMembersRef.current = seenMembers;
    setMounted(true);
  }, []);

  // Simpan notifikasi ke localStorage setiap kali berubah
  useEffect(() => {
    if (mounted) {
      saveToStorage(STORAGE_KEY, notifications);
    }
  }, [notifications, mounted]);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "createdAt" | "isRead">) => {
      setNotifications((prev) => {
        const newNotif: Notification = {
          ...n,
          id: genId(),
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        const updated = [newNotif, ...prev].slice(0, 50); // maks 50 notif
        return updated;
      });
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // ── POLLING ────────────────────────────────────────────────────────────
  const pollProyek = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token) return; // Tidak login, skip polling

      const { data } = await apiClient.get<any>("/projects");
      const proyek: any[] = Array.isArray(data) ? data : (data?.data ?? []);

      // Ambil userId dari JWT (decode simple)
      let currentUserId: string | null = null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUserId = payload.sub || payload.id || payload.userId || null;
      } catch {
        /* noop */
      }

      const newSeenStatus = { ...seenProjectStatusRef.current };
      const newSeenMembers = { ...seenMembersRef.current };
      const toAdd: Omit<Notification, "id" | "createdAt" | "isRead">[] = [];

      for (const p of proyek) {
        const id = p.id as string;
        const nama = p.nama || p.name || "Proyek";
        const status = (p.status as string)?.toLowerCase() ?? "";

        // 1. Deteksi perubahan status → selesai / penutupan / closing
        const CLOSED_STATUSES = ["selesai", "penutupan", "closing", "closed", "terhenti"];
        if (CLOSED_STATUSES.includes(status)) {
          const prevStatus = newSeenStatus[id];
          if (prevStatus === undefined) {
            // Pertama kali lihat proyek ini sudah closed → tidak notif (biar tidak spam saat pertama load)
            newSeenStatus[id] = status;
          } else if (prevStatus !== status) {
            // Status berubah jadi closed
            toAdd.push({
              type: "project_closed",
              proyekId: id,
              title: "Proyek Selesai / Closing",
              message: `Proyek "${nama}" telah berubah status menjadi ${status.toUpperCase()}.`,
            });
            newSeenStatus[id] = status;
          }
        } else {
          if (newSeenStatus[id] === undefined) {
            newSeenStatus[id] = status;
          } else if (newSeenStatus[id] !== status) {
            newSeenStatus[id] = status;
          }
        }

        // 2. Deteksi user baru ditambahkan ke tim proyek
        if (currentUserId) {
          const teams: any[] = p.teams ?? p.projectTeam ?? [];
          const memberIds: string[] = teams.map((t: any) => t.userId || t.user?.id).filter(Boolean);

          const prevMembers = newSeenMembers[id] ?? [];

          if (prevMembers.length === 0 && memberIds.length > 0) {
            // Inisialisasi — simpan tanpa notif
            newSeenMembers[id] = memberIds;
          } else {
            const newAddedIds = memberIds.filter((uid) => !prevMembers.includes(uid));
            for (const newMemberId of newAddedIds) {
              if (newMemberId === currentUserId) {
                // Current user ditambahkan ke proyek
                toAdd.push({
                  type: "project_joined",
                  proyekId: id,
                  title: "Anda Ditambahkan ke Proyek",
                  message: `Admin/PM telah menambahkan Anda ke proyek "${nama}".`,
                });
              } else {
                // Member lain ditambahkan (hanya tampilkan untuk Admin/PM)
                const newMember = teams.find(
                  (t: any) => (t.userId || t.user?.id) === newMemberId
                );
                const memberName =
                  newMember?.user?.name ?? newMember?.userName ?? "Seorang anggota";
                toAdd.push({
                  type: "project_joined",
                  proyekId: id,
                  title: "Anggota Baru Bergabung",
                  message: `${memberName} telah bergabung ke proyek "${nama}".`,
                });
              }
            }
            if (newAddedIds.length > 0) {
              newSeenMembers[id] = memberIds;
            }
          }
        }
      }

      // Update refs & storage
      seenProjectStatusRef.current = newSeenStatus;
      seenMembersRef.current = newSeenMembers;
      saveToStorage(SEEN_PROJECTS_KEY, newSeenStatus);
      saveToStorage(SEEN_MEMBERS_KEY, newSeenMembers);

      // Tambah notifikasi baru (reverse agar yang terbaru di atas)
      if (toAdd.length > 0) {
        toAdd.forEach((n) => addNotification(n));
      }
    } catch {
      /* API error → silent fail */
    }
  }, [addNotification]);

  // Jalankan polling
  useEffect(() => {
    if (!mounted) return;
    pollProyek(); // langsung saat mount
    const interval = setInterval(pollProyek, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [mounted, pollProyek]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications harus digunakan dalam NotificationProvider");
  return ctx;
}
