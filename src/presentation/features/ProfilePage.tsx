"use client";

/**
 * Feature: ProfilePage
 * Halaman profil pengguna — fetch data lengkap dari API via ID user.
 * Data dari localStorage hanya dipakai sebagai fallback sementara.
 */

import { useState, useEffect } from "react";
import { useUserDetail } from "@/use-cases/hooks/useUser";
import { useAuth } from "@/use-cases/hooks";
import type { User } from "@/core/entities";

// ── Helpers ───────────────────────────────────────────────────────────

function getStoredUserSafe(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function getRoleBadgeClass(role: string): string {
  switch (role?.toUpperCase()) {
    case "ADMIN":  return "profile-role-badge role-admin";
    case "PM":     return "profile-role-badge role-pm";
    case "STAFF":
    case "TIM":    return "profile-role-badge role-staff";
    case "CLIENT": return "profile-role-badge role-client";
    case "VENDOR": return "profile-role-badge role-vendor";
    default:       return "profile-role-badge role-default";
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status?.toUpperCase()) {
    case "ACTIVE":   return "profile-status-badge status-active";
    case "PENDING":  return "profile-status-badge status-pending";
    case "INACTIVE": return "profile-status-badge status-inactive";
    default:         return "profile-status-badge status-inactive";
  }
}

function translateStatus(status: string): string {
  switch (status?.toUpperCase()) {
    case "ACTIVE":   return "Aktif";
    case "PENDING":  return "Menunggu";
    case "INACTIVE": return "Tidak Aktif";
    default:         return status ?? "—";
  }
}

function isInternalRole(role: string): boolean {
  return ["ADMIN", "PM", "TIM", "STAFF"].includes(role?.toUpperCase());
}

function isExternalRole(role: string): boolean {
  return ["CLIENT", "VENDOR"].includes(role?.toUpperCase());
}

// ── Component ─────────────────────────────────────────────────────────

export function ProfilePage() {
  const { logout } = useAuth();

  // Ambil user dari localStorage setelah mount
  const [localUser, setLocalUser] = useState<User | null>(null);
  useEffect(() => {
    setLocalUser(getStoredUserSafe());
  }, []);

  // Fetch data lengkap dari API berdasarkan ID yang tersimpan
  const userId = localUser?.id ?? "";
  const { data: apiUser, isLoading } = useUserDetail(userId);

  // Prioritas: data API (lengkap) → fallback localStorage
  const user = apiUser ?? localUser;

  // DEBUG — hapus setelah masalah terselesaikan
  if (apiUser) {
    console.log("[ProfilePage] API user response:", apiUser);
  }


  const displayName    = user?.name    || "User";
  const displayEmail   = user?.email   || "—";
  const displayRole    = user?.role    || "—";
  const displayStatus  = user?.status  || "—";
  const displayPhone   = user?.phone   || "—";
  const displayInitial = displayName.charAt(0).toUpperCase();
  // Fallback: cek departemen (Indonesian) dan department (English)
  const displayDept    = user?.departemen
    ?? (user as any)?.department
    ?? "—";


  const internal = isInternalRole(displayRole);
  const external = isExternalRole(displayRole);

  return (
    <div className="profile-page" id="profile-page">
      {/* ── Page Header ── */}
      <div className="profile-page-header">
        <h1 className="profile-page-title">Profil</h1>
        <p className="profile-page-subtitle">Informasi akun Anda</p>
      </div>

      {/* ── Card ── */}
      <div className="profile-card" id="profile-card">

        {/* Hero: Avatar + Nama + Badges */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle" aria-label={`Avatar ${displayName}`}>
              {isLoading ? "…" : displayInitial}
            </div>
            <div className="profile-avatar-ring" />
          </div>

          <div className="profile-hero-info">
            <h2 className="profile-hero-name" id="profile-name">
              {isLoading ? "Memuat..." : displayName}
            </h2>
            <div className="profile-hero-badges">
              {displayRole !== "—" && (
                <span className={getRoleBadgeClass(displayRole)}>
                  {displayRole}
                </span>
              )}
              {displayStatus !== "—" && (
                <span className={getStatusBadgeClass(displayStatus)}>
                  <span className="profile-status-dot" />
                  {translateStatus(displayStatus)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="profile-info">

          {/* Email */}
          <div className="profile-field">
            <span className="profile-field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </span>
            <span className="profile-field-value" id="profile-email">
              {isLoading ? "Memuat..." : displayEmail}
            </span>
          </div>

          <div className="profile-divider" />

          {/* Telepon */}
          <div className="profile-field">
            <span className="profile-field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 15.5 19.79 19.79 0 0 1 1.06 6.83 2 2 0 0 1 3.04 4.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Telepon
            </span>
            <span className="profile-field-value" id="profile-phone">
              {isLoading ? "Memuat..." : displayPhone}
            </span>
          </div>

          <div className="profile-divider" />

          {/* Jabatan */}
          <div className="profile-field">
            <span className="profile-field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Role
            </span>
            <span className="profile-field-value" id="profile-role">
              {isLoading ? "Memuat..." : displayRole}
            </span>
          </div>

          <div className="profile-divider" />

          {/* Posisi */}
          <div className="profile-field">
            <span className="profile-field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Posisi
            </span>
            <span className="profile-field-value" id="profile-position">
              {isLoading ? "Memuat..." : (user?.position || "—")}
            </span>
          </div>

          {/* Departemen — hanya ADMIN / PM / STAFF */}
          {(internal || (!isLoading && !external)) && (
            <>
              <div className="profile-divider" />
              <div className="profile-field">
                <span className="profile-field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Departemen
                </span>
                <span className="profile-field-value" id="profile-departemen">
                  {isLoading ? "Memuat..." : displayDept}
                </span>
              </div>
            </>
          )}

          {/* Tipe — hanya CLIENT / VENDOR */}
          {external && (
            <>
              <div className="profile-divider" />
              <div className="profile-field">
                <span className="profile-field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Tipe
                </span>
                <span className="profile-field-value" id="profile-type">
                  {displayRole === "CLIENT" ? "Client" : "Vendor"}
                </span>
              </div>
            </>
          )}

          <div className="profile-divider" />

          {/* Status */}
          <div className="profile-field">
            <span className="profile-field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Status
            </span>
            <span className={getStatusBadgeClass(displayStatus)} id="profile-status">
              <span className="profile-status-dot" />
              {isLoading ? "Memuat..." : translateStatus(displayStatus)}
            </span>
          </div>

        </div>

        {/* Sign out */}
        <button
          className="profile-signout-btn"
          id="btn-profile-signout"
          onClick={logout}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Keluar
        </button>
      </div>
    </div>
  );
}
