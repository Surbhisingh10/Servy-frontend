import { BellRing, Building2, DollarSign, TrendingDown, UserPlus, Wallet } from 'lucide-react';
import { fetchAdmin } from '@/lib/admin-server';
import { AppNotification, DashboardMetrics, Pagination, RestaurantListItem, SystemLog } from '@/lib/admin-types';
import StatCard from '@/components/admin/StatCard';
import LineChart from '@/components/admin/LineChart';
import QuickActions from '@/components/admin/QuickActions';

interface LogsResponse {
  items: SystemLog[];
  pagination: Pagination;
}

interface RestaurantsResponse {
  items: RestaurantListItem[];
  pagination: Pagination;
}

type NotificationsResponse = AppNotification[];

export default async function AdminDashboardPage() {
  const [metrics, logs, restaurants, notifications] = await Promise.all([
    fetchAdmin<DashboardMetrics>('/admin/dashboard/metrics?days=30'),
    fetchAdmin<LogsResponse>('/admin/logs?limit=6').catch(() => ({
      items: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 0,
      },
    })),
    fetchAdmin<RestaurantsResponse>('/admin/restaurants?limit=8').catch(() => ({
      items: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
      },
    })),
    fetchAdmin<NotificationsResponse>('/admin/notifications?limit=8').catch(() => []),
  ]);

  const pendingOnboarding = restaurants.items.filter(
    (restaurant) => restaurant.onboardingState === 'PENDING',
  );
  const paymentAlerts = notifications.filter((item) => item.category === 'PAYMENT');
  const infraAlerts = notifications.filter((item) => item.category === 'SYSTEM');
  const unreadAlerts = notifications.filter((item) => !item.isRead).length;

  const formatNotificationTime = (value: string) =>
    new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Global SaaS performance snapshot</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total restaurants" value={metrics.totalRestaurants} icon={<Building2 size={16} />} />
        <StatCard label="Active subscriptions" value={metrics.activeSubscriptions} icon={<Wallet size={16} />} />
        <StatCard label="MRR" value={`$${metrics.mrr.toFixed(2)}`} icon={<DollarSign size={16} />} />
        <StatCard label="Churn rate" value={`${metrics.churnRate}%`} icon={<TrendingDown size={16} />} />
        <StatCard label="New signups" value={metrics.newSignupsThisMonth} icon={<UserPlus size={16} />} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Revenue trend (30 days)</h2>
          <LineChart data={metrics.revenueTrend} />
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Alerts</h2>
              <p className="text-sm text-gray-500">Persistent admin inbox for onboarding, subscription, payment, and platform signals.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
              <BellRing size={14} />
              {unreadAlerts} unread
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">Pending onboarding</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{pendingOnboarding.length}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">Payment alerts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{paymentAlerts.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Infra alerts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{infraAlerts.length}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    notification.category === 'SYSTEM'
                      ? 'border-red-200 bg-red-50'
                      : notification.category === 'PAYMENT' || notification.category === 'ONBOARDING'
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    {!notification.isRead && (
                      <span className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-600">{notification.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-white/80 px-2 py-1 font-semibold uppercase tracking-[0.18em] text-gray-700">
                      {notification.category}
                    </span>
                    <span>{formatNotificationTime(notification.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
                No admin notifications yet. New onboarding requests, payment spikes, subscription issues, and infrastructure alerts will appear here.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Revenue & Payments</h2>
          <p className="mt-1 text-sm text-gray-500">Snapshot from recent platform activity.</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">${metrics.mrr.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">Churn rate</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.churnRate}%</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">New signups this month</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.newSignupsThisMonth}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">System log entries</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{logs.items.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
