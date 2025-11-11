import ApiService from './api';

class CustomerService {
  // Get all customers
  async getAllCustomers() {
    try {
      const response = await ApiService.get('/customers');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Get customer by ID
  async getCustomerById(id) {
    try {
      const response = await ApiService.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      return null;
    }
  }

  // Create new customer
  async createCustomer(customerData) {
    try {
      const response = await ApiService.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Update customer
  async updateCustomer(id, customerData) {
    try {
      const response = await ApiService.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  }

  // Delete customer (soft delete)
  async deleteCustomer(id) {
    try {
      const response = await ApiService.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }
}

export default new CustomerService();