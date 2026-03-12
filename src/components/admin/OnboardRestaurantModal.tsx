'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AdminModal from './AdminModal';
import { Plan } from '@/lib/admin-types';

interface OnboardRestaurantModalProps {
  plans: Plan[];
}

const initialState = {
  name: '',
  slug: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'US',
  zipCode: '',
  ownerFirstName: '',
  ownerLastName: '',
  ownerEmail: '',
  ownerPassword: '',
  ownerPhone: '',
  planId: '',
  trialDays: '14',
};

export default function OnboardRestaurantModal({ plans }: OnboardRestaurantModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof typeof initialState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        trialDays: Number(form.trialDays || 0),
        planId: form.planId || undefined,
      }),
    });
    setLoading(false);

    if (!response.ok) {
      const json = await response.json().catch(() => null);
      setError(json?.message || 'Failed to onboard restaurant');
      return;
    }

    setIsOpen(false);
    setForm(initialState);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Onboard Restaurant</Button>
      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Onboard Restaurant">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Restaurant name*" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input className="input" placeholder="Slug (optional)" value={form.slug} onChange={(e) => update('slug', e.target.value)} />
          <input className="input" placeholder="Restaurant email*" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input className="input" placeholder="Restaurant phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <input className="input sm:col-span-2" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          <input className="input" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <input className="input" placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
          <input className="input" placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
          <input className="input" placeholder="Zip code" value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)} />
          <input className="input" placeholder="Owner first name*" value={form.ownerFirstName} onChange={(e) => update('ownerFirstName', e.target.value)} />
          <input className="input" placeholder="Owner last name" value={form.ownerLastName} onChange={(e) => update('ownerLastName', e.target.value)} />
          <input className="input" placeholder="Owner email*" value={form.ownerEmail} onChange={(e) => update('ownerEmail', e.target.value)} />
          <input className="input" placeholder="Owner phone" value={form.ownerPhone} onChange={(e) => update('ownerPhone', e.target.value)} />
          <input className="input" type="password" placeholder="Owner password*" value={form.ownerPassword} onChange={(e) => update('ownerPassword', e.target.value)} />
          <input className="input" type="number" min={0} placeholder="Trial days" value={form.trialDays} onChange={(e) => update('trialDays', e.target.value)} />
          <select className="input sm:col-span-2" value={form.planId} onChange={(e) => update('planId', e.target.value)}>
            <option value="">No plan now (trial only)</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ${Number(plan.price).toFixed(2)} / {plan.billingCycle.toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 flex justify-end">
          <Button onClick={submit} isLoading={loading}>
            Create Restaurant
          </Button>
        </div>
      </AdminModal>
    </>
  );
}
