'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Star } from 'lucide-react';
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
  paymentStatus?: 'PENDING' | 'PAID';
  paymentMethod?: 'UPI' | 'CARD' | 'WALLET' | 'ONLINE';
  restaurantSlug?: string;
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
  const orderAgainHref = lastOrder?.restaurantSlug
    ? `/restaurant/${lastOrder.restaurantSlug}/menu`
    : '/';

  const reviewHref = lastOrder?.restaurantSlug
    ? `/review?restaurant=${lastOrder.restaurantSlug}&orderNumber=${encodeURIComponent(orderNumber)}`
    : null;

  return (
    <div className="min-h-screen bg-[#f5fbf8] pb-24 text-slate-900">
      <div className="mx-auto max-w-md space-y-4 px-4 py-8">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Confirmation</p>
            <h1 className="text-xl font-semibold text-slate-900">Order placed</h1>
          </div>
        </header>

        {/* Success */}
        <div className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_8px_24px_rgba(5,150,105,0.35)]">
            <CheckCircle2 size={30} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Order confirmed!</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {lastOrder?.orderType === 'TAKEAWAY'
              ? 'Payment confirmed. Your order is headed to the kitchen.'
              : 'Your order is in the kitchen.'}
            {lastOrder?.orderType === 'DINE_IN' && lastOrder.table
              ? ` Stay at Table ${lastOrder.table}.`
              : ''}
          </p>
        </div>

        {/* Order ID + time */}
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Order ID</p>
              <p className="mt-1 text-xl font-bold text-slate-950">#{orderNumber}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              ~15–20 min
            </span>
          </div>
        </div>

        {/* Bill summary */}
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Order summary</p>
            <span className="text-xs text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-400">qty {item.quantity}</p>
                </div>
                <span className="shrink-0 font-semibold text-slate-900">
                  {inrFormatter.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(lastOrder?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service tax</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(lastOrder?.serviceTax || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(lastOrder?.gratuity || 0)}</span>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Payment</span>
              <span className="font-semibold text-slate-900">
                {lastOrder?.orderType === 'TAKEAWAY'
                  ? `Paid via ${lastOrder.paymentMethod || 'card'}`
                  : 'Pay after meal'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-950">
            <span>{lastOrder?.orderType === 'TAKEAWAY' ? 'Total charged' : 'Total bill'}</span>
            <span>{inrFormatter.format(lastOrder?.total || 0)}</span>
          </div>
        </div>

        {/* Actions */}
        <Button className="w-full" size="lg" onClick={() => router.push(orderAgainHref)}>
          Place New Order
        </Button>

        {reviewHref && (
          <Link
            href={reviewHref}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <Star size={15} />
            Leave a Review
          </Link>
        )}
      </div>

      <BottomNav active="orders" />
    </div>
  );
}
