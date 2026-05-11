"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Clock, Upload, FileText, Check, Loader2 } from "lucide-react";
import AttachmentModal from "@/presentation/components/AttachmentModal";
import type { Aktivitas } from "@/core/entities/Proyek"; 
import { ClosingRepository } from "@/infrastructure/repositories/closing.repo";
import SuccessClosingModal from "@/presentation/components/SuccessClosingModal";

interface TabClosingProyekProps {
  proyekId: string;
  initialActivities: Aktivitas[];
}

export default function TabClosingProyek({
  proyekId,
  initialActivities,
}: TabClosingProyekProps) {
  const [activities, setActivities] = useState<Aktivitas[]>(initialActivities);
  const storageKey = `verified-activities-${proyekId}`;
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    }
    return new Set();
  });
  
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(verifiedIds)));
  }, [verifiedIds, storageKey]);


  const [bastFileName, setBastFileName] = useState<string | null>(null);
  const [isUploadingBast, setIsUploadingBast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" })


  // Kalkulasi Progress
  const totalActivities = activities.length;
  const verifiedCount = verifiedIds.size;
  const progressPercentage = totalActivities === 0 ? 0 : Math.round((verifiedCount / totalActivities) * 100);



  const handleVerify = (id: string) => {
    setVerifiedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingBast(true);
      
      try {
        await ClosingRepository.uploadBast(proyekId, file);
        setBastFileName(file.name);
        setModalContent({
          title: "Upload Berhasil",
          message: "Dokumen BAST sukses diunggah dan disimpan ke dalam sistem."
        });
        setIsSuccessModalOpen(true);
      } catch (error) {
        console.error("Error upload BAST:", error);
        alert("❌ Gagal mengunggah BAST");
      } finally {
        setIsUploadingBast(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
      }
    }
  };

  const handleSubmitClosing = async () => {
    if (verifiedCount !== totalActivities) {
      alert("Semua aktivitas harus diverifikasi sebelum menutup proyek!");
      return;
    }

    try {
      const response = await ClosingRepository.submitClosing({
        proyekId,
        handoverDate: new Date().toISOString(),
        notes: "Proyek diselesaikan dan diverifikasi.",
      });

      if (response) {
        localStorage.removeItem(storageKey); 
        
        setModalContent({
          title: "Proyek Ditutup!",
          message: "Semua aktivitas telah diverifikasi dan proyek resmi dinyatakan selesai."
        });
        setIsSuccessModalOpen(true);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      const pesanBackend = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`❌ Gagal Menutup Proyek: \n${JSON.stringify(pesanBackend, null, 2)}`);
    }
  };


  return (
  <div className="space-y-6">

    {/* Input File Tersembunyi buat BAST */}
      <input 
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

    {/* Banner Notifikasi */}
    <div className="flex items-center justify-between gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      {/* Bagian Kiri: Ikon dan Teks */}
      <div className="flex items-start gap-4">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
        <div>
          <h3 className="font-semibold text-yellow-800">
            {verifiedCount} dari {totalActivities} aktivitas terverifikasi
          </h3>
          <p className="text-sm text-yellow-700">
            Verifikasi semua aktivitas sebelum menutup proyek
          </p>
        </div>
      </div>

      {/* Bagian Kanan: Tombol Lampiran */}
      <div className="flex items-center gap-3">
          {/* Kalau udah keupload, tampilkan nama filenya */}
          {bastFileName && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-md">
              <FileText className="w-3 h-3" /> {bastFileName}
            </span>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploadingBast}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isUploadingBast ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {bastFileName ? "Ganti BAST" : "Upload BAST"}
          </button>
        </div>
    </div>

    {/* Progress Bar */}
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-600">Verifikasi Progress</span>
        <span className="font-bold text-gray-800">{progressPercentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>

    {/* List Aktivitas */}
    <div className="space-y-4">
      {activities.map((activity) => {
        const isVerified = verifiedIds.has(activity.id);

        return (
          <div
            key={activity.id}
            className={`flex flex-col justify-between rounded-xl border p-5 sm:flex-row sm:items-start ${
              isVerified
                ? "border-emerald-200 bg-emerald-50/30"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start gap-3">
              {isVerified ? (
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
              ) : (
                <div className="mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-gray-300" />
              )}

              <div>
                <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                
                {isVerified ? (
                  <div className="mt-1 space-y-2">
                    <p className="text-sm text-emerald-600">
                      ✓ Diverifikasi oleh Anda pada {new Date().toLocaleDateString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">{activity.deskripsi}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex shrink-0 flex-col gap-2 sm:mt-0 sm:items-end">
              {!isVerified && (
                <button
                  onClick={() => handleVerify(activity.id)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Verifikasi
                </button>
              )}  
            </div>
          </div>
        );
      })}
    </div>

    {/* Submit Button (Muncul jika 100% verified) */}
    {progressPercentage === 100 && (
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmitClosing}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Tutup Proyek & Generate Report
        </button>
      </div>     
    )}

    <SuccessClosingModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
    />
    
  </div>
  
  );
}