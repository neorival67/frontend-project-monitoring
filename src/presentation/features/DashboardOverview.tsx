"use client";

import React from 'react';
import { DashboardChart } from './DashboardChart';
import { 
  FolderGit2, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Zap, ArrowUpRight 
} from 'lucide-react';
import { 
  useDashboardStats, useActiveProjects, 
  useDashboardCharts, usePredictions, useDashboardActivities 
} from '@/use-cases/hooks/useDashboard';

export const DashboardOverview = () => {
  const { data: statsAPI, isLoading: loadingStats } = useDashboardStats();
  const { data: activeProjectsAPI, isLoading: loadingProjects } = useActiveProjects();
  const { data: chartDataAPI, isLoading: loadingCharts } = useDashboardCharts();
  const { data: predictionsAPI, isLoading: loadingPredictions } = usePredictions();
  const { data: activitiesAPI, isLoading: loadingActivities } = useDashboardActivities();

  const stats = statsAPI?.overview || {};
  const keuangan = statsAPI?.keuangan || {};
  const activeProjects = Array.isArray(activeProjectsAPI) ? activeProjectsAPI : [];
  const chartDataBudget = chartDataAPI?.komparasiKeuangan || [];
  const chartDataTarget = chartDataAPI?.targetVsAktual || [];
  const evmPredictions = Array.isArray(predictionsAPI) ? predictionsAPI : [];
  
  const recentActivities = activitiesAPI?.recentActivities || [];
  const riskDistribution = activitiesAPI?.riskDistribution || [];

  // Kalkulasi total risiko untuk Donut Chart
  const totalRisks = riskDistribution.reduce((sum: number, r: any) => sum + (r.count || 0), 0);
  let currentSvgAngle = 0; // Untuk rotasi dinamis Donut Chart

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pemantauan proyek real-time
          </p>
        </div>
      </div>

      {/* STATS CARDS (Top Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><FolderGit2 className="w-5 h-5"/></div>
          <ArrowUpRight className="absolute top-5 right-5 w-4 h-4 text-slate-300" />
          <h2 className="text-3xl font-bold text-slate-800">{loadingStats ? "..." : (stats.proyek || 0)}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Total Proyek</p>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><TrendingUp className="w-5 h-5"/></div>
          <ArrowUpRight className="absolute top-5 right-5 w-4 h-4 text-slate-300" />
          <h2 className="text-3xl font-bold text-slate-800">
            {loadingStats ? "..." : `Rp ${(keuangan.totalBudget / 1000000 || 0).toFixed(1)}M`}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Total Budget</p>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden">
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4"><AlertTriangle className="w-5 h-5"/></div>
          <ArrowUpRight className="absolute top-5 right-5 w-4 h-4 text-slate-300" />
          <h2 className="text-3xl font-bold text-slate-800">{loadingActivities ? "..." : totalRisks}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Total Risiko</p>
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4"><CheckCircle2 className="w-5 h-5"/></div>
          <ArrowUpRight className="absolute top-5 right-5 w-4 h-4 text-slate-300" />
          <h2 className="text-3xl font-bold text-slate-800">{loadingStats ? "..." : (stats.dokumen || 0)}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Total Deliverable</p>
        </div>
      </div>

      {/* ACTIVE PROJECTS (Second Row) - FULL API */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loadingProjects ? (
           <div className="col-span-3 text-center text-slate-400 py-4 border border-dashed rounded-xl">Memuat data proyek dari API...</div>
        ) : activeProjects.length > 0 ? (
          activeProjects.map((proyek: any) => (
            <div key={proyek.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-400">PRJ-{proyek.id.substring(0,4)}</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full font-semibold tracking-wide uppercase">
                  {proyek.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{proyek.nama}</h3>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                {proyek.tanggalSelesai ? new Date(proyek.tanggalSelesai).toLocaleDateString() : 'Belum set timeline'}
              </p>
              
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                <span>Progress</span><span>{proyek.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${proyek.progress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-3">
                <span className="text-[11px] font-medium text-slate-400">Budget: Rp {(proyek.budget / 1000000 || 0).toFixed(1)}M</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-slate-400 py-4 border border-dashed rounded-xl">Belum ada proyek aktif di sistem.</div>
        )}
      </div>

      {/* CHARTS AREA - FULL API */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] min-h-[350px]">
          {loadingCharts ? (
             <div className="animate-pulse w-full h-48 bg-slate-100 rounded mt-10"></div>
          ) : chartDataBudget.length > 0 ? (
            <DashboardChart 
              title="Budget vs Realisasi"
              data={chartDataBudget.map((d:any) => ({ ...d, fullLabel: `Proyek ${d.label}` }))}
              label1="Budget" label2="Realisasi"
              color1="#3b82f6" color2="#10b981" 
              valuePrefix="Rp "
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">Tidak ada data visualisasi keuangan</div>
          )}
        </div>
        
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] min-h-[350px]">
          {loadingCharts ? (
             <div className="animate-pulse w-full h-48 bg-slate-100 rounded mt-10"></div>
          ) : chartDataTarget.length > 0 ? (
            <DashboardChart 
              title="Target vs Aktual Progress (%)"
              data={chartDataTarget.map((d:any) => ({ ...d, fullLabel: `Proyek ${d.label}` }))}
              label1="Target" label2="Aktual"
              color1="#8b5cf6" color2="#06b6d4" 
              valueSuffix="%"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">Tidak ada data progress proyek</div>
          )}
        </div>
      </div>

      {/* PREDICTIVE ANALYTICS SECTION - FULL API */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Forecast Keterlambatan (Dari EVM / SPI Backend) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-500" /></div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Forecast Kinerja</h3>
              <p className="text-[11px] text-slate-400 font-medium">Berdasarkan CPI/SPI</p>
            </div>
          </div>
          <div className="space-y-3">
            {loadingPredictions ? (
              <div className="text-sm text-slate-400">Memuat analisis EVM...</div>
            ) : evmPredictions.length > 0 ? (
              evmPredictions.map((pred: any) => (
                <div key={`forecast-${pred.proyekId}`} className="border p-3 rounded-xl bg-slate-50 border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-700 line-clamp-1">{pred.proyek}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Target EV: Rp {(pred.metrics.EV / 1000000 || 0).toFixed(1)}M</span>
                    <span>Aktual Progress: {pred.progress}%</span>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-sm text-slate-400">Data EVM belum tersedia</div>
            )}
          </div>
        </div>

        {/* Prediksi Overbudget (Dari EAC Backend) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-rose-500" /></div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Prediksi Overbudget</h3>
              <p className="text-[11px] text-slate-400 font-medium">Estimate At Completion (EAC)</p>
            </div>
          </div>
          <div className="space-y-3">
            {loadingPredictions ? (
              <div className="text-sm text-slate-400">Mengkalkulasi anggaran...</div>
            ) : evmPredictions.length > 0 ? (
              evmPredictions.map((pred: any) => {
                const isOver = pred.status === 'POTENSI OVERBUDGET';
                return (
                  <div key={`budget-${pred.proyekId}`} className={`${isOver ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'} border p-3 rounded-xl flex flex-col justify-center`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-700 truncate pr-2">{pred.proyek}</span>
                      <span className={`text-[11px] font-bold flex items-center gap-1 shrink-0 ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isOver ? <AlertTriangle className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>} 
                        {isOver ? 'Overbudget' : 'Aman'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p>BAC: Rp {(pred.metrics.BAC / 1000000 || 0).toFixed(1)}M</p>
                      <p>Prediksi (EAC): <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>Rp {(pred.metrics.EAC / 1000000 || 0).toFixed(1)}M</span></p>
                    </div>
                  </div>
                );
              })
            ) : (
               <div className="text-sm text-slate-400">Data anggaran belum tersedia</div>
            )}
          </div>
        </div>

        {/* Analisis Performa Vendor - KOSONG KARENA BELUM ADA API */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"><Zap className="w-4 h-4 text-purple-500" /></div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Analisis Vendor</h3>
              <p className="text-[11px] text-slate-400 font-medium">Multi-metric Scoring</p>
            </div>
          </div>
          
          <div className="h-full flex items-center justify-center pb-10">
             <div className="text-slate-400 text-sm text-center border border-dashed border-slate-200 p-4 rounded-xl">
               Belum ada data metrik evaluasi vendor dari API saat ini.
             </div>
          </div>
        </div>

      </div>

      {/* RISIKO & AKTIVITAS BAWAH - FULL API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Distribusi Risiko - Dynamic Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <h3 className="font-semibold text-slate-800 text-sm mb-8">Distribusi Risiko</h3>
          
          {loadingActivities ? (
             <div className="text-center text-slate-400 text-sm py-10">Memuat matriks risiko...</div>
          ) : totalRisks === 0 ? (
             <div className="text-center text-slate-400 text-sm py-10">Belum ada risiko teridentifikasi di sistem.</div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                  {riskDistribution.map((risk: any, index: number) => {
                    const pct = risk.count / totalRisks;
                    const dashOffset = 251.2 * (1 - pct);
                    const rotation = currentSvgAngle;
                    currentSvgAngle += (pct * 360); // Accumulate rotation for next slice
                    
                    // Assign warna berdasar level
                    let color = '#3b82f6'; // Default Low/Dimitigasi
                    if(risk.level === 'Critical' || risk.level === 'Kritis') color = '#ef4444';
                    if(risk.level === 'High' || risk.level === 'Tinggi') color = '#f97316';
                    if(risk.level === 'Medium' || risk.level === 'Sedang') color = '#eab308';

                    return (
                      <circle 
                        key={index}
                        cx="50" cy="50" r="40" 
                        fill="transparent" stroke={color} 
                        strokeWidth="16" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={dashOffset} 
                        className="origin-center transition-all duration-1000 ease-out"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="space-y-3 w-full sm:w-auto">
                {riskDistribution.map((risk: any, index: number) => {
                    let colorClass = 'bg-blue-500'; 
                    if(risk.level === 'Critical' || risk.level === 'Kritis') colorClass = 'bg-rose-500';
                    if(risk.level === 'High' || risk.level === 'Tinggi') colorClass = 'bg-orange-500';
                    if(risk.level === 'Medium' || risk.level === 'Sedang') colorClass = 'bg-yellow-500';

                    return (
                      <div key={index} className="flex justify-between items-center text-xs w-full gap-8">
                        <span className="flex items-center gap-2 text-slate-600">
                          <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div> {risk.level}
                        </span>
                        <span className="font-semibold text-slate-800">{risk.count}</span>
                      </div>
                    );
                })}
                <div className="pt-3 mt-2 border-t border-slate-100 text-[10px] text-slate-400">Total: {totalRisks} risiko</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Aktivitas Terkini - DARI API */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
          <h3 className="font-semibold text-slate-800 text-sm mb-6">Aktivitas Terkini</h3>
          <div className="space-y-5">
            {loadingActivities ? (
              <div className="text-sm text-slate-400">Menarik log aktivitas...</div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((act: any) => (
                <div key={act.id} className="flex gap-4 items-center group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${act.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-700">{act.nama}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {act.proyek?.kode || 'Tanpa Proyek'} • Progress {act.progress}% • {act.status}
                    </p>
                  </div>
                  {/* Garis status di kanan */}
                  <div className={`w-8 h-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity ${act.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400 py-4">Belum ada aktivitas terekam.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};