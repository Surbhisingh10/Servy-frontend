'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { api, SalesReport } from '@/lib/api-client';
import {
  IndianRupee, ShoppingCart, TrendingUp, XCircle,
  Loader2, ArrowUpRight, ArrowDownRight, CalendarDays, Store,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
interface Outlet { id: string; name: string; isPrimary?: boolean }

const customSchema = z.object({
  dateFrom: z.string().min(1, 'Required'),
  dateTo: z.string().min(1, 'Required'),
});
type CustomForm = z.infer<typeof customSchema>;

const PERIODS: { value: Period; label: string; short: string }[] = [
  { value: 'daily',   label: 'Last 7 Days',    short: '7D' },
  { value: 'weekly',  label: 'Last 8 Weeks',   short: '8W' },
  { value: 'monthly', label: '12 Months',       short: '12M' },
  { value: 'yearly',  label: '5 Years',         short: '5Y' },
  { value: 'custom',  label: 'Custom',          short: '...' },
];

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash', CARD: 'Card', UPI: 'UPI', WALLET: 'Wallet', ONLINE: 'Online', CREDIT: 'Credit', UNKNOWN: 'Unknown',
};
const TYPE_LABELS: Record<string, string> = { DINE_IN: 'Dine-in', TAKEAWAY: 'Takeaway', DELIVERY: 'Delivery' };

const SEG_COLORS  = ['#10b981','#0d9488','#06b6d4','#8b5cf6','#f59e0b','#3b82f6'];
const SEG_LABELS  = ['emerald','teal','cyan','violet','amber','blue'];

function fmt(n: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
}
function fmtDecimal(n: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n);
}

/* ─── Animated Revenue Bar Chart ─────────────────────────────── */
function RevenueBarChart({ data }: { data: { label: string; revenue: number; orders: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...data.map(d => d.revenue), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div ref={ref} className="relative">
      {/* Y-axis labels */}
      <div className="flex">
        <div className="flex flex-col justify-between pb-6 pr-3 text-right" style={{ width: 56 }}>
          {[1, 0.75, 0.5, 0.25, 0].map(f => (
            <span key={f} className="text-[10px] text-slate-400 leading-none">
              ₹{fmt(max * f)}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative flex-1">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="border-b border-slate-100 border-dashed w-full" />
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex items-end gap-1 h-56 pb-6">
            {data.map((d, i) => {
              const heightPct = (d.revenue / max) * 100;
              const isHovered = hovered === i;
              return (
                <div
                  key={i}
                  className="relative flex-1 flex flex-col justify-end cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                      >
                        <div className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap">
                          <p className="font-semibold text-emerald-400">₹{fmt(d.revenue)}</p>
                          <p className="text-slate-400">{d.orders} orders</p>
                          <p className="text-slate-500 mt-0.5">{d.label}</p>
                        </div>
                        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bar */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ height: `${Math.max(heightPct, d.revenue > 0 ? 3 : 0)}%`, transformOrigin: 'bottom' }}
                    className={`w-full rounded-t-lg transition-all duration-200 ${
                      isHovered
                        ? 'bg-[linear-gradient(180deg,#34d399_0%,#059669_100%)] shadow-lg shadow-emerald-500/30'
                        : d.revenue > 0
                          ? 'bg-[linear-gradient(180deg,#6ee7b7_0%,#10b981_100%)]'
                          : 'bg-slate-100'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex gap-1" style={{ paddingRight: 0 }}>
            {data.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <span className={`text-[9px] leading-none truncate block ${hovered === i ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SVG Donut Chart ─────────────────────────────────────────── */
function DonutChart({ items }: { items: { label: string; value: number; color: string; textColor: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });

  if (total === 0) return <p className="py-6 text-center text-xs text-slate-400">No data</p>;

  const r = 44;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;

  let cumulativeAngle = 0;
  const segments = items.map((item, idx) => {
    const pct = item.value / total;
    const dash = pct * circumference;
    const offset = circumference - cumulativeAngle;
    cumulativeAngle += dash;
    return { ...item, dash, offset, pct: Math.round(pct * 100), idx };
  });

  return (
    <div className="flex items-center gap-6">
      <svg ref={ref} viewBox="0 0 120 120" width={120} height={120} className="shrink-0">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={14} />
        {segments.map((seg) => (
          <motion.circle
            key={seg.idx}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={SEG_COLORS[seg.idx % SEG_COLORS.length]}
            strokeWidth={14}
            strokeLinecap="butt"
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={inView ? seg.offset : circumference}
            transform={`rotate(-90 ${cx} ${cy})`}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: seg.offset } : {}}
            transition={{ duration: 0.8, delay: seg.idx * 0.12, ease: 'easeOut' }}
          />
        ))}
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fontSize={11} fontWeight={700} fill="#0f172a">
          {segments[0]?.pct ?? 0}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill="#94a3b8">
          {METHOD_LABELS[segments[0]?.label] ?? segments[0]?.label ?? ''}
        </text>
      </svg>

      <div className="flex-1 space-y-2">
        {segments.map((seg) => (
          <div key={seg.idx} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SEG_COLORS[seg.idx % SEG_COLORS.length] }} />
            <span className="flex-1 text-xs text-slate-600 truncate">{METHOD_LABELS[seg.label] ?? seg.label}</span>
            <span className="text-xs font-semibold text-slate-800">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated Horizontal Bar ─────────────────────────────────── */
function HBar({ label, value, max, color, sublabel }: { label: string; value: number; max: number; color: string; sublabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium text-slate-700 truncate pr-2">{label}</span>
        <span className="text-xs font-semibold text-slate-900 shrink-0">{sublabel ?? fmt(value)}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, sub, iconColor, iconBg, delay = 0,
}: { icon: React.ElementType; label: string; value: string; sub?: string; iconColor: string; iconBg: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        {sub && (
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{sub}</span>
        )}
      </div>
      <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function SalesPage() {
  const [period, setPeriod] = useState<Period>('monthly');
  const [outletId, setOutletId] = useState('ALL');
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustom, setShowCustom] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CustomForm>({
    resolver: zodResolver(customSchema),
    defaultValues: {
      dateFrom: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
      dateTo: new Date().toISOString().slice(0, 10),
    },
  });

  const fetchReport = useCallback(async (p: Period, oId: string, custom?: CustomForm) => {
    setLoading(true);
    try {
      setReport(await api.getSalesReport({
        period: p,
        ...(oId !== 'ALL' ? { outletId: oId } : {}),
        ...(p === 'custom' && custom ? { dateFrom: custom.dateFrom, dateTo: custom.dateTo } : {}),
      }));
    } catch {
      toast.error('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.getOutlets().then(d => setOutlets(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (period !== 'custom') void fetchReport(period, outletId);
  }, [period, outletId, fetchReport]);

  const onCustomSubmit = handleSubmit(values => {
    setShowCustom(false);
    void fetchReport('custom', outletId, values);
  });

  const s = report?.summary;
  const maxItemRevenue = Math.max(...(report?.topItems.map(i => i.revenue) ?? []), 1);
  const maxTypeCount  = Math.max(...(report?.byOrderType.map(t => t.count) ?? []), 1);
  const completionRate = s && s.totalOrders > 0
    ? Math.round((s.completedOrders / s.totalOrders) * 100)
    : 0;

  return (
    <div className="min-h-screen space-y-5">
      {/* ── Hero banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#0d1f17] p-6 shadow-2xl"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-32 h-48 w-48 rounded-full bg-teal-500/8 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-400">Sales Analytics</p>
            {loading ? (
              <div className="mt-3 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <span className="text-sm text-slate-400">Loading…</span>
              </div>
            ) : s ? (
              <>
                <motion.p
                  key={s.totalRevenue}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl"
                >
                  ₹{fmt(s.totalRevenue)}
                </motion.p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-xs text-slate-400">{fmt(s.totalOrders)} orders</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400">₹{fmtDecimal(s.avgOrderValue)} avg</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-emerald-400 font-medium">{completionRate}% completion</span>
                </div>
                {report && (
                  <p className="mt-1 text-[10px] text-slate-600">
                    {new Date(report.dateFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' – '}
                    {new Date(report.dateTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </>
            ) : null}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:items-end">
            {/* Period pills */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/5">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  onClick={() => { setPeriod(p.value); setShowCustom(p.value === 'custom'); }}
                  className={`px-3 py-2 text-[11px] font-semibold transition-all ${
                    period === p.value
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.short}
                </button>
              ))}
            </div>

            {/* Outlet */}
            {outlets.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Store className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={outletId}
                  onChange={e => setOutletId(e.target.value)}
                  className="bg-transparent text-[11px] font-semibold text-slate-300 outline-none"
                >
                  <option value="ALL" className="bg-slate-900">All Outlets</option>
                  {outlets.map(o => (
                    <option key={o.id} value={o.id} className="bg-slate-900">
                      {o.name}{o.isPrimary ? ' ★' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Custom date range */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={onCustomSubmit} className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">From</label>
                <input type="date" {...register('dateFrom')} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
                {errors.dateFrom && <p className="text-[10px] text-rose-500">{errors.dateFrom.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">To</label>
                <input type="date" {...register('dateTo')} className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500" />
                {errors.dateTo && <p className="text-[10px] text-rose-500">{errors.dateTo.message}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Apply</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowCustom(false); setPeriod('monthly'); }}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-100" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-xs text-slate-400">Crunching numbers…</p>
          </div>
        </div>
      ) : report && s ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={IndianRupee} label="Total Revenue"   value={`₹${fmt(s.totalRevenue)}`}     iconColor="text-emerald-600" iconBg="bg-emerald-50" delay={0} />
            <StatCard icon={ShoppingCart} label="Total Orders"   value={fmt(s.totalOrders)}             iconColor="text-teal-600"    iconBg="bg-teal-50"    delay={0.06} />
            <StatCard icon={TrendingUp}   label="Avg Order Value" value={`₹${fmtDecimal(s.avgOrderValue)}`} iconColor="text-violet-600"  iconBg="bg-violet-50"  delay={0.12} />
            <StatCard icon={XCircle}      label="Cancelled"      value={fmt(s.cancelledOrders)}         sub={`${completionRate}% done`} iconColor="text-rose-500"  iconBg="bg-rose-50"    delay={0.18} />
          </div>

          {/* Revenue bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Revenue Trend</p>
                <h2 className="mt-1 text-base font-bold text-slate-900">Revenue Over Time</h2>
              </div>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                {PERIODS.find(p => p.value === period)?.label}
              </span>
            </div>
            {report.revenueByPeriod.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400">No data for this period</p>
              </div>
            ) : (
              <RevenueBarChart data={report.revenueByPeriod} />
            )}
          </motion.div>

          {/* Bottom row */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Payment methods */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Payments</p>
              <h2 className="mb-4 mt-1 text-base font-bold text-slate-900">Payment Methods</h2>
              <DonutChart
                items={report.byPaymentMethod.map((m, i) => ({
                  label: m.method,
                  value: m.amount,
                  color: SEG_COLORS[i % SEG_COLORS.length],
                  textColor: SEG_LABELS[i % SEG_LABELS.length],
                }))}
              />
            </motion.div>

            {/* Order types */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Channels</p>
              <h2 className="mb-4 mt-1 text-base font-bold text-slate-900">Order Types</h2>
              <div className="space-y-4">
                {report.byOrderType.map((t, i) => (
                  <HBar
                    key={t.type}
                    label={TYPE_LABELS[t.type] ?? t.type}
                    value={t.count}
                    max={maxTypeCount}
                    color={SEG_COLORS[i % SEG_COLORS.length]}
                    sublabel={`${t.count} (₹${fmt(t.amount)})`}
                  />
                ))}
                {report.byOrderType.length === 0 && (
                  <p className="text-xs text-slate-400 py-4 text-center">No data</p>
                )}
              </div>
            </motion.div>

            {/* Top items */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Bestsellers</p>
              <h2 className="mb-4 mt-1 text-base font-bold text-slate-900">Top Items</h2>
              <div className="space-y-4">
                {report.topItems.slice(0, 5).map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ background: SEG_COLORS[i % SEG_COLORS.length] + '20', color: SEG_COLORS[i % SEG_COLORS.length] }}>
                      {i + 1}
                    </span>
                    <HBar
                      label={item.name}
                      value={item.revenue}
                      max={maxItemRevenue}
                      color={SEG_COLORS[i % SEG_COLORS.length]}
                      sublabel={`₹${fmt(item.revenue)}`}
                    />
                  </div>
                ))}
                {report.topItems.length === 0 && (
                  <p className="text-xs text-slate-400 py-4 text-center">No item data</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Full top items table */}
          {report.topItems.length > 5 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">All Top Items</h2>
                <span className="text-[10px] text-slate-400">{report.topItems.length} items</span>
              </div>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/60">
                    {['#','Item','Qty','Revenue'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {report.topItems.map((item, idx) => (
                    <tr key={item.name} className="group hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-2.5 text-xs text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-2.5 text-xs font-medium text-slate-800">{item.name}</td>
                      <td className="px-5 py-2.5 text-xs text-slate-500">{item.quantity}</td>
                      <td className="px-5 py-2.5 text-xs font-semibold text-slate-900">₹{fmtDecimal(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}
