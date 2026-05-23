"use client";

import { useEffect, useRef } from "react";

/**
 * Dumb Component: Modal
 * Komponen modal dialog yang bisa dipakai ulang.
 */

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Tutup modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </dialog>
  );
}
