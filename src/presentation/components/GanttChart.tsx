"use client";

import React, { useMemo } from 'react';
import type { Aktivitas } from '@/core/entities/Proyek';

interface GanttChartProps {
  activities: Aktivitas[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ activities }) => {
  const timeline = useMemo(() => {
    if (!activities || activities.length === 0) return { days: [], startDate: new Date() };

    let minDate = new Date(activities[0].startDate || new Date());
    let maxDate = new Date(activities[0].dueDate || new Date());

    activities.forEach((act) => {
      const start = new Date(act.startDate || new Date());
      const end = new Date(act.dueDate || new Date());
      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 5);

    const days = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      days.push({
        date: new Date(currentDate),
        dayNum: currentDate.getDate(),
        monthStr: currentDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { days, startDate: minDate };
  }, [activities]);

  const { days, startDate } = timeline;
  // menghitung posisi (offset) dan lebar bar berdasarkan tanggal
  const getBarStyles = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return { left: '0%', width: '0%', display: 'none' };

    const start = new Date(startStr);
    const end = new Date(endStr)
  
    // Jika tanggal invalid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { left: '0%', width: '0%', display: 'none' };
    }

    const totalMsInDay = 1000 * 60 * 60 * 24;
    const offsetDays = (start.getTime() - startDate.getTime()) / totalMsInDay;
    const durationDays = (end.getTime() - start.getTime()) / totalMsInDay + 1; 

    return {
      left: `${(offsetDays / days.length) * 100}%`,
      width: `${(durationDays / days.length) * 100}%`
    };
  };

  // Helper: Warna Bar & Dot Status
  const getStatusColor = (status: string, progres: number) => {
    const safeStatus = (status || '').toLowerCase();
    
    if (safeStatus === 'selesai' || progres === 100) return 'bg-emerald-500';
    if (safeStatus === 'terlambat') return 'bg-rose-500';
    if (safeStatus === 'berjalan') return 'bg-blue-500';
    return 'bg-slate-300';
  };

  const months = days.reduce((acc, curr) => {
    if (!acc.includes(curr.monthStr)) acc.push(curr.monthStr);
    return acc;
  }, [] as string[]);

  if (!activities || activities.length === 0) {
    return <div className="p-8 text-center text-slate-400">Belum ada data Gantt Chart.</div>;
  }

  return (
    <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white mt-4">
      
      {/* KIRI: Panel List Aktivitas (Fixed Width) */}
      <div className="w-64 shrink-0 border-r border-slate-200 bg-white z-10 flex flex-col">
        {/* Header Kiri */}
        <div className="h-14 border-b border-slate-200 flex items-end p-3 pb-2 bg-slate-50/50">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">AKTIVITAS</span>
        </div>
        
        {/* Body Kiri */}
        <div className="flex-1">
          {activities.map((act, i) => {
            const currentProgress = act.progress ?? 0;
            const statusColor = getStatusColor(act.status, currentProgress);
            
            const assigneesText = act.assignees && act.assignees.length > 0 
              ? act.assignees.map((user: any) => user.name).join(', ') 
              : 'Belum ada tim';

            return (
              <div key={act.id || i} className="h-14 border-b border-slate-100 flex items-center justify-between px-3 group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${statusColor}`}></div>
                  <div className="overflow-hidden">
                    {/* PERBAIKAN: Gunakan act.name */}
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1" title={act.name}>{act.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1" title={assigneesText}>{assigneesText}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 ml-2">{currentProgress}%</span>
              </div>
            );
          })}
        </div>
      </div>

          {/* Body Kanan (Grid & Bars) */}
          <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px] relative">
          
          {/* Header Kanan (Bulan & Tanggal) */}
          <div className="h-14 border-b border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="flex text-[11px] font-bold text-slate-600 px-2 pt-1.5 border-b border-slate-200">
              {months.map(m => <div key={m} className="mr-8 mb-1">{m}</div>)}
            </div>
            <div className="flex flex-1 relative">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex justify-center items-center text-[10px] text-slate-400 border-r border-slate-100 last:border-0 relative">
                  {d.dayNum}
                </div>
              ))}
            </div>
          </div>

          {/* Body Kanan (Grid & Bars) */}
          <div className="relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex">
              {days.map((_, i) => (
                <div key={i} className="flex-1 border-r border-slate-100 last:border-0 h-full"></div>
              ))}
            </div>

            {/* Activity Bars */}
            {activities.map((act, i) => {
              const { left, width, display } = getBarStyles(act.startDate, act.dueDate);
              const currentProgress = act.progress ?? 0;
              const barColor = getStatusColor(act.status, currentProgress);
              
              return (
                <div key={act.id || i} className="h-14 border-b border-slate-100 flex items-center relative hover:bg-slate-50/30">
                  <div 
                    className={`absolute h-6 rounded-md shadow-sm flex items-center px-2 z-10 transition-all duration-300 ${barColor} text-white text-[10px] font-bold`}
                    style={{ left, width, display }}
                    title={`${act.name} (${currentProgress}%)`}
                  >
                    {/* Tampilkan progress text jika bar cukup panjang */}
                    {parseInt(width) > 5 && `${currentProgress}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};