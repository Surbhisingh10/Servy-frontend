import { Building2, DollarSign, TrendingDown, UserPlus, Wallet } from 'lucide-react';
import { fetchAdmin } from '@/lib/admin-server';
import { DashboardMetrics } from '@/lib/admin-types';
import StatCard from '@/components/admin/StatCard';
import LineChart from '@/components/admin/LineChart';
import QuickActions from '@/components/admin/QuickActions';

export default async function AdminDashboardPage() {
  const metrics = await fetchAdmin<DashboardMetrics>('/admin/dashboard/metrics?days=30');

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
    </div>
  );
}
