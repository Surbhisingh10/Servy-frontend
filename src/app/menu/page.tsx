'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import CategoryNav from '@/components/customer/CategoryNav';
import MenuItemCard from '@/components/customer/MenuItemCard';
import ItemDetailModal from '@/components/customer/ItemDetailModal';
import CartButton from '@/components/customer/CartButton';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  tags?: string[];
  preparationTime?: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!restaurantId) {
      setError('Restaurant ID is required');
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          api.getCategories(restaurantId),
          api.getMenuItems(restaurantId),
        ]);

        setCategories(categoriesData);
        setItems(
          itemsData.map((item: any) => ({
            ...item,
            price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
          })),
        );

        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = items.filter((item) => {
      // Check both categoryId field and nested category object
      return item.categoryId === category.id || item.category?.id === category.id;
    });
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        </div>
      </div>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {/* Menu Items by Category */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {categories.map((category) => {
          const categoryItems = itemsByCategory[category.id] || [];
          if (categoryItems.length === 0) return null;

          return (
            <div
              key={category.id}
              ref={(el) => { if (el) categoryRefs.current[category.id] = el; }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">{categoryItems.length} items</span>
              </div>

              <div className="grid gap-4">
                {categoryItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onItemClick={handleItemClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      <CartButton />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
