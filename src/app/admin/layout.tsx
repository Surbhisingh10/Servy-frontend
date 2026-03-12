import { ReactNode } from 'react';
import { getAdminToken } from '@/lib/admin-server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const token = getAdminToken();
  if (!token) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
