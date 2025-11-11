import { ApiService } from './api.js';

class InventoryService extends ApiService {
  constructor() {
    super('/inventory');
  }

  async getAllInventory() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  }

  async getInventoryById(id) {
    return this.get(`/${id}`);
  }
}

export default new InventoryService();