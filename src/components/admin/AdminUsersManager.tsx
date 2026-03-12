'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Table from '@/components/admin/Table';
import AdminModal from '@/components/admin/AdminModal';
import { AdminUser, AdminRole } from '@/lib/admin-types';

export default function AdminUsersManager({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'SUPPORT_ADMIN' as AdminRole,
  });

  const createUser = async () => {
    await fetch('/api/admin/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setIsOpen(false);
    router.refresh();
  };

  const removeUser = async (id: string) => {
    await fetch(`/api/admin/admin-users/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Security & Admin Users</h1>
        <Button onClick={() => setIsOpen(true)}>Create Admin</Button>
      </div>

      <Table
        rows={users}
        columns={[
          { key: 'name', header: 'Name', render: (row) => `${row.firstName} ${row.lastName || ''}`.trim() },
          { key: 'email', header: 'Email', render: (row) => row.email },
          { key: 'role', header: 'Role', render: (row) => row.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Support Admin' },
          { key: '2fa', header: '2FA', render: (row) => (row.twoFactorEnabled ? 'Enabled' : 'Placeholder') },
          { key: 'lastLogin', header: 'Last Login', render: (row) => (row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'N/A') },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Button size="sm" variant="outline" onClick={() => removeUser(row.id)}>
                Remove
              </Button>
            ),
          },
        ]}
      />

      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Admin User">
        <div className="space-y-3">
          <input className="input" placeholder="First name" value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
          <input className="input" placeholder="Last name" value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          <select className="input" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as AdminRole }))}>
            <option value="SUPPORT_ADMIN">Support Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <Button onClick={createUser}>Create</Button>
        </div>
      </AdminModal>
    </div>
  );
}
