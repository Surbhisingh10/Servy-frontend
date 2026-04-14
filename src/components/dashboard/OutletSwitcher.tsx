'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

interface Outlet {
  id: string;
  name: string;
  isPrimary?: boolean;
}

export default function OutletSwitcher() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState('ALL');

  useEffect(() => {
    const loadOutlets = async () => {
      if (!user?.restaurantId) return;

      const data = await api.getOutlets();
      setOutlets(data);

      const stored =
        typeof window !== 'undefined' ? localStorage.getItem('selected_outlet_id') : null;
      if (stored) {
        setSelectedOutletId(stored);
        return;
      }

      if (user.outletId && !['OWNER', 'ADMIN'].includes(user.role)) {
        setSelectedOutletId(user.outletId);
        localStorage.setItem('selected_outlet_id', user.outletId);
        return;
      }

      setSelectedOutletId('ALL');
    };

    loadOutlets().catch(() => undefined);
  }, [user?.restaurantId, user?.outletId, user?.role]);

  if (!user) return null;

  const allowAllOutlets = ['OWNER', 'ADMIN'].includes(user.role);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)] backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
        <Building2 size={14} />
        Outlet
      </div>
      <select
        value={selectedOutletId}
        onChange={(event) => {
          const nextValue = event.target.value;
          setSelectedOutletId(nextValue);
          localStorage.setItem('selected_outlet_id', nextValue);
          window.dispatchEvent(new Event('selected-outlet-changed'));
          router.refresh();
        }}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary-500"
      >
        {allowAllOutlets && <option value="ALL">All Outlets</option>}
        {outlets.map((outlet) => (
          <option key={outlet.id} value={outlet.id}>
            {outlet.name}
            {outlet.isPrimary ? ' (Primary)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
