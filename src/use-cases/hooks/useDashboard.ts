"use client";

import { useQuery } from "@tanstack/react-query";
import * as dashboardRepo from "@/infrastructure/repositories/dashboard.repo";

/**
 * Hook: useDashboard
 * Mengelola state data dashboard summary.
 */

const DASHBOARD_QUERY_KEY = ["dashboard-summary"] as const;

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardRepo.getDashboardSummary,
    refetchInterval: 60_000, // auto-refresh setiap 1 menit
  });
}
