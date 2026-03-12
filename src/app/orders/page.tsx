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

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

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
            ? [
                {
                  orderNumber: lastOrder.orderNumber,
                  restaurantSlug: lastOrder.restaurantSlug || storedSlug || undefined,
                  createdAt: lastOrder.createdAt,
                },
              ]
            : [];

        const mergedEntries = [...history, ...fallbackEntries].filter(
          (entry) => entry?.orderNumber && (entry?.restaurantSlug || storedSlug),
        );

        const uniqueEntries = Array.from(
          new Map(
            mergedEntries.map((entry) => [
              entry.orderNumber,
              {
                ...entry,
                restaurantSlug: entry.restaurantSlug || storedSlug || undefined,
              },
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
              return (await api.getOrderByOrderNumber(
                entry.orderNumber,
                restaurantContext,
              )) as CustomerOrder;
            } catch {
              return null;
            }
          }),
        );

        const validOrders = fetched.filter((order): order is CustomerOrder => Boolean(order));
        validOrders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Past Orders</p>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        </header>

        <section className="rounded-3xl border border-gray-200 bg-white/95 p-5 space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 size={16} className="animate-spin" />
              Loading orders...
            </div>
          ) : error ? (
            <p className="text-sm font-semibold text-red-700">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-sm font-semibold text-gray-700">No orders found yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        statusStyles[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {inrFormatter.format(Number(order.total) || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white/95 p-5 text-sm text-gray-600">
          <p className="font-semibold text-gray-900">Order status</p>
          {recentOrder ? (
            <p>
              Current status for <span className="font-semibold">{recentOrder.orderNumber}</span> is{' '}
              <span className="font-semibold">{recentOrder.status}</span>.
            </p>
          ) : (
            <p>Place an order from the menu to track status here.</p>
          )}
        </section>
      </div>

      <BottomNav active="orders" />
    </div>
  );
}
