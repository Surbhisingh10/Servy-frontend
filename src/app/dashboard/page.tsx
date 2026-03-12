'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { motion } from 'framer-motion';
import { ShoppingCart, IndianRupee, Users, Calendar, TrendingUp } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SalesChart from '@/components/dashboard/SalesChart';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();
  const { user } = useAuthStore();
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
  const [onboardingState, setOnboardingState] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('APPROVED');
  const [onboardingReason, setOnboardingReason] = useState<string | null>(null);
  const [onboardingHistory, setOnboardingHistory] = useState<
    { action: string; message?: string; createdAt: string; actor?: string }[]
  >([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    const loadOnboarding = async () => {
      try {
        const data = await api.getOnboardingStatus();
        const onboarding = data?.onboarding;
        if (!onboarding) return;
        setOnboardingState(onboarding.state || 'APPROVED');
        setOnboardingReason(onboarding.rejectionReason || null);
        setOnboardingHistory(Array.isArray(onboarding.history) ? onboarding.history : []);
      } catch {
        // no-op: onboarding info should not block dashboard
      }
    };

    loadOnboarding();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Orders Today',
      value: stats.ordersToday,
      icon: ShoppingCart,
      color: 'bg-highlight-50 text-highlight-600',
    },
    {
      title: 'Revenue Today',
      value: inrFormatter.format(stats.revenueToday || 0),
      icon: IndianRupee,
      color: 'bg-highlight-50 text-highlight-600',
    },
    {
      title: 'Repeat Customers',
      value: `${stats.repeatCustomerPercent.toFixed(1)}%`,
      icon: Users,
      color: 'bg-highlight-50 text-highlight-600',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Calendar,
      color: 'bg-highlight-50 text-highlight-600',
    },
  ];

  const submitOnboardingReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter your reply');
      return;
    }
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
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {onboardingState !== 'APPROVED' && (
        <div
          className={`rounded-xl border p-4 ${
            onboardingState === 'REJECTED' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
          }`}
        >
          <p className="font-semibold text-gray-900">
            Onboarding status: {onboardingState}
          </p>
          {onboardingReason && (
            <p className="mt-2 text-sm text-gray-700">Admin reason: {onboardingReason}</p>
          )}
          {onboardingState === 'REJECTED' && (user?.role === 'OWNER' || user?.role === 'ADMIN') && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                placeholder="Reply with changes made based on admin comments..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button onClick={submitOnboardingReply} isLoading={submittingReply}>
                Submit Reply for Re-review
              </Button>
            </div>
          )}
          {onboardingHistory.length > 0 && (
            <div className="mt-3 space-y-2">
              {onboardingHistory.slice(-3).reverse().map((entry, index) => (
                <div key={`${entry.createdAt}-${index}`} className="rounded-lg border border-gray-200 bg-white p-2 text-sm">
                  <p className="font-medium">{entry.action}</p>
                  {entry.message && <p className="text-gray-600">{entry.message}</p>}
                  <p className="text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
            <p className="text-sm text-gray-600">Last 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-highlight-600">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">
              {stats.revenueToday > 0 ? '+' : ''}
              {((stats.revenueToday / (stats.revenueToday + 1)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <SalesChart data={stats.salesData} />
      </motion.div>
    </div>
  );
}
