"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, User, FileText, CheckCircle2, Activity, Clock } from 'lucide-react';
import { useProyekDetail } from '@/use-cases/hooks/useProyek';

// Nanti pastikan path import ini disesuaikan dengan folder strukturmu
import { TabOverview } from './tabs/TabOverview';
import { TabPlanningGantt } from './tabs/TabPlanningGantt';
import { TabMonitoring } from './tabs/TabMonitoring';
import { TabApproval } from './tabs/TabApproval';
import { userAgent } from 'next/server';
import TabClosingProyek from './tabs/TabClosingProyek'; 
import { Client } from '../../core/entities/Client';
import { ClientVendor, ClosingProyek } from '../../core/entities/Proyek';
import { active } from 'd3';

export const ProjectDetailFeature = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string; 

  const [activeTab, setActiveTab] = useState('overview');

  // TARIK DATA API
  const { data: response, isLoading } = useProyekDetail(projectId);

  const rawData = response?.data?.data || response?.data || response || {};
  const proyek = rawData.proyek || rawData; 

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-400 text-sm">Menarik detail proyek dari API...</p>
      </div>
    );
  }

  if (!proyek || Object.keys(proyek).length === 0) {
    return (
      <div className="w-full p-10 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl">
        <p className="text-slate-500">Data proyek tidak ditemukan atau API gagal mengambil data.</p>
        <button onClick={() => router.back()} className="mt-4 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm">Kembali</button>
      </div>
    );
  }

  // Data Preparation (Bisa juga dipindah ke custom hooks terpisah jika makin besar)
  const activities = proyek.activities || proyek.aktivitas || [];
  const team = proyek.tim || proyek.teamMember || proyek.users || [];
  const risks = proyek.risks || proyek.risiko || []; 
  const deliverables = proyek.deliverables || proyek.dokumen || [];
  const clientName = proyek.klien?.nama || proyek.client?.name || proyek.klien?.name || '-';
  const LogAktivitas = proyek.LogAktivitas || proyek.logAktivitas || [];
  const Approval = proyek.ReviewApproval || [];

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER SECTION TETAP DI SINI */}
      <div className="bg-white border border-slate-100 rounded-t-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="p-6 pb-0 flex items-start justify-between">
          <div className="flex gap-4">
            <button onClick={() => router.back()} className="mt-1 p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-slate-400">PRJ-{proyek.kode || proyek.id?.substring(0,4)}</span>
                <span className="bg-purple-50 text-purple-600 text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wide uppercase">
                  {proyek.status || 'Berjalan'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{proyek.nama || proyek.name || 'Nama Proyek'}</h1>
              <p className="text-sm text-slate-500 mt-1">{clientName}</p>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-8 mt-6 px-6 border-b border-slate-100 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
            { id: 'planning', label: 'Planning & Gantt', icon: <Calendar className="w-4 h-4" /> },
            { id: 'monitoring', label: 'Monitoring', icon: <Clock className="w-4 h-4" /> },
            { id: 'approval', label: 'Approval', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'closing', label: 'Closing', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* COMPONENT TAB RENDERING */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'overview' && (
          <TabOverview 
            proyek={proyek} 
            activities={activities} 
            team={team} 
            ClientName = {clientName}
            risks={risks} 
            deliverables={deliverables} 
          />
        )}
        {activeTab === 'planning' && (
          <TabPlanningGantt
            proyek={proyek} 
            activities={activities} 
            risks={risks} 
          />
        )}

       {activeTab === 'monitoring' && (
          <TabMonitoring activities={activities} />
        )}

        {activeTab === 'approval' && (
          <TabApproval 
            activities={activities} 
            currentUser={User} 
          />
        )}

        {activeTab === 'closing' && (
          <TabClosingProyek
            proyekId={projectId}
            initialActivities={activities}
          />
        )}
        {/* Render tab lainnya di sini... */} 
      </div>

    </div>
  );
};