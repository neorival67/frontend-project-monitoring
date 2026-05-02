"use client";

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { RiskRepository } from '@/infrastructure/repositories/risk.repo';

interface DeleteRiskProps {
  isOpen: boolean;
  onClose: () => void;
  riskId: string;
  riskDesc: string; 
  onSuccess: () => void;
}

export const DeleteRisk: React.FC<DeleteRiskProps> = ({ isOpen, onClose, riskId, riskDesc, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Gunakan repo untuk konsistensi kode
      await RiskRepository.deleteRisk(riskId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat menghapus risiko.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="p-6 flex flex-col items-center text-center pt-8">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-5 ring-4 ring-rose-50">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Hapus Risiko?</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-2">Apakah Anda yakin ingin menghapus risiko:</p>
          <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg w-full border border-slate-100 mb-4 line-clamp-2">
            {riskDesc}
          </p>
          <p className="text-xs text-rose-500 font-medium">Tindakan ini permanen dan tidak dapat dibatalkan.</p>
        </div>

        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
          <button onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-100 rounded-xl transition-colors">Batal</button>
          <button onClick={handleDelete} disabled={isLoading} className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors">
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>

      </div>
    </div>
  );
};