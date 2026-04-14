'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowRight, ClipboardList, HelpCircle, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { api } from '@/lib/api';
import BottomNav from '@/components/customer/BottomNav';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';

const supportRequestOptions = [
  { label: 'Call Waiter', value: 'WAITER', priority: 'HIGH' },
  { label: 'Bill', value: 'BILL', priority: 'MEDIUM' },
  { label: 'Water', value: 'WATER', priority: 'LOW' },
  { label: 'Cleaning', value: 'CLEANING', priority: 'MEDIUM' },
] as const;

export default function RestaurantLandingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string | undefined;
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequestingSupport, setIsRequestingSupport] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<
    (typeof supportRequestOptions)[number]['value']
  >('WAITER');
  const {
    setRestaurant: setRestaurantInCart,
    setRestaurantSlug,
    setQrContext,
    tableNumber,
    qrCodeId,
    qrCode,
    items,
  } = useCartStore();

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

        const qrCode = searchParams.get('qr')?.trim();
        if (qrCode) {
          const resolvedQr = await api.getQrCodeByCode(qrCode, restaurantData.id);
          if (resolvedQr?.id) {
            setQrContext({
              qrCodeId: resolvedQr.id,
              qrCode,
              tableNumber: resolvedQr.tableNumber,
              outletId: resolvedQr.outletId || undefined,
            });
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [searchParams, setQrContext, setRestaurantInCart, setRestaurantSlug, slug]);

  const handleSupportRequest = async () => {
    if (!slug) {
      toast.error('Restaurant context is missing');
      return;
    }

    if (!qrCodeId) {
      toast.error('A valid table QR is required. Please scan the table QR again.');
      return;
    }

    setIsRequestingSupport(true);
    try {
      const selectedOption = supportRequestOptions.find((option) => option.value === selectedRequestType);
      const request = await api.createSupportRequest(
        {
          qrCodeId,
          requestType: selectedRequestType,
          priority: selectedOption?.priority || 'MEDIUM',
        },
        slug,
      );

      const requestTime = new Date(request.requestedAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
      toast.success(`${selectedOption?.label || 'Request'} sent for Table ${request.tableNumber} at ${requestTime}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to request support');
    } finally {
      setIsRequestingSupport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5fbf8] px-4">
        <p className="text-sm text-gray-500">Loading restaurant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5fbf8] px-4">
        <div className="space-y-3 text-center">
          <p className="text-sm text-gray-700">{error}</p>
          <Link
            href="/website"
            className="inline-flex rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            Open website
          </Link>
        </div>
      </div>
    );
  }

  const qrQuery = qrCode ? `?qr=${encodeURIComponent(qrCode)}` : '';
  const cartPath = `/checkout${qrQuery}`;

  return (
    <div className="min-h-screen bg-[#f5fbf8] pb-24 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-3 py-4 sm:px-4 sm:py-6">
        <header className="mb-4 rounded-[1.75rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50">
              {restaurant?.logo ? (
                <Image
                  src={restaurant.logo}
                  alt={restaurant?.name || 'Restaurant logo'}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <span className="text-lg font-semibold text-emerald-700">
                  {(restaurant?.name || 'R').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Restaurant</p>
              <h1 className="mt-1 text-lg font-semibold text-slate-900">
                {restaurant?.name || 'Restaurant'}
              </h1>
            </div>
          </div>
        </header>

        <div className="rounded-[1.75rem] border border-emerald-100 bg-[linear-gradient(135deg,#059669_0%,#0f766e_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:rounded-[2rem] sm:p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">Scan to Order</p>
          {tableNumber && (
            <span className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              Table {tableNumber}
            </span>
          )}
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/90 sm:max-w-sm sm:leading-7">
            Browse the digital menu, place your order, and track it without waiting for table-side service.
          </p>

          <Link
            href={`/restaurant/${slug}/menu${qrQuery}`}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:mt-8 sm:w-auto"
          >
            Start ordering
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Quick actions</p>
            <div className="mt-4 grid gap-3">
              <Link
                href={`/restaurant/${slug}/menu${qrQuery}`}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <UtensilsCrossed size={18} />
                  Browse menu
                </span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href={cartPath}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <ShoppingBag size={18} />
                  Review cart
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {items.length}
                </span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <ClipboardList size={18} />
                  Track orders
                </span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-white text-slate-900">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <p className="text-[1.2rem] font-semibold leading-none text-slate-900 sm:text-[1.35rem]">
                    Need Help?
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Call restaurant support or request assistance at your table
                  </p>
                  {tableNumber && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                      Table {tableNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full space-y-3 sm:w-auto">
                <select
                  value={selectedRequestType}
                  onChange={(event) =>
                    setSelectedRequestType(
                      event.target.value as (typeof supportRequestOptions)[number]['value'],
                    )
                  }
                  className="w-full rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  {supportRequestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSupportRequest}
                  className="w-full shrink-0 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  {isRequestingSupport ? 'Sending...' : 'Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="scan" restaurantSlug={slug} />
    </div>
  );
}
