export function StatCardSkeleton() {
  return <div className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />;
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-8 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
