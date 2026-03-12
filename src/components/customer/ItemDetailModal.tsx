'use client';

import { useState } from 'react';
import BottomSheet from './BottomSheet';
import Button from '@/components/ui/Button';
import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';

interface MenuItem {
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

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  if (!item) return null;
  const price = Number(item.price) || 0;
  const visibleTags = (item.tags || []).filter((tag) => !['veg', 'vegetarian'].includes(tag.toLowerCase()));
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price,
      quantity,
      image: item.image,
      specialNote: specialNote.trim() || undefined,
    });

    toast.success(`${item.name} added to cart`);
    setQuantity(1);
    setSpecialNote('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={item.name}>
      <div className="space-y-6">
        {/* Image */}
        {item.image && (
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 -mx-6">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          </div>
        )}

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                {item.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
              {item.preparationTime && (
                <span className="text-gray-500 text-sm">
                  {item.preparationTime} min
                </span>
              )}
            </div>
            <span className="text-2xl font-bold text-gray-900">{inrFormatter.format(price)}</span>
          </div>

          {item.description && (
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          )}

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 border-t border-b">
            <span className="font-medium text-gray-900">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg border border-primary-300 bg-primary-50 p-2 text-primary-800 transition hover:bg-primary-100"
              >
                <Minus size={18} />
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg border border-primary-300 bg-primary-50 p-2 text-primary-800 transition hover:bg-primary-100"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Special Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="Any special requests?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
        >
          Add to Cart - {inrFormatter.format(price * quantity)}
        </Button>
      </div>
    </BottomSheet>
  );
}

