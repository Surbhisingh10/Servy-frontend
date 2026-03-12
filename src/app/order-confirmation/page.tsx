'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import BottomNav from '@/components/customer/BottomNav';

interface LastOrder {
  orderNumber: string;
  items: Array<{ menuItemId: string; name: string; quantity: number; price: number }>;
  subtotal: number;
  serviceTax: number;
  gratuity: number;
  total: number;
  table?: string;
  orderType?: 'DINE_IN' | 'TAKEAWAY';
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderNumber = params.get('orderNumber') || '-';
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      try {
        setLastOrder(JSON.parse(stored));
      } catch {
        setLastOrder(null);
      }
    }
  }, []);

  const items = lastOrder?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-gray-600 transition hover:border-primary-500 hover:text-primary-700"
          >
            <ArrowLeft size={18} />
            <span className="sr-only">Back</span>
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Confirmation</p>
            <h1 className="text-2xl font-semibold text-gray-900">Order Confirmed</h1>
          </div>
        </header>

        <section className="space-y-3 rounded-3xl border border-gray-200 bg-white/95 p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 text-gray-900">
            <CheckCircle2 size={28} />
          </div>
          <p className="text-lg font-semibold">Order Confirmed</p>
          <p className="text-sm text-gray-500">
            Your order has been sent to the kitchen.
            {lastOrder?.orderType === 'DINE_IN' && lastOrder.table
              ? ` Please stay at Table ${lastOrder.table}.`
              : ''}
          </p>
        </section>

        <section className="space-y-2 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-gray-400">
            <span>Order ID</span>
            <span>Est. time</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold text-gray-900">
            <span>#{orderNumber}</span>
            <span>15-20m</span>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Order summary</p>
            <p className="text-xs font-semibold text-gray-500">{items.length} gathered</p>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {item.quantity} x
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {inrFormatter.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{inrFormatter.format(lastOrder?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Tax</span>
              <span>{inrFormatter.format(lastOrder?.serviceTax || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity</span>
              <span>{inrFormatter.format(lastOrder?.gratuity || 0)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-lg font-bold text-gray-900">
            <span>Total charged</span>
            <span>{inrFormatter.format(lastOrder?.total || 0)}</span>
          </div>
        </section>

        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push('/')}
        >
          Place New Order
        </Button>
      </div>

      <BottomNav active="orders" />
    </div>
  );
}
