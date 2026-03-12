'use client';

import { useMemo, useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, Mail, Phone, Search, Tags, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

const suggestedGroups = ['VIP', 'Regulars', 'Corporate', 'Brunch Club'];

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [draftGroups, setDraftGroups] = useState<Record<string, string>>({});
  const [savingCustomerId, setSavingCustomerId] = useState<string | null>(null);
  const { customers, loading, total, totalPages } = useCustomers(search, page, 20);
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const allKnownGroups = useMemo(() => {
    const existing = customers.flatMap((customer) => customer.customerGroups || []);
    return Array.from(new Set([...suggestedGroups, ...existing])).sort();
  }, [customers]);

  const parseGroups = (value: string) =>
    Array.from(
      new Set(
        value
          .split(',')
          .map((group) => group.trim())
          .filter(Boolean),
      ),
    );

  const handleSaveGroups = async (customer: any) => {
    const inputValue =
      draftGroups[customer.id] ?? (customer.customerGroups || []).join(', ');
    const customerGroups = parseGroups(inputValue);

    setSavingCustomerId(customer.id);
    try {
      await api.updateCustomer(customer.id, { customerGroups });
      toast.success('Customer groups updated');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update customer groups');
    } finally {
      setSavingCustomerId(null);
    }
  };

  const handleQuickAdd = (customerId: string, group: string, currentGroups: string[] = []) => {
    const nextGroups = Array.from(new Set([...currentGroups, group]));
    setDraftGroups((prev) => ({
      ...prev,
      [customerId]: nextGroups.join(', '),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-gray-600">
            Manage customer groups for segmented promotions.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, phone, email, or group..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <Users className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Known Groups</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{allKnownGroups.length}</p>
            </div>
            <Tags className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {inrFormatter.format(
                  customers.reduce((sum, c) => sum + Number(c.lifetimeSpend || 0), 0),
                )}
              </p>
            </div>
            <Tags className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Groups
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {customers.map((customer) => {
                  const currentGroups = customer.customerGroups || [];
                  const inputValue =
                    draftGroups[customer.id] ?? currentGroups.join(', ');

                  return (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="align-top hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName || customer.lastName
                            ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                            : 'Guest'}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {customer.totalVisits} visits •{' '}
                          {inrFormatter.format(Number(customer.lifetimeSpend || 0))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {customer.lastVisitDate
                          ? new Date(customer.lastVisitDate).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {currentGroups.length > 0 ? (
                              currentGroups.map((group) => (
                                <span
                                  key={`${customer.id}-${group}`}
                                  className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
                                >
                                  {group}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No groups assigned</span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {allKnownGroups.map((group) => (
                              <button
                                key={`${customer.id}-suggest-${group}`}
                                type="button"
                                onClick={() => handleQuickAdd(customer.id, group, parseGroups(inputValue))}
                                className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:border-primary-400 hover:text-primary-700"
                              >
                                + {group}
                              </button>
                            ))}
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              value={inputValue}
                              onChange={(event) =>
                                setDraftGroups((prev) => ({
                                  ...prev,
                                  [customer.id]: event.target.value,
                                }))
                              }
                              placeholder="VIP, Birthday Club, Office Park"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveGroups(customer)}
                              disabled={savingCustomerId === customer.id}
                            >
                              {savingCustomerId === customer.id ? 'Saving...' : 'Save Groups'}
                            </Button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} customers
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
