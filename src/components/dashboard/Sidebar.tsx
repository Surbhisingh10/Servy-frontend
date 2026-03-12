'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
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
  QrCode,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone},
  { name: 'QR Codes', href: '/dashboard/qr-codes', icon: QrCode },
  { name: 'Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
  { name: 'Staff', href: '/dashboard/staff', icon: UserCog, roles: ['OWNER', 'ADMIN'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['OWNER', 'ADMIN'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-gray-200 bg-white p-2 text-[#1A202C] shadow-sm lg:hidden"
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-[#F9FAFB] shadow-xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-[#1A202C]">Restaurant SaaS</h2>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-[#1A202C]">
                    <X size={24} />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          router.push(item.href);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-[#1A202C] hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[#1A202C] transition-colors hover:bg-primary-50 hover:text-primary-700"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden bg-[#F9FAFB] lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <h1 className="text-xl font-bold text-[#1A202C]">Restaurant SaaS</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-[#1A202C] hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="px-4 py-2 text-sm text-[#4A5568]">
              <p className="font-medium text-[#1A202C]">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#1A202C] transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
