'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AdminModal from '@/components/admin/AdminModal';
import Table from '@/components/admin/Table';
import { Plan } from '@/lib/admin-types';

export default function PlanManager({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [features, setFeatures] = useState('');

  const createPlan = async () => {
    await fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: Number(price),
        billingCycle,
        features: features.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    setIsOpen(false);
    router.refresh();
  };

  const deactivatePlan = async (id: string) => {
    await fetch(`/api/admin/plans/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</h1>
        <Button onClick={() => setIsOpen(true)}>Create Plan</Button>
      </div>

      <Table
        rows={plans}
        columns={[
          { key: 'name', header: 'Plan Name', render: (row) => row.name },
          { key: 'price', header: 'Price', render: (row) => `$${Number(row.price).toFixed(2)}` },
          { key: 'cycle', header: 'Billing Cycle', render: (row) => row.billingCycle },
          { key: 'features', header: 'Features', render: (row) => row.features.join(', ') },
          { key: 'usage', header: 'Plan Usage', render: (row) => row.usageCount || 0 },
          { key: 'status', header: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Button size="sm" variant="outline" onClick={() => deactivatePlan(row.id)}>
                Deactivate
              </Button>
            ),
          },
        ]}
      />

      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Plan">
        <div className="space-y-3">
          <input className="input" placeholder="Plan name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select className="input" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as 'MONTHLY' | 'YEARLY')}>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
          <input
            className="input"
            placeholder="Features comma separated"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <Button onClick={createPlan}>Save Plan</Button>
        </div>
      </AdminModal>
    </div>
  );
}
