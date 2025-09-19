import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/api/auth/logout');
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getCapsules: async () => {
    const response = await api.get('/api/products/capsules');
    return response.data;
  },

  getMachines: async () => {
    const response = await api.get('/api/products/machines');
    return response.data;
  },

  getCapsule: async (id: string) => {
    const response = await api.get(`/api/products/capsules/${id}`);
    return response.data;
  },

  getMachine: async (id: string) => {
    const response = await api.get(`/api/products/machines/${id}`);
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/api/products/featured');
    return response.data;
  }
};

// Cart API
export const cartAPI = {
  getCart: async (sessionId: string) => {
    const response = await api.get(`/api/cart/${sessionId}`);
    return response.data;
  },

  addToCart: async (sessionId: string, product: any, quantity: number = 1) => {
    const response = await api.post('/api/cart/add', {
      sessionId,
      product,
      quantity
    });
    return response.data;
  },

  updateCart: async (sessionId: string, productId: string, quantity: number) => {
    const response = await api.put('/api/cart/update', {
      sessionId,
      productId,
      quantity
    });
    return response.data;
  },

  removeFromCart: async (sessionId: string, productId: string) => {
    const response = await api.delete(`/api/cart/remove/${sessionId}/${productId}`);
    return response.data;
  },

  clearCart: async (sessionId: string) => {
    const response = await api.post('/api/cart/clear', { sessionId });
    return response.data;
  }
};

// Orders API
export const ordersAPI = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  }
};