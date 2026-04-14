'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Pencil, X, Check, Building2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';

interface Outlet {
  id: string;
  name: string;
  code?: string;
  city?: string;
  state?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  _count?: {
    orders: number;
    customers: number;
  };
}

interface OutletFormData {
  name: string;
  code: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const emptyForm: OutletFormData = { name: '', code: '', phone: '', address: '', city: '', state: '', zipCode: '' };

export default function OutletsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [createForm, setCreateForm] = useState<OutletFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OutletFormData>(emptyForm);
  const [editSaving, setEditSaving] = useState(false);

  const loadOutlets = async () => {
    try {
      setLoading(true);
      const data = await api.getOutlets();
      setOutlets(data);
    } catch {
      toast.error('Failed to load outlets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutlets();
  }, []);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error('Outlet name is required');
      return;
    }
    try {
      setSaving(true);
      await api.createOutlet({
        name: createForm.name.trim(),
        code: createForm.code.trim() || undefined,
        phone: createForm.phone.trim() || undefined,
        address: createForm.address.trim() || undefined,
        city: createForm.city.trim() || undefined,
        state: createForm.state.trim() || undefined,
        zipCode: createForm.zipCode.trim() || undefined,
      });
      toast.success('Outlet created');
      setCreateForm(emptyForm);
      await loadOutlets();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to create outlet');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (outlet: Outlet) => {
    setEditingId(outlet.id);
    setEditForm({
      name: outlet.name || '',
      code: outlet.code || '',
      phone: outlet.phone || '',
      address: outlet.address || '',
      city: outlet.city || '',
      state: outlet.state || '',
      zipCode: outlet.zipCode || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleDelete = async (outlet: Outlet) => {
    if (!window.confirm(`Delete "${outlet.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteOutlet(outlet.id);
      toast.success('Outlet deleted');
      await loadOutlets();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete outlet');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      toast.error('Outlet name is required');
      return;
    }
    try {
      setEditSaving(true);
      await api.updateOutlet(id, {
        name: editForm.name.trim(),
        code: editForm.code.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        address: editForm.address.trim() || undefined,
        city: editForm.city.trim() || undefined,
        state: editForm.state.trim() || undefined,
        zipCode: editForm.zipCode.trim() || undefined,
      });
      toast.success('Outlet updated');
      setEditingId(null);
      await loadOutlets();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to update outlet');
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-[24px] bg-emerald-50/80 px-6 py-5 ring-1 ring-emerald-200/60 dark:bg-[#0d1f17] dark:ring-0">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.12] blur-3xl dark:bg-emerald-500/[0.07]" />
        <p className="relative text-[10px] font-semibold uppercase tracking-[0.38em] text-emerald-600 dark:text-emerald-400">Multi-location</p>
        <h1 className="relative mt-1 text-xl font-bold text-slate-900 dark:text-white">Outlets</h1>
        <p className="relative mt-0.5 text-xs text-slate-500">
          {outlets.length} location{outlets.length !== 1 ? 's' : ''} under this organisation
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {/* ── Outlets list ── */}
        <section className="rounded-[20px] border border-slate-200/70 bg-white p-5 dark:border-white/[0.07] dark:bg-[#0d1f17]"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Existing Outlets</h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {outlets.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={24} />
            </div>
          ) : outlets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 dark:border-white/[0.07]">
              <Building2 size={28} className="mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500">No outlets yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {outlets.map((outlet) => (
                <article
                  key={outlet.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/50 dark:border-white/[0.07] dark:bg-white/[0.03]"
                >
                  {editingId === outlet.id ? (
                    /* ── Edit form ── */
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Name"
                          value={editForm.name}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        />
                        <Input
                          label="Code"
                          value={editForm.code}
                          onChange={(e) => setEditForm((p) => ({ ...p, code: e.target.value }))}
                        />
                        <Input
                          label="Phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                        <Input
                          label="Address"
                          value={editForm.address}
                          onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                        />
                        <Input
                          label="City"
                          value={editForm.city}
                          onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                        />
                        <Input
                          label="State"
                          value={editForm.state}
                          onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                        />
                        <Input
                          label="Zip Code"
                          value={editForm.zipCode}
                          onChange={(e) => setEditForm((p) => ({ ...p, zipCode: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleUpdate(outlet.id)}
                          disabled={editSaving}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-60 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                        >
                          {editSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Read view ── */
                    <div className="flex items-start justify-between gap-4 p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{outlet.name}</h3>
                          {outlet.isPrimary && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                              Primary
                            </span>
                          )}
                          {outlet.isActive === false && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-500/15 dark:text-slate-400">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {[outlet.address, outlet.city, outlet.state].filter(Boolean).join(', ') || 'Location pending'}
                        </p>
                        {outlet.phone && <p className="mt-0.5 text-xs text-slate-400">{outlet.phone}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{outlet._count?.orders ?? 0} orders</p>
                          <p className="text-xs text-slate-500">{outlet._count?.customers ?? 0} customers</p>
                        </div>
                        <button
                          onClick={() => startEdit(outlet)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                          title="Edit outlet"
                        >
                          <Pencil size={13} />
                        </button>
                        {!outlet.isPrimary && (
                          <button
                            onClick={() => handleDelete(outlet)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:border-red-500/20 dark:bg-white/5 dark:text-red-400/70 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            title="Delete outlet"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── Create outlet ── */}
        <section className="rounded-[20px] border border-slate-200/70 bg-white p-5 dark:border-white/[0.07] dark:bg-[#0d1f17]"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div className="mb-4 flex items-center gap-2">
            <Plus size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add Outlet</h2>
          </div>
          <div className="space-y-3">
            <Input
              label="Outlet Name"
              value={createForm.name}
              onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Code"
              value={createForm.code}
              onChange={(e) => setCreateForm((p) => ({ ...p, code: e.target.value }))}
            />
            <Input
              label="Phone"
              value={createForm.phone}
              onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="Address"
              value={createForm.address}
              onChange={(e) => setCreateForm((p) => ({ ...p, address: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                value={createForm.city}
                onChange={(e) => setCreateForm((p) => ({ ...p, city: e.target.value }))}
              />
              <Input
                label="State"
                value={createForm.state}
                onChange={(e) => setCreateForm((p) => ({ ...p, state: e.target.value }))}
              />
            </div>
            <Input
              label="Zip Code"
              value={createForm.zipCode}
              onChange={(e) => setCreateForm((p) => ({ ...p, zipCode: e.target.value }))}
            />
            <Button className="w-full" onClick={handleCreate} isLoading={saving}>
              Create Outlet
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
