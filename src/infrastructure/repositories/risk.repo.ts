// core/repositories/risk.repo.ts

import { CreateRiskPayload, PenilaianResiko } from '@/core/entities';
import apiClient from "@/infrastructure/api/apiClient"; 

export const RiskRepository = {
  // GET: Mengambil semua risiko berdasarkan ID Proyek
  async getByProjectId(proyekId: string): Promise<PenilaianResiko[]> {
    const { data } = await apiClient.get(`/penilaian-resiko/project/${proyekId}`);
    return data.data || data; 
  }, // <--- INI KOMA AMAN

  // POST: Menambahkan risiko baru
  async createRisk(payload: CreateRiskPayload): Promise<PenilaianResiko> {
    const { data } = await apiClient.post('/penilaian-resiko', payload);
    return data.data || data;
  }, // <--- 🔥 INI DIA KOMA YANG TADI KETINGGALAN 🔥

  // DELETE: Menghapus risiko
  async deleteRisk(id: string): Promise<void> {
    await apiClient.delete(`/penilaian-resiko/${id}`);
  }, // <--- Tambahin koma di sini juga buat jaga-jaga kalau nanti mau nambah fungsi lagi

  // UPDATE: Mengubah status risiko (Fungsi yang baru kita bahas)
  async updateRiskStatus(id: string, status: string): Promise<void> {
    await apiClient.patch(`/penilaian-resiko/${id}`, { status });
  }
};