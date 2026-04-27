import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivateForm } from "@/presentation/features";

export const metadata: Metadata = {
  title: "Aktivasi Akun — Dashboard Monitoring",
  description:
    "Buat password untuk mengaktifkan akun Anda di Dashboard Monitoring.",
};

export default function ActivatePage() {
  return (
    <Suspense>
      <ActivateForm />
    </Suspense>
  );
}
