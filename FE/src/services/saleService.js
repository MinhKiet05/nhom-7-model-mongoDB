import { ApiService } from './api.js';

class SaleService extends ApiService {
  constructor() {
    super('/sales');
  }

  async getAllSales() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  }

  async getSaleById(id) {
    return this.get(`/${id}`);
  }
}

export default new SaleService();