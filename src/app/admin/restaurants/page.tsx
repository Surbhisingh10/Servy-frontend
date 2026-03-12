import Link from 'next/link';
import { fetchAdmin } from '@/lib/admin-server';
import Table from '@/components/admin/Table';
import { Pagination, Plan, RestaurantListItem } from '@/lib/admin-types';
import RestaurantRowActions from '@/components/admin/RestaurantRowActions';
import OnboardRestaurantModal from '@/components/admin/OnboardRestaurantModal';

interface RestaurantResponse {
  items: RestaurantListItem[];
  pagination: Pagination;
}

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) query.set(key, value);
  });

  const [restaurantsResponse, plans] = await Promise.all([
    fetchAdmin<RestaurantResponse>(`/admin/restaurants?${query.toString()}`),
    fetchAdmin<Plan[]>('/admin/plans'),
  ]);

  const columns = [
    { key: 'name', header: 'Restaurant', render: (row: RestaurantListItem) => row.name },
    { key: 'owner', header: 'Owner', render: (row: RestaurantListItem) => row.ownerName },
    { key: 'email', header: 'Email', render: (row: RestaurantListItem) => row.email },
    { key: 'plan', header: 'Plan', render: (row: RestaurantListItem) => row.plan },
    {
      key: 'status',
      header: 'Status',
      render: (row: RestaurantListItem) =>
        row.onboardingState && row.onboardingState !== 'APPROVED'
          ? `${row.onboardingState} (${row.status})`
          : row.status,
    },
    { key: 'orders', header: 'Total Orders', render: (row: RestaurantListItem) => row.totalOrders },
    { key: 'revenue', header: 'Total Revenue', render: (row: RestaurantListItem) => `$${row.totalRevenue.toFixed(2)}` },
    { key: 'login', header: 'Last Login', render: (row: RestaurantListItem) => (row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'N/A') },
    { key: 'actions', header: 'Actions', render: (row: RestaurantListItem) => <RestaurantRowActions restaurant={row} /> },
  ];

  const currentPage = Number(searchParams.page || 1);
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(restaurantsResponse.pagination.totalPages, currentPage + 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Restaurants Management</h1>
        <OnboardRestaurantModal plans={plans} />
      </div>

      <form className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input
          name="search"
          defaultValue={typeof searchParams.search === 'string' ? searchParams.search : ''}
          placeholder="Search by name/email"
          className="input sm:col-span-2"
        />
        <select name="planId" defaultValue={typeof searchParams.planId === 'string' ? searchParams.planId : ''} className="input">
          <option value="">All plans</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={typeof searchParams.status === 'string' ? searchParams.status : ''} className="input">
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="EXPIRED">Expired</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <button className="btn btn-primary sm:col-span-4">Apply Filters</button>
      </form>

      <Table columns={columns} rows={restaurantsResponse.items} />

      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Page {restaurantsResponse.pagination.page} of {restaurantsResponse.pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Link
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            href={`/admin/restaurants?${new URLSearchParams({ ...Object.fromEntries(query), page: String(previousPage) }).toString()}`}
          >
            Previous
          </Link>
          <Link
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            href={`/admin/restaurants?${new URLSearchParams({ ...Object.fromEntries(query), page: String(nextPage) }).toString()}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
