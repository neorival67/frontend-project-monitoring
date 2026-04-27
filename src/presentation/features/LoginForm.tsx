"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/use-cases/hooks";

// ── SVG Icons ────────────────────────────────────────────────────────

function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

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

function IconMonitor() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const justRegistered = searchParams.get("registered") === "true";
  const justActivated = searchParams.get("activated") === "true";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch {
      // Error ditangani oleh hook
    }
  }

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-logo">
          <IconMonitor />
        </div>
        <h1 className="auth-title">Selamat Datang</h1>
        <p className="auth-subtitle">
          Masuk ke Dashboard Monitoring untuk memantau proyek Anda
        </p>
      </div>

      {/* Success alerts */}
      {justRegistered && (
        <div className="auth-alert auth-alert-success" role="alert">
          <span className="auth-alert-icon">✓</span>
          Registrasi berhasil! Silakan masuk dengan akun Anda.
        </div>
      )}

      {justActivated && (
        <div className="auth-alert auth-alert-success" role="alert">
          <span className="auth-alert-icon">✓</span>
          Akun berhasil diaktifkan! Silakan masuk.
        </div>
      )}

      {/* Error alert */}
      {loginError && (
        <div className="auth-alert auth-alert-error" role="alert">
          <span className="auth-alert-icon">✕</span>
          {loginError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form" id="login-form">
        <div className="auth-input-group">
          <label htmlFor="login-email" className="auth-label">Email</label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconMail /></span>
            <input
              id="login-email"
              type="email"
              className="auth-input"
              placeholder="nama@perusahaan.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label htmlFor="login-password" className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconLock /></span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={6}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-btn auth-btn-primary"
          disabled={isLoggingIn}
          id="login-submit"
        >
          {isLoggingIn ? (
            <span className="auth-btn-spinner">
              <span className="auth-spinner" />
              Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Belum punya akun?{" "}
          <Link href="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
