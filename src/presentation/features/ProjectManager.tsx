"use client";

import React, { useState } from "react";
import { useSemuaProyek } from "@/use-cases/hooks/useProyek";
import { ProjectCard } from "@/presentation/components/ProjectCard";
import { CreateProjectModal } from "@/presentation/components/CreateProjectModal";
import type { Proyek } from "@/core/entities";

export function ProjectManager() {
  const { data: projects, isLoading, isError } = useSemuaProyek();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const safeProjects = projects || [];

  // Derived counts
  const countAll = safeProjects.length;
  const countPlanning = safeProjects.filter(p => p.status?.toLowerCase() === "perencanaan" || p.status?.toLowerCase() === "planning").length;
  const countPelaksanaan = safeProjects.filter(p => p.status?.toLowerCase() === "pelaksanaan" || p.status?.toLowerCase() === "ongoing" || p.status?.toLowerCase() === "berjalan").length;
  const countClosing = safeProjects.filter(p => p.status?.toLowerCase() === "penutupan" || p.status?.toLowerCase() === "closing" || p.status?.toLowerCase() === "selesai").length;

  const handleFilter = (status: string) => {
    setFilterStatus(status);
  };

  const filteredProjects = safeProjects.filter(p => {
    // text search
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // status filter
    if (filterStatus === "Semua") return true;
    if (filterStatus === "Planning") return p.status?.toLowerCase() === "perencanaan" || p.status?.toLowerCase() === "planning";
    if (filterStatus === "Pelaksanaan") return p.status?.toLowerCase() === "pelaksanaan" || p.status?.toLowerCase() === "ongoing" || p.status?.toLowerCase() === "berjalan";
    if (filterStatus === "Closing") return p.status?.toLowerCase() === "penutupan" || p.status?.toLowerCase() === "closing" || p.status?.toLowerCase() === "selesai";

    return true;
  });

  return (
    <div className="project-manager">
      <div className="pm-header">
        <div className="pm-header-left">
          <h1 className="pm-title">Daftar Proyek</h1>
          <p className="pm-subtitle">{countAll} proyek terdaftar</p>
        </div>
        <button className="btn btn-primary btn-add" onClick={() => setIsModalOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Buat Proyek Baru
        </button>
      </div>

      <div className="pm-filters-container">
        <div className="pm-search">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Cari nama atau kode proyek..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="pm-tabs">
          <button 
            className={`pm-tab ${filterStatus === "Semua" ? "active" : ""}`}
            onClick={() => handleFilter("Semua")}
          >
            Semua ({countAll})
          </button>
          <button 
            className={`pm-tab ${filterStatus === "Planning" ? "active" : ""}`}
            onClick={() => handleFilter("Planning")}
          >
            Planning ({countPlanning})
          </button>
          <button 
            className={`pm-tab ${filterStatus === "Pelaksanaan" ? "active" : ""}`}
            onClick={() => handleFilter("Pelaksanaan")}
          >
            Pelaksanaan ({countPelaksanaan})
          </button>
          <button 
            className={`pm-tab ${filterStatus === "Closing" ? "active" : ""}`}
            onClick={() => handleFilter("Closing")}
          >
            Closing ({countClosing})
          </button>
        </div>
      </div>

      <div className="pm-content">
        {isLoading ? (
          <div className="pm-loading">Memuat proyek...</div>
        ) : isError ? (
          <div className="pm-error">Terjadi kesalahan saat memuat data.</div>
        ) : filteredProjects.length === 0 ? (
          <div className="pm-empty">Tidak ada proyek yang ditemukan.</div>
        ) : (
          <div className="project-grid">
            {filteredProjects.map(proyek => (
              <ProjectCard key={proyek.id} proyek={proyek} />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
