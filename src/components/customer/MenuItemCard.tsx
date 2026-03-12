'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  tags?: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  onItemClick: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onItemClick }: MenuItemCardProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const price = Number(item.price) || 0;
  const cartItem = cartItems.find((cartEntry) => cartEntry.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;
  const visibleTags = (item.tags || []).filter((tag) => !['veg', 'vegetarian'].includes(tag.toLowerCase()));
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const handleIncrement = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price,
      quantity: 1,
      image: item.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="flex gap-4 p-4">
        {item.image ? (
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${
                item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
          )}

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {visibleTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">{inrFormatter.format(price)}</span>
            {quantity > 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="rounded-md p-1 text-primary-700 transition hover:bg-white hover:text-primary-900"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-5 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="rounded-md p-1 text-primary-700 transition hover:bg-white hover:text-primary-900"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onItemClick(item)}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
