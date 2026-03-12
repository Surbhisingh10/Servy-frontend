import { fetchAdmin } from '@/lib/admin-server';
import { Pagination, SystemLog } from '@/lib/admin-types';
import Table from '@/components/admin/Table';

interface LogsResponse {
  items: SystemLog[];
  pagination: Pagination;
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) query.set(key, value);
  });

  const logs = await fetchAdmin<LogsResponse>(`/admin/logs?${query.toString()}`);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">System Logs & Monitoring</h1>

      <form className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-4">
        <input
          name="search"
          className="input sm:col-span-2"
          placeholder="Search logs"
          defaultValue={typeof searchParams.search === 'string' ? searchParams.search : ''}
        />
        <select name="type" className="input" defaultValue={typeof searchParams.type === 'string' ? searchParams.type : ''}>
          <option value="">All types</option>
          <option value="API_ERROR">API errors</option>
          <option value="PAYMENT_FAILED">Failed payments</option>
          <option value="CAMPAIGN_DELIVERY">Campaign delivery</option>
          <option value="SECURITY">Security</option>
        </select>
        <select name="level" className="input" defaultValue={typeof searchParams.level === 'string' ? searchParams.level : ''}>
          <option value="">All levels</option>
          <option value="INFO">Info</option>
          <option value="WARN">Warn</option>
          <option value="ERROR">Error</option>
        </select>
        <button className="btn btn-primary sm:col-span-4">Apply Filters</button>
      </form>

      <Table
        rows={logs.items}
        columns={[
          { key: 'time', header: 'Timestamp', render: (row) => new Date(row.createdAt).toLocaleString() },
          { key: 'type', header: 'Type', render: (row) => row.type },
          { key: 'level', header: 'Level', render: (row) => row.level },
          { key: 'source', header: 'Source', render: (row) => row.source },
          { key: 'message', header: 'Message', render: (row) => row.message },
        ]}
      />
    </div>
  );
}
