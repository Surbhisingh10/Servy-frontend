'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowRight, ClipboardList, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { api } from '@/lib/api';
import BottomNav from '@/components/customer/BottomNav';
import { useCartStore } from '@/store/cart-store';

export default function RestaurantLandingPage() {
  const params = useParams();
  const slug = params.slug as string | undefined;
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setRestaurant: setRestaurantInCart, setRestaurantSlug, items } = useCartStore();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const restaurantData = await api.getRestaurantBySlug(slug);
        setRestaurant(restaurantData);
        setRestaurantInCart(restaurantData.id);
        setRestaurantSlug(slug);

        if (typeof window !== 'undefined') {
          localStorage.setItem('restaurantSlug', slug);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [setRestaurantInCart, setRestaurantSlug, slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-sm text-gray-500">Loading restaurant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="space-y-3 text-center">
          <p className="text-sm text-gray-700">{error}</p>
          <Link
            href="/website"
            className="inline-flex rounded-2xl border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:bg-primary-100"
          >
            Open website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        <div className="rounded-[2rem] border border-primary-100 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-500 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          <p className="text-xs uppercase tracking-[0.35em] text-primary-100">Scan to Order</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {restaurant?.name || 'Restaurant'}
          </h1>
          <p className="mt-3 text-sm leading-7 text-primary-50/90">
            Browse the digital menu, place your order, and track it without waiting for table-side service.
          </p>

          <Link
            href={`/restaurant/${slug}/menu`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Start ordering
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-gray-400">Quick actions</p>
            <div className="mt-4 grid gap-3">
              <Link
                href={`/restaurant/${slug}/menu`}
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <UtensilsCrossed size={18} />
                  Browse menu
                </span>
                <ArrowRight size={16} className="text-gray-400" />
              </Link>
              <Link
                href="/checkout"
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <ShoppingBag size={18} />
                  Review cart
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {items.length}
                </span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 transition hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <ClipboardList size={18} />
                  Track orders
                </span>
                <ArrowRight size={16} className="text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="scan" />
    </div>
  );
}
