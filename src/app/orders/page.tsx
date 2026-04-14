'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import BottomNav from '@/components/customer/BottomNav';
import { Loader2 } from 'lucide-react';

interface CustomerOrderHistoryEntry {
  orderNumber: string;
  restaurantSlug?: string;
  createdAt?: string;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ id?: string; quantity: number; menuItem?: { name?: string } }>;
  type?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PREPARING: 'bg-violet-50 text-violet-700 border-violet-200',
    READY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const recentOrder = useMemo(() => orders[0], [orders]);
  const isActive = recentOrder && !['COMPLETED', 'CANCELLED'].includes(recentOrder.status);
  const activeStepIndex = STATUS_STEPS.indexOf(recentOrder?.status ?? '');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedSlug = typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;
        const historyRaw = typeof window !== 'undefined' ? localStorage.getItem('customerOrderHistory') : null;
        const history = historyRaw ? (JSON.parse(historyRaw) as CustomerOrderHistoryEntry[]) : [];
        const lastOrderRaw = typeof window !== 'undefined' ? localStorage.getItem('lastOrder') : null;
        const lastOrder = lastOrderRaw ? JSON.parse(lastOrderRaw) : null;

        const fallbackEntries: CustomerOrderHistoryEntry[] =
          lastOrder?.orderNumber && (storedSlug || lastOrder?.restaurantSlug)
            ? [{ orderNumber: lastOrder.orderNumber, restaurantSlug: lastOrder.restaurantSlug || storedSlug || undefined, createdAt: lastOrder.createdAt }]
            : [];

        const mergedEntries = [...history, ...fallbackEntries].filter(
          (entry) => entry?.orderNumber && (entry?.restaurantSlug || storedSlug),
        );

        const uniqueEntries = Array.from(
          new Map(
            mergedEntries.map((entry) => [
              entry.orderNumber,
              { ...entry, restaurantSlug: entry.restaurantSlug || storedSlug || undefined },
            ]),
          ).values(),
        ).slice(0, 20);

        if (uniqueEntries.length === 0) {
          setOrders([]);
          return;
        }

        const fetched = await Promise.all(
          uniqueEntries.map(async (entry) => {
            const restaurantContext = entry.restaurantSlug || storedSlug;
            if (!restaurantContext) return null;
            try {
              return (await api.getOrderByOrderNumber(entry.orderNumber, restaurantContext)) as CustomerOrder;
            } catch {
              return null;
            }
          }),
        );

        const validOrders = fetched.filter((order): order is CustomerOrder => Boolean(order));
        validOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(validOrders);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5fbf8] pb-24 text-slate-900">
      <div className="mx-auto max-w-md space-y-4 px-3 py-6 sm:px-4 sm:py-10">
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">My Orders</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Order history</h1>
        </header>

        {/* Live order tracker */}
        {isActive && recentOrder && (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5,#d1fae5)] p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Live order</p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">#{recentOrder.orderNumber}</p>
              <StatusBadge status={recentOrder.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {recentOrder.items.length} item{recentOrder.items.length !== 1 ? 's' : ''} · {inrFormatter.format(Number(recentOrder.total) || 0)}
            </p>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between gap-1">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-1 flex-col items-center gap-1">
                    <div className={`h-1.5 w-full rounded-full transition-colors ${i <= activeStepIndex ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
                    <span className={`text-[9px] font-semibold uppercase tracking-wide ${i <= activeStepIndex ? 'text-emerald-700' : 'text-slate-300'}`}>
                      {step === 'PENDING' ? 'Placed' : step === 'CONFIRMED' ? 'Confirmed' : step === 'PREPARING' ? 'Preparing' : 'Ready'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order history */}
        <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Past orders</p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 px-5 py-6 text-sm text-slate-500">
              <Loader2 size={16} className="animate-spin text-emerald-600" />
              Loading orders...
            </div>
          ) : error ? (
            <p className="px-5 py-6 text-sm font-semibold text-rose-600">{error}</p>
          ) : orders.length === 0 ? (
            <div className="m-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No orders yet</p>
              <p className="mt-1 text-xs text-slate-400">Place an order from the menu to see it here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">#{order.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {order.type && <span className="ml-2 text-slate-300">· {order.type.replace('_', '-')}</span>}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={order.status} />
                    <p className="text-sm font-semibold text-slate-950">{inrFormatter.format(Number(order.total) || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav active="orders" />
    </div>
  );
}
