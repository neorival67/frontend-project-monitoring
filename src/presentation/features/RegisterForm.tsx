"use client";

import { useState, useMemo, type FormEvent } from "react";
import Link from "next/link";
import { useRegister } from "@/use-cases/hooks";
import type { RegisterableRole } from "@/core/entities";

// ── SVG Icons ────────────────────────────────────────────────────────

function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

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

function IconShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
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

function IconUserPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
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

// ── Component ────────────────────────────────────────────────────────

export function RegisterForm() {
  const { register, isRegistering, registerError } = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterableRole>("ADMIN");
  const [showPassword, setShowPassword] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
    } catch {
      // Error ditangani oleh hook
    }
  }

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-logo">
          <IconUserPlus />
        </div>
        <h1 className="auth-title">Buat Akun Baru</h1>
        <p className="auth-subtitle">
          Pendaftaran mandiri untuk Admin dan Project Manager
        </p>
      </div>

      {/* Error alert */}
      {registerError && (
        <div className="auth-alert auth-alert-error" role="alert">
          <span className="auth-alert-icon">✕</span>
          {registerError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form" id="register-form">
        {/* Nama */}
        <div className="auth-input-group">
          <label htmlFor="register-name" className="auth-label">
            Nama Lengkap
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconUser /></span>
            <input
              id="register-name"
              type="text"
              className="auth-input"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Email */}
        <div className="auth-input-group">
          <label htmlFor="register-email" className="auth-label">
            Email
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconMail /></span>
            <input
              id="register-email"
              type="email"
              className="auth-input"
              placeholder="nama@perusahaan.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Role */}
        <div className="auth-input-group">
          <label htmlFor="register-role" className="auth-label">
            Role
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconShield /></span>
            <select
              id="register-role"
              className="auth-select"
              value={role}
              onChange={(e) => setRole(e.target.value as RegisterableRole)}
              required
            >
              <option value="ADMIN">Admin</option>
              <option value="PM">Project Manager</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="auth-input-group">
          <label htmlFor="register-password" className="auth-label">
            Password
          </label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon"><IconLock /></span>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
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

        <button
          type="submit"
          className="auth-btn auth-btn-primary"
          disabled={isRegistering}
          id="register-submit"
        >
          {isRegistering ? (
            <span className="auth-btn-spinner">
              <span className="auth-spinner" />
              Mendaftarkan...
            </span>
          ) : (
            "Daftar"
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
