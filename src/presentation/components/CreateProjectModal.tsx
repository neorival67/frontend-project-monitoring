import React, { useState } from "react";
import { useSemuaClient } from "@/use-cases/hooks/useClient";
import { useCreateProyek } from "@/use-cases/hooks/useProyek";
import type { CreateProyekPayload } from "@/core/entities";

interface CreateProjectModalProps {
  onClose: () => void;
}

const MOCK_TEAM_MEMBERS = [
  { id: "uuid-putri", name: "Putri Handayani", role: "Project Manager" },
  { id: "uuid-andi", name: "Andi Kurniawan", role: "Backend Developer" },
  { id: "uuid-rina", name: "Rina Permatasari", role: "Frontend Developer" },
  { id: "uuid-doni", name: "Doni Setiawan", role: "UI/UX Designer" },
  { id: "uuid-maya", name: "Maya Sari", role: "Business Analyst" },
  { id: "uuid-farhan", name: "Farhan Malik", role: "DevOps Engineer" },
  { id: "uuid-lestari", name: "Lestari Dewi", role: "QA Engineer" },
  { id: "uuid-bayu", name: "Bayu Pratama", role: "Mobile Developer" },
];

export function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const { data: clientsAndVendors, isLoading: isClientsLoading } = useSemuaClient();
  const createProyek = useCreateProyek();

  const clients = clientsAndVendors?.filter(c => c.type === "client" || c.tipe === "client") || [];
  const vendors = clientsAndVendors?.filter(c => c.type === "vendor" || c.tipe === "vendor") || [];

  const [formData, setFormData] = useState<CreateProyekPayload>({
    nameProyek: "",
    description: "",
    objectives: "",
    idClient: "",
    startDate: "",
    endDate: "",
    budget: 0,
    status: "inisiasi",
    vendorIds: [],
    teamMemberIds: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "budget" ? Number(value) : value,
    }));
  };

  const toggleVendor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      vendorIds: prev.vendorIds.includes(id) 
        ? prev.vendorIds.filter(v => v !== id)
        : [...prev.vendorIds, id]
    }));
  };

  const toggleTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMemberIds: prev.teamMemberIds.includes(id)
        ? prev.teamMemberIds.filter(t => t !== id)
        : [...prev.teamMemberIds, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProyek.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || "Gagal membuat proyek");
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">Buat Proyek Baru</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-scroll">
          {/* INFORMASI DASAR */}
          <div className="form-section">
            <h3 className="form-section-title">Informasi Dasar</h3>
            
            <div className="form-group">
              <label>Nama Proyek <span className="text-danger">*</span></label>
              <input
                type="text"
                name="nameProyek"
                className="form-input"
                placeholder="Nama proyek yang jelas dan deskriptif"
                value={formData.nameProyek}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Deskripsi</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Deskripsi singkat proyek..."
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tujuan / Objectives</label>
              <textarea
                name="objectives"
                className="form-input"
                placeholder="Tujuan dan target yang ingin dicapai dari proyek ini..."
                rows={2}
                value={formData.objectives}
                onChange={handleChange}
              />
            </div>
          </div>

          <hr className="form-divider" />

          {/* CLIENT & TIMELINE */}
          <div className="form-section">
            <h3 className="form-section-title">Client & Timeline</h3>
            
            <div className="form-group">
              <label>Client <span className="text-danger">*</span></label>
              <select
                name="idClient"
                className="form-input form-select"
                value={formData.idClient}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Pilih Client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.nama}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label>Tanggal Mulai <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-6">
                <label>Tanggal Selesai <span className="text-danger">*</span></label>
                <input
                  type="date"
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label>Total Budget (Rp)</label>
                <input
                  type="number"
                  name="budget"
                  className="form-input"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group col-6">
                <label>Status Awal</label>
                <select
                  name="status"
                  className="form-input form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="inisiasi">Inisiasi</option>
                  <option value="perencanaan">Planning</option>
                  <option value="pelaksanaan">Pelaksanaan</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="form-divider" />

          {/* VENDOR */}
          <div className="form-section">
            <h3 className="form-section-title">Vendor</h3>
            <div className="selection-grid">
              {vendors.length > 0 ? (
                vendors.map(v => (
                  <div 
                    key={v.id} 
                    className={`selection-card ${formData.vendorIds.includes(v.id) ? 'selected' : ''}`}
                    onClick={() => toggleVendor(v.id)}
                  >
                    <div className="selection-checkbox">
                      <div className={`checkbox-inner ${formData.vendorIds.includes(v.id) ? 'checked' : ''}`}></div>
                    </div>
                    <div className="selection-info">
                      <div className="selection-title">{v.name || v.nama}</div>
                      <div className="selection-subtitle">{v.contactPerson || v.kontak || "-"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted">Tidak ada vendor tersedia.</div>
              )}
            </div>
          </div>

          <hr className="form-divider" />

          {/* ASSIGN TIM */}
          <div className="form-section">
            <h3 className="form-section-title">Assign Tim</h3>
            <div className="selection-grid">
              {MOCK_TEAM_MEMBERS.map(t => (
                <div 
                  key={t.id} 
                  className={`selection-card ${formData.teamMemberIds.includes(t.id) ? 'selected' : ''}`}
                  onClick={() => toggleTeamMember(t.id)}
                >
                  <div className="selection-checkbox">
                    <div className={`checkbox-inner ${formData.teamMemberIds.includes(t.id) ? 'checked' : ''}`}></div>
                  </div>
                  <div className="selection-info">
                    <div className="selection-title">{t.name}</div>
                    <div className="selection-subtitle">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer sticky-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={createProyek.isPending}>
              {createProyek.isPending ? "Menyimpan..." : "Buat Proyek"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
