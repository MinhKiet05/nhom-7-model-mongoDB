import { ApiService } from './api.js';

class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  // Lấy tất cả users
  async getAllUsers() {
    try {
      const response = await this.get('');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Lấy user theo ID
  async getUserById(id) {
    return this.get(`/${id}`);
  }

  // Tìm kiếm user theo tên
  async searchUsers(name) {
    return this.get(`?search=${encodeURIComponent(name)}`);
  }
}

export default new UserService();