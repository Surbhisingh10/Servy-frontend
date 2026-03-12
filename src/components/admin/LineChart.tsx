interface Point {
  date: string;
  revenue?: number;
  count?: number;
}

interface LineChartProps {
  data: Point[];
  color?: string;
}

export default function LineChart({ data, color = '#6366F1' }: LineChartProps) {
  if (data.length === 0) {
    return <div className="h-56 rounded-lg bg-gray-50" />;
  }

  const values = data.map((point) => point.revenue ?? point.count ?? 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <svg viewBox="0 0 100 100" className="h-56 w-full" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="2.2" points={points} />
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
