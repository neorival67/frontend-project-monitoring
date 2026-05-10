"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
  onUpload: (fileName: string, fileType: string) => void;
}

export default function AttachmentModal({
  isOpen,
  onClose,
  activityName,
  onUpload,
}: AttachmentModalProps) {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("PDF");

  if (!isOpen) return null;

  const handleUpload = () => {
    if (!fileName) return alert("Nama file wajib diisi");
    onUpload(fileName, fileType);
    setFileName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Tambah Lampiran</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-500">{activityName}</p>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nama File *
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Contoh: Laporan_Final.pdf"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tipe File
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="JPEG">JPEG</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ukuran File
              </label>
              <input
                type="text"
                disabled
                value="2.5 MB" // Simulasi otomatis
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </div>

          {/* Dropzone Area */}
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100">
            <Upload className="mb-2 h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">Upload file PDF atau JPEG/JPG</p>
            <p className="text-xs text-gray-400">(Simulasi: masukkan nama file di atas)</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Lampirkan
          </button>
        </div>
      </div>
    </div>
  );
}