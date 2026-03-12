'use client';

import { useEffect } from 'react';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Sidebar from './Sidebar';
import { Loader2 } from 'lucide-react';

const restrictedSegmentRoles: Record<string, string[]> = {
  settings: ['OWNER', 'ADMIN'],
  staff: ['OWNER', 'ADMIN'],
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
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-[#1A202C]">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-[#1A202C]">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#1A202C]">Access Denied</h2>
          <p className="text-[#4A5568]">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-dashboard-theme className="min-h-screen bg-[#F9FAFB] text-[#1A202C]">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
