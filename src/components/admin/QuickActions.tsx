'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function QuickActions() {
  const [message, setMessage] = useState('');

  const sendPromotion = async () => {
    const response = await fetch('/api/admin/actions/send-promotion', { method: 'POST' });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || 'Action complete');
  };

  const exportReport = async () => {
    window.open('/api/admin/reports/export?type=revenue', '_blank');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={sendPromotion}>
          Send promotion
        </Button>
        <Button size="sm" variant="outline" onClick={exportReport}>
          Export report
        </Button>
      </div>
      {message ? <p className="mt-2 text-xs text-gray-500">{message}</p> : null}
    </div>
  );
}
