'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AlertTriangle, ArrowLeft, RefreshCcw, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useInventoryStore } from '@/store/inventory-store';
import type { InventoryItem, StockAdjustmentType } from '@/lib/inventory.service';

const editSchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  unit: z.string().min(1, 'Unit is required'),
  currentQuantity: z.coerce.number().min(0),
  minimumQuantity: z.coerce.number().min(0),
});

const transactionSchema = z.object({
  type: z.enum(['ADD', 'REDUCE']),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  note: z.string().optional(),
});

type EditValues = z.infer<typeof editSchema>;
type TransactionValues = z.infer<typeof transactionSchema>;

function statusClasses(status: InventoryItem['status']) {
  return status === 'LOW'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

export default function InventoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { currentItem, transactions, isLoading, error, fetchItem, updateItem, updateStock, deleteItem, clearCurrentItem } =
    useInventoryStore();
  const [stockModalOpen, setStockModalOpen] = useState(false);

  const itemId = params.id;

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: '',
      unit: '',
      currentQuantity: 0,
      minimumQuantity: 0,
    },
  });

  const transactionForm = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'ADD',
      quantity: 0,
      note: '',
    },
  });

  useEffect(() => {
    if (!itemId) return;
    void fetchItem(itemId);
    return () => clearCurrentItem();
  }, [clearCurrentItem, fetchItem, itemId]);

  useEffect(() => {
    if (!currentItem) return;
    editForm.reset({
      name: currentItem.name,
      unit: currentItem.unit,
      currentQuantity: currentItem.currentQuantity,
      minimumQuantity: currentItem.minimumQuantity,
    });
  }, [currentItem, editForm]);

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (!itemId) return;
    try {
      await updateItem(itemId, values);
      toast.success('Inventory item updated');
    } catch {
      toast.error('Could not update inventory item');
    }
  });

  const onTransactionSubmit = transactionForm.handleSubmit(async (values) => {
    if (!itemId) return;
    try {
      await updateStock(itemId, {
        type: values.type as StockAdjustmentType,
        quantity: values.quantity,
        note: values.note?.trim() || undefined,
      });
      toast.success('Stock updated');
      transactionForm.reset({ type: 'ADD', quantity: 0, note: '' });
      setStockModalOpen(false);
    } catch {
      toast.error('Could not update stock');
    }
  });

  const handleDelete = async () => {
    if (!currentItem) return;
    if (!window.confirm(`Delete ${currentItem.name}?`)) return;
    try {
      await deleteItem(currentItem.id);
      toast.success('Inventory item deleted');
      router.push('/inventory');
    } catch {
      toast.error('Could not delete inventory item');
    }
  };

  if (isLoading && !currentItem) {
    return <div className="py-16 text-center text-slate-500">Loading inventory item...</div>;
  }

  if (!currentItem) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 text-amber-500" size={18} />
          <div>
            <h2 className="font-semibold text-slate-950">Inventory item not found</h2>
            <p className="mt-1 text-sm text-slate-600">The item may have been deleted or you do not have access.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push('/inventory')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to inventory
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => router.push('/inventory')}>
            <ArrowLeft size={14} className="mr-2" />
            Back
          </Button>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">{currentItem.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(currentItem.status)}`}>
              {currentItem.status}
            </span>
            <span className="text-sm text-slate-500">
              {Number(currentItem.currentQuantity).toFixed(2)} {currentItem.unit} available
            </span>
            <span className="text-sm text-slate-500">
              Minimum: {Number(currentItem.minimumQuantity).toFixed(2)} {currentItem.unit}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStockModalOpen(true)}>
            <RefreshCcw size={16} className="mr-2" />
            Adjust stock
          </Button>
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-950">Edit item</h2>
          <p className="mt-1 text-sm text-slate-500">Update the unit, thresholds, or current quantity.</p>

          <form className="mt-6 space-y-5" onSubmit={onEditSubmit}>
            <Input label="Item name" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
            <Input label="Unit" {...editForm.register('unit')} error={editForm.formState.errors.unit?.message} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Current quantity"
                type="number"
                step="0.01"
                {...editForm.register('currentQuantity')}
                error={editForm.formState.errors.currentQuantity?.message}
              />
              <Input
                label="Minimum quantity"
                type="number"
                step="0.01"
                {...editForm.register('minimumQuantity')}
                error={editForm.formState.errors.minimumQuantity?.message}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" isLoading={isLoading}>
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/inventory/add')}>
                Create new item
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-950">History</h2>
          <p className="mt-1 text-sm text-slate-500">Every add or reduce action is saved here.</p>
          <div className="mt-5 space-y-3">
            {transactions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No stock changes yet.
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{transaction.type}</p>
                      <p className="text-sm text-slate-600">
                        {Number(transaction.quantity).toFixed(2)} units
                        {transaction.note ? ` • ${transaction.note}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title="Adjust stock"
        size="md"
      >
        <form className="space-y-4" onSubmit={onTransactionSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Type</span>
              <select
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
                {...transactionForm.register('type')}
              >
                <option value="ADD">Add</option>
                <option value="REDUCE">Reduce</option>
              </select>
            </label>
            <Input
              label="Quantity"
              type="number"
              step="0.01"
              {...transactionForm.register('quantity')}
              error={transactionForm.formState.errors.quantity?.message}
            />
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Note</span>
            <textarea
              rows={4}
              placeholder="Optional note"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
              {...transactionForm.register('note')}
            />
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>
              Save movement
            </Button>
            <Button type="button" variant="outline" onClick={() => setStockModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
