import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8081/api/auth';

const client = axios.create({
  baseURL: AUTH_BASE_URL
});

export const authService = {
  async login(payload) {
    const { data } = await client.post('/login', payload);
    return data; // { token, type, expiresIn }
  },
  async register(payload) {
    const { data } = await client.post('/register', payload);
    return data;
  }
};
