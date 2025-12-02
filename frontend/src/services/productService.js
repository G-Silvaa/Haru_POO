import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/products';

const client = axios.create({
  baseURL: API_BASE_URL
});

let authToken = null;

const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price)
});

export const productService = {
  setAuthToken(token) {
    authToken = token;
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  },
  async getAll({ page = 0, size = 10, search = '', category = '' } = {}) {
    const { data } = await client.get('', { params: { page, size, search, category } });
    return {
      ...data,
      content: data.content.map(normalizeProduct)
    };
  },
  async create(payload) {
    const { data } = await client.post('', payload);
    return normalizeProduct(data);
  },
  async update(id, payload) {
    const { data } = await client.put(`/${id}`, payload);
    return normalizeProduct(data);
  },
  async updateQuantity(id, quantity) {
    const { data } = await client.patch(`/${id}/quantity`, { quantity });
    return normalizeProduct(data);
  },
  async remove(id) {
    await client.delete(`/${id}`);
  }
};
