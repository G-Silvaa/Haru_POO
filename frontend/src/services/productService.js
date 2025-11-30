import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/products';

const client = axios.create({
  baseURL: API_BASE_URL
});

const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price)
});

export const productService = {
  async getAll() {
    const { data } = await client.get('');
    return data.map(normalizeProduct);
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
  }
};
