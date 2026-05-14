"use client";

import { useQuery } from "@tanstack/react-query";
import * as dashboardRepo from "@/infrastructure/repositories/dashboard.repo";


const REFETCH_INTERVAL = 60_000; // auto-refresh setiap 1 menit

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardRepo.getDashboardStats,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useActiveProjects() {
  return useQuery({
    queryKey: ["dashboard", "active-projects"],
    queryFn: dashboardRepo.getActiveProjects,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: ["dashboard", "charts"],
    queryFn: dashboardRepo.getDashboardCharts,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: ["dashboard", "predictions"],
    queryFn: dashboardRepo.getPredictions,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useDashboardActivities() {
  return useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: dashboardRepo.getActivities,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useVendorPerformance() {
  return useQuery({
    queryKey: ["dashboard", "vendor-performance"],
    queryFn: dashboardRepo.getVendorPerformance,
    refetchInterval: REFETCH_INTERVAL,
  })
}