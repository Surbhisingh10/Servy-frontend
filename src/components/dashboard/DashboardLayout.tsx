'use client';

import { useEffect } from 'react';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Sidebar from './Sidebar';
import { Loader2 } from 'lucide-react';

const restrictedSegmentRoles: Record<string, string[]> = {
  settings: ['OWNER', 'ADMIN'],
  staff: ['OWNER', 'ADMIN'],
  outlets: ['OWNER', 'ADMIN'],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const segments = useSelectedLayoutSegments();
  const activeSegment = segments[segments.length - 1] || '';
  const requiredRole = restrictedSegmentRoles[activeSegment] || null;

  useEffect(() => {
    document.documentElement.dataset.platformTheme = 'emerald-green';
    return () => {
      delete document.documentElement.dataset.platformTheme;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      fetchUser().catch(() => {
        router.push('/auth/login');
      });
    }
  }, [isAuthenticated, isLoading, router, fetchUser]);

  useEffect(() => {
    if (user && requiredRole && !requiredRole.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--page-bg)] text-[color:var(--page-fg)]">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--page-bg)] text-[color:var(--page-fg)]">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#1A202C]">Access Denied</h2>
          <p className="text-[#4A5568]">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-dashboard-theme
      className="relative min-h-screen overflow-hidden bg-[#f0faf5] text-slate-900 dark:bg-[#080e0a] dark:text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.07),transparent_26%),linear-gradient(180deg,#f5fbf8_0%,#f0faf5_42%,#e8f5ee_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.04),transparent_26%),linear-gradient(180deg,#090f0b_0%,#080e0a_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),transparent)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0.2),transparent)]"
      />
      <Sidebar />
      <main className="relative z-10 lg:pl-[19rem]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
