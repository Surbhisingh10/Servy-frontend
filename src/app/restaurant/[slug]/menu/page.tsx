'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { Leaf, Minus, Plus, Search, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import BottomNav from '@/components/customer/BottomNav';

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
  categoryId: string;
  tags?: string[];
}

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const {
    items: cartItems,
    setRestaurant: setRestaurantInCart,
    setRestaurantSlug,
    addItem,
    setQrContext,
    qrCode,
    updateQuantity,
  } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const [restaurantData, categoriesData, itemsData] = await Promise.all([
          api.getRestaurantBySlug(slug),
          api.getCategories(slug),
          api.getMenuItems(slug),
        ]);

        setRestaurant(restaurantData);
        setRestaurantInCart(restaurantData.id);
        setRestaurantSlug(slug);
        if (typeof window !== 'undefined') {
          localStorage.setItem('restaurantSlug', slug);
        }

        const scannedQrCode = searchParams.get('qr')?.trim();
        if (scannedQrCode) {
          const resolvedQr = await api.getQrCodeByCode(scannedQrCode, restaurantData.id);
          if (resolvedQr?.id) {
            setQrContext({
              qrCodeId: resolvedQr.id,
              qrCode: scannedQrCode,
              tableNumber: resolvedQr.tableNumber,
              outletId: resolvedQr.outletId || undefined,
            });
          }
        }

        setCategories(categoriesData);
        setItems(
          itemsData.map((item: any) => ({
            ...item,
            price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
          })),
        );
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, setQrContext, setRestaurantInCart, setRestaurantSlug, slug]);

  const filteredItems = useMemo(() => {
    const base = items.filter((item) =>
      activeCategory === 'all' ? true : item.categoryId === activeCategory,
    );
    if (!searchTerm.trim()) return base;
    return base.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [items, activeCategory, searchTerm]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      const categoryName =
        categories.find((category) => category.id === item.categoryId)?.name || 'Menu';
      acc[categoryName] = acc[categoryName] || [];
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [filteredItems, categories]);

  const addToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  const openItemDetail = (itemId: string) => {
    const suffix = qrCode ? `?qr=${encodeURIComponent(qrCode)}` : '';
    router.push(`/restaurant/${slug}/menu/${itemId}${suffix}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf8]">
        <p className="text-gray-500 text-sm">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5fbf8] px-4">
        <div className="max-w-xl text-center space-y-3">
          <p className="text-sm text-gray-700">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5fbf8] pb-24 text-gray-900">
      <div className="mx-auto max-w-md px-3 sm:px-4">
        <div className="space-y-3 pb-4 pt-5 sm:pt-6">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Menu</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">{restaurant?.name || 'Menu'}</h1>
          <p className="text-sm text-gray-500">{restaurant?.tagline || "Choose what you'd like to eat"}</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search dishes"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-800 focus:border-emerald-500 focus:ring-0"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                activeCategory === 'all'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              Popular
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                  activeCategory === category.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-7">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
            <div key={categoryName} className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 text-lg font-semibold">{categoryName}</h2>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  {categoryItems.length} items
                </span>
              </div>

              <div className="space-y-4">
                {categoryItems.map((item) => {
                  const cartItem = cartItems.find((cartEntry) => cartEntry.menuItemId === item.id);
                  const quantity = cartItem?.quantity || 0;

                  return (
                    <article
                      key={item.id}
                      onClick={() => openItemDetail(item.id)}
                      className="flex items-start gap-3 rounded-[1.6rem] border border-gray-200 bg-white p-3.5 shadow-sm"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={88}
                          height={88}
                          unoptimized
                          className="h-[88px] w-[88px] flex-shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
                          <UtensilsCrossed size={24} />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold leading-5 text-gray-900">{item.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold">
                            {inrFormatter.format(Number(item.price) || 0)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal ${
                              item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                          {item.tags
                            ?.filter((tag) => !['veg', 'vegetarian'].includes(tag.toLowerCase()))
                            .map((tag) => (
                              <span key={`${item.id}-${tag}`}>{tag}</span>
                            ))}
                        </div>
                      </div>
                      {quantity > 0 ? (
                        <div className="ml-auto flex flex-shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              updateQuantity(item.id, quantity - 1);
                            }}
                            className="rounded-full p-1 text-emerald-700 transition hover:bg-white hover:text-primary-900"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-4 text-center text-sm font-semibold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(item);
                            }}
                            className="rounded-full p-1 text-emerald-700 transition hover:bg-white hover:text-primary-900"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            addToCart(item);
                          }}
                          className="ml-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-100"
                        >
                          <Plus size={18} />
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-5 py-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm">
            <Leaf size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">Dietary requirements?</h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Tap on any item to view detailed allergens and nutritional info.
          </p>
        </div>
      </div>
      <BottomNav active="menu" restaurantSlug={slug} />
    </div>
  );
}
