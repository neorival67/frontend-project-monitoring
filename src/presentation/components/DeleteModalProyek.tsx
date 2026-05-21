"use client";

import React, { useState } from "react";
import { deleteProyek } from "@/infrastructure/repositories/proyek.repo";

interface DeleteModalProyekProps {
  projectId: string | null;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteModalProyek({
  projectId,
  projectName,
  isOpen,
  onClose,
  onSuccess,
}: DeleteModalProyekProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    try {
      await deleteProyek(projectId);
      alert("✅ Proyek berhasil dihapus permanen!");
      onSuccess?.();
      onClose();
      window.location.reload();
    } catch (error: any) {
      const Backendmsg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`❌ Gagal menghapus proyek: \n${Backendmsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-confirm" style={{ maxWidth: "400px" }}>
        <div className="modal-delete-icon">🗑️</div>
        <h2 className="modal-title">Hapus Proyek?</h2>
        <p className="modal-message">
          Yakin mau menghapus proyek "{projectName}"?<br />
          Semua aktivitas di dalamnya akan hilang!
        </p>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmDelete}
            disabled={isLoading}
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
