// File: src/infrastructure/api/apiDashboard.ts
import apiClient from "./apiClient";

export const apiDashboard = {
  getStats: () => apiClient.get<any>("/dashboard/stats"),
  getActiveProjects: () => apiClient.get<any>("/dashboard/active-projects"),
  getCharts: () => apiClient.get<any>("/dashboard/charts"),
  getPredictions: () => apiClient.get<any>("/dashboard/predictions"),
  getActivities: () => apiClient.get<any>("/dashboard/activities"),
};