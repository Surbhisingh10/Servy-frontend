'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  BookOpen,
  Box,
  PencilLine,
  Plus,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { api } from '@/lib/api';
import type { InventoryItem, InventoryMode, StockAdjustmentType } from '@/lib/inventory.service';
import { inventoryService } from '@/lib/inventory.service';
import { useInventoryStore } from '@/store/inventory-store';

const stockSchema = z.object({
  type: z.enum(['ADD', 'REDUCE']),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  note: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

function statusClasses(status: InventoryItem['status']) {
  return status === 'LOW'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

interface Outlet {
  id: string;
  name: string;
  isPrimary?: boolean;
}

export default function InventoryPage() {
  const router = useRouter();
  const { items, isLoading, error, fetchItems, deleteItem, updateStock } = useInventoryStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('ALL');
  const [stockItem, setStockItem] = useState<InventoryItem | null>(null);
  const [inventoryMode, setInventoryMode] = useState<InventoryMode>('MANUAL');
  const [switchingMode, setSwitchingMode] = useState(false);

  const stockForm = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      type: 'ADD',
      quantity: 0,
      note: '',
    },
  });

  const allowAllOutlets = true;

  useEffect(() => {
    const loadOutlets = async () => {
      try {
        const [data, mode] = await Promise.all([
          api.getOutlets(),
          inventoryService.getInventoryMode(),
        ]);
        setOutlets(Array.isArray(data) ? data : []);
        setInventoryMode(mode);

        const stored =
          typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') : null;
        if (stored) {
          setSelectedOutletId(stored);
          return;
        }

        setSelectedOutletId('ALL');
      } catch {
        setOutlets([]);
      }
    };

    void loadOutlets();
  }, []);

  useEffect(() => {
    void fetchItems(selectedOutletId);
  }, [fetchItems, selectedOutletId]);

  const handleModeSwitch = async (next: InventoryMode) => {
    if (next === inventoryMode || switchingMode) return;
    setSwitchingMode(true);
    try {
      const updated = await inventoryService.setInventoryMode(next);
      setInventoryMode(updated);
      toast.success(
        updated === 'RECIPE_BASED'
          ? 'Switched to Recipe-Based Auto Deduction'
          : 'Switched to Manual Inventory Management',
      );
    } catch {
      toast.error('Failed to switch mode');
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      await deleteItem(id);
      toast.success('Inventory item deleted');
    } catch {
      toast.error('Could not delete item');
    }
  };

  const openAdjustModal = (item: InventoryItem) => {
    setStockItem(item);
    stockForm.reset({
      type: 'ADD',
      quantity: 0,
      note: '',
    });
  };

  const closeAdjustModal = () => {
    setStockItem(null);
  };

  const submitStockUpdate = stockForm.handleSubmit(async (values) => {
    if (!stockItem) return;

    try {
      await updateStock(stockItem.id, {
        type: values.type as StockAdjustmentType,
        quantity: values.quantity,
        note: values.note?.trim() || undefined,
      });
      toast.success('Stock updated');
      setStockItem(null);
    } catch {
      toast.error('Could not update stock');
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manual stock control</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            View current stock, track reductions, and catch low items before they slow service down.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Outlet filter
            </span>
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
              className="min-w-56 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[color:var(--accent)]"
            >
              {allowAllOutlets ? <option value="ALL">All outlets</option> : null}
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                  {outlet.isPrimary ? ' (Primary)' : ''}
                </option>
              ))}
            </select>
          </label>
          <Link href="/inventory/recipes">
            <Button variant="outline" className="whitespace-nowrap">
              <BookOpen size={16} className="mr-2" />
              Recipes
            </Button>
          </Link>
          <Button className="whitespace-nowrap" onClick={() => router.push('/inventory/add')}>
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Inventory mode toggle */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-900">Inventory Mode</p>
            <p className="text-sm text-slate-500 mt-0.5">
              {inventoryMode === 'RECIPE_BASED'
                ? 'Stock auto-deducts when orders are placed using linked recipes'
                : 'Update stock manually via transactions'}
            </p>
          </div>
          <div className="flex rounded-xl overflow-hidden border border-slate-200 shrink-0">
            <button
              onClick={() => void handleModeSwitch('MANUAL')}
              disabled={switchingMode}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                inventoryMode === 'MANUAL'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => void handleModeSwitch('RECIPE_BASED')}
              disabled={switchingMode}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                inventoryMode === 'RECIPE_BASED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Recipe-Based
            </button>
          </div>
        </div>
        {inventoryMode === 'RECIPE_BASED' && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            <BookOpen size={14} className="shrink-0" />
            Recipe-based deduction is active. Ensure menu items have linked recipes.
            <Link href="/inventory/recipes" className="ml-auto font-medium underline">
              Manage Recipes →
            </Link>
          </div>
        )}
      </Card>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Stock list</h2>
              <p className="text-sm text-slate-500">Green means healthy. Red means the item needs attention.</p>
            </div>
            <div className="text-sm text-slate-500">{items.length} items</div>
          </div>
        </div>

        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-500">Loading inventory...</div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Box size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-950">No inventory items yet</h3>
            <p className="mt-2 text-sm text-slate-500">Add your first item to start tracking manual stock.</p>
            <Button className="mt-6" onClick={() => router.push('/inventory/add')}>
              <Plus size={16} className="mr-2" />
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Minimum</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Outlet</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-950">{item.name}</p>
                        <p className="text-xs text-slate-500">Updated {new Date(item.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {Number(item.currentQuantity).toFixed(2)} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {Number(item.minimumQuantity).toFixed(2)} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.outlet?.name || 'All outlets'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => openAdjustModal(item)}
                        >
                          <RefreshCcw size={14} className="mr-2" />
                          Adjust
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => router.push(`/inventory/${item.id}`)}
                        >
                          <PencilLine size={14} className="mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => void handleDelete(item.id, item.name)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={Boolean(stockItem)}
        onClose={closeAdjustModal}
        title={stockItem ? `Adjust stock: ${stockItem.name}` : 'Adjust stock'}
        size="md"
      >
        <form className="space-y-4" onSubmit={submitStockUpdate}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Movement type</span>
              <select
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
                {...stockForm.register('type')}
              >
                <option value="ADD">Add stock</option>
                <option value="REDUCE">Reduce stock</option>
              </select>
            </label>
            <Input
              label="Quantity"
              type="number"
              step="0.01"
              {...stockForm.register('quantity')}
              error={stockForm.formState.errors.quantity?.message}
            />
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Note</span>
            <textarea
              rows={4}
              placeholder="Optional note"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
              {...stockForm.register('note')}
            />
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              Save movement
            </Button>
            <Button type="button" variant="outline" onClick={closeAdjustModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
