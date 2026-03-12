import Link from 'next/link';
import { fetchAdmin } from '@/lib/admin-server';
import LineChart from '@/components/admin/LineChart';

interface AnalyticsResponse {
  statusCounts: { status: string; _count: { status: number } }[];
  revenueTrend: { date: string; revenue: number }[];
  signupsByDay: { date: string; count: number }[];
}

export default async function AnalyticsPage() {
  const analytics = await fetchAdmin<AnalyticsResponse>('/admin/analytics?days=30');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">SaaS Analytics</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-600">Revenue trends</h2>
          <LineChart data={analytics.revenueTrend} />
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-600">Signup growth</h2>
          <LineChart data={analytics.signupsByDay} color="#0f766e" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-600">Active vs expired</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {analytics.statusCounts.map((item) => (
            <span key={item.status} className="rounded-full border border-gray-300 px-3 py-1">
              {item.status}: {item._count.status}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-600">Export CSV reports</h2>
        <div className="mt-3 flex gap-2">
          <Link className="btn btn-outline" href="/api/admin/reports/export?type=restaurants">
            Restaurants
          </Link>
          <Link className="btn btn-outline" href="/api/admin/reports/export?type=revenue">
            Revenue
          </Link>
          <Link className="btn btn-outline" href="/api/admin/reports/export?type=subscriptions">
            Subscriptions
          </Link>
        </div>
      </div>
    </div>
  );
}
