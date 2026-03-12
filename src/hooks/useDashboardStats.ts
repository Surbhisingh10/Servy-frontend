import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  repeatCustomerPercent: number;
  pendingBookings: number;
  salesData: Array<{ date: string; revenue: number }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    ordersToday: 0,
    revenueToday: 0,
    repeatCustomerPercent: 0,
    pendingBookings: 0,
    salesData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch orders and bookings
        const [orders, bookings, customers] = await Promise.all([
          api.getOrders().catch(() => []),
          api.getBookings().catch(() => []),
          api.getCustomers().catch(() => []),
        ]);

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ordersToday = orders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime() && order.status !== 'CANCELLED';
        });

        const revenueToday = ordersToday.reduce(
          (sum: number, order: any) => sum + Number(order.total || 0),
          0
        );

        const pendingBookings = bookings.filter(
          (booking: any) => booking.status === 'PENDING' || booking.status === 'CONFIRMED'
        ).length;

        // Calculate repeat customer percentage
        const repeatCustomers = customers.filter(
          (customer: any) => customer.totalVisits > 1
        ).length;
        const repeatCustomerPercent =
          customers.length > 0 ? (repeatCustomers / customers.length) * 100 : 0;

        // Sales data for last 7 days
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          const dayOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === date.getTime() && order.status !== 'CANCELLED';
          });

          const revenue = dayOrders.reduce(
            (sum: number, order: any) => sum + Number(order.total || 0),
            0
          );

          salesData.push({
            date: date.toISOString().split('T')[0],
            revenue,
          });
        }

        setStats({
          ordersToday: ordersToday.length,
          revenueToday,
          repeatCustomerPercent,
          pendingBookings,
          salesData,
        });
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
