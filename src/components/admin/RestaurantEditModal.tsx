'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminModal from './AdminModal';
import Button from '@/components/ui/Button';

interface RestaurantEditModalProps {
  restaurantId: string;
  initialValues: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
  };
}

export default function RestaurantEditModal({
  restaurantId,
  initialValues,
}: RestaurantEditModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    address: initialValues.address || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    country: initialValues.country || 'US',
    zipCode: initialValues.zipCode || '',
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError('');

    const response = await fetch(`/api/admin/restaurants/${restaurantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!response.ok) {
      const json = await response.json().catch(() => null);
      setError(json?.message || 'Failed to update restaurant');
      return;
    }

    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Restaurant">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Restaurant name" value={form.name} onChange={(e) => update('name', e.target.value)} />
          <input className="input" placeholder="Restaurant email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          <input className="input sm:col-span-2" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} />
          <input className="input" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
          <input className="input" placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
          <input className="input" placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
          <input className="input" placeholder="Zip code" value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)} />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 flex justify-end">
          <Button onClick={submit} isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </AdminModal>
    </>
  );
}
