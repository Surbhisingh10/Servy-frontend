import { StatCardSkeleton, TableSkeleton } from '@/components/admin/Skeletons';

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <StatCardSkeleton key={idx} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
