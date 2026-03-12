'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { motion } from 'framer-motion';
import { CheckCircle, ChefHat, Clock, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import PlatformBadge from '@/components/dashboard/PlatformBadge';

const statusConfig = {
  PENDING: {
    label: 'New',
    icon: Clock,
    color: 'border-yellow-200 bg-yellow-100/80 text-yellow-800',
    nextStatus: 'CONFIRMED',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: Clock,
    color: 'border-blue-200 bg-blue-100/80 text-blue-800',
    nextStatus: 'PREPARING',
  },
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'border-purple-200 bg-purple-100/80 text-purple-800',
    nextStatus: 'READY',
  },
  READY: {
    label: 'Ready',
    icon: CheckCircle,
    color: 'border-green-200 bg-green-100/80 text-green-800',
    nextStatus: 'COMPLETED',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'border-gray-200 bg-gray-100 text-gray-800',
    nextStatus: null,
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: X,
    color: 'border-red-200 bg-red-100/80 text-red-800',
    nextStatus: null,
  },
} as const;

const actionableStatuses = new Set(['PENDING', 'CONFIRMED', 'PREPARING', 'READY']);

export default function OrdersPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
  const { orders, loading, updateOrderStatus, refetch } = useOrders(
    undefined,
    selectedPlatform,
  );

  useRealtimeOrders(refetch);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch {
      // Error handled in hook
    }
  };

  const ordersByStatus = {
    PENDING: orders.filter((o) => o.status === 'PENDING'),
    CONFIRMED: orders.filter((o) => o.status === 'CONFIRMED'),
    PREPARING: orders.filter((o) => o.status === 'PREPARING'),
    READY: orders.filter((o) => o.status === 'READY'),
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED'),
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED'),
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-600">Manage and track all orders across every platform.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="ALL">All Platforms</option>
            <option value="DIRECT">Direct</option>
            <option value="SWIGGY">Swiggy</option>
            <option value="ZOMATO">Zomato</option>
            <option value="DINEOUT">Dineout</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-5">
          {Object.entries(statusConfig).map(([status, config]) => {
            const statusOrders = ordersByStatus[status as keyof typeof ordersByStatus] || [];
            const Icon = config.icon;

            return (
              <section
                key={status}
                className="flex w-[320px] flex-shrink-0 flex-col rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className={`m-4 flex items-center gap-3 rounded-2xl border px-4 py-3 ${config.color}`}>
                  <Icon size={20} />
                  <h3 className="text-base font-semibold">{config.label}</h3>
                  <span className="ml-auto rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold">
                    {statusOrders.length}
                  </span>
                </div>

                <div className="flex max-h-[calc(100vh-260px)] flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
                  {statusOrders.length > 0 ? (
                    statusOrders.map((order) => (
                      <motion.article
                        key={order.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="break-words text-lg font-semibold leading-7 text-gray-900">
                              {order.orderNumber}
                            </p>
                            <div className="mt-2">
                              <PlatformBadge platform={order.sourcePlatform || 'DIRECT'} />
                            </div>
                          </div>
                          <span className="flex-shrink-0 text-sm font-bold text-gray-900">
                            {inrFormatter.format(Number(order.total) || 0)}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
                          {order.tableNumber && <p>Table {order.tableNumber}</p>}
                          {order.customer && (
                            <p>
                              {[order.customer.firstName, order.customer.lastName]
                                .filter(Boolean)
                                .join(' ') || order.customer.phone}
                            </p>
                          )}
                          <p>
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>

                        <div className="mt-4 space-y-2">
                          {order.status === 'PENDING' && (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                                className="rounded-xl bg-primary-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                className="rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {config.nextStatus &&
                            actionableStatuses.has(order.status) &&
                            order.status !== 'PENDING' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, config.nextStatus)}
                                className="w-full rounded-xl bg-primary-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                              >
                                Mark as{' '}
                                {
                                  statusConfig[config.nextStatus as keyof typeof statusConfig]
                                    ?.label
                                }
                              </button>
                            )}

                          {order.isExternal && (
                            <div className="rounded-xl bg-white px-3 py-2 text-center text-xs font-medium text-gray-600">
                              Managed from {order.sourcePlatform}
                            </div>
                          )}
                        </div>
                      </motion.article>
                    ))
                  ) : (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
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
