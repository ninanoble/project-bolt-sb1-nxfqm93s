import axios, { InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  subscription: 'none' | 'free' | 'premium';
  newsletterSubscribed: boolean;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface SignupResponse extends LoginResponse {}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  signup: async (
    email: string,
    password: string,
    name: string,
    subscribeNewsletter: boolean
  ): Promise<SignupResponse> => {
    console.log('Signup data being sent:', { email, password, name, subscribeNewsletter });
    try {
      const response = await api.post<SignupResponse>('/auth/signup', {
        email,
        password,
        name,
        subscribeNewsletter,
      });
      return response.data;
    } catch (error: any) {
      console.error('Signup error details:', error.response?.data);
      throw error;
    }
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.get(`/auth/verify/${token}`);
  },
};

export const subscriptionApi = {
  updateSubscription: async (subscription: 'free' | 'premium'): Promise<void> => {
    await api.post('/subscription/update', { subscription });
  },

  getCurrentSubscription: async (): Promise<{ subscription: 'none' | 'free' | 'premium' }> => {
    const response = await api.get('/subscription/current');
    return response.data;
  },
};

export default api; 