'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BottomNav from '@/components/customer/BottomNav';
import toast from 'react-hot-toast';

const tipOptions = [
  { label: '10%', value: 0.1 },
  { label: '15%', value: 0.15 },
  { label: '20%', value: 0.2 },
  { label: '25%', value: 0.25 },
];

function normalizePhone(value: string) {
  return value.replace(/[\s\-()]/g, '');
}

function isValidPhone(value: string) {
  return /^\+?[1-9]\d{1,14}$/.test(normalizePhone(value));
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    orderType,
    restaurantId,
    restaurantSlug,
    removeItem,
    updateQuantity,
    clearCart,
    setOrderType,
    setRestaurantSlug,
  } = useCartStore();
  const [table, setTable] = useState('');
  const [tip, setTip] = useState(0.15);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const serviceTax = subtotal * 0.08;
  const gratuity = subtotal * tip;
  const total = subtotal + serviceTax + gratuity;

  const handleQuantity = (id: string, delta: number) => {
    const item = items.find((it) => it.menuItemId === id);
    if (!item) return;
    const nextQty = item.quantity + delta;
    if (nextQty <= 0) {
      removeItem(id);
      return;
    }
    updateQuantity(id, nextQty);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handlePlaceOrder = async () => {
    if (!restaurantId) {
      toast.error('Restaurant context is missing');
      return;
    }
    if (!orderType) {
      toast.error('Please select an order type');
      return;
    }
    if (items.length === 0) {
      toast.error('Add items before placing an order');
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      toast.error('Name is required');
      return;
    }

    if (!trimmedPhone) {
      toast.error('Phone number is required');
      return;
    }

    if (!isValidPhone(trimmedPhone)) {
      toast.error('Enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        type: orderType,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          specialNote: item.specialNote,
          customizations: item.customizations,
        })),
        customerPhone: trimmedPhone,
        customerName: trimmedName,
        tableNumber: orderType === 'DINE_IN' ? (table || undefined) : undefined,
      };

      const persistedSlug =
        typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;
      let slugToUse = restaurantSlug || persistedSlug || undefined;

      if (!slugToUse && restaurantId) {
        const restaurant = await api.getRestaurant(restaurantId);
        slugToUse = restaurant?.slug;
        if (slugToUse) {
          setRestaurantSlug(slugToUse);
          if (typeof window !== 'undefined') {
            localStorage.setItem('restaurantSlug', slugToUse);
          }
        }
      }

      if (!slugToUse) {
        toast.error('Restaurant context is missing. Please reopen the menu.');
        return;
      }

      const order = await api.createOrder(restaurantId, orderData, slugToUse);
      toast.success('Order placed!');
      const lastOrder = {
        orderNumber: order.orderNumber,
        items,
        subtotal,
        serviceTax,
        gratuity,
        total,
        table: orderType === 'DINE_IN' ? table : undefined,
        orderType,
        restaurantSlug: slugToUse,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
      const existingHistoryRaw = localStorage.getItem('customerOrderHistory');
      const existingHistory = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      const nextHistory = [
        {
          orderNumber: order.orderNumber,
          restaurantSlug: slugToUse,
          createdAt: new Date().toISOString(),
        },
        ...existingHistory.filter((entry: any) => entry?.orderNumber !== order.orderNumber),
      ].slice(0, 20);
      localStorage.setItem('customerOrderHistory', JSON.stringify(nextHistory));
      clearCart();
      router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetOrderType = (type: 'DINE_IN' | 'TAKEAWAY') => {
    if (type === 'DINE_IN') {
      setOrderType(type, table);
    } else {
      setOrderType(type, undefined);
      setTable('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-gray-600 transition hover:border-primary-500 hover:text-primary-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Your Order</p>
            <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
          </div>
        </header>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm font-semibold text-gray-900">{items.length} selections</p>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Summary</span>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">Add dishes to your order to begin.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3"
                >
                  <div className="h-14 w-14 flex-shrink-0 rounded-2xl border border-gray-200 bg-gray-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        unoptimized
                        className="h-full w-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <span className="text-base">?</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {inrFormatter.format(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                      <button
                        onClick={() => handleQuantity(item.menuItemId, -1)}
                        className="rounded-full border border-primary-200 bg-primary-50 px-2 text-primary-800 transition hover:bg-primary-100"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.menuItemId, 1)}
                        className="rounded-full border border-primary-200 bg-primary-50 px-2 text-primary-800 transition hover:bg-primary-100"
                      >
                        +
                      </button>
                      <button onClick={() => handleRemove(item.menuItemId)} className="text-gray-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Contact</p>
            <p className="mt-1 text-sm text-gray-500">
              Name and phone number are required. The customer will receive order confirmation on this WhatsApp number.
            </p>
          </div>
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </section>

        <section className="space-y-3 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Order type</p>
          <div className="flex gap-3">
            {['DINE_IN', 'TAKEAWAY'].map((type) => (
              <button
                key={type}
                onClick={() => handleSetOrderType(type as 'DINE_IN' | 'TAKEAWAY')}
                className={`flex-1 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  orderType === type
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {type === 'DINE_IN' ? 'Dine-in' : 'Takeaway'}
              </button>
            ))}
          </div>
          {orderType === 'DINE_IN' && (
            <Input
              label="Table Number"
              value={table}
              onChange={(event) => {
                const value = event.target.value;
                setTable(value);
                setOrderType('DINE_IN', value);
              }}
            />
          )}
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Tip</p>
            <p className="text-xs text-gray-500">Support the team</p>
          </div>
          <div className="flex gap-2">
            {tipOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setTip(option.value)}
                className={`flex-1 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                  tip === option.value
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white/95 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Summary</p>
            <p className="text-xs font-semibold text-gray-500">{inrFormatter.format(total)} total</p>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{inrFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Tax</span>
              <span>{inrFormatter.format(serviceTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity</span>
              <span>{inrFormatter.format(gratuity)}</span>
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={items.length === 0 || !orderType || !name.trim() || !phone.trim()}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </section>
      </div>

      <BottomNav active="cart" />
    </div>
  );
}
