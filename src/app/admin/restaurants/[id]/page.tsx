import { fetchAdmin } from '@/lib/admin-server';
import { Plan } from '@/lib/admin-types';
import LineChart from '@/components/admin/LineChart';
import RestaurantDetailActions from '@/components/admin/RestaurantDetailActions';

const tabs = ['Orders', 'Bookings', 'Customers', 'Campaigns', 'Settings'];

interface DetailResponse {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  email: string;
  phone?: string;
  status: string;
  country?: string;
  zipCode?: string;
  onboarding?: {
    state: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string | null;
    history?: { action: string; message?: string; createdAt: string; actor?: string }[];
  };
  currentPlan?: { name: string } | null;
  billingStatus: string;
  counts: {
    orders: number;
    bookings: number;
    customers: number;
    campaigns: number;
  };
  orderTrend: { date: string; revenue: number }[];
}

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const [detail, plans] = await Promise.all([
    fetchAdmin<DetailResponse>(`/admin/restaurants/${params.id}`),
    fetchAdmin<Plan[]>('/admin/plans'),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{detail.name}</h1>
        <p className="text-sm text-gray-500">
          {detail.address || '-'} {detail.city || ''} {detail.state || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 lg:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Contact</p>
          <p className="mt-1 text-sm text-gray-800">{detail.email}</p>
          <p className="text-sm text-gray-600">{detail.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Plan</p>
          <p className="mt-1 text-sm text-gray-800">{detail.currentPlan?.name || 'Unassigned'}</p>
          <p className="text-sm text-gray-600">{detail.billingStatus}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
          <p className="mt-1 text-sm text-gray-800">{detail.status}</p>
          <p className="text-sm text-gray-600">Onboarding: {detail.onboarding?.state || 'APPROVED'}</p>
        </div>
      </div>

      {detail.onboarding?.state === 'REJECTED' && detail.onboarding?.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Latest rejection reason</p>
          <p className="mt-1">{detail.onboarding.rejectionReason}</p>
        </div>
      )}

      {!!detail.onboarding?.history?.length && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Onboarding Activity</p>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {detail.onboarding.history.slice(-5).reverse().map((entry, idx) => (
              <div key={`${entry.createdAt}-${idx}`} className="rounded border border-gray-100 bg-gray-50 p-2">
                <p className="font-medium">{entry.action}</p>
                {entry.message && <p className="text-gray-600">{entry.message}</p>}
                <p className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RestaurantDetailActions
        restaurantId={params.id}
        plans={plans}
        onboardingState={detail.onboarding?.state}
        initialValues={{
          name: detail.name,
          email: detail.email,
          phone: detail.phone,
          address: detail.address,
          city: detail.city,
          state: detail.state,
          country: detail.country,
          zipCode: detail.zipCode,
        }}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
          <p>Orders: {detail.counts.orders}</p>
          <p>Bookings: {detail.counts.bookings}</p>
          <p>Customers: {detail.counts.customers}</p>
          <p>Campaigns: {detail.counts.campaigns}</p>
        </div>
        <div className="lg:col-span-2">
          <LineChart data={detail.orderTrend} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">Tabs</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <span key={tab} className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700">
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
