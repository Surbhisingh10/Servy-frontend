import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  restaurantId: string;
  organizationId?: string;
  outletId?: string | null;
  accessibleOutletIds?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    restaurantId: string;
    restaurantName?: string;
    outletNames?: string[];
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.login(email, password);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.register(data);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('selected_outlet_id');
      localStorage.removeItem('restaurantSlug');
      localStorage.removeItem('restaurantTableNumber');
      localStorage.removeItem('lastOrder');
      localStorage.removeItem('customerOrderHistory');
      localStorage.removeItem('restaurant-cart');
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await api.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
