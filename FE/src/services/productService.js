import { ApiService } from './api.js';

class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    return this.get(`/${id}`);
  }

  // Tìm kiếm sản phẩm theo tên
  async searchProducts(name) {
    return this.get(`?search=${encodeURIComponent(name)}`);
  }
}

export default new ProductService();