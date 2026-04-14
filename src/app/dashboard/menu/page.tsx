'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { resolveMediaUrl } from '@/lib/media';

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
  category?: Category;
  tags?: string[];
  preparationTime?: number;
}

interface CategoryFormState {
  name: string;
  description: string;
  image: string;
  displayOrder: string;
}

interface MenuItemFormState {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  tags: string;
  preparationTime: string;
  isVeg: boolean;
  isAvailable: boolean;
}

const initialCategoryForm: CategoryFormState = {
  name: '',
  description: '',
  image: '',
  displayOrder: '',
};

const initialMenuItemForm: MenuItemFormState = {
  name: '',
  description: '',
  price: '',
  image: '',
  categoryId: '',
  tags: '',
  preparationTime: '',
  isVeg: false,
  isAvailable: true,
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(initialCategoryForm);
  const [menuItemForm, setMenuItemForm] = useState<MenuItemFormState>(initialMenuItemForm);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isItemSubmitting, setIsItemSubmitting] = useState(false);

  const { user } = useAuthStore();
  const canManageMenu = ['OWNER', 'ADMIN', 'MANAGER', 'STAFF'].includes(user?.role || '');
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

  const fetchMenu = useCallback(async () => {
    if (!user?.restaurantId) return;
    
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        api.getCategories(user.restaurantId),
        api.getMenuItems(user.restaurantId),
      ]);
      setCategories(categoriesData);
      setItems(
        itemsData.map((item: MenuItem) => ({
          ...item,
          price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
        })),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  const resolveItemImage = (image?: string | null) => resolveMediaUrl(image);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const openCategoryModal = () => {
    setCategoryForm(initialCategoryForm);
    setIsCategoryModalOpen(true);
  };

  const openItemModal = () => {
    setEditingItemId(null);
    setMenuItemForm(initialMenuItemForm);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItemId(item.id);
    setMenuItemForm({
      name: item.name || '',
      description: item.description || '',
      price: String(typeof item.price === 'number' ? item.price : Number(item.price) || 0),
      image: item.image || '',
      categoryId: item.categoryId || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      preparationTime: item.preparationTime ? String(item.preparationTime) : '',
      isVeg: Boolean(item.isVeg),
      isAvailable: Boolean(item.isAvailable),
    });
    setIsItemModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryForm(initialCategoryForm);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItemId(null);
    setMenuItemForm(initialMenuItemForm);
  };

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setIsCategorySubmitting(true);
      const payload = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        image: categoryForm.image.trim() || undefined,
        displayOrder: categoryForm.displayOrder
          ? Number(categoryForm.displayOrder)
          : undefined,
      };
      const createdCategory = await api.createCategory(payload);
      toast.success('Category created successfully');
      closeCategoryModal();
      setSelectedCategory(createdCategory.id);
      fetchMenu();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleItemSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!menuItemForm.name.trim()) {
      toast.error('Menu item name is required');
      return;
    }

    const price = Number(menuItemForm.price);
    if (!menuItemForm.price || Number.isNaN(price)) {
      toast.error('Valid price is required');
      return;
    }

    if (!menuItemForm.categoryId) {
      toast.error('Please select a category');
      return;
    }

    try {
      setIsItemSubmitting(true);
      const tags = menuItemForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        name: menuItemForm.name.trim(),
        description: menuItemForm.description.trim() || undefined,
        price,
        image: menuItemForm.image.trim() || undefined,
        isVeg: menuItemForm.isVeg,
        isAvailable: menuItemForm.isAvailable,
        preparationTime: menuItemForm.preparationTime
          ? Number(menuItemForm.preparationTime)
          : undefined,
        tags: tags.length > 0 ? tags : undefined,
        categoryId: menuItemForm.categoryId,
      };

      if (editingItemId) {
        await api.updateMenuItem(editingItemId, payload);
        toast.success('Menu item updated successfully');
      } else {
        await api.createMenuItem(payload);
        toast.success('Menu item created successfully');
      }
      closeItemModal();
      setSelectedCategory(menuItemForm.categoryId);
      fetchMenu();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          (editingItemId ? 'Failed to update menu item' : 'Failed to create menu item'),
      );
    } finally {
      setIsItemSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    if (!canManageMenu) return;
    const confirmed = window.confirm(`Delete menu item "${item.name}"?`);
    if (!confirmed) return;

    try {
      await api.deleteMenuItem(item.id);
      toast.success('Menu item deleted successfully');
      fetchMenu();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!canManageMenu) return;
    const confirmed = window.confirm(
      `Delete category "${category.name}"? Delete or move its menu items first.`,
    );
    if (!confirmed) return;

    try {
      await api.deleteCategory(category.id);
      toast.success('Category deleted successfully');
      if (selectedCategory === category.id) {
        setSelectedCategory(null);
      }
      fetchMenu();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoryId === selectedCategory)
    : items;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="mt-2 text-gray-600">Manage your menu categories and items</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCategoryModal} variant="outline">
            <Plus size={18} className="mr-2" />
            Add Category
          </Button>
          <Button onClick={openItemModal}>
            <Plus size={18} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === null
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center rounded-lg border ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <button
              onClick={() => setSelectedCategory(category.id)}
              className="px-3 py-2 font-medium whitespace-nowrap transition-colors"
            >
              {category.name}
            </button>
            <button
              onClick={() => handleDeleteCategory(category)}
              disabled={!canManageMenu}
              title="Delete category"
              className={`px-2 py-2 border-l ${
                selectedCategory === category.id
                  ? 'border-primary-500 hover:bg-primary-700'
                  : 'border-gray-200 hover:bg-red-50 text-red-600'
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            {resolveItemImage(item.image) ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={resolveItemImage(item.image)!}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-full h-40 rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                <ImageIcon className="text-gray-400" size={32} />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-gray-900">
                  {inrFormatter.format(Number(item.price) || 0)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => openEditItemModal(item)}
                  disabled={!canManageMenu}
                  className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item)}
                  disabled={!canManageMenu}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">No menu items found</p>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        title="Add Category"
        size="md"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Input
            label="Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <Input
            label="Image URL"
            type="url"
            value={categoryForm.image}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, image: e.target.value }))}
          />
          <Input
            label="Display Order"
            type="number"
            value={categoryForm.displayOrder}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, displayOrder: e.target.value }))}
            min={0}
          />
          <Button type="submit" className="w-full" isLoading={isCategorySubmitting}>
            Create Category
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isItemModalOpen}
        onClose={closeItemModal}
        title={editingItemId ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <Input
            label="Name"
            value={menuItemForm.name}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={menuItemForm.categoryId}
              onChange={(e) => setMenuItemForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Price (INR)"
            type="number"
            step="0.01"
            value={menuItemForm.price}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
          <Input
            label="Image URL"
            type="url"
            value={menuItemForm.image}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, image: e.target.value }))}
          />
          <Input
            label="Preparation Time (minutes)"
            type="number"
            value={menuItemForm.preparationTime}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, preparationTime: e.target.value }))}
            min={1}
          />
          <Input
            label="Tags (comma separated)"
            value={menuItemForm.tags}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, tags: e.target.value }))}
          />
          <Input
            label="Description"
            value={menuItemForm.description}
            onChange={(e) => setMenuItemForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={menuItemForm.isVeg}
                onChange={(e) => setMenuItemForm((prev) => ({ ...prev, isVeg: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
              <span className="text-sm text-gray-700">Vegetarian</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={menuItemForm.isAvailable}
                onChange={(e) => setMenuItemForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
              <span className="text-sm text-gray-700">Available</span>
            </label>
          </div>
          <Button type="submit" className="w-full" isLoading={isItemSubmitting}>
            {editingItemId ? 'Update Menu Item' : 'Create Menu Item'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

