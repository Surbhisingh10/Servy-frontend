'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Info, Minus, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';

interface MenuItemDetail {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  tags?: string[];
  preparationTime?: number;
  customizations?: any;
}

function normalizeGroups(customizations: any) {
  if (Array.isArray(customizations)) {
    return customizations;
  }

  if (Array.isArray(customizations?.groups)) {
    return customizations.groups;
  }

  if (Array.isArray(customizations?.options)) {
    return [
      {
        name: 'Options',
        required: false,
        options: customizations.options,
      },
    ];
  }

  return [];
}

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const itemId = params.itemId as string;
  const [item, setItem] = useState<MenuItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [specialNote, setSpecialNote] = useState('');
  const { addItem, items, setQrContext, updateQuantity } = useCartStore();

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const data = await api.getMenuItem(slug, itemId);
        setItem({
          ...data,
          price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
        });

        const scannedQrCode = searchParams.get('qr')?.trim();
        if (scannedQrCode) {
          const restaurant = await api.getRestaurantBySlug(slug);
          const resolvedQr = await api.getQrCodeByCode(scannedQrCode, restaurant.id);
          if (resolvedQr?.id) {
            setQrContext({
              qrCodeId: resolvedQr.id,
              qrCode: scannedQrCode,
              tableNumber: resolvedQr.tableNumber,
              outletId: resolvedQr.outletId || undefined,
            });
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load item');
        router.push(`/restaurant/${slug}/menu`);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId, router, searchParams, setQrContext, slug]);

  const groups = useMemo(() => normalizeGroups(item?.customizations), [item?.customizations]);
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
  const price = Number(item?.price) || 0;
  const visibleTags = (item?.tags || []).filter(
    (tag) => !['veg', 'vegetarian'].includes(tag.toLowerCase()),
  );
  const cartCount = items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const currentCartItem = items.find((cartItem) => cartItem.menuItemId === item?.id);
  const currentCartQuantity = currentCartItem?.quantity || 0;

  useEffect(() => {
    if (currentCartQuantity > 0) {
      setQuantity(currentCartQuantity);
    }
  }, [currentCartQuantity]);

  const handleAddToCart = () => {
    if (!item) return;

    if (currentCartQuantity > 0) {
      updateQuantity(item.id, quantity);
      toast.success(`${item.name} quantity updated`);
    } else {
      addItem({
        menuItemId: item.id,
        name: item.name,
        price,
        quantity,
        image: item.image,
        customizations: Object.keys(selectedOptions).length ? selectedOptions : undefined,
        specialNote: specialNote.trim() || undefined,
      });
      toast.success(`${item.name} added to cart`);
    }

    router.push(`/restaurant/${slug}/menu`);
  };

  if (loading || !item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-sm text-gray-500">Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32 text-slate-900">
      <header className="sticky top-0 z-20 bg-stone-50/95 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-[1.35rem] border border-stone-200 bg-white px-3 py-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-2 text-slate-700 transition hover:bg-white"
            >
              <ArrowLeft size={18} />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 sm:text-sm sm:tracking-[0.28em]">
              Item detail
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="relative rounded-full border border-stone-200 bg-white p-2 text-slate-700 shadow-sm"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-3 sm:px-4">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-stone-200 sm:h-[23rem]">
          <div className="relative h-[15rem] sm:h-[23rem]">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-400">
              <UtensilsCrossed size={42} />
            </div>
          )}
          </div>

          <div className="absolute bottom-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2 sm:bottom-4 sm:left-4">
            {(visibleTags.length > 0
              ? visibleTags
              : ['Chef Pick', item.isVeg ? 'Vegetarian' : 'Signature']
            )
              .slice(0, 2)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        <div className="bg-stone-50 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold leading-7 tracking-tight text-slate-900 sm:text-2xl sm:leading-tight">
                {item.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-stone-500 sm:mt-3 sm:gap-3">
                <span>{item.isVeg ? 'Vegetarian' : 'Chef special'}</span>
                <span>|</span>
                <span>Approx. {item.preparationTime || 20} mins</span>
              </div>
            </div>
            <span className="text-xl font-semibold text-slate-900 sm:text-2xl">
              {inrFormatter.format(price)}
            </span>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4 text-sm leading-6 text-stone-500 shadow-sm sm:mt-6 sm:rounded-[1.75rem] sm:px-5 sm:py-5 sm:text-base sm:leading-8">
            {item.description ||
              'A chef-crafted dish prepared fresh to order with premium ingredients.'}
          </div>

          <section className="mt-7">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
              Quantity
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {currentCartQuantity > 0
                ? `Current cart quantity: ${currentCartQuantity}`
                : 'Choose how many you want to add'}
            </p>

            <div className="mt-4 flex flex-col gap-3 rounded-[1.2rem] border border-stone-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span className="text-sm font-medium text-stone-500">
                {currentCartQuantity > 0
                  ? `Add quantity (${currentCartQuantity} in cart)`
                  : 'Selected quantity'}
              </span>
              <div className="inline-flex items-center justify-between gap-4 self-stretch rounded-full border border-stone-200 bg-stone-50 px-4 py-2 sm:self-auto sm:gap-6 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-full p-1 text-lg font-semibold text-stone-500 transition hover:bg-white hover:text-slate-900"
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-6 text-center text-xl font-semibold text-slate-900 sm:text-2xl">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full p-1 text-lg font-semibold text-stone-500 transition hover:bg-white hover:text-slate-900"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-7 space-y-4 sm:space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
              Customization
            </p>

            {groups.length > 0 ? (
              groups.map((group: any, index: number) => (
                <div
                  key={`${group.name || 'group'}-${index}`}
                  className="rounded-[1.6rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-900 sm:text-xl">
                      {group.name || `Option ${index + 1}`}
                    </p>
                    <p className="mt-1 text-sm text-stone-400">
                      {group.required ? 'Required' : 'Optional'}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(group.options || []).map((option: any, optionIndex: number) => {
                      const optionLabel =
                        typeof option === 'string'
                          ? option
                          : option?.label || option?.name || `Choice ${optionIndex + 1}`;
                      const isSelected =
                        selectedOptions[group.name || `group-${index}`] === optionLabel;

                      return (
                        <button
                          key={`${optionLabel}-${optionIndex}`}
                          type="button"
                          onClick={() =>
                            setSelectedOptions((current) => ({
                              ...current,
                              [group.name || `group-${index}`]: optionLabel,
                            }))
                          }
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 text-primary-800'
                              : 'border-stone-200 bg-white text-slate-900 hover:border-stone-300'
                          }`}
                        >
                          <span className="font-medium">{optionLabel}</span>
                          {typeof option === 'object' && option?.recommended && (
                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                              Recommended
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.6rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-sm text-stone-500">
                  No item-specific customizations for this dish.
                </p>
              </div>
            )}
          </section>

          <section className="mt-7">
            <label className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-900">
              Notes
            </label>
            <textarea
              value={specialNote}
              onChange={(event) => setSpecialNote(event.target.value)}
              placeholder="Any special requests?"
              rows={3}
              className="mt-4 w-full rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-primary-500"
            />
          </section>

          <div className="mt-7 rounded-[1.5rem] border border-dashed border-stone-300 bg-white px-4 py-4 text-sm leading-6 text-stone-500">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 text-stone-400" />
              <p>
                Contains dietary and preparation details when available. Please inform the
                restaurant staff about any allergies or intolerances before ordering.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-stone-50/95 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
        <div className="mx-auto max-w-md rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-[1.2rem] bg-slate-900 px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-black sm:rounded-[1.35rem] sm:py-4 sm:text-lg"
          >
            Add to Cart - {inrFormatter.format(price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
