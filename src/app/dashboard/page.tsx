'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useThemeStore } from '@/store/theme-store';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  IndianRupee,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PlatformBadge from '@/components/dashboard/PlatformBadge';
import Button from '@/components/ui/Button';
import type { InventoryItem } from '@/lib/inventory.service';

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  tableNumber?: string;
  sourcePlatform?: 'DIRECT' | 'SWIGGY' | 'ZOMATO' | 'DINEOUT';
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  items?: Array<{
    id: string;
    quantity: number;
    menuItem?: { name?: string };
  }>;
};

const STATUS_META: Record<string, { dot: string; badge: string }> = {
  PENDING:   { dot: 'bg-amber-400',   badge: 'bg-amber-500/15 text-amber-300 dark:bg-amber-500/15 dark:text-amber-300' },
  CONFIRMED: { dot: 'bg-sky-400',     badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
  PREPARING: { dot: 'bg-orange-400',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' },
  READY:     { dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  COMPLETED: { dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400' },
  CANCELLED: { dot: 'bg-rose-400',    badge: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400' },
};

/* ── Inline SVG area chart ── */
interface AreaChartProps {
  data: Array<{ date: string; revenue: number }>;
}

function AreaChart({ data }: AreaChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const { colorMode } = useThemeStore();
  const isDark = colorMode === 'dark';

  const W = 560;
  const H = 140;
  const PAD = { top: 12, right: 12, bottom: 24, left: 4 };

  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  const pts = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(data.length - 1, 1)) * (W - PAD.left - PAD.right),
    y: PAD.top + (1 - d.revenue / maxVal) * (H - PAD.top - PAD.bottom),
    revenue: d.revenue,
    label: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }),
  }));

  const linePath = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y} ${cpx} ${pt.y} ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD.bottom} L ${pts[0].x} ${H - PAD.bottom} Z`;

  const inrShort = (v: number) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`;

  const [hovered, setHovered] = useState<number | null>(null);

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const labelColor = isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.6)';
  const tooltipBg = 'rgba(15,23,42,0.92)';

  return (
    <div className="relative select-none">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 140 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? '0.22' : '0.15'} />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {[0, 0.33, 0.67, 1].map((frac) => {
          const y = PAD.top + frac * (H - PAD.top - PAD.bottom);
          return <line key={frac} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke={gridColor} strokeWidth="1" />;
        })}

        <motion.path d={areaPath} fill="url(#areaGrad)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.6, delay: 0.2 }} />
        <motion.path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }} transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }} />

        {pts.map((pt) => (
          <text key={pt.label} x={pt.x} y={H - 4} textAnchor="middle" fontSize="9" fill={labelColor} fontFamily="inherit">{pt.label}</text>
        ))}

        {pts.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'crosshair' }} />
            <motion.circle cx={pt.x} cy={pt.y} r={hovered === i ? 5 : 3.5} fill={hovered === i ? '#34d399' : '#10b981'} stroke={hovered === i ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={hovered === i ? 2 : 1} initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={{ delay: 0.6 + i * 0.05, type: 'spring', stiffness: 260, damping: 20 }} />
          </g>
        ))}

        <AnimatePresence>
          {hovered !== null && (() => {
            const pt = pts[hovered];
            const tw = 64;
            const tx = Math.min(Math.max(pt.x - tw / 2, 0), W - tw);
            const ty = pt.y - 36;
            return (
              <motion.g key="tooltip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <rect x={tx} y={ty} width={tw} height={22} rx={6} fill={tooltipBg} />
                <text x={tx + tw / 2} y={ty + 14} textAnchor="middle" fontSize="9.5" fill="#34d399" fontWeight="600" fontFamily="inherit">{inrShort(pt.revenue)}</text>
              </motion.g>
            );
          })()}
        </AnimatePresence>
      </svg>
    </div>
  );
}

/* ── Stat card ── */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  lightAccent: string;
  darkAccent: string;
  delay: number;
}

function StatCard({ title, value, icon: Icon, lightAccent, darkAccent, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur transition hover:bg-white dark:border-white/[0.07] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
    >
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${lightAccent} dark:${darkAccent}`}>
        <Icon size={16} />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

/* ── Main page ── */
export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();
  const { user } = useAuthStore();
  const router = useRouter();

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const [onboardingState, setOnboardingState] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('APPROVED');
  const [onboardingReason, setOnboardingReason] = useState<string | null>(null);
  const [onboardingHistory, setOnboardingHistory] = useState<
    { action: string; message?: string; createdAt: string; actor?: string }[]
  >([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('ALL');
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    const loadOnboarding = async () => {
      try {
        const data = await api.getOnboardingStatus();
        const onboarding = data?.onboarding;
        if (!onboarding) return;
        setOnboardingState(onboarding.state || 'APPROVED');
        setOnboardingReason(onboarding.rejectionReason || null);
        setOnboardingHistory(Array.isArray(onboarding.history) ? onboarding.history : []);
      } catch { /* no-op */ }
    };
    loadOnboarding();
  }, []);

  useEffect(() => {
    const syncSelectedOutlet = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') || 'ALL' : 'ALL';
      setSelectedOutletId(stored);
    };
    syncSelectedOutlet();
    window.addEventListener('selected-outlet-changed', syncSelectedOutlet);
    return () => window.removeEventListener('selected-outlet-changed', syncSelectedOutlet);
  }, []);

  useEffect(() => {
    const loadInventoryAlerts = async () => {
      try {
        const items = await api.getInventoryItems(selectedOutletId);
        const lowStock = Array.isArray(items) ? items.filter((item: InventoryItem) => item.status === 'LOW') : [];
        setLowStockItems(lowStock.slice(0, 5));
      } catch { setLowStockItems([]); }
    };
    if (onboardingState === 'APPROVED') void loadInventoryAlerts();
  }, [onboardingState, selectedOutletId]);

  useEffect(() => {
    const loadRecentOrders = async () => {
      if (onboardingState !== 'APPROVED') { setRecentOrders([]); return; }
      try {
        setOrdersLoading(true);
        const data = await api.getOrders(undefined, 'ALL', selectedOutletId);
        setRecentOrders(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch { setRecentOrders([]); } finally { setOrdersLoading(false); }
    };
    void loadRecentOrders();
  }, [onboardingState, selectedOutletId]);

  const activeOrdersCount = recentOrders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)).length;

  const filteredOrders = recentOrders.filter((o) => {
    const q = orderSearch.trim().toLowerCase();
    if (!q) return true;
    return [o.orderNumber, o.tableNumber, o.customer?.firstName, o.customer?.lastName, o.customer?.phone, o.status]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  const hourGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const submitOnboardingReply = async () => {
    if (!replyMessage.trim()) { toast.error('Please enter your reply'); return; }
    try {
      setSubmittingReply(true);
      await api.replyOnboarding(replyMessage.trim());
      toast.success('Reply submitted. Your onboarding request is pending review.');
      setReplyMessage('');
      setOnboardingState('PENDING');
      setOnboardingReason(null);
      const refreshed = await api.getOnboardingStatus();
      const onboarding = refreshed?.onboarding;
      setOnboardingHistory(Array.isArray(onboarding?.history) ? onboarding.history : []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to submit reply');
    } finally { setSubmittingReply(false); }
  };

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-500/30 border-t-emerald-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-600 dark:text-rose-400">Dashboard error</p>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  /* ── Onboarding gate ── */
  if (onboardingState !== 'APPROVED') {
    return (
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/[0.08] dark:bg-[#0d1f17] dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
        >
          <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8 dark:border-white/[0.08]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-emerald-600 dark:text-emerald-400">Restaurant onboarding</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your access is being reviewed</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              The full restaurant panel unlocks after admin approval. Track the current status below.
            </p>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-slate-200/80 p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-white/[0.08]">
              <div className={`rounded-2xl border p-5 ${onboardingState === 'REJECTED' ? 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10' : 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${onboardingState === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{onboardingState}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {onboardingState === 'REJECTED'
                    ? 'Your onboarding needs updates before approval. Address the notes and submit a single reply.'
                    : 'Waiting for platform admin approval.'}
                </p>
                {onboardingReason && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Admin feedback</p>
                    <p className="mt-1.5 leading-6 text-slate-700 dark:text-slate-300">{onboardingReason}</p>
                  </div>
                )}
                {onboardingState === 'REJECTED' && (user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Summarize the updates you made..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600"
                    />
                    <Button onClick={submitOnboardingReply} isLoading={submittingReply}>Submit reply for re-review</Button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500">Recent activity</p>
              {onboardingHistory.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {onboardingHistory.slice(-5).reverse().map((entry, i) => (
                    <div key={`${entry.createdAt}-${i}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/[0.07] dark:bg-white/[0.04]">
                      <p className="font-medium text-slate-900 dark:text-white">{entry.action}</p>
                      {entry.message && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.message}</p>}
                      <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-600">{new Date(entry.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No onboarding updates yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main dashboard ── */
  const revenueChange = stats.salesData.length >= 2
    ? stats.salesData[stats.salesData.length - 1].revenue - stats.salesData[stats.salesData.length - 2].revenue
    : 0;
  const revenueChangePct = stats.salesData.length >= 2 && stats.salesData[stats.salesData.length - 2].revenue > 0
    ? (revenueChange / stats.salesData[stats.salesData.length - 2].revenue) * 100
    : 0;

  const statCards = [
    { title: 'Orders Today',     value: stats.ordersToday,                            icon: ShoppingCart, lightAccent: 'bg-emerald-100 text-emerald-700', darkAccent: 'bg-emerald-500/20 text-emerald-400', delay: 0.12 },
    { title: 'Revenue Today',    value: inrFormatter.format(stats.revenueToday || 0), icon: IndianRupee,  lightAccent: 'bg-teal-100 text-teal-700',       darkAccent: 'bg-teal-500/20 text-teal-400',       delay: 0.18 },
    { title: 'Repeat Customers', value: `${stats.repeatCustomerPercent.toFixed(1)}%`, icon: Users,        lightAccent: 'bg-violet-100 text-violet-700',   darkAccent: 'bg-violet-500/20 text-violet-400',   delay: 0.24 },
    { title: 'Pending Bookings', value: stats.pendingBookings,                        icon: Calendar,     lightAccent: 'bg-amber-100 text-amber-700',     darkAccent: 'bg-amber-500/20 text-amber-400',     delay: 0.30 },
  ];

  return (
    <div className="space-y-4">
      {/* ── Hero banner ── */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[28px] bg-emerald-50/80 px-6 py-7 ring-1 ring-emerald-200/60 sm:px-8 dark:bg-[#0d1f17] dark:ring-0"
        style={{ boxShadow: '0 8px 40px rgba(16,185,129,0.08)' }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/[0.12] blur-3xl dark:bg-emerald-500/[0.07]" />
        <div className="pointer-events-none absolute -bottom-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-teal-400/[0.08] blur-3xl dark:bg-teal-400/[0.05]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: greeting + revenue */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-emerald-600 dark:text-emerald-400">Today&apos;s snapshot</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              {hourGreeting()}, {user?.firstName || 'there'} 👋
            </h1>
            <div className="mt-4 flex items-end gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Revenue today</p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, type: 'spring' }}
                  className="mt-1 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white"
                >
                  {inrFormatter.format(stats.revenueToday || 0)}
                </motion.p>
              </div>
              {revenueChangePct !== 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`mb-1.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${revenueChangePct >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}
                >
                  <TrendingUp size={12} className={revenueChangePct < 0 ? 'rotate-180' : ''} />
                  {Math.abs(revenueChangePct).toFixed(1)}% vs yesterday
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: live indicator + search */}
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex items-center gap-2.5 rounded-full border border-emerald-300/50 bg-emerald-100/80 px-4 py-2 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {activeOrdersCount} active order{activeOrdersCount !== 1 ? 's' : ''}
              </span>
              <Zap size={12} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="relative w-full lg:w-72">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders, tables, customers…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-200 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="flex gap-2">
              {([['Orders', '/dashboard/orders'], ['Inventory', '/inventory']]).map(([label, href]) => (
                <button
                  key={label as string}
                  onClick={() => router.push(href as string)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.1] dark:hover:text-white"
                >
                  {label} <ArrowRight size={12} />
                </button>
              ))}
              <button
                onClick={() => router.push('/dashboard/bookings')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
              >
                Bookings <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </motion.section>

      {/* ── Low stock strip ── */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-3 dark:border-amber-500/20 dark:bg-amber-500/[0.07]"
          >
            <AlertTriangle size={14} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-700 dark:text-amber-400">Low stock:</span>
            {lowStockItems.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                {item.name}
                <span className="text-amber-400 dark:text-amber-500/60">·</span>
                <span className="text-amber-600 dark:text-amber-400/80">{Number(item.currentQuantity).toFixed(1)} {item.unit}</span>
              </span>
            ))}
            <button onClick={() => router.push('/inventory')} className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
              View all <ArrowRight size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content grid ── */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        {/* Sales chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-5 dark:border-white/[0.07] dark:bg-[#0d1f17]"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-emerald-600 dark:text-emerald-400">Revenue trend</p>
              <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">Sales — last 7 days</h2>
            </div>
            {revenueChangePct !== 0 && (
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${revenueChangePct >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'}`}>
                <TrendingUp size={11} className={revenueChangePct < 0 ? 'rotate-180' : ''} />
                {revenueChangePct >= 0 ? '+' : ''}{revenueChangePct.toFixed(1)}%
              </div>
            )}
          </div>
          {stats.salesData.length > 0
            ? <AreaChart data={stats.salesData} />
            : <div className="flex h-36 items-center justify-center text-sm text-slate-400">No sales data yet</div>
          }
        </motion.div>

        {/* Order queue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#0d1f17]"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-emerald-600 dark:text-emerald-400">Live queue</p>
              <h2 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">Recent orders</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-white/[0.06] dark:text-slate-500">
              {ordersLoading ? '…' : `${filteredOrders.length} shown`}
            </span>
          </div>
          <div className="max-h-[22rem] overflow-y-auto scrollbar-hide">
            {ordersLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-[2px] border-emerald-500/30 border-t-emerald-400" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <PlatformBadge platform={order.sourcePlatform || 'DIRECT'} />
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {order.customer
                          ? [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || order.customer.phone || 'Guest'
                          : 'Guest'}
                        {order.tableNumber ? ` · T${order.tableNumber}` : ''}
                        {' · '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {inrFormatter.format(Number(order.total) || 0)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                No orders match your search
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 px-5 py-3 dark:border-white/[0.07]">
            <button
              onClick={() => router.push('/dashboard/orders')}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all orders <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
