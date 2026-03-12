export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN';
export type RestaurantStatus = 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED';

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface DashboardMetrics {
  totalRestaurants: number;
  activeSubscriptions: number;
  mrr: number;
  churnRate: number;
  newSignupsThisMonth: number;
  revenueTrend: RevenuePoint[];
}

export interface RestaurantListItem {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  plan: string;
  status: RestaurantStatus;
  onboardingState?: 'PENDING' | 'APPROVED' | 'REJECTED';
  onboardingRejectionReason?: string | null;
  totalOrders: number;
  totalRevenue: number;
  lastLogin: string | null;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  isActive: boolean;
  usageCount?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  type: 'API_ERROR' | 'PAYMENT_FAILED' | 'CAMPAIGN_DELIVERY' | 'SECURITY';
  message: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: AdminRole;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}
