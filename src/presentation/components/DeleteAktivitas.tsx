import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteAktivitasProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activityName: string;
  isLoading: boolean;
}

export const DeleteAktivitas: React.FC<DeleteAktivitasProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activityName,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Konfirmasi Hapus
          </h2>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus aktivitas <span className="font-bold text-slate-800">"{activityName}"</span>? 
            Tindakan ini tidak dapat dibatalkan dan semua riwayat progres di dalamnya akan ikut terhapus.
          </p>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            disabled={isLoading} 
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-rose-600/20"
          >
            {isLoading ? (
              'Menghapus...'
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Ya, Hapus
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};