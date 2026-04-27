"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAcceptInvite } from "@/use-cases/hooks";

// ── SVG Icons ────────────────────────────────────────────────────────

function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function IconMailOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconAlertTriangle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

// ── Password Strength ────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  level: number;
  label: string;
  className: string;
} {
  if (!password) return { level: 0, label: "", className: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: "Lemah", className: "weak" };
  if (score <= 3) return { level: 2, label: "Sedang", className: "medium" };
  return { level: 3, label: "Kuat", className: "strong" };
}

export function ActivateForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";
  // Gunakan nama jika ada, atau bagian depan email sebagai fallback
  const name = searchParams.get("name") || (emailParam ? emailParam.split('@')[0] : "Pengguna");
  
  const { acceptInvite, isAccepting, acceptError, isSuccess, data } =
    useAcceptInvite();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  // Handle case dimana token benar-benar kosong dari link email
  // Karena backend membutuhkan token untuk verifikasi, kita harus menolak jika tidak ada token.
  if (!token) {
    return (
      <div className="auth-card">
        <div className="auth-header">
          <div
            className="auth-logo"
            style={{ background: "linear-gradient(135deg, #ef4444, #f97316)" }}
          >
            <IconAlertTriangle />
          </div>
          <h1 className="auth-title">Link Tidak Lengkap</h1>
          <p className="auth-subtitle">
            Sistem mendeteksi bahwa link aktivasi dari email Anda kehilangan parameter <strong>token</strong>. 
            Hal ini disebabkan oleh template email dari backend yang belum menyertakan `&token=...` pada linknya.
          </p>
        </div>
        <Link href="/login" className="auth-btn auth-btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          Kembali ke Login
        </Link>
      </div>
    );
  }

  // Success state
  if (isSuccess && data) {
    return (
      <div className="auth-card">
        <div className="auth-success-container">
          <div className="auth-success-icon">
            <IconCheck />
          </div>
          <h2 className="auth-success-title">Akun Berhasil Diaktifkan!</h2>
          <p className="auth-success-message">
            Selamat datang, <strong>{data.user?.name || name}</strong>! Akun Anda sebagai{" "}
            <strong>{data.user?.role || "PENGGUNA"}</strong> telah aktif. Anda akan diarahkan
            ke halaman login...
          </p>
          <Link
            href="/login?activated=true"
            className="auth-btn auth-btn-primary"
            style={{ display: "block", textAlign: "center", textDecoration: "none" }}
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await acceptInvite({ token, password });
    } catch {
      // Error ditangani oleh hook
    }
  }

  const displayError = localError || acceptError;

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-logo">
          <IconMailOpen />
        </div>
        <h1 className="auth-title">Aktivasi Akun</h1>
        <p className="auth-subtitle">
          Halo {name}, selamat datang! Silakan buat password Anda untuk mulai menggunakan sistem.
        </p>
      </div>

      {/* Error alert */}
      {displayError && (
        <div className="auth-alert auth-alert-error" role="alert">
          <span className="auth-alert-icon">✕</span>
          {displayError}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="auth-form"
        id="activate-form"
      >
        {/* Password */}
        <div className="auth-input-group">
          <label htmlFor="activate-password" className="auth-label">
            Password Baru
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconLock /></span>
            <input
              id="activate-password"
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <>
              <div className="password-strength">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`password-strength-bar ${
                      bar <= strength.level
                        ? `active ${strength.className}`
                        : ""
                    }`}
                  />
                ))}
              </div>
              <p className="password-strength-text">
                Kekuatan password: {strength.label}
              </p>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="auth-input-group">
          <label htmlFor="activate-confirm-password" className="auth-label">
            Konfirmasi Password
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconLock /></span>
            <input
              id="activate-confirm-password"
              type={showPassword ? "text" : "password"}
              className={`auth-input ${
                confirmPassword && password !== confirmPassword
                  ? "input-error"
                  : ""
              }`}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="password-strength-text" style={{ color: "var(--error)" }}>
              Password tidak cocok
            </p>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn auth-btn-primary"
          disabled={isAccepting || (!!confirmPassword && password !== confirmPassword)}
          id="activate-submit"
        >
          {isAccepting ? (
            <span className="auth-btn-spinner">
              <span className="auth-spinner" />
              Menyimpan...
            </span>
          ) : (
            "Simpan"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Sudah punya akun?{" "}
          <Link href="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
