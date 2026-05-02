import React from "react";
import type { User } from "@/core/entities";

interface TeamCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function TeamCard({ user, onEdit, onDelete }: TeamCardProps) {
  // Extract initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determine avatar background color deterministically
  const getColorClass = (name: string) => {
    const colors = ["bg-red", "bg-blue", "bg-green", "bg-yellow", "bg-purple", "bg-pink", "bg-indigo", "bg-teal"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getDeptClass = (dept?: string) => {
    if (!dept) return "";
    const lower = dept.toLowerCase();
    if (lower.includes("engineering")) return "engineering";
    if (lower.includes("design")) return "design";
    if (lower.includes("business")) return "business";
    if (lower.includes("qa")) return "qa";
    return "";
  };

  const skills = user.skills ? user.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const displaySkills = skills.slice(0, 3);
  const remainingSkills = skills.length > 3 ? skills.length - 3 : 0;

  return (
    <div className="team-card">
      <div className="tc-header" onClick={() => onEdit(user)}>
        <div className={`tc-avatar ${getColorClass(user.name)}`}>
          {getInitials(user.name)}
        </div>
        <div className="tc-info">
          <div className="tc-name" title={user.name}>{user.name}</div>
          <div className="tc-role">{user.role}</div>
        </div>
      </div>

      <div className="tc-contact">
        <div className="tc-contact-item" title={user.email}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          {user.email}
        </div>
        {user.phone && (
          <div className="tc-contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {user.phone}
          </div>
        )}
      </div>

      <div className="tc-badges-row">
        {user.departemen && (
          <span className={`dept-badge ${getDeptClass(user.departemen)}`}>
            {user.departemen}
          </span>
        )}
        <span className={`status-badge ${user.status.toLowerCase()}`}>
          {user.status === "ACTIVE" ? "Aktif" : user.status === "INACTIVE" ? "Inaktif" : user.status}
        </span>
      </div>

      {skills.length > 0 && (
        <div className="tc-skills">
          {displaySkills.map((skill, idx) => (
            <span key={idx} className="skill-pill">{skill}</span>
          ))}
          {remainingSkills > 0 && (
            <span className="skill-pill">+{remainingSkills}</span>
          )}
        </div>
      )}

      {onDelete && (
        <div className="tc-actions">
          <button
            className="tc-action-btn tc-action-edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="tc-action-btn tc-action-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user);
            }}
            title="Hapus"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
