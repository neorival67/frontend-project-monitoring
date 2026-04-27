import type { Metadata } from "next";
import { Suspense } from "react";
import { AcceptInviteForm } from "@/presentation/features";

export const metadata: Metadata = {
  title: "Terima Undangan — Dashboard Monitoring",
  description:
    "Terima undangan dan aktifkan akun Anda di Dashboard Monitoring.",
};

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteForm />
    </Suspense>
  );
}
