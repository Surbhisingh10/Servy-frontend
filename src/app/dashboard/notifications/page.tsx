'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, ConciergeBell, Loader2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { AppNotification } from '@/lib/admin-types';
import Button from '@/components/ui/Button';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [markingReadId, setMarkingReadId] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await api.getNotifications(50);
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  useRealtimeNotifications({
    onNewNotification: (payload) => {
      setNotifications((current) => {
        const next = [payload, ...current.filter((item) => item.id !== payload.id)];
        return next.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      });
    },
    onNotificationUpdated: (payload) => {
      setNotifications((current) =>
        current.map((item) => (item.id === payload.id ? { ...item, ...payload } : item)),
      );
    },
  });

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const orderNotifications = notifications.filter((item) => item.category === 'ORDER');
  const paymentSuccessNotifications = notifications.filter(
    (item) => item.category === 'PAYMENT' && item.title.toUpperCase().includes('SUCCEEDED'),
  );
  const paymentFailedNotifications = notifications.filter(
    (item) => item.category === 'PAYMENT' && item.title.toUpperCase().includes('FAILED'),
  );
  const supportNotifications = notifications.filter((item) => item.category === 'SUPPORT');

  const formatNotificationTime = (value: string) =>
    new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const getNotificationTone = (notification: AppNotification) => {
    if (notification.priority === 'CRITICAL') {
      return 'border-red-200 bg-red-50';
    }
    if (notification.category === 'PAYMENT' && notification.title.toUpperCase().includes('FAILED')) {
      return 'border-amber-200 bg-amber-50';
    }
    if (notification.category === 'PAYMENT' && notification.title.toUpperCase().includes('SUCCEEDED')) {
      return 'border-emerald-200 bg-emerald-50';
    }
    if (notification.category === 'SUPPORT' || notification.category === 'SYSTEM') {
      return 'border-orange-200 bg-orange-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  const markNotificationRead = async (id: string) => {
    try {
      setMarkingReadId(id);
      await api.markNotificationRead(id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, isRead: true, readAt: new Date().toISOString() }
            : item,
        ),
      );
    } catch {
      toast.error('Failed to update notification');
    } finally {
      setMarkingReadId(null);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      setMarkingAllRead(true);
      await api.markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
      );
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to update notifications');
    } finally {
      setMarkingAllRead(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Review onboarding, orders, payments, service requests, and subscription updates in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700">
            {unreadCount} unread
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
            isLoading={markingAllRead}
          >
            Mark all read
          </Button>
          <div className="rounded-full bg-primary-50 p-3 text-primary-700">
            <Bell size={20} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: 'New Orders',
            value: orderNotifications.length,
            icon: ShoppingCart,
            tone: 'bg-slate-50 text-slate-800',
          },
          {
            label: 'Payments Received',
            value: paymentSuccessNotifications.length,
            icon: CheckCircle2,
            tone: 'bg-emerald-50 text-emerald-800',
          },
          {
            label: 'Payment Failures',
            value: paymentFailedNotifications.length,
            icon: AlertTriangle,
            tone: 'bg-amber-50 text-amber-800',
          },
          {
            label: 'Open Service Calls',
            value: supportNotifications.length,
            icon: ConciergeBell,
            tone: 'bg-orange-50 text-orange-800',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <div className={`rounded-lg p-2 ${item.tone}`}>
                <item.icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Recent notifications</p>
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6">
              <Loader2 className="animate-spin text-primary-600" size={20} />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border px-4 py-4 text-sm ${getNotificationTone(notification)}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{notification.title}</p>
                      {!notification.isRead && (
                        <span className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600">{notification.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-white/80 px-2 py-1 font-semibold uppercase tracking-[0.18em] text-gray-600">
                        {notification.category}
                      </span>
                      {notification.priority && (
                        <span className="rounded-full bg-white/80 px-2 py-1 font-semibold uppercase tracking-[0.18em] text-gray-600">
                          {notification.priority}
                        </span>
                      )}
                      {notification.status && (
                        <span className="rounded-full bg-white/80 px-2 py-1 font-semibold uppercase tracking-[0.18em] text-gray-600">
                          {notification.status}
                        </span>
                      )}
                      <span>{formatNotificationTime(notification.createdAt)}</span>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markNotificationRead(notification.id)}
                      isLoading={markingReadId === notification.id}
                      className="shrink-0"
                    >
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500">
              No notifications yet. New orders, approval updates, service calls, payment events, and subscription alerts will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
