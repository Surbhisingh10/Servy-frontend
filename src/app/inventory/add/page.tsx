'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useInventoryStore } from '@/store/inventory-store';
import { api } from '@/lib/api';

const inventorySchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  unit: z.string().min(1, 'Unit is required'),
  currentQuantity: z.coerce.number().min(0, 'Current quantity must be 0 or more'),
  minimumQuantity: z.coerce.number().min(0, 'Minimum quantity must be 0 or more'),
  outletId: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface Outlet {
  id: string;
  name: string;
  isPrimary?: boolean;
}

export default function AddInventoryPage() {
  const router = useRouter();
  const { createItem, isLoading } = useInventoryStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('ALL');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      unit: '',
      currentQuantity: 0,
      minimumQuantity: 0,
      outletId: 'ALL',
    },
  });

  useEffect(() => {
    const loadOutlets = async () => {
      try {
        const data = await api.getOutlets();
        const nextOutlets = Array.isArray(data) ? data : [];
        setOutlets(nextOutlets);

        const stored =
          typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') : null;
        setSelectedOutletId(stored || 'ALL');
      } catch {
        setOutlets([]);
      }
    };

    void loadOutlets();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const outletId = selectedOutletId && selectedOutletId !== 'ALL' ? selectedOutletId : undefined;
      const item = await createItem({
        name: values.name,
        unit: values.unit,
        currentQuantity: values.currentQuantity,
        minimumQuantity: values.minimumQuantity,
        outletId,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('selected_outlet_id', selectedOutletId);
        window.dispatchEvent(new Event('selected-outlet-changed'));
      }
      toast.success('Inventory item created');
      router.push('/inventory');
    } catch {
      toast.error('Could not create inventory item');
    }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
          Inventory
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Add stock item</h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep it simple: name, unit, current stock, minimum threshold, and outlet.
        </p>
      </div>

      <Card className="p-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          <Input label="Item name" placeholder="Basmati Rice" {...register('name')} error={errors.name?.message} />
          <Input label="Unit" placeholder="kg / pcs / l" {...register('unit')} error={errors.unit?.message} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current quantity"
              type="number"
              step="0.01"
              {...register('currentQuantity')}
              error={errors.currentQuantity?.message}
            />
            <Input
              label="Minimum quantity"
              type="number"
              step="0.01"
              {...register('minimumQuantity')}
              error={errors.minimumQuantity?.message}
            />
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Outlet</span>
            <select
              value={selectedOutletId}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSelectedOutletId(nextValue);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('selected_outlet_id', nextValue);
                  window.dispatchEvent(new Event('selected-outlet-changed'));
                }
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
            >
              <option value="ALL">All outlets</option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                  {outlet.isPrimary ? ' (Primary)' : ''}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              Save item
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/inventory')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
