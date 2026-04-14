'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ClipboardList, Scan, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

type NavKey = 'scan' | 'menu' | 'cart' | 'orders';

interface BottomNavProps {
  active?: NavKey;
  restaurantSlug?: string;
}

export default function BottomNav({ active, restaurantSlug: propSlug }: BottomNavProps) {
  const { restaurantSlug: storeSlug, qrCode: storeQrCode } = useCartStore();
  const pathname = usePathname();
  const [persistedSlug, setPersistedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setPersistedSlug(localStorage.getItem('restaurantSlug'));
  }, []);

  // Extract slug from URL if available (e.g., /restaurant/demo-restaurant/menu -> demo-restaurant)
  const urlSlug = pathname.match(/\/restaurant\/([^\/]+)/)?.[1];

  // Use route context first, then persisted customer context.
  const currentSlug = propSlug || urlSlug || storeSlug || persistedSlug;
  const qrQuery = storeQrCode ? `?qr=${encodeURIComponent(storeQrCode)}` : '';
  const basePath = currentSlug ? `/restaurant/${currentSlug}${qrQuery}` : '#';
  const menuPath = currentSlug ? `/restaurant/${currentSlug}/menu${qrQuery}` : '#';

  const cartPath = qrQuery ? `/checkout${qrQuery}` : '/checkout';

  const navItems: Array<{ key: NavKey; label: string; href: string; Icon: LucideIcon }> = [
    { key: 'scan', label: 'Scan', href: basePath, Icon: Scan },
    { key: 'menu', label: 'Menu', href: menuPath, Icon: UtensilsCrossed },
    { key: 'cart', label: 'Cart', href: cartPath, Icon: ShoppingBag },
    { key: 'orders', label: 'Orders', href: '/orders', Icon: ClipboardList },
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white/95 px-2 py-2.5 shadow-xl shadow-black/5 backdrop-blur">
      {navItems.map(({ key, label, href, Icon }) => {
        const isActive = active === key;
        const isDisabled = (key === 'scan' || key === 'menu') && !currentSlug;
        return (
          <Link
            key={key}
            href={href}
            aria-disabled={isDisabled}
            onClick={(event) => {
              if (isDisabled) {
                event.preventDefault();
              }
            }}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 text-[9px] font-semibold uppercase tracking-[0.22em] transition sm:text-[10px] sm:tracking-[0.28em] ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            } ${
              isDisabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {isActive ? (
              <span className="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 px-3 py-1.5">
                <Icon size={17} className="text-emerald-600" />
                <span className="truncate">{label}</span>
              </span>
            ) : (
              <>
                <Icon size={17} className="text-slate-400" />
                <span className="truncate">{label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
