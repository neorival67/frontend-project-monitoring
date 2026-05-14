import React, { useState, useEffect } from 'react';
import apiClient from "@/infrastructure/api/apiClient";
import { Aktivitas } from '@/core/entities/Proyek'; 

interface CreateLogAktivitasProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Aktivitas[] 
  onSuccess: () => void;
}

export const CreateLogAktivitas: React.FC<CreateLogAktivitasProps> = ({ isOpen, onClose, activities, onSuccess }) => {
  const [aktivitasId, setAktivitasId] = useState('');
  const [userId, setUserId] = useState('');
  const [tipeLog, setTipeLog] = useState('Update Progress'); 
  const [progress, setProgress] = useState('');
  const [biaya, setBiaya] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tanggal, setTanggal] = useState('');

  useEffect(() => {
    if (isOpen) {
      const userData = localStorage.getItem('user'); 
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const payload = {
        aktivitasId: aktivitasId,
        userId: userId, 
        description: deskripsi,
        progressAdded: tipeLog === 'Update Progress' && progress ? Number(progress) : 0,
        costIncurred: tipeLog === 'Realisasi Biaya' && biaya ? Number(biaya) : 0,
        status: "ON_TRACK", // Hardcode sementara sesuai contoh lu
        logDate: tanggal ? new Date(tanggal).toISOString() : new Date().toISOString(),
      };

      // Fetch endpoint logaktivitas
      await apiClient.post('/log-aktivitas/post-log', payload);

      // Reset form
      setAktivitasId('');
      setTipeLog('Update Progress');
      setTanggal('');
      setProgress('');
      setBiaya('');
      setDeskripsi('');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan log:", error);
      alert("Gagal menyimpan log aktivitas. Cek console.");
    } finally {
      setIsLoading(false);
    }

    
  };

   if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Tambah Log Aktivitas</h2>
        </div>

        <div className="p-6">
          <form id="form-log" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-6">
              
              {/* Dropdown Aktivitas */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Aktivitas <span className="text-rose-500">*</span></label>
                <select 
                  value={aktivitasId} 
                  onChange={(e) => setAktivitasId(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 text-slate-700"
                  required
                >
                  <option value="" disabled>Pilih Aktivitas</option>
                  {activities.map(act => (
                    <option key={act.id} value={act.id}>{act.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Tipe Log</label>
                <select 
                  value={tipeLog} 
                  onChange={(e) => setTipeLog(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500 text-slate-700"
                >
                  <option value="Update Progress">Update Progress</option>
                  <option value="Realisasi Biaya">Realisasi Biaya</option>
                  <option value="Catatan">Catatan</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Tanggal</label>
                <input 
                  type="date" 
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              {/* Input Dinamis berdasarkan Tipe UI */}
              {tipeLog === 'Update Progress' && (
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Progress (%)</label>
                  <input 
                    type="number" min="0" max="100"
                    value={progress} onChange={(e) => setProgress(e.target.value)}
                    placeholder="0-100"
                    className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              )}

              {tipeLog === 'Realisasi Biaya' && (
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Jumlah Biaya (Rp)</label>
                  <input 
                    type="number" 
                    value={biaya} onChange={(e) => setBiaya(e.target.value)}
                    placeholder="Contoh: 1000000"
                    className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Deskripsi <span className="text-rose-500">*</span></label>
              <textarea 
                rows={3}
                value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi detail log aktivitas..." required
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-slate-700 resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button 
            type="button" onClick={onClose} disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" form="form-log" disabled={isLoading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Log'}
          </button>
        </div>

      </div>
    </div>
  );
};