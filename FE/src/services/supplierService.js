import { ApiService } from './api.js';

class SupplierService extends ApiService {
  constructor() {
    super('/suppliers');
  }

  // Lấy tất cả nhà cung cấp
  async getAllSuppliers() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }
  }

  // Lấy nhà cung cấp theo ID
  async getSupplierById(id) {
    return this.get(`/${id}`);
  }

  // Tìm kiếm nhà cung cấp theo tên
  async searchSuppliers(name) {
    return this.get(`?search=${encodeURIComponent(name)}`);
  }
}

export default new SupplierService();