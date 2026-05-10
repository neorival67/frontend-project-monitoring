"use client";

import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { ApprovalRepository } from '@/infrastructure/repositories/approval.repo';
import { Aktivitas } from '@/core/entities';
import { Attachment } from '@/core/entities/Proyek';

interface SubmitDeliverableProps {
  isOpen: boolean;
  onClose: () => void;
  proyekId: string;
  activities: Aktivitas[];  // list activities 
  onSuccess: () => void;
}

export const SubmitDeliverable: React.FC<SubmitDeliverableProps> = ({ isOpen, onClose, proyekId, activities, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    aktivitasId: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Silakan pilih file dokumen (PDF) terlebih dahulu.");
    
    setIsLoading(true);
    try {
      // Menggunakan FormData karena ini adalah upload file
      const submitData = new FormData();
      submitData.append('file', file);
      submitData.append('proyekId', proyekId);
      submitData.append('aktivitasId', formData.aktivitasId);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);

      await ApprovalRepository.uploadDeliverable(submitData);
      
      onSuccess();
      onClose();
      // Reset Form
      setFormData({ aktivitasId: '', title: '', description: '' });
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Gagal mengunggah deliverable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Tambah Deliverable Baru</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          <form id="submit-deliverable-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aktivitas *</label>
                <select required name="aktivitasId" value={formData.aktivitasId} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 bg-white">
                  <option value="">Pilih Aktivitas</option>
                  {activities.map(act => (
                    <option key={act.id} value={act.id}>{act.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Deliverable *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Laporan Security Testing" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">File Bukti / Dokumen (PDF, Maks 5MB) *</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                    <p className="text-xs text-slate-400">{file ? file.name : "PDF (MAX. 5MB)"}</p>
                  </div>
                  <input required type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi / Catatan Tambahan</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 resize-none" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200">Batal</button>
          <button type="submit" form="submit-deliverable-form" disabled={isLoading} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};