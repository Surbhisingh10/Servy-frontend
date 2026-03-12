'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ClipboardList, Scan, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

type NavKey = 'scan' | 'menu' | 'cart' | 'orders';

interface BottomNavProps {
  active?: NavKey;
}

export default function BottomNav({ active }: BottomNavProps) {
  const { restaurantSlug } = useCartStore();
  const slug = restaurantSlug || 'demo-restaurant';
  const basePath = `/restaurant/${slug}`;

  const navItems: Array<{ key: NavKey; label: string; href: string; Icon: LucideIcon }> = [
    { key: 'scan', label: 'Scan', href: basePath, Icon: Scan },
    { key: 'menu', label: 'Menu', href: `${basePath}/menu`, Icon: UtensilsCrossed },
    { key: 'cart', label: 'Cart', href: '/checkout', Icon: ShoppingBag },
    { key: 'orders', label: 'Orders', href: '/orders', Icon: ClipboardList },
  ];

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-3xl border border-gray-200 bg-white/95 px-6 py-3 shadow-xl shadow-black/5 backdrop-blur">
      {navItems.map(({ key, label, href, Icon }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            className={`flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4em] transition ${
              isActive ? 'text-black' : 'text-gray-600'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-black' : 'text-gray-500'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
