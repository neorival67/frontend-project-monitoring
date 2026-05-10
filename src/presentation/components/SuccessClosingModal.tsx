import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessClosingModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessClosingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Kotak Modal */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Ikon Sukses */}
          <div className="rounded-full bg-emerald-100 p-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          
          {/* Teks */}
          <div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Tombol Tutup */}
          <button
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Selesai
          </button>

        </div>
      </div>
    </div>
  );
}