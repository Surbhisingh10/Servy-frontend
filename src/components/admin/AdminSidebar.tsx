'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/restaurants', label: 'Restaurants' },
  { href: '/admin/plans', label: 'Plans' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/logs', label: 'System Logs' },
  { href: '/admin/admin-users', label: 'Admin Users' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-full border-r border-gray-200 bg-[#F9FAFB] lg:w-64">
      <div className="sticky top-0 flex h-screen flex-col px-4 py-6">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-[#1A202C]">SaaS Admin</h1>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active ? 'bg-primary-600 text-white' : 'text-[#1A202C] hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A202C] hover:bg-primary-50 hover:text-primary-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
