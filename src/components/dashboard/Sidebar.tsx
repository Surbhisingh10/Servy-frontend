'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import type { AppNotification } from '@/lib/admin-types';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  Users,
  UtensilsCrossed,
  UserCog,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Megaphone,
  Bell,
  QrCode,
  Building2,
  Package,
  BarChart2,
  Sun,
  Moon,
} from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  group: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Overview' },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, group: 'Operations' },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, group: 'Operations' },
  { name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed, group: 'Operations' },
  { name: 'Customers', href: '/dashboard/customers', icon: Users, group: 'Guests & Loyalty' },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone, group: 'Guests & Loyalty' },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, group: 'Guests & Loyalty' },
  { name: 'QR Codes', href: '/dashboard/qr-codes', icon: QrCode, group: 'Venue' },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['OWNER', 'ADMIN', 'MANAGER'], group: 'Venue' },
  { name: 'Outlets', href: '/dashboard/outlets', icon: Building2, roles: ['OWNER', 'ADMIN'], group: 'Venue' },
  { name: 'Sales', href: '/dashboard/sales', icon: BarChart2, roles: ['OWNER', 'ADMIN'], group: 'Analytics' },
  { name: 'Staff', href: '/dashboard/staff', icon: UserCog, roles: ['OWNER', 'ADMIN'], group: 'Admin' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['OWNER', 'ADMIN'], group: 'Admin' },
];

const NAV_GROUPS = ['Overview', 'Operations', 'Guests & Loyalty', 'Analytics', 'Venue', 'Admin'];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [latestOrderCreatedAt, setLatestOrderCreatedAt] = useState<string | null>(null);
  const [lastSeenOrderCreatedAt, setLastSeenOrderCreatedAt] = useState<string | null>(null);

  const { colorMode, toggleColorMode } = useThemeStore();

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const orderSeenStorageKey = user ? `dashboard:last-seen-order:${user.id}` : null;

  useEffect(() => {
    if (!orderSeenStorageKey || typeof window === 'undefined') return;
    setLastSeenOrderCreatedAt(localStorage.getItem(orderSeenStorageKey));
  }, [orderSeenStorageKey]);

  useEffect(() => {
    let isMounted = true;

    const loadSidebarIndicators = async () => {
      try {
        const selectedOutletId =
          typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') || 'ALL' : 'ALL';
        const [notifications, orders] = await Promise.all([
          api.getNotifications(50),
          api.getOrders(undefined, 'ALL', selectedOutletId),
        ]);

        if (!isMounted) return;

        const unreadCount = Array.isArray(notifications)
          ? notifications.filter((item: AppNotification) => !item.isRead).length
          : 0;
        const latestCreatedAt = Array.isArray(orders) && orders.length > 0 ? orders[0].createdAt : null;

        setUnreadNotificationsCount(unreadCount);
        setLatestOrderCreatedAt(latestCreatedAt);
      } catch {
        // Avoid toast noise from persistent sidebar background refreshes.
      }
    };

    void loadSidebarIndicators();
    const intervalId = window.setInterval(loadSidebarIndicators, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useRealtimeOrders(() => {
    const selectedOutletId =
      typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') || 'ALL' : 'ALL';

    Promise.all([
      api.getNotifications(50),
      api.getOrders(undefined, 'ALL', selectedOutletId),
    ])
      .then(([notifications, orders]) => {
        const unreadCount = Array.isArray(notifications)
          ? notifications.filter((item: AppNotification) => !item.isRead).length
          : 0;
        const latestCreatedAt = Array.isArray(orders) && orders.length > 0 ? orders[0].createdAt : null;

        setUnreadNotificationsCount(unreadCount);
        setLatestOrderCreatedAt(latestCreatedAt);
      })
      .catch(() => {
        // Ignore background refresh failures in the sidebar indicator.
      });
  });

  useRealtimeNotifications({
    onNewNotification: () => {
      api
        .getNotifications(50)
        .then((notifications) => {
          const unreadCount = Array.isArray(notifications)
            ? notifications.filter((item: AppNotification) => !item.isRead).length
            : 0;
          setUnreadNotificationsCount(unreadCount);
        })
        .catch(() => undefined);
    },
    onNotificationUpdated: () => {
      api
        .getNotifications(50)
        .then((notifications) => {
          const unreadCount = Array.isArray(notifications)
            ? notifications.filter((item: AppNotification) => !item.isRead).length
            : 0;
          setUnreadNotificationsCount(unreadCount);
        })
        .catch(() => undefined);
    },
  });

  useEffect(() => {
    if (pathname !== '/dashboard/orders' || !latestOrderCreatedAt || !orderSeenStorageKey || typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(orderSeenStorageKey, latestOrderCreatedAt);
    setLastSeenOrderCreatedAt(latestOrderCreatedAt);
  }, [latestOrderCreatedAt, orderSeenStorageKey, pathname]);

  const hasUnreadNotifications = unreadNotificationsCount > 0;
  const hasNewOrders =
    Boolean(latestOrderCreatedAt) &&
    latestOrderCreatedAt !== lastSeenOrderCreatedAt &&
    pathname !== '/dashboard/orders';

  const renderNavBadge = (itemName: string) => {
    if (itemName === 'Notifications' && hasUnreadNotifications) {
      return (
        <span className="ml-auto inline-flex h-2.5 w-2.5 rounded-full bg-red-500" aria-label={`${unreadNotificationsCount} unread notifications`} />
      );
    }

    if (itemName === 'Orders' && hasNewOrders) {
      return (
        <span className="ml-auto inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" aria-label="New orders available" />
      );
    }

    return null;
  };

  const renderGroupedNav = (items: NavItem[]) => {
    return NAV_GROUPS.map((group) => {
      const groupItems = items.filter((item) => item.group === group);
      if (groupItems.length === 0) return null;
      return (
        <div key={group}>
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            {group}
          </p>
          <div className="space-y-0.5">
            {groupItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:bg-white/8 hover:text-slate-200 font-medium'
                  }`}
                >
                  <item.icon size={16} className={isActive ? 'text-emerald-400' : ''} />
                  <span>{item.name}</span>
                  {renderNavBadge(item.name)}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    toast.success('Logged out successfully');
    router.replace('/auth/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-slate-200/70 bg-white/90 p-2.5 text-slate-900 shadow-[0_16px_32px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden"
      >
        <MenuIcon size={24} />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[19rem] flex-col overflow-hidden border-r border-white/[0.06] bg-[#0d1f17] text-slate-100 shadow-[0_24px_64px_rgba(15,23,42,0.42)] lg:hidden"
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="relative border-b border-white/[0.08] px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] text-base font-extrabold text-white shadow-[0_8px_20px_rgba(16,185,129,0.30)]">
                      S
                    </div>
                    <div>
                      <h2 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-base font-extrabold tracking-tight text-transparent">Servy</h2>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                  <nav className="space-y-4">
                    {renderGroupedNav(filteredNavigation)}
                  </nav>
                </div>
                <div className="shrink-0 border-t border-white/[0.08] p-4 space-y-2">
                  <button
                    onClick={toggleColorMode}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Toggle color mode"
                  >
                    {colorMode === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-400" />}
                    <span>{colorMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                      {colorMode === 'dark' ? 'ON' : 'OFF'}
                    </span>
                  </button>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-500">
                        {user?.role?.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      aria-label="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-screen lg:w-[19rem] lg:flex-col lg:overflow-hidden lg:border-r lg:border-white/[0.06] lg:bg-[#0d1f17] lg:text-slate-100 lg:shadow-[0_24px_64px_rgba(15,23,42,0.32)]">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-white/[0.08] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] text-base font-extrabold text-white shadow-[0_8px_20px_rgba(16,185,129,0.30)]">
                S
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-base font-extrabold tracking-tight text-transparent">Servy</h1>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
            <nav className="space-y-4">
              {renderGroupedNav(filteredNavigation)}
            </nav>
          </div>

          <div className="shrink-0 border-t border-white/[0.08] p-4 space-y-2">
            <button
              onClick={toggleColorMode}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Toggle color mode"
            >
              {colorMode === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-400" />}
              <span>{colorMode === 'dark' ? 'Light mode' : 'Dark mode'}</span>
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                {colorMode === 'dark' ? 'ON' : 'OFF'}
              </span>
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xs font-bold text-emerald-400">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs capitalize text-slate-500">
                  {user?.role?.toLowerCase().replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
