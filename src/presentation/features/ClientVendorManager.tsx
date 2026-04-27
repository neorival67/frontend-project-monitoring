"use client";

/**
 * Smart Component: ClientVendorManager
 * Halaman master data Client / Vendor dengan CRUD lengkap.
 * Menggunakan tabel data, modal form, dan fitur pencarian + filter.
 */

import { useState, useMemo, useCallback } from "react";
import {
  useSemuaClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/use-cases/hooks";
import { Modal, Button, Input } from "@/presentation/components";
import type {
  Client,
  ClientType,
  ClientStatus,
  CreateClientPayload,
} from "@/core/entities";

// ── Types ────────────────────────────────────────────────────────────

type FilterType = "Semua" | "client" | "vendor";
type FilterStatus = "Semua" | "ACTIVE" | "INACTIVE";

interface FormState {
  type: ClientType;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: ClientStatus;
}

const EMPTY_FORM: FormState = {
  type: "client",
  name: "",
  industry: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  status: "ACTIVE",
};

// ── Component ────────────────────────────────────────────────────────

export function ClientVendorManager() {
  // ─ Data Hooks ──────────────────────────────────────────────────────
  const { data: rawClients, isLoading, isError } = useSemuaClient();
  const clients = Array.isArray(rawClients) ? rawClients : [];
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  // ─ Local State ─────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("Semua");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("Semua");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ─ Filtered / Searched Data ────────────────────────────────────────
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.contactPerson?.toLowerCase().includes(search.toLowerCase()) ??
          false) ||
        (c.email?.toLowerCase().includes(search.toLowerCase()) ?? false);

      const matchType = filterType === "Semua" || c.type === filterType;
      const matchStatus =
        filterStatus === "Semua" || c.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [clients, search, filterType, filterStatus]);

  // ─ Stats ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = clients.length;
    const totalClient = clients.filter((c) => c.type === "client").length;
    const totalVendor = clients.filter((c) => c.type === "vendor").length;
    const totalActive = clients.filter((c) => c.status === "ACTIVE").length;
    return { total, totalClient, totalVendor, totalActive };
  }, [clients]);

  // ─ Handlers ────────────────────────────────────────────────────────

  const openCreate = useCallback(() => {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((client: Client) => {
    setEditingClient(client);
    setForm({
      type: client.type,
      name: client.name,
      industry: client.industry ?? "",
      contactPerson: client.contactPerson ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
      status: client.status,
    });
    setFormErrors({});
    setIsFormOpen(true);
  }, []);

  const openDetail = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDetailOpen(true);
  }, []);

  const openDelete = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Nama perusahaan wajib diisi";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateClientPayload = {
      type: form.type,
      name: form.name.trim(),
      industry: form.industry.trim() || undefined,
      contactPerson: form.contactPerson.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      status: form.status,
    };

    try {
      if (editingClient) {
        await updateMutation.mutateAsync({
          id: editingClient.id,
          payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      closeForm();
    } catch {
      // error ditangani oleh React Query
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      await deleteMutation.mutateAsync(selectedClient.id);
      setIsDeleteOpen(false);
      setSelectedClient(null);
    } catch {
      // error ditangani oleh React Query
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ─ Render ──────────────────────────────────────────────────────────

  return (
    <div className="cv-manager">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="cv-header">
        <div className="cv-header-left">
          <h1 className="cv-page-title">Master Data Client / Vendor</h1>
          <p className="cv-page-subtitle">
            Kelola data client dan vendor perusahaan
          </p>
        </div>
        <Button
          id="btn-add-client"
          variant="primary"
          onClick={openCreate}
        >
          <span className="cv-btn-icon">＋</span>
          Tambah Baru
        </Button>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="cv-stats">
        <div className="cv-stat-card cv-stat-total">
          <span className="cv-stat-icon">📋</span>
          <div className="cv-stat-info">
            <span className="cv-stat-value">{stats.total}</span>
            <span className="cv-stat-label">Total Data</span>
          </div>
        </div>
        <div className="cv-stat-card cv-stat-client">
          <span className="cv-stat-icon">🏢</span>
          <div className="cv-stat-info">
            <span className="cv-stat-value">{stats.totalClient}</span>
            <span className="cv-stat-label">Client</span>
          </div>
        </div>
        <div className="cv-stat-card cv-stat-vendor">
          <span className="cv-stat-icon">🤝</span>
          <div className="cv-stat-info">
            <span className="cv-stat-value">{stats.totalVendor}</span>
            <span className="cv-stat-label">Vendor</span>
          </div>
        </div>
        <div className="cv-stat-card cv-stat-active">
          <span className="cv-stat-icon">✅</span>
          <div className="cv-stat-info">
            <span className="cv-stat-value">{stats.totalActive}</span>
            <span className="cv-stat-label">Aktif</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="cv-toolbar">
        <div className="cv-search-wrapper">
          <span className="cv-search-icon">🔍</span>
          <input
            id="search-client"
            type="text"
            placeholder="Cari nama, PIC, atau email..."
            className="cv-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="cv-search-clear"
              onClick={() => setSearch("")}
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <div className="cv-filters">
          <select
            id="filter-type"
            className="cv-filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <option value="Semua">Semua Tipe</option>
            <option value="client">Client</option>
            <option value="vendor">Vendor</option>
          </select>

          <select
            id="filter-status"
            className="cv-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <option value="Semua">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="cv-table-wrapper">
        {isLoading ? (
          <div className="cv-loading">
            <div className="cv-spinner" />
            <span>Memuat data...</span>
          </div>
        ) : isError ? (
          <div className="cv-error">
            <span className="cv-error-icon">⚠️</span>
            <p>Gagal memuat data. Silakan coba lagi.</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="cv-empty">
            <span className="cv-empty-icon">📭</span>
            <p className="cv-empty-title">
              {search || filterType !== "Semua" || filterStatus !== "Semua"
                ? "Tidak ada data yang cocok"
                : "Belum ada data client / vendor"}
            </p>
            <p className="cv-empty-subtitle">
              {search || filterType !== "Semua" || filterStatus !== "Semua"
                ? "Coba ubah kata kunci atau filter pencarian"
                : 'Klik tombol "Tambah Baru" untuk memulai'}
            </p>
          </div>
        ) : (
          <table className="cv-table" id="table-clients">
            <thead>
              <tr>
                <th>Nama Perusahaan</th>
                <th>Tipe</th>
                <th>Industri</th>
                <th>PIC</th>
                <th>Email</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="cv-row">
                  <td className="cv-cell-name">
                    <button
                      className="cv-name-link"
                      onClick={() => openDetail(client)}
                    >
                      {client.name}
                    </button>
                  </td>
                  <td>
                    <span
                      className={`cv-badge cv-badge-${client.type.toLowerCase()}`}
                    >
                      {client.type === "client" ? "Client" : "Vendor"}
                    </span>
                  </td>
                  <td className="cv-cell-muted">
                    {client.industry || "—"}
                  </td>
                  <td>{client.contactPerson || "—"}</td>
                  <td className="cv-cell-muted">
                    {client.email || "—"}
                  </td>
                  <td>
                    <span
                      className={`cv-status cv-status-${client.status.toLowerCase()}`}
                    >
                      <span className="cv-status-dot" />
                      {client.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td>
                    <div className="cv-actions">
                      <button
                        className="cv-action-btn cv-action-view"
                        title="Lihat Detail"
                        onClick={() => openDetail(client)}
                        aria-label={`Lihat detail ${client.name}`}
                      >
                        👁
                      </button>
                      <button
                        className="cv-action-btn cv-action-edit"
                        title="Edit"
                        onClick={() => openEdit(client)}
                        aria-label={`Edit ${client.name}`}
                      >
                        ✏️
                      </button>
                      <button
                        className="cv-action-btn cv-action-delete"
                        title="Hapus"
                        onClick={() => openDelete(client)}
                        aria-label={`Hapus ${client.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Result Count ────────────────────────────────────────────── */}
      {!isLoading && !isError && filteredClients.length > 0 && (
        <div className="cv-result-count">
          Menampilkan {filteredClients.length} dari {clients.length} data
        </div>
      )}

      {/* ── Form Modal (Create / Edit) ──────────────────────────────── */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingClient ? "Edit Client / Vendor" : "Tambah Client / Vendor"}
      >
        <form className="cv-form" onSubmit={handleSubmit}>
          {/* Type & Status row */}
          <div className="cv-form-row">
            <div className="cv-form-group">
              <label className="cv-form-label" htmlFor="form-type">
                Tipe
              </label>
              <select
                id="form-type"
                className="cv-form-select"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as ClientType,
                  }))
                }
              >
                <option value="client">Client</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <div className="cv-form-group">
              <label className="cv-form-label" htmlFor="form-status">
                Status
              </label>
              <select
                id="form-status"
                className="cv-form-select"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as ClientStatus,
                  }))
                }
              >
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
              </select>
            </div>
          </div>

          <Input
            id="form-name"
            label="Nama Perusahaan *"
            placeholder="Contoh: PT Maju Jaya Indonesia"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={formErrors.name}
          />

          <Input
            id="form-industry"
            label="Industri"
            placeholder="Contoh: Keuangan, IT Services"
            value={form.industry}
            onChange={(e) =>
              setForm((f) => ({ ...f, industry: e.target.value }))
            }
          />

          <Input
            id="form-contact"
            label="Person in Charge (PIC)"
            placeholder="Contoh: Ir. Bambang Suryanto"
            value={form.contactPerson}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactPerson: e.target.value }))
            }
          />

          <div className="cv-form-row">
            <Input
              id="form-email"
              label="Email"
              type="email"
              placeholder="contact@company.co.id"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              error={formErrors.email}
            />
            <Input
              id="form-phone"
              label="Telepon"
              placeholder="+62-21-5555-5555"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>

          <div className="cv-form-group">
            <label className="cv-form-label" htmlFor="form-address">
              Alamat
            </label>
            <textarea
              id="form-address"
              className="cv-form-textarea"
              placeholder="Jl. Gatot Subroto No. 12, Jakarta Pusat 12345"
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
            />
          </div>

          {/* Error message from mutation */}
          {(createMutation.isError || updateMutation.isError) && (
            <div className="cv-form-error">
              ⚠️ Terjadi kesalahan. Silakan coba lagi.
            </div>
          )}

          <div className="cv-form-actions">
            <Button
              type="button"
              variant="ghost"
              onClick={closeForm}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              id="btn-submit-client"
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              {editingClient ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Detail Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedClient(null);
        }}
        title="Detail Client / Vendor"
      >
        {selectedClient && (
          <div className="cv-detail">
            <div className="cv-detail-header">
              <div className="cv-detail-avatar">
                {selectedClient.type === "client" ? "🏢" : "🤝"}
              </div>
              <div>
                <h3 className="cv-detail-name">{selectedClient.name}</h3>
                <div className="cv-detail-badges">
                  <span
                    className={`cv-badge cv-badge-${selectedClient.type.toLowerCase()}`}
                  >
                    {selectedClient.type === "client" ? "Client" : "Vendor"}
                  </span>
                  <span
                    className={`cv-status cv-status-${selectedClient.status.toLowerCase()}`}
                  >
                    <span className="cv-status-dot" />
                    {selectedClient.status === "ACTIVE"
                      ? "Aktif"
                      : "Tidak Aktif"}
                  </span>
                </div>
              </div>
            </div>

            <div className="cv-detail-grid">
              <div className="cv-detail-item">
                <span className="cv-detail-label">Industri</span>
                <span className="cv-detail-value">
                  {selectedClient.industry || "—"}
                </span>
              </div>
              <div className="cv-detail-item">
                <span className="cv-detail-label">Person in Charge</span>
                <span className="cv-detail-value">
                  {selectedClient.contactPerson || "—"}
                </span>
              </div>
              <div className="cv-detail-item">
                <span className="cv-detail-label">Email</span>
                <span className="cv-detail-value">
                  {selectedClient.email || "—"}
                </span>
              </div>
              <div className="cv-detail-item">
                <span className="cv-detail-label">Telepon</span>
                <span className="cv-detail-value">
                  {selectedClient.phone || "—"}
                </span>
              </div>
              <div className="cv-detail-item cv-detail-full">
                <span className="cv-detail-label">Alamat</span>
                <span className="cv-detail-value">
                  {selectedClient.address || "—"}
                </span>
              </div>
              <div className="cv-detail-item">
                <span className="cv-detail-label">Dibuat pada</span>
                <span className="cv-detail-value">
                  {new Date(selectedClient.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
              {selectedClient.updatedAt && (
                <div className="cv-detail-item">
                  <span className="cv-detail-label">Diperbarui pada</span>
                  <span className="cv-detail-value">
                    {new Date(selectedClient.updatedAt).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="cv-detail-actions">
              <Button
                variant="primary"
                onClick={() => {
                  setIsDetailOpen(false);
                  openEdit(selectedClient);
                }}
              >
                ✏️ Edit Data
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsDetailOpen(false);
                  openDelete(selectedClient);
                }}
              >
                🗑️ Hapus
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedClient(null);
        }}
        title="Konfirmasi Hapus"
      >
        {selectedClient && (
          <div className="cv-delete-confirm">
            <div className="cv-delete-icon">🗑️</div>
            <p className="cv-delete-message">
              Apakah Anda yakin ingin menghapus{" "}
              <strong>{selectedClient.name}</strong>?
            </p>
            <p className="cv-delete-warning">
              Tindakan ini tidak dapat dibatalkan.
            </p>

            {deleteMutation.isError && (
              <div className="cv-form-error">
                ⚠️ Gagal menghapus data. Silakan coba lagi.
              </div>
            )}

            <div className="cv-form-actions">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedClient(null);
                }}
                disabled={deleteMutation.isPending}
              >
                Batal
              </Button>
              <Button
                id="btn-confirm-delete"
                variant="danger"
                onClick={handleDelete}
                isLoading={deleteMutation.isPending}
              >
                Hapus
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
