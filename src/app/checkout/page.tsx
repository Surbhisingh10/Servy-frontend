'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const takeawayPaymentMethods = [
  { label: 'UPI', value: 'UPI' },
  { label: 'Card', value: 'CARD' },
  { label: 'Wallet', value: 'WALLET' },
  { label: 'Online', value: 'ONLINE' },
] as const;

type TakeawayPaymentMethod = (typeof takeawayPaymentMethods)[number]['value'];

function normalizePhone(value: string) {
  return value.replace(/[\s\-()]/g, '');
}

function isValidPhone(value: string) {
  return /^\+?[1-9]\d{1,14}$/.test(normalizePhone(value));
}

function normalizeForCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    orderType,
    restaurantId,
    restaurantSlug,
    tableNumber,
    qrCodeId,
    qrCode,
    removeItem,
    updateQuantity,
    clearCart,
    setOrderType,
    setRestaurant,
  } = useCartStore();
  const [table, setTable] = useState(tableNumber || '');
  const [tip, setTip] = useState(0.15);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<TakeawayPaymentMethod>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const urlQrCode = searchParams.get('qr')?.trim() || undefined;
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

  useEffect(() => {
    const hydrateRestaurantContext = async () => {
      if (restaurantId || !restaurantSlug) return;

      try {
        const restaurant = await api.getRestaurantBySlug(restaurantSlug);
        if (restaurant?.id) {
          setRestaurant(restaurant.id);
        }
      } catch {
        // The checkout page already shows a friendly validation message if
        // the restaurant context is still missing during order placement.
      }
    };

    hydrateRestaurantContext();
  }, [restaurantId, restaurantSlug, setRestaurant]);

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
    if (orderType === 'DINE_IN' && !qrCodeId && !table.trim()) {
      toast.error('Please scan a valid table QR code or enter a table number before placing a dine-in order');
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
      if (orderType === 'TAKEAWAY') {
        const paymentSuccess = await simulatePayment(paymentMethod);
        if (!paymentSuccess) {
          toast.error('Payment failed. Please try again.');
          return;
        }
      }

      const slugToUse = restaurantSlug || undefined;

      let resolvedQrCodeId = qrCodeId;
      const trimmedTable = table.trim();
      const prefixedTableCode =
        slugToUse && trimmedTable ? `${slugToUse.toUpperCase()}-${normalizeForCode(trimmedTable)}` : undefined;
      const qrCandidates = [
        prefixedTableCode,
        urlQrCode,
        qrCode,
        trimmedTable ? trimmedTable.toUpperCase() : undefined,
        trimmedTable && !trimmedTable.toUpperCase().startsWith('TBL-')
          ? `TBL-${normalizeForCode(trimmedTable)}`
          : undefined,
        trimmedTable && /^\d+$/.test(trimmedTable) ? `TBL-${trimmedTable.padStart(3, '0')}` : undefined,
        trimmedTable && /^\d+$/.test(trimmedTable) ? `TBL-${trimmedTable}` : undefined,
      ].filter((value): value is string => Boolean(value));

      if (orderType === 'DINE_IN' && !resolvedQrCodeId) {
        for (const candidate of qrCandidates) {
          try {
            const resolvedQr = await api.getQrCodeByCode(candidate, restaurantId);
            resolvedQrCodeId = resolvedQr.id;
            break;
          } catch {
            // Try the next candidate.
          }
        }

        if (!resolvedQrCodeId) {
          toast.error(
            trimmedTable
              ? `No active QR code found for table ${trimmedTable}`
              : 'Please scan a valid table QR code before placing a dine-in order',
          );
          return;
        }
      }

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
        qrCodeId: orderType === 'DINE_IN' ? resolvedQrCodeId : undefined,
        tableNumber: orderType === 'DINE_IN' ? trimmedTable || undefined : undefined,
        ...(orderType === 'TAKEAWAY'
          ? {
              paymentStatus: 'PAID' as const,
              paymentMethod,
            }
          : {}),
      };
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
        table: orderType === 'DINE_IN' ? table.trim() || undefined : undefined,
        orderType,
        paymentStatus: orderData.paymentStatus,
        paymentMethod: orderData.paymentMethod,
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
      router.push(`/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate payment step for takeaway
  async function simulatePayment(method: TakeawayPaymentMethod) {
    // Placeholder for actual gateway integration. We keep the explicit step in the
    // UI so takeaway orders already follow a pay-first flow.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Boolean(method));
      }, 1200);
    });
  }

  const handleSetOrderType = (type: 'DINE_IN' | 'TAKEAWAY') => {
    if (type === 'DINE_IN') {
      setOrderType(type, table);
    } else {
      setOrderType(type, undefined);
      setTable('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5fbf8] pb-24">
      <div className="mx-auto max-w-md space-y-4 px-3 py-5 sm:px-4 sm:py-8">
        <header className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Your Order</p>
            <h1 className="text-xl font-semibold text-slate-900">Checkout</h1>
          </div>
        </header>

        {/* Order items */}
        <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Order items</p>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{items.length} items</span>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500">Add dishes to your order to begin.</p>
            ) : (
              items.map((item) => (
                <div key={item.menuItemId} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={56} height={56} unoptimized className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300 text-base">?</div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        {inrFormatter.format(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantity(item.menuItemId, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <span className="text-base leading-none">−</span>
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.menuItemId, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <span className="text-base leading-none">+</span>
                      </button>
                      <button onClick={() => handleRemove(item.menuItemId)} className="ml-1 text-slate-300 transition hover:text-rose-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Contact</p>
            <p className="mt-1.5 text-sm text-slate-500">Required for order confirmation via WhatsApp.</p>
          </div>
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input label="Phone Number" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        </section>

        {/* Order type */}
        <section className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Order type</p>
          <div className="flex gap-2">
            {(['DINE_IN', 'TAKEAWAY'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleSetOrderType(type)}
                className={`flex-1 rounded-2xl border py-2.5 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  orderType === type
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
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
              onChange={(event) => setTable(event.target.value)}
              placeholder={qrCodeId ? 'Loaded from scanned QR code' : 'Enter table number'}
              disabled={Boolean(qrCodeId)}
            />
          )}
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-800">
            {orderType === 'TAKEAWAY'
              ? 'Takeaway orders are paid during checkout and then sent to the kitchen.'
              : 'Dine-in orders go to the kitchen now. The bill is settled after your meal.'}
          </div>
        </section>

        {/* Payment (takeaway only) */}
        {orderType === 'TAKEAWAY' && (
          <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Payment method</p>
                <p className="mt-1 text-sm text-slate-500">Pay now to confirm your takeaway order.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Pay first</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {takeawayPaymentMethods.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPaymentMethod(option.value)}
                  className={`rounded-2xl border py-3 text-sm font-semibold transition ${
                    paymentMethod === option.value
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
              Total to pay: {inrFormatter.format(total)}
            </div>
          </section>
        )}

        {/* Tip */}
        <section className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Add a tip</p>
            <p className="text-xs text-slate-400">Support the team</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setTip(option.value)}
                className={`rounded-2xl border py-2.5 text-xs font-semibold transition ${
                  tip === option.value
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Bill summary + CTA */}
        <section className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Bill summary</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service tax (8%)</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(serviceTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity ({Math.round(tip * 100)}%)</span>
              <span className="font-medium text-slate-900">{inrFormatter.format(gratuity)}</span>
            </div>
            <div className="my-1 border-t border-slate-100" />
            <div className="flex justify-between text-base font-bold text-slate-950">
              <span>Total</span>
              <span>{inrFormatter.format(total)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" isLoading={isSubmitting} onClick={handlePlaceOrder}>
            {orderType === 'TAKEAWAY' ? 'Pay & Place Order' : 'Place Order'}
          </Button>
        </section>
      </div>

      <BottomNav active="cart" />
    </div>
  );
}
