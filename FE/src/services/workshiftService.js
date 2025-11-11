import { ApiService } from './api.js';

class WorkshiftService extends ApiService {
  constructor() {
    super('/workshifts');
  }

  // Lấy tất cả ca làm việc
  async getAllWorkshifts() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching workshifts:', error);
      return [];
    }
  }

  // Lấy ca làm việc theo ID
  async getWorkshiftById(id) {
    return this.get(`/${id}`);
  }

  // Tìm kiếm ca làm việc theo trạng thái
  async getWorkshiftsByStatus(status) {
    return this.get(`?status=${encodeURIComponent(status)}`);
  }
}

export default new WorkshiftService();