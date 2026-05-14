import { apiDashboard } from "@/infrastructure/api/apiDashboard";


export async function getDashboardStats() {
  const { data: response } = await apiDashboard.getStats();
  const finalData = response?.data?.overview ? response.data : (response?.data?.data || response?.data);
  return finalData || { overview: {}, keuangan: {}, aktivitasTerkini: [], distribusiRisiko: [] };
}

export async function getActiveProjects() {
  const { data: response } = await apiDashboard.getActiveProjects();
  // Mengambil array proyek aktif
  return response?.data || [];
}

export async function getDashboardCharts() {
  const { data: response } = await apiDashboard.getCharts();
  // Mengambil data untuk D3.js (statistik proyek & komparasi keuangan)
  return response?.data || { statistikProyek: [], komparasiKeuangan: [] };
}

export async function getPredictions() {
  const { data: response } = await apiDashboard.getPredictions();
  // Mengambil array kalkulasi EVM (Earned Value Management)
  return response?.data || [];
}

export async function getActivities() {
  const { data: response } = await apiDashboard.getActivities();
  return response?.data || [];
}

export async function getVendorPerformance() {
  const { data: response } = await apiDashboard.getVendorPerformance();
  return response?.data || [];
}