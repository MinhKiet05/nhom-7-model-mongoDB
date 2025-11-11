import { ApiService } from './api.js';

class ReportService extends ApiService {
  constructor() {
    super('/reports');
  }

  async getAllReports() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  }

  async getReportById(id) {
    return this.get(`/${id}`);
  }
}

export default new ReportService();