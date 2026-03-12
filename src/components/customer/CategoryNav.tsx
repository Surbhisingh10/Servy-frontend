'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={navRef}
      className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
          >
            <span
              className={`relative z-10 ${
                activeCategory === category.id
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.name}
            </span>
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-primary-50 border-2 border-primary-600 pointer-events-none z-0"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
