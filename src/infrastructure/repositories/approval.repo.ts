import type { 
  Deliverable, 
  ReviewApproval, 
  CreateReviewPayload,
} from '@/core/entities';
import apiClient  from '@/infrastructure/api/apiClient';

export const ApprovalRepository = {
  async getByProject(proyekId: string): Promise<Deliverable[]> {
    const { data } = await apiClient.get(`/deliverables/project/${proyekId}`);
    return data.data || data;
  },

  // PATCH: Review Deliverable (Client, Admin)
  async uploadDeliverable(payload: FormData): Promise<Deliverable> {
    const { data } = await apiClient.post('/deliverables/upload', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data || data;
  },

  async reviewDeliverable(
    id: string, 
    payload: CreateReviewPayload
  ): Promise<ReviewApproval> {
    const { data } = await apiClient.patch(`/deliverables/review/${id}`, payload);
    return data.data || data;
  }
};
