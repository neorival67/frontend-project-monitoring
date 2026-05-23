"use client";

import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { RiskRepository } from '@/infrastructure/repositories/risk.repo';

interface CreateRiskProps {
  isOpen: boolean;
  onClose: () => void;
  proyekId: string;
  teamMembers: Array<{ id: string; name: string }>; 
  onSuccess: () => void;
}

export const CreateRisk: React.FC<CreateRiskProps> = ({ isOpen, onClose, proyekId, teamMembers, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // NAMA STATE disesuaikan persis dengan DTO
  const [formData, setFormData] = useState({
    riskName: '',
    kategori: 'Teknis',
    ownerId: '',
    probability: 3,
    impact: 3,
    mitigation: ''
  });

  // calculate score
  const riskScore = formData.probability * formData.impact;
  const riskLevel = useMemo(() => {
    if (riskScore >= 15) return { label: 'CRITICAL', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
    if (riskScore >= 10) return { label: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    if (riskScore >= 5) return { label: 'MEDIUM', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  }, [riskScore]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'probability' || name === 'impact' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await RiskRepository.createRisk({
        proyekId,
        riskName: formData.riskName,
        impact: formData.impact,
        probability: formData.probability,
        mitigation: formData.mitigation || undefined,
        ownerId: formData.ownerId || undefined,
        kategori: formData.kategori
      });

      onSuccess();
      onClose();
      // Reset Form
      setFormData({ riskName: '', kategori: 'Teknis', ownerId: '', probability: 3, impact: 3, mitigation: '' });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan atau pastikan kategori sesuai dropdown.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Tambah Risiko</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form id="create-risk-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Risiko *</label>
              <textarea 
                required name="riskName" value={formData.riskName} onChange={handleChange} 
                placeholder="Contoh: Keterlambatan suplai material" rows={2} 
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:border-orange-500 bg-white resize-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:border-orange-500 bg-white cursor-pointer">
                  <option value="Teknis">Teknis</option>
                  <option value="Manajemen">Manajemen</option>
                  <option value="SDM">SDM</option>
                  <option value="Regulasi">Regulasi</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Finansial">Finansial</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Owner</label>
                <select name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:border-orange-500 bg-white cursor-pointer">
                  <option value="">Pilih Owner</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Probabilitas (1-5)</label>
                <input type="range" min="1" max="5" step="1" name="probability" value={formData.probability} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                <div className="text-center text-sm font-bold text-slate-700 mt-1">{formData.probability}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">Dampak (1-5)</label>
                <input type="range" min="1" max="5" step="1" name="impact" value={formData.impact} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                <div className="text-center text-sm font-bold text-slate-700 mt-1">{formData.impact}</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${riskLevel.bg} transition-colors duration-300`}>
              <span className="text-sm font-medium text-slate-600">Risk Level Prediksi: </span>
              <span className={`text-sm font-bold ${riskLevel.color}`}>{riskLevel.label} (Score: {riskScore})</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rencana Mitigasi</label>
              <textarea name="mitigation" value={formData.mitigation} onChange={handleChange} placeholder="Langkah mitigasi yang direncanakan" rows={3} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:border-orange-500 bg-white resize-none" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3 rounded-b-2xl bg-slate-50">
          <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
          <button type="submit" form="create-risk-form" disabled={isLoading} className="flex-1 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

      </div>
    </div>
  );
};