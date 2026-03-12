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
    <div className="h-64 flex items-end justify-between gap-2">
      {data.map((item, index) => {
        const height = (item.revenue / maxRevenue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full h-48 flex items-end">
              <div
                className="w-full rounded-t-lg bg-highlight-500 transition-all duration-300 hover:bg-highlight-600"
                style={{ height: `${Math.max(height, 2)}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                  {inrFormatter.format(item.revenue || 0)}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {formatDate(item.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
