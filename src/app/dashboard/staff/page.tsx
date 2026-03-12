'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Phone, Shield } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export default function StaffPage() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'STAFF',
  });
  const [editFormData, setEditFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'STAFF',
    isActive: true,
  });

  const canManageStaff = currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers?.() || [];
      setUsers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'STAFF',
    });
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      role: user.role || 'STAFF',
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUserId(null);
    setEditFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'STAFF',
      isActive: true,
    });
  };

  const handleCreateStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageStaff) {
      toast.error('Only owner or admin can add staff');
      return;
    }
    if (!formData.email.trim() || !formData.password.trim() || !formData.firstName.trim()) {
      toast.error('Email, password, and first name are required');
      return;
    }

    try {
      setIsCreateSubmitting(true);
      await api.createUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        role: formData.role,
      });
      toast.success('Staff member created');
      closeCreateModal();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create staff member');
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleUpdateStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageStaff) {
      toast.error('Only owner or admin can edit staff');
      return;
    }
    if (!editingUserId) {
      toast.error('No staff member selected');
      return;
    }
    if (!editFormData.email.trim() || !editFormData.firstName.trim()) {
      toast.error('Email and first name are required');
      return;
    }

    try {
      setIsEditSubmitting(true);
      await api.updateUser(editingUserId, {
        email: editFormData.email.trim().toLowerCase(),
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim() || undefined,
        phone: editFormData.phone.trim() || undefined,
        role: editFormData.role,
        isActive: editFormData.isActive,
      });
      toast.success('Staff member updated');
      closeEditModal();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  const roleColors: { [key: string]: string } = {
    OWNER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    MANAGER: 'bg-green-100 text-green-800',
    STAFF: 'bg-gray-100 text-gray-800',
    WAITER: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="mt-2 text-gray-600">Manage your restaurant staff</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!canManageStaff}
          title={!canManageStaff ? 'Only owner/admin can add staff' : undefined}
        >
          <Plus size={18} className="mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {user.firstName[0]}{user.lastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        roleColors[user.role] || roleColors.STAFF
                      }`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        disabled={!canManageStaff}
                        className="text-primary-600 hover:text-primary-900 disabled:text-gray-300"
                        title={!canManageStaff ? 'Only owner/admin can edit staff' : 'Edit'}
                      >
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Shield size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No staff members found</p>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Add Staff Member"
        size="md"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="STAFF">Staff</option>
              <option value="WAITER">Waiter</option>
              <option value="CASHIER">Cashier</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full" isLoading={isCreateSubmitting}>
            Create Staff Member
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Staff Member"
        size="md"
      >
        <form onSubmit={handleUpdateStaff} className="space-y-4">
          <Input
            label="First Name"
            value={editFormData.firstName}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <Input
            label="Last Name"
            value={editFormData.lastName}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, lastName: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={editFormData.phone}
            onChange={(e) => setEditFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={editFormData.role}
              onChange={(e) => setEditFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="STAFF">Staff</option>
              <option value="WAITER">Waiter</option>
              <option value="CASHIER">Cashier</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={editFormData.isActive}
              onChange={(e) => setEditFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="form-checkbox h-4 w-4 text-primary-600"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <Button type="submit" className="w-full" isLoading={isEditSubmitting}>
            Save Changes
          </Button>
        </form>
      </Modal>
    </div>
  );
}
