import { ApiService } from './api.js';

class ReturnService extends ApiService {
  constructor() {
    super('/returns');
  }

  async getAllReturns() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching returns:', error);
      return [];
    }
  }

  async getReturnById(id) {
    return this.get(`/${id}`);
  }
}

export default new ReturnService();