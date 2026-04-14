'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useRealtimeSupportRequests } from '@/hooks/useRealtimeSupportRequests';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChefHat, Clock, X, Bell, CheckCheck, UserCheck, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import PlatformBadge from '@/components/dashboard/PlatformBadge';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface SupportRequest {
  id: string;
  tableNumber: string;
  status: string;
  requestType: string;
  priority: string;
  requestedAt: string;
  escalatedAt?: string | null;
  assignedTo?: { id: string; firstName?: string; lastName?: string } | null;
  outlet?: { id: string; name: string };
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'New',
    icon: Clock,
    header: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    dot: 'bg-amber-400',
    card: 'border-amber-200/70 bg-amber-50/40 dark:border-amber-500/15 dark:bg-amber-500/[0.05]',
    nextStatus: 'CONFIRMED',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: Clock,
    header: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
    dot: 'bg-sky-400',
    card: 'border-sky-200/70 bg-sky-50/40 dark:border-sky-500/15 dark:bg-sky-500/[0.05]',
    nextStatus: 'PREPARING',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    header: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
    dot: 'bg-orange-400',
    card: 'border-orange-200/70 bg-orange-50/40 dark:border-orange-500/15 dark:bg-orange-500/[0.05]',
    nextStatus: 'READY',
  },
  READY: {
    label: 'Ready',
    icon: CheckCircle,
    header: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    dot: 'bg-emerald-400',
    card: 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-500/15 dark:bg-emerald-500/[0.05]',
    nextStatus: 'COMPLETED',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCheck,
    header: 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-400',
    dot: 'bg-slate-400',
    card: 'border-slate-200/70 bg-slate-50/40 dark:border-slate-500/15 dark:bg-slate-500/[0.04]',
    nextStatus: null,
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: X,
    header: 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400',
    dot: 'bg-rose-500',
    card: 'border-rose-200/70 bg-rose-50/30 dark:border-rose-500/15 dark:bg-rose-500/[0.04]',
    nextStatus: null,
  },
} as const;

const PRIORITY_META: Record<string, { badge: string }> = {
  HIGH:   { badge: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' },
  URGENT: { badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200' },
  MEDIUM: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  LOW:    { badge: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400' },
};

const actionableStatuses = new Set(['PENDING', 'CONFIRMED', 'PREPARING', 'READY']);

export default function OrdersPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [outlets, setOutlets] = useState<Array<{ id: string; name: string }>>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const { orders, loading, updateOrderStatus, refetch } = useOrders(
    undefined,
    selectedPlatform,
    selectedOutlet,
    dateFrom || undefined,
    dateTo || undefined,
  );

  useRealtimeOrders(refetch);

  const loadSupportRequests = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setRequestsLoading(true);
        const data = await api.getSupportRequests(undefined, selectedOutlet);
        setSupportRequests(data.filter((r: SupportRequest) => r.status !== 'RESOLVED'));
      } catch {
        if (!silent) toast.error('Failed to load support requests');
      } finally {
        if (!silent) setRequestsLoading(false);
      }
    },
    [selectedOutlet],
  );

  useRealtimeSupportRequests({
    onNewRequest: (payload) => {
      toast.success(`Support request: Table ${payload.tableNumber}`);
      loadSupportRequests(true);
    },
    onResolvedRequest: () => loadSupportRequests(true),
    onUpdatedRequest:  () => loadSupportRequests(true),
  });

  useEffect(() => {
    api.getOutlets().then((data) => setOutlets(data)).catch(() => undefined);
  }, []);

  useEffect(() => {
    loadSupportRequests();
  }, [loadSupportRequests]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch { /* handled in hook */ }
  };

  const handleResolveSupportRequest = async (requestId: string) => {
    try {
      await api.resolveSupportRequest(requestId);
      toast.success('Support request resolved');
      loadSupportRequests(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to resolve');
    }
  };

  const handleClaimSupportRequest = async (requestId: string) => {
    try {
      await api.assignSupportRequest(requestId);
      toast.success('Support request assigned');
      loadSupportRequests(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to assign');
    }
  };

  const handleMoveSupportRequestToInProgress = async (requestId: string) => {
    try {
      await api.updateSupportRequestStatus(requestId, 'IN_PROGRESS');
      toast.success('Marked in progress');
      loadSupportRequests(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to update');
    }
  };

  const ordersByStatus = {
    PENDING:   orders.filter((o) => o.status === 'PENDING'),
    CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED'),
    PREPARING: orders.filter((o) => o.status === 'PREPARING'),
    READY:     orders.filter((o) => o.status === 'READY'),
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED'),
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED'),
  };

  const totalActive = orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-500/30 border-t-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[24px] bg-emerald-50/80 px-6 py-5 ring-1 ring-emerald-200/60 dark:bg-[#0d1f17] dark:ring-0"
        style={{ boxShadow: '0 8px 40px rgba(16,185,129,0.07)' }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.12] blur-3xl dark:bg-emerald-500/[0.07]" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-emerald-600 dark:text-emerald-400">Live board</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Orders</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {totalActive} active · {orders.length} total
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {supportRequests.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-100/80 px-3 py-1.5 dark:border-amber-500/20 dark:bg-amber-500/10">
                <Bell size={12} className="text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  {supportRequests.length} table request{supportRequests.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                showFilters
                  ? 'border-emerald-400/60 bg-emerald-100 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap gap-2 border-t border-emerald-200/60 pt-4 dark:border-white/[0.07]">
                {[
                  <select key="outlet" value={selectedOutlet} onChange={(e) => setSelectedOutlet(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-emerald-400 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 [&>option]:bg-white dark:[&>option]:bg-slate-900">
                    <option value="ALL">All Outlets</option>
                    {outlets.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>,
                  <select key="platform" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-emerald-400 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 [&>option]:bg-white dark:[&>option]:bg-slate-900">
                    <option value="ALL">All Platforms</option>
                    <option value="DIRECT">Direct</option>
                    <option value="SWIGGY">Swiggy</option>
                    <option value="ZOMATO">Zomato</option>
                    <option value="DINEOUT">Dineout</option>
                  </select>,
                  <input key="from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none [color-scheme:light] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:[color-scheme:dark]" />,
                  <input key="to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none [color-scheme:light] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:[color-scheme:dark]" />,
                ]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Support requests ── */}
      <AnimatePresence>
        {(requestsLoading || supportRequests.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="overflow-hidden rounded-[20px] border border-amber-200/70 bg-amber-50/60 dark:border-amber-500/15 dark:bg-amber-500/[0.05]"
          >
            <div className="flex items-center justify-between border-b border-amber-200/60 px-5 py-3.5 dark:border-amber-500/10">
              <div className="flex items-center gap-2.5">
                <Bell size={14} className="text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">Table assistance</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                {supportRequests.length} active
              </span>
            </div>

            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {requestsLoading ? (
                <div className="flex h-16 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
                </div>
              ) : (
                supportRequests.map((req, i) => {
                  const priorityMeta = PRIORITY_META[req.priority] ?? PRIORITY_META['LOW'];
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-xl border border-amber-200/70 bg-white p-4 dark:border-amber-500/20 dark:bg-[#0d1f17] ${req.escalatedAt ? 'ring-1 ring-rose-300 dark:ring-rose-500/40' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Table {req.tableNumber}</p>
                            {req.escalatedAt && (
                              <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                                <AlertTriangle size={10} /> Escalated
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{req.requestType}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityMeta.badge}`}>{req.priority}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {new Date(req.requestedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            {' · '}{req.status.replace(/_/g, ' ')}
                          </p>
                          {req.assignedTo && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                              <UserCheck size={11} />
                              {[req.assignedTo.firstName, req.assignedTo.lastName].filter(Boolean).join(' ') || 'Staff'}
                            </p>
                          )}
                          {req.outlet?.name && selectedOutlet === 'ALL' && (
                            <p className="mt-1 text-[10px] text-slate-400">{req.outlet.name}</p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-col gap-1.5">
                          {!req.assignedTo && (
                            <button
                              onClick={() => handleClaimSupportRequest(req.id)}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.1]"
                            >
                              Claim
                            </button>
                          )}
                          {req.status === 'OPEN' && (
                            <button
                              onClick={() => handleMoveSupportRequestToInProgress(req.id)}
                              className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-200 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                            >
                              In Progress
                            </button>
                          )}
                          <button
                            onClick={() => handleResolveSupportRequest(req.id)}
                            className="rounded-lg bg-emerald-100 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Kanban board ── */}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const statusOrders = ordersByStatus[status as keyof typeof ordersByStatus] ?? [];
            const Icon = config.icon;

            return (
              <section
                key={status}
                className="flex w-[288px] shrink-0 flex-col rounded-[20px] border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#0d1f17]"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                {/* Column header */}
                <div className={`mx-3 mt-3 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${config.header}`}>
                  <Icon size={14} />
                  <h3 className="text-xs font-bold uppercase tracking-wider">{config.label}</h3>
                  <span className="ml-auto rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold text-current dark:bg-white/10">
                    {statusOrders.length}
                  </span>
                </div>

                {/* Order cards */}
                <div className="flex max-h-[calc(100vh-280px)] flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3 pt-2.5 scrollbar-hide">
                  {statusOrders.length > 0 ? (
                    statusOrders.map((order, i) => (
                      <motion.article
                        key={order.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 220, damping: 24 }}
                        className={`rounded-2xl border p-3.5 ${config.card}`}
                      >
                        {/* Order header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{order.orderNumber}</p>
                            <div className="mt-1">
                              <PlatformBadge platform={order.sourcePlatform || 'DIRECT'} />
                            </div>
                          </div>
                          <span className="shrink-0 text-sm font-black text-slate-900 dark:text-white">
                            {inrFormatter.format(Number(order.total) || 0)}
                          </span>
                        </div>

                        {/* Order meta */}
                        <div className="mt-2.5 space-y-0.5">
                          <p className="text-[11px] text-slate-500">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            {order.tableNumber ? ` · Table ${order.tableNumber}` : ''}
                          </p>
                          {order.customer && (
                            <p className="text-[11px] text-slate-500">
                              {[order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || order.customer.phone}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400 dark:text-slate-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 space-y-1.5">
                          {order.status === 'PENDING' && (
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                                className="rounded-xl bg-emerald-100 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                className="rounded-xl bg-rose-100 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {config.nextStatus &&
                            actionableStatuses.has(order.status) &&
                            order.status !== 'PENDING' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, config.nextStatus!)}
                                className="w-full rounded-xl bg-emerald-100 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                              >
                                Mark as {STATUS_CONFIG[config.nextStatus as keyof typeof STATUS_CONFIG]?.label}
                              </button>
                            )}

                          {order.isExternal && (
                            <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-center text-[10px] font-medium text-slate-500 dark:bg-white/[0.04] dark:text-slate-500">
                              Managed from {order.sourcePlatform}
                            </div>
                          )}
                        </div>
                      </motion.article>
                    ))
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-xs text-slate-400 dark:border-white/[0.06] dark:bg-transparent">
                      No orders
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
