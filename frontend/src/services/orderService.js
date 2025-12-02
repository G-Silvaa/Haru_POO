import axios from 'axios';

const ORDER_BASE_URL = import.meta.env.VITE_ORDER_URL || 'http://localhost:8081/api/orders';

const client = axios.create({
  baseURL: ORDER_BASE_URL
});

export const orderService = {
  setAuthToken(token) {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  },
  async create(payload) {
    const { data } = await client.post('', payload);
    return data;
  },
  async list() {
    const { data } = await client.get('');
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await client.patch(`/${id}/status`, { status });
    return data;
  },
  async remove(id) {
    await client.delete(`/${id}`);
  }
};
