import React, { useState } from "react";
import { useSemuaUser } from "@/use-cases/hooks/useUser";
import { 
  useMasterTeams, 
  useAssignProyekTeam, 
  useProyekTeamByProyekId, 
  useUpdateProyekTeam, 
  useDeleteProyekTeam 
} from "@/use-cases/hooks/useMasterTeam";

interface TabTeamProjectProps {
  proyekId: string;
  team: any[]; // tim saat ini (fallback)
}

export function TabTeamProject({ proyekId, team: fallbackTeam }: TabTeamProjectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: users } = useSemuaUser();
  const { data: masterTeams } = useMasterTeams();
  
  // Ambil data tim terbaru dari endpoint GET by proyekId
  const { data: apiTeam, isLoading } = useProyekTeamByProyekId(proyekId);
  const assignTeam = useAssignProyekTeam();
  const updateTeam = useUpdateProyekTeam();
  const deleteTeam = useDeleteProyekTeam();

  const [formData, setFormData] = useState({
    userId: "",
    teamId: "",
    roleInProject: "",
  });

  const handleOpenModal = (member?: any) => {
    if (member) {
      setEditingId(member.id); // Asumsi backend mereturn ID assignment
      setFormData({
        userId: member.userId || member.user?.id || "",
        teamId: member.teamId || member.team?.id || "",
        roleInProject: member.roleInProject || member.role || "",
      });
    } else {
      setEditingId(null);
      setFormData({ userId: "", teamId: "", roleInProject: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.userId || !formData.roleInProject) {
      alert("User dan Role wajib diisi!");
      return;
    }
    
    try {
      if (editingId) {
        // Edit mode (hanya ubah teamId dan roleInProject berdasarkan API yang biasa berlaku)
        await updateTeam.mutateAsync({
          id: editingId,
          payload: {
            teamId: formData.teamId || undefined,
            roleInProject: formData.roleInProject,
          }
        });
        alert("Data anggota berhasil diperbarui!");
      } else {
        // Assign baru
        await assignTeam.mutateAsync({
          proyekId,
          userId: formData.userId,
          teamId: formData.teamId || undefined,
          roleInProject: formData.roleInProject,
        });
        alert("Anggota berhasil di-assign!");
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert("Gagal memproses permintaan: " + (e?.message || "Error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus penugasan ini?")) {
      try {
        await deleteTeam.mutateAsync(id);
        alert("Penugasan berhasil dihapus!");
      } catch (e: any) {
        alert("Gagal menghapus penugasan: " + (e?.message || "Error"));
      }
    }
  };

  // Gunakan data dari API jika ada, jika belum / kosong gunakan fallback dari props
  const teamDataToDisplay = apiTeam && apiTeam.length > 0 ? apiTeam : fallbackTeam;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Tim Proyek</h3>
          <p className="text-[11px] text-slate-400 font-medium">Penugasan anggota ke proyek ini</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
        >
          Assign Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4 pl-6">Nama Anggota</th>
              <th className="p-4">Peran (Role)</th>
              <th className="p-4">Asal Tim</th>
              <th className="p-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                   Memuat data tim proyek...
                 </td>
               </tr>
            ) : teamDataToDisplay.length > 0 ? (
              teamDataToDisplay.map((member: any, idx: number) => {
                const userName = member.user?.name || member.userName || "Unknown User";
                const role = member.roleInProject || member.role || "-";
                const teamName = member.team?.name || member.masterTeamName || "-";
                
                return (
                  <tr key={member.id || idx} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-semibold text-slate-800 text-sm">{userName}</td>
                    <td className="p-4 text-sm text-slate-500">{role}</td>
                    <td className="p-4 text-sm text-slate-500">{teamName}</td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(member)} 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Edit Role/Tim"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => member.id ? handleDelete(member.id) : alert('ID assignment tidak tersedia')} 
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Hapus Assignment"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                  Belum ada anggota yang di-assign ke proyek ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800">{editingId ? "Edit Penugasan" : "Assign Member"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pilih User</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                  value={formData.userId}
                  onChange={e => setFormData({...formData, userId: e.target.value})}
                  disabled={!!editingId} // User ID biasanya tidak bisa diubah setelah di assign
                >
                  <option value="">-- Pilih User --</option>
                  {users?.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                {editingId && <p className="text-[10px] text-slate-400 mt-1">User tidak dapat diubah pada mode edit.</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pilih Master Team (Opsional)</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-white"
                  value={formData.teamId}
                  onChange={e => setFormData({...formData, teamId: e.target.value})}
                >
                  <option value="">-- Tidak Masuk Tim --</option>
                  {masterTeams?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role / Peran</label>
                <input 
                  type="text" 
                  value={formData.roleInProject} 
                  onChange={(e) => setFormData({...formData, roleInProject: e.target.value})}
                  placeholder="Misal: Backend Developer"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} disabled={assignTeam.isPending || updateTeam.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {(assignTeam.isPending || updateTeam.isPending) ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
