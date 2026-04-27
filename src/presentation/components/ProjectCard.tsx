import React from "react";
import type { Proyek } from "@/core/entities";

interface ProjectCardProps {
  proyek: Proyek;
  onClick?: () => void;
}

export function ProjectCard({ proyek, onClick }: ProjectCardProps) {
  // Helper for formatting date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper for formatting currency
  const formatRupiah = (amount: number | string) => {
    const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
    if (isNaN(num)) return "Rp 0";
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  // Status mapping
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "perencanaan":
      case "planning":
        return "status-planning";
      case "pelaksanaan":
      case "ongoing":
      case "berjalan":
        return "status-pelaksanaan";
      case "closing":
      case "penutupan":
      case "selesai":
        return "status-closing";
      case "inisiasi":
        return "status-inisiasi";
      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status: string) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Calculate days left
  const calculateDaysLeft = (endDateStr: string) => {
    if (!endDateStr) return { text: "-", isLate: false };
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} hari terlambat`, isLate: true };
    }
    return { text: `${diffDays} hari tersisa`, isLate: false };
  };

  const timeInfo = calculateDaysLeft(proyek.endDate);
  
  // Mock progress and budget used (since not in API yet)
  const progress = proyek.progres ?? Math.floor(Math.random() * 100);
  const budgetNum = typeof proyek.budget === "string" ? parseInt(proyek.budget, 10) : proyek.budget;
  const budgetUsed = Math.floor((budgetNum || 0) * (progress / 100)); // mock
  const budgetPercent = budgetNum ? (budgetUsed / budgetNum) * 100 : 0;

  const teamMembers = proyek.teams || [];
  const displayTeams = teamMembers.slice(0, 4);
  const extraTeams = teamMembers.length > 4 ? teamMembers.length - 4 : 0;

  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-icon-wrap">
        <div className="project-card-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
        </div>
      </div>
      
      <div className="project-card-content">
        <div className="project-card-header">
          <div className="project-card-meta">
            <span className="project-id">{proyek.id.substring(0, 8).toUpperCase()}</span>
            <span className={`project-status ${getStatusColor(proyek.status)}`}>
              <span className="status-dot"></span>
              {getStatusLabel(proyek.status)}
            </span>
          </div>
          <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <h3 className="project-title">{proyek.name}</h3>
        <p className="project-desc">{proyek.description?.length > 80 ? proyek.description.substring(0, 80) + "..." : proyek.description}</p>

        <div className="project-details-grid">
          <div className="detail-item">
            <span className="detail-label">🏢 Client</span>
            <span className="detail-value">{proyek.client?.name || "-"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Timeline</span>
            <span className="detail-value">{formatDate(proyek.startDate)} — {formatDate(proyek.endDate)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👥 Tim</span>
            <div className="team-avatars">
              {displayTeams.length > 0 ? (
                displayTeams.map((t, idx) => (
                  <div key={t.id || idx} className={`avatar bg-color-${idx % 5}`}>
                    {t.user?.name ? t.user.name.charAt(0).toUpperCase() : "?"}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400">Belum ada tim</span>
              )}
              {extraTeams > 0 && (
                <div className="avatar avatar-more">+{extraTeams}</div>
              )}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Sisa Waktu</span>
            <span className={`detail-value ${timeInfo.isLate ? "text-danger" : "text-muted"}`}>
              {timeInfo.text}
            </span>
          </div>
        </div>

        <div className="project-progress-row">
          <div className="progress-group">
            <div className="progress-labels">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill fill-primary" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="progress-group">
            <div className="progress-labels">
              <span>Budget Terpakai</span>
              <span>{Math.round(budgetPercent)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill fill-success" style={{ width: `${budgetPercent}%` }}></div>
            </div>
            <div className="progress-subtext">
              {formatRupiah(budgetUsed)} / {formatRupiah(budgetNum)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
