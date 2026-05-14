"use client";

/**
 * Layout: Navbar
 * Bar navigasi atas dengan notifikasi (bell + panel) dan profil user.
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/use-cases/hooks";
import { useNotifications } from "@/infrastructure/providers/NotificationProvider";
import { NotificationPanel } from "@/presentation/components/NotificationPanel";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();

  useEffect(() => setMounted(true), []);

  const displayName = mounted ? (user?.name ?? "User") : "User";
  const displayInitial = mounted ? (user?.name?.charAt(0)?.toUpperCase() ?? "U") : "U";
  const displayEmail = mounted ? (user?.email ?? "") : "";

  // Close profile dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showProfile) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProfile]);

  return (
    <header className="navbar" id="main-navbar">
      {/* Right side */}
      <div className="navbar-right">

        {/* Notification Bell */}
        <div className="notif-wrapper">
          <button
            className="navbar-icon-btn"
            id="btn-notification"
            aria-label="Notifikasi"
            onClick={() => {
              setShowNotif((s) => !s);
              setShowProfile(false);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {mounted && unreadCount > 0 && (
              <span className="navbar-notif-dot" />
            )}
          </button>

          {showNotif && (
            <NotificationPanel onClose={() => setShowNotif(false)} />
          )}
        </div>

        {/* Profile */}
        <div className="navbar-profile-wrapper" ref={profileRef}>
          <button
            className="navbar-profile-btn"
            id="btn-profile"
            onClick={() => {
              setShowProfile((s) => !s);
              setShowNotif(false);
            }}
            aria-label="Profil"
          >
            <div className="navbar-avatar">
              {displayInitial}
            </div>
            <span className="navbar-profile-name">{displayName}</span>
            <span className={`navbar-profile-chevron ${showProfile ? "open" : ""}`}>›</span>
          </button>

          {showProfile && (
            <div className="navbar-profile-dropdown" id="profile-dropdown">
              <div className="navbar-dropdown-header">
                <div className="navbar-avatar navbar-avatar-lg">
                  {displayInitial}
                </div>
                <div>
                  <span className="navbar-dropdown-name">{displayName}</span>
                  <span className="navbar-dropdown-email">{displayEmail}</span>
                </div>
              </div>
              <div className="navbar-dropdown-divider" />
              <button
                className="navbar-dropdown-item navbar-dropdown-item--profile"
                id="btn-go-profile"
                onClick={() => { setShowProfile(false); router.push("/profile"); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Lihat Profil
              </button>
              <button className="navbar-dropdown-item" id="btn-navbar-signout" onClick={logout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
