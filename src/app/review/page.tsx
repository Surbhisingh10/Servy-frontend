'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

function normalizePhone(phone?: string | null) {
  return (phone || '').replace(/[^\d]/g, '');
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent!',
};

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const restaurantSlug = searchParams.get('restaurant')?.trim() || '';
  const orderNumber = searchParams.get('orderNumber')?.trim() || '';
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [restaurant, setRestaurant] = useState<{ name?: string; phone?: string } | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadRestaurant = async () => {
      if (!restaurantSlug) return;

      try {
        setIsLoadingRestaurant(true);
        const data = await api.getRestaurantBySlug(restaurantSlug);
        if (!ignore) setRestaurant(data);
      } catch {
        if (!ignore) toast.error('Failed to load restaurant details');
      } finally {
        if (!ignore) setIsLoadingRestaurant(false);
      }
    };

    void loadRestaurant();
    return () => { ignore = true; };
  }, [restaurantSlug]);

  const whatsappHref = useMemo(() => {
    const phone = normalizePhone(restaurant?.phone);
    if (!phone || !rating) return '';

    const messageLines = [
      `Review for ${restaurant?.name || 'Restaurant'}`,
      orderNumber ? `Order: ${orderNumber}` : null,
      `Rating: ${rating}/5`,
      notes.trim() ? `Feedback: ${notes.trim()}` : null,
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  }, [notes, orderNumber, rating, restaurant?.name, restaurant?.phone]);

  return (
    <div className="min-h-screen bg-[#f5fbf8] px-4 py-8">
      <div className="mx-auto max-w-md space-y-4">

        {/* Header */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Review</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Rate your experience
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {restaurant?.name || 'The restaurant'} would love to hear how your order went.
          </p>
          {orderNumber && (
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Order {orderNumber}
            </p>
          )}
        </div>

        {/* Rating form */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Your rating</p>

          <div className="mt-4 flex items-center justify-between gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= rating;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                    active
                      ? 'border-amber-300 bg-amber-50 text-amber-500'
                      : 'border-slate-200 bg-slate-50 text-slate-300 hover:border-slate-300 hover:text-slate-400'
                  }`}
                >
                  <Star size={22} fill={active ? 'currentColor' : 'none'} />
                </button>
              );
            })}
          </div>

          <div className="mt-2 h-5 text-center">
            {rating > 0 && (
              <p className="text-sm font-semibold text-amber-600">{RATING_LABELS[rating]}</p>
            )}
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-900">
            Your feedback
          </label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            placeholder="Tell the restaurant what you liked or what could be better."
            className="mt-2 w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          />

          <a
            href={whatsappHref || undefined}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (!rating || !whatsappHref) {
                event.preventDefault();
                toast.error(
                  !rating
                    ? 'Please choose a rating first'
                    : 'Restaurant WhatsApp number is not available',
                );
              }
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[1.3rem] bg-emerald-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            <MessageCircle size={18} />
            Send Review on WhatsApp
          </a>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            {isLoadingRestaurant
              ? 'Loading restaurant details...'
              : 'Your feedback will open in WhatsApp so you can send it directly.'}
          </p>
        </div>

        {restaurantSlug && (
          <Link
            href={`/restaurant/${restaurantSlug}`}
            className="block rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Back to restaurant
          </Link>
        )}
      </div>
    </div>
  );
}
