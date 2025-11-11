import { ApiService } from './api.js';

class PurchaseOrderService extends ApiService {
  constructor() {
    super('/purchaseorders');
  }

  async getAllPurchaseOrders() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      return [];
    }
  }

  async getPurchaseOrderById(id) {
    return this.get(`/${id}`);
  }
}

export default new PurchaseOrderService();