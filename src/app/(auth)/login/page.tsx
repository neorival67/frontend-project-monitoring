import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/presentation/features";

export const metadata: Metadata = {
  title: "Masuk — Dashboard Monitoring",
  description: "Masuk ke Dashboard Monitoring untuk memantau proyek Anda.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
