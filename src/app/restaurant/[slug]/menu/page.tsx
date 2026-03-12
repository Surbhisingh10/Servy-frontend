'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { Search, Minus, Plus, UtensilsCrossed } from 'lucide-react';
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
  }, [slug, setRestaurantInCart, setRestaurantSlug]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-xl text-center space-y-3">
          <p className="text-sm text-gray-700">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="rounded-2xl border border-primary-300 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-800 transition hover:bg-primary-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="pt-6 pb-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Menu</p>
          <h1 className="text-3xl font-semibold">{restaurant?.name || 'Menu'}</h1>
          <p className="text-sm text-gray-500">{restaurant?.tagline || "Choose what you'd like to eat"}</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search dishes"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-800 focus:border-primary-500 focus:ring-0"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                activeCategory === 'all'
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              Popular
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
                  activeCategory === category.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
            <div key={categoryName} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{categoryName}</h2>
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
                      className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          unoptimized
                          className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
                          <UtensilsCrossed size={24} />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold">{item.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                          </div>
                          <span className="text-sm font-semibold">
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
                        <div className="flex flex-shrink-0 items-center gap-3 rounded-full border border-primary-200 bg-primary-50 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="rounded-full p-1 text-primary-700 transition hover:bg-white hover:text-primary-900"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-4 text-center text-sm font-semibold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="rounded-full p-1 text-primary-700 transition hover:bg-white hover:text-primary-900"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary-300 bg-primary-50 text-primary-700 transition hover:border-primary-500 hover:bg-primary-100"
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
      </div>
      <BottomNav active="menu" />
    </div>
  );
}
