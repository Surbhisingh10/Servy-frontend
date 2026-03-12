'use client';

import { useCartStore } from '@/store/cart-store';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartButton() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getTotal());
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  if (itemCount === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push('/cart')}
      className="fixed bottom-6 right-6 z-30 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
    >
      <ShoppingCart size={24} />
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium">{itemCount} items</span>
        <span className="text-sm font-bold">{inrFormatter.format(total)}</span>
      </div>
    </motion.button>
  );
}
