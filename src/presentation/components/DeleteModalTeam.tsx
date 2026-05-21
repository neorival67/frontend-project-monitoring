"use client";

import React from "react";
import { useDeleteMasterTeam } from "@/use-cases/hooks/useMasterTeam";

interface DeleteModalTeamProps {
  teamId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteModalTeam({
  teamId,
  isOpen,
  onClose,
  onSuccess,
}: DeleteModalTeamProps) {
  const deleteTeam = useDeleteMasterTeam();

  const handleConfirmDelete = async () => {
    if (!teamId) return;
    try {
      await deleteTeam.mutateAsync(teamId);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Gagal menghapus tim", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-confirm" style={{ maxWidth: "400px" }}>
        <div className="modal-delete-icon">🗑️</div>
        <h2 className="modal-title">Hapus Tim?</h2>
        <p className="modal-message">
          Data yang dihapus tidak dapat dikembalikan.
        </p>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={deleteTeam.isPending}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmDelete}
            disabled={deleteTeam.isPending}
          >
            {deleteTeam.isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
