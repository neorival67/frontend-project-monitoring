"use client";

import React from "react";
import { useDeleteUser } from "@/use-cases/hooks";

interface DeleteConfirmationModalProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteConfirmationModal({
  userId,
  isOpen,
  onClose,
  onSuccess,
}: DeleteConfirmationModalProps) {
  const deleteUser = useDeleteUser();
  const isLoading = deleteUser.isPending;

  const handleConfirmDelete = async () => {
    if (!userId) return;

    deleteUser.mutate(userId, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        alert(error?.response?.data?.message || "Gagal menghapus pengguna");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-confirm" style={{ maxWidth: "400px" }}>
        <div className="modal-delete-icon">🗑️</div>
        <h2 className="modal-title">Hapus Anggota?</h2>
        <p className="modal-message">
          Data yang dihapus tidak dapat dikembalikan.
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
