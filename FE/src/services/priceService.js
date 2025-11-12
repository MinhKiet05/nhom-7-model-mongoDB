import { ApiService } from './api.js';

class PriceService extends ApiService {
  constructor() {
    super('/prices'); // Sử dụng endpoint /prices
  }

  // Lấy tất cả giá
  async getAllPrices() {
    try {
      const response = await this.get('');
      return response || [];
    } catch (error) {
      console.error('Error fetching prices:', error);
      return [];
    }
  }

  // Lấy giá theo ID
  async getPriceById(id) {
    return this.get(`/${id}`);
  }

  // Lấy giá theo ProductID
  async getPricesByProductId(productId) {
    return this.get(`?productId=${productId}`);
  }

  // Tìm kiếm giá theo query
  async searchPrices(query) {
    return this.get(`?search=${encodeURIComponent(query)}`);
  }

  // Lấy giá theo trạng thái
  async getPricesByStatus(status) {
    return this.get(`?status=${status}`);
  }
}

export default new PriceService();