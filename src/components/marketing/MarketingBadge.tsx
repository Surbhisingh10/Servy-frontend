import type { ReactNode } from 'react';

export default function MarketingBadge({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-emerald-200 bg-[rgba(16,185,129,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 ${className}`}
    >
      {children}
    </span>
  );
}
