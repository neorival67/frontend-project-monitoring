/**
 * Layout: DashboardLayout
 * Layout wrapper untuk semua halaman dashboard (Sidebar + Navbar + Content).
 * Meliputi NotificationProvider untuk sistem notifikasi real-time (polling).
 */

import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { NotificationProvider } from "@/infrastructure/providers/NotificationProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <NotificationProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <main className="dashboard-content">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
