'use client';

import { useMemo } from 'react';

interface SalesData {
  date: string;
  revenue: number;
}

interface SalesChartProps {
  data: SalesData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const maxRevenue = useMemo(() => {
    return Math.max(...data.map((d) => d.revenue), 1);
  }, [data]);
  const inrFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    [],
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="h-72 flex items-end justify-between gap-3">
      {data.map((item, index) => {
        const height = (item.revenue / maxRevenue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative flex h-52 w-full items-end">
              <div
                className="group relative w-full rounded-t-3xl bg-[linear-gradient(180deg,#60a5fa_0%,#2563eb_100%)] shadow-[0_16px_32px_rgba(37,99,235,0.18)] transition-all duration-300 hover:brightness-110"
                style={{ height: `${Math.max(height, 6)}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white/95 px-2 py-1 text-[11px] font-semibold text-slate-600 shadow-sm opacity-0 transition group-hover:opacity-100">
                  {inrFormatter.format(item.revenue || 0)}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {formatDate(item.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
