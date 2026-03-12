import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { handleApiError, ApiError } from './errors';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private requestQueue: Map<string, Promise<any>> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const requestId = typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        config.headers['x-request-id'] = requestId;

        if (typeof window !== 'undefined') {
          const slugMatch = window.location.pathname.match(/\/restaurant\/([^\/]+)/);
          if (slugMatch) {
            config.headers['x-restaurant-slug'] = slugMatch[1];
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => {
        if (response.data?.success !== undefined) {
          return { ...response, data: response.data.data };
        }
        return response;
      },
      (error: AxiosError) => {
        const apiError = handleApiError(error);

        if (apiError.statusCode === 401) {
          this.clearToken();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            window.location.href = '/auth/login';
          }
          return Promise.reject(apiError);
        }

        if (apiError.statusCode === 403) {
          toast.error('You do not have permission to perform this action');
          return Promise.reject(apiError);
        }

        if (apiError.statusCode === 429) {
          toast.error('Too many requests. Please try again later.');
          return Promise.reject(apiError);
        }

        if (apiError.statusCode >= 500) {
          toast.error('Server error. Please try again later.');
          return Promise.reject(apiError);
        }

        // Check if this is an auth endpoint - let them handle their own errors
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        if (!isAuthEndpoint && apiError.statusCode >= 400 && apiError.statusCode < 500) {
          toast.error(apiError.message);
        }

        return Promise.reject(apiError);
      },
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  getAuthToken(): string | null {
    return this.getToken();
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  private async deduplicatedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
  ): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    restaurantId: string;
    restaurantName?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async createCategory(data: {
    name: string;
    description?: string;
    image?: string;
    displayOrder?: number;
  }) {
    const response = await this.client.post('/menu/categories', data);
    return response.data;
  }

  async createMenuItem(data: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    isVeg?: boolean;
    isAvailable?: boolean;
    displayOrder?: number;
    preparationTime?: number;
    tags?: string[];
    customizations?: any;
    categoryId: string;
  }) {
    const response = await this.client.post('/menu/items', data);
    return response.data;
  }

  async updateMenuItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      isVeg?: boolean;
      isAvailable?: boolean;
      displayOrder?: number;
      preparationTime?: number;
      tags?: string[];
      customizations?: any;
      categoryId?: string;
    },
  ) {
    const response = await this.client.patch(`/menu/items/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string) {
    const response = await this.client.delete(`/menu/categories/${id}`);
    return response.data;
  }

  async deleteMenuItem(id: string) {
    const response = await this.client.delete(`/menu/items/${id}`);
    return response.data;
  }

  async getCurrentUser() {
    return this.deduplicatedRequest('auth:me', () =>
      this.client.get('/auth/me').then((res) => res.data),
    );
  }

  async getRestaurant(id: string) {
    return this.deduplicatedRequest(`restaurant:${id}`, () =>
      this.client.get(`/restaurants/${id}`).then((res) => res.data),
    );
  }

  async getRestaurantBySlug(slug: string) {
    return this.deduplicatedRequest(`restaurant:slug:${slug}`, () =>
      this.client.get(`/restaurants/slug/${slug}`).then((res) => res.data),
    );
  }

  async getCategories(restaurantIdOrSlug: string) {
    const isSlug = !restaurantIdOrSlug.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );

    if (isSlug) {
      return this.deduplicatedRequest(`categories:${restaurantIdOrSlug}`, () =>
        this.client
          .get(`/menu/categories`, {
            headers: { 'x-restaurant-slug': restaurantIdOrSlug },
          })
          .then((res) => res.data),
      );
    }

    return this.deduplicatedRequest(`categories:${restaurantIdOrSlug}`, () =>
      this.client
        .get(`/menu/categories?restaurantId=${restaurantIdOrSlug}`)
        .then((res) => res.data),
    );
  }

  async getMenuItems(restaurantIdOrSlug: string, categoryId?: string) {
    const isSlug = !restaurantIdOrSlug.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );

    if (isSlug) {
      const url = categoryId ? `/menu/items?categoryId=${categoryId}` : `/menu/items`;
      return this.deduplicatedRequest(`items:${restaurantIdOrSlug}:${categoryId || 'all'}`, () =>
        this.client
          .get(url, {
            headers: { 'x-restaurant-slug': restaurantIdOrSlug },
          })
          .then((res) => res.data),
      );
    }

    const url = categoryId
      ? `/menu/items?restaurantId=${restaurantIdOrSlug}&categoryId=${categoryId}`
      : `/menu/items?restaurantId=${restaurantIdOrSlug}`;
    return this.deduplicatedRequest(`items:${restaurantIdOrSlug}:${categoryId || 'all'}`, () =>
      this.client.get(url).then((res) => res.data),
    );
  }

  async createOrder(restaurantId: string, orderData: any, restaurantSlug?: string) {
    const params = new URLSearchParams({ restaurantId });
    if (restaurantSlug) {
      params.append('slug', restaurantSlug);
    }

    const response = await this.client.post(
      `/orders?${params.toString()}`,
      orderData,
      {
        headers: restaurantSlug ? { 'x-restaurant-slug': restaurantSlug } : undefined,
      },
    );
    return response.data;
  }

  async getOnboardingStatus() {
    const response = await this.client.get('/restaurants/onboarding/status');
    return response.data;
  }

  async replyOnboarding(message: string) {
    const response = await this.client.post('/restaurants/onboarding/reply', { message });
    return response.data;
  }

  async getOrders(status?: string, platform?: string) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (platform && platform !== 'ALL') params.set('platform', platform);
    const url = params.toString() ? `/orders?${params.toString()}` : '/orders';
    const response = await this.client.get(url);
    return response.data;
  }

  async getOrder(id: string) {
    return this.deduplicatedRequest(`order:${id}`, () =>
      this.client.get(`/orders/${id}`).then((res) => res.data),
    );
  }

  async getOrderByOrderNumber(orderNumber: string, restaurantSlugOrId: string) {
    const isSlug = !restaurantSlugOrId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    const encodedOrderNumber = encodeURIComponent(orderNumber);

    if (isSlug) {
      return this.deduplicatedRequest(`order-number:${restaurantSlugOrId}:${orderNumber}`, () =>
        this.client
          .get(`/orders/order-number/${encodedOrderNumber}`, {
            headers: { 'x-restaurant-slug': restaurantSlugOrId },
          })
          .then((res) => res.data),
      );
    }

    return this.deduplicatedRequest(`order-number:${restaurantSlugOrId}:${orderNumber}`, () =>
      this.client
        .get(`/orders/order-number/${encodedOrderNumber}?restaurantId=${restaurantSlugOrId}`)
        .then((res) => res.data),
    );
  }

  async updateOrder(id: string, data: any) {
    const response = await this.client.patch(`/orders/${id}`, data);
    return response.data;
  }

  async createBooking(restaurantId: string, bookingData: any) {
    const response = await this.client.post(`/bookings?restaurantId=${restaurantId}`, bookingData);
    return response.data;
  }

  async getBookings(date?: string) {
    const url = date ? `/bookings?date=${date}` : '/bookings';
    const response = await this.client.get(url);
    return response.data;
  }

  async updateBooking(id: string, data: any) {
    const response = await this.client.patch(`/bookings/${id}`, data);
    return response.data;
  }

  async getCustomers() {
    const response = await this.client.get('/customers');
    return response.data;
  }

  async updateCustomer(id: string, data: any) {
    const response = await this.client.patch(`/customers/${id}`, data);
    return response.data;
  }

  async getCustomer(id: string) {
    return this.deduplicatedRequest(`customer:${id}`, () =>
      this.client.get(`/customers/${id}`).then((res) => res.data),
    );
  }

  async getCustomerByPhone(phone: string, restaurantId: string) {
    try {
      const response = await this.client.get(`/customers/phone/${phone}`, {
        headers: { 'X-Restaurant-Id': restaurantId },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async createUser(data: any) {
    const response = await this.client.post('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: any) {
    const response = await this.client.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await this.client.delete(`/users/${id}`);
    return response.data;
  }

  async getCampaigns(status?: string) {
    const params = status ? `?status=${status}` : '';
    const response = await this.client.get(`/campaigns${params}`);
    return response.data;
  }

  async createCampaign(data: any) {
    const response = await this.client.post('/campaigns', data);
    return response.data;
  }

  async updateCampaign(id: string, data: any) {
    const response = await this.client.patch(`/campaigns/${id}`, data);
    return response.data;
  }

  async getQrCodes() {
    const response = await this.client.get('/qr-codes');
    return response.data;
  }

  async createQrCode(data: {
    code: string;
    tableNumber: string;
    tableName?: string;
  }) {
    const response = await this.client.post('/qr-codes', data);
    return response.data;
  }

  async getQrCodeByCode(code: string, restaurantId: string) {
    return this.deduplicatedRequest(`qrcode:${code}:${restaurantId}`, () =>
      this.client
        .get(`/qr-codes/code/${code}?restaurantId=${restaurantId}`)
        .then((res) => res.data),
    );
  }

  async getIntegrations() {
    const response = await this.client.get('/integrations');
    return response.data;
  }

  async connectIntegration(
    platform: 'SWIGGY' | 'ZOMATO' | 'DINEOUT',
    payload: { apiKey: string; webhookSecret?: string },
  ) {
    const response = await this.client.put(`/integrations/${platform}`, payload);
    return response.data;
  }

  async disconnectIntegration(platform: 'SWIGGY' | 'ZOMATO' | 'DINEOUT') {
    const response = await this.client.patch(`/integrations/${platform}/disconnect`);
    return response.data;
  }
}

export const api = new ApiClient();
