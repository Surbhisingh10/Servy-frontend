import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  paymentStatus: string;
  total: number;
  tableNumber?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    phone: string;
  };
  createdAt: string;
  sourcePlatform?: 'DIRECT' | 'SWIGGY' | 'ZOMATO' | 'DINEOUT';
  isExternal?: boolean;
  items: Array<{
    id: string;
    quantity: number;
    menuItem: {
      name: string;
    };
  }>;
}

export function useOrders(status?: string, platform: string = 'ALL') {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.getOrders(status, platform);
      setOrders(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [status, platform]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await api.updateOrder(orderId, { status: newStatus });
      toast.success('Order status updated');
    } catch (err: any) {
      // Revert on error
      setOrders(previousOrders);
      toast.error(err.response?.data?.message || 'Failed to update order');
      throw err;
    }
  };

  return { orders, loading, error, updateOrderStatus, refetch: () => fetchOrders(true) };
}
