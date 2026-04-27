import apiClient from "@/infrastructure/api/apiClient";
import type { DashboardSummary } from "@/core/entities";

/**
 * Repository: Dashboard
 * Fungsi pemanggil endpoint dashboard summary.
 */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data: response } = await apiClient.get<any>("/dashboard/summary");
  const beData = response?.data || {};

  return {
    projectStats: {
      totalProjects: beData.overview?.proyek || 0,
      inProgress: beData.statistikProyek?.find((p: any) => p.status === 'berjalan')?.jumlah || 0,
      completed: beData.statistikProyek?.find((p: any) => p.status === 'selesai')?.jumlah || 0,
      delayed: beData.statistikProyek?.find((p: any) => p.status === 'terlambat')?.jumlah || 0,
      notStarted: beData.statistikProyek?.find((p: any) => p.status === 'inisiasi')?.jumlah || 0,
    },
    financialSummary: {
      totalBudget: beData.keuangan?.totalBudget || 0,
      totalSpent: beData.keuangan?.totalPengeluaran || 0,
      remainingBudget: beData.keuangan?.sisaAnggaran || 0,
      budgetUtilization: beData.keuangan?.totalBudget 
        ? Math.round((beData.keuangan.totalPengeluaran / beData.keuangan.totalBudget) * 100) 
        : 0,
    },
    teamStats: {
      totalUsers: beData.overview?.karyawan || 0,
      activeUsers: beData.overview?.karyawan || 0,
      pendingInvitations: 0,
    },
    activityStats: {
      totalActivities: beData.overview?.aktivitas || 0,
      completedActivities: 0,
      inProgressActivities: beData.overview?.aktivitas || 0,
      delayedActivities: 0,
      averageProgress: 50,
    },
    riskSummary: {
      totalRisks: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    },
    deliverableStats: {
      totalDeliverables: beData.overview?.dokumen || 0,
      approved: beData.overview?.dokumen || 0,
      rejected: 0,
      pending: 0,
    },
    topRisks: [],
    upcomingDeadlines: [],
  };
}
