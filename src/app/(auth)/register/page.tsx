import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/presentation/features";

export const metadata: Metadata = {
  title: "Daftar — Dashboard Monitoring",
  description:
    "Daftar akun baru untuk Admin atau Project Manager di Dashboard Monitoring.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  // Jika ini adalah link undangan dari sistem (mengandung email/type), arahkan ke halaman aktivasi
  if (params?.email || params?.type === "client" || params?.type === "vendor") {
    const query = new URLSearchParams();
    if (params.email) query.set("email", params.email as string);
    if (params.type) query.set("type", params.type as string);
    if (params.token) query.set("token", params.token as string);
    if (params.name) query.set("name", params.name as string);
    
    redirect(`/activate?${query.toString()}`);
  }

  return <RegisterForm />;
}
