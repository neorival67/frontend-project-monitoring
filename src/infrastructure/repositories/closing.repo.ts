import type { 
  ClosingProyek, 
  CreateClosingPayload 
} from '@/core/entities/Proyek'; 
import apiClient from '@/infrastructure/api/apiClient'; 

export const ClosingRepository = {
  
  async submitClosing(payload: CreateClosingPayload): Promise<ClosingProyek> {
    const { data } = await apiClient.post('/closing/submit', payload);
    return data.data || data;
  },

  async generateReport(proyekId: string): Promise<ClosingProyek> {
    // Return type disesuaikan dengan response API 
    const { data } = await apiClient.get(`/closing/generate-report/${proyekId}`);
    return data.data || data;
  },

  async getByProject(proyekId: string): Promise<ClosingProyek> {
    const { data } = await apiClient.get(`/closing/project/${proyekId}`);
    return data.data || data;
  },

  async uploadBast(proyekId: string, file: File) {
    const formData = new FormData();
    formData.append('proyekId', proyekId);
    formData.append('file', file);

    const { data } = await apiClient.post('/closing/upload-bast', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.data || data;
  }
};