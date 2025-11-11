import { ApiService } from './api.js';

class PromotionService extends ApiService {
  constructor() {
    super('/promotions');
  }

  async getAllPromotions() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  }

  async getPromotionById(id) {
    return this.get(`/${id}`);
  }
}

export default new PromotionService();