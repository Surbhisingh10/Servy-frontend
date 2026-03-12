import { fetchAdmin } from '@/lib/admin-server';
import { AdminUser } from '@/lib/admin-types';
import AdminUsersManager from '@/components/admin/AdminUsersManager';

export default async function AdminUsersPage() {
  const users = await fetchAdmin<AdminUser[]>('/admin/admin-users');
  return <AdminUsersManager users={users} />;
}
