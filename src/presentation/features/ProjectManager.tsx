"use client";

import React, { useState } from "react";
import { useSemuaProyek } from "@/use-cases/hooks/useProyek";
import { ProjectCard } from "@/presentation/components/ProjectCard";
import { CreateProjectModal } from "@/presentation/components/CreateProjectModal"; 

const getStatusValue = (proyek: Record<string, unknown>): string => {
  const status = proyek.status;
  if (typeof status === 'string') return status.toLowerCase();
  return '';
};

const matchesSearch = (proyek: Record<string, unknown>, query: string): boolean => {
  const nama = typeof proyek.nama === 'string' ? proyek.nama : '';
  const name = typeof proyek.name === 'string' ? proyek.name : '';
  const kode = typeof proyek.kode === 'string' ? proyek.kode : '';
  const searchLower = query.toLowerCase();
  
  return nama.toLowerCase().includes(searchLower) || 
         name.toLowerCase().includes(searchLower) || 
         kode.toLowerCase().includes(searchLower);
};

const isStatusMatching = (status: string, filterStatus: string): boolean => {
  if (filterStatus === "Semua") return true;
  if (filterStatus === "Planning") return status === "perencanaan" || status === "planning";
  if (filterStatus === "Pelaksanaan") return status === "pelaksanaan" || status === "ongoing" || status === "berjalan";
  if (filterStatus === "Closing") return status === "penutupan" || status === "closing" || status === "selesai";
  return true;
};

export function ProjectManager() {
  const { data: response, isLoading, isError } = useSemuaProyek();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  // Handle response data
  const safeProjects: Record<string, unknown>[] = (Array.isArray(response) ? response : []) as unknown as Record<string, unknown>[];

  // Derived counts
  const countAll = safeProjects.length;
  const countPlanning = safeProjects.filter((p) => isStatusMatching(getStatusValue(p), "Planning")).length;
  const countPelaksanaan = safeProjects.filter((p) => isStatusMatching(getStatusValue(p), "Pelaksanaan")).length;
  const countClosing = safeProjects.filter((p) => isStatusMatching(getStatusValue(p), "Closing")).length;

  const filteredProjects = safeProjects.filter((p) => {
    if (!matchesSearch(p, searchQuery)) return false;
    if (!isStatusMatching(getStatusValue(p), filterStatus)) return false;
    return true;
  });

  return (
    <div className="w-full pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Daftar Proyek</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{countAll} proyek terdaftar di sistem</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Buat Proyek Baru
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-2 mb-6">
        
        {/* Search Bar */}
        <div className="relative flex-1 flex items-center">
          <svg className="absolute left-3 text-slate-400 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Cari nama atau kode proyek..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        {/* Tabs Status */}
        <div className="flex gap-1 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
          {[
            { id: "Semua", label: `All (${countAll})` },
            { id: "Planning", label: `Planning (${countPlanning})` },
            { id: "Pelaksanaan", label: `On Going (${countPelaksanaan})` },
            { id: "Closing", label: `Closing (${countClosing})` }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === tab.id 
                  ? "bg-slate-800 text-white dark:bg-blue-600" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
             <p className="text-slate-500 text-sm">Memuat daftar proyek...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-rose-500 text-sm border border-dashed border-rose-200 rounded-xl bg-rose-50">
            Terjadi kesalahan saat memuat data. Pastikan backend aktif.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
            Tidak ada proyek yang ditemukan untuk filter ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredProjects.map((proyek: Record<string, unknown>) => (
              <ProjectCard key={String(proyek.id)} proyek={proyek} />
            ))}
          </div>
        )}
      </div>
        {isModalOpen && <CreateProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}