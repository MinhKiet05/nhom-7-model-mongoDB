import { ApiService } from './api.js';

class TaxService extends ApiService {
  constructor() {
    super('/tax'); // Sử dụng endpoint /tax theo collection name
  }

  // Lấy tất cả thuế
  async getAllTaxes() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching taxes:', error);
      return [];
    }
  }

  // Lấy thuế theo ID
  async getTaxById(id) {
    return this.get(`/${id}`);
  }

  // Tìm kiếm thuế theo tên hoặc mã
  async searchTaxes(query) {
    return this.get(`?search=${encodeURIComponent(query)}`);
  }

  // Lấy thuế theo trạng thái
  async getTaxesByStatus(status) {
    return this.get(`?status=${status}`);
  }
}

export default new TaxService();