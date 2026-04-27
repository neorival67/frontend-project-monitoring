"use client";

/**
 * Layout: Navbar
 * Bar navigasi atas dengan search, notifikasi, dan profil user.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/use-cases/hooks";

export function Navbar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const displayName = mounted ? (user?.name ?? "User") : "User";
  const displayInitial = mounted ? (user?.name?.charAt(0)?.toUpperCase() ?? "U") : "U";
  const displayEmail = mounted ? (user?.email ?? "") : "";

  return (
    <header className="navbar" id="main-navbar">
      {/* Search */}
      <div className="navbar-search-wrapper">
        <span className="navbar-search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search-input"
          id="navbar-search"
        />
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Notification bell */}
        <button className="navbar-icon-btn" id="btn-notification" aria-label="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="navbar-notif-dot" />
        </button>

        {/* Profile */}
        <div className="navbar-profile-wrapper">
          <button
            className="navbar-profile-btn"
            id="btn-profile"
            onClick={() => setShowProfile((s) => !s)}
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
              <button className="navbar-dropdown-item" onClick={logout}>
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
