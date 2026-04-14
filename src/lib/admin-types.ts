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

export type NotificationAudience = 'RESTAURANT' | 'ADMIN';
export type NotificationCategory =
  | 'ONBOARDING'
  | 'ORDER'
  | 'SUPPORT'
  | 'PAYMENT'
  | 'SUBSCRIPTION'
  | 'SYSTEM'
  | 'REVENUE';

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  category: NotificationCategory;
  title: string;
  body: string;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status?: 'PENDING' | 'SENT' | 'READ';
  dedupeKey?: string | null;
  targetRole?: 'OWNER' | 'MANAGER' | 'STAFF' | null;
  targetUserId?: string | null;
  readAt?: string | null;
  createdAt: string;
  restaurantId?: string | null;
  outletId?: string | null;
  adminUserId?: string | null;
}
