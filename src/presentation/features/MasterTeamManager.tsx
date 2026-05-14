"use client";

import React, { useState } from "react";
import { useMasterTeams, useCreateMasterTeam, useUpdateMasterTeam, useDeleteMasterTeam } from "@/use-cases/hooks/useMasterTeam";

export function MasterTeamManager() {
  const { data: teams, isLoading } = useMasterTeams();
  const createTeam = useCreateMasterTeam();
  const updateTeam = useUpdateMasterTeam();
  const deleteTeam = useDeleteMasterTeam();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<{id: string, name: string, description: string} | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleOpenModal = (team?: any) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ name: team.name, description: team.description });
    } else {
      setEditingTeam(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingTeam) {
      await updateTeam.mutateAsync({ id: editingTeam.id, payload: formData });
    } else {
      await createTeam.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus tim ini?")) {
      await deleteTeam.mutateAsync(id);
    }
  };

  return (
    <div className="w-full space-y-6 pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Master Tim</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola struktur organisasi dan tim kerja</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah Tim
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Memuat data tim...</div>
        ) : (teams && teams.length > 0) ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 pl-6">Nama Tim</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teams.map((team: any) => (
                <tr key={team.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-800">{team.name}</td>
                  <td className="p-4 text-sm text-slate-500">{team.description}</td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenModal(team)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(team.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-400">Belum ada tim yang ditambahkan.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800">{editingTeam ? "Edit Tim" : "Tambah Tim Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Tim</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Misal: Tim Backend"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Penjelasan tugas dan tanggung jawab tim"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 h-24 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} disabled={createTeam.isPending || updateTeam.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {(createTeam.isPending || updateTeam.isPending) ? "Menyimpan..." : "Simpan Tim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
