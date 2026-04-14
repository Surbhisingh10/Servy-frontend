'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';
import { inventoryService, InventoryItem } from '@/lib/inventory.service';
import { useAuthStore } from '@/store/auth-store';

interface MenuItemOption {
  id: string;
  name: string;
}

interface IngredientRow {
  inventoryItemId: string;
  quantity: string;
}

const recipeSchema = z.object({
  name: z.string().min(2, 'Recipe name is required'),
  menuItemId: z.string().optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export default function NewRecipePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [menuItems, setMenuItems] = useState<MenuItemOption[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { inventoryItemId: '', quantity: '' },
  ]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: { name: '', menuItemId: '' },
  });

  const loadData = useCallback(async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const [menuData, invData] = await Promise.all([
        api.getMenuItems(user.restaurantId),
        inventoryService.getInventoryItems(),
      ]);
      setMenuItems(Array.isArray(menuData) ? menuData : (menuData as { items?: MenuItemOption[] })?.items ?? []);
      setInventoryItems(invData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { inventoryItemId: '', quantity: '' }]);

  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const updateIngredient = (index: number, field: keyof IngredientRow, value: string) =>
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );

  const onSubmit = handleSubmit(async (values) => {
    const validIngredients = ingredients.filter(
      (r) => r.inventoryItemId && r.quantity && parseFloat(r.quantity) > 0,
    );

    if (validIngredients.length === 0) {
      toast.error('Add at least one ingredient with a quantity');
      return;
    }

    setSubmitting(true);
    try {
      await inventoryService.createRecipe({
        name: values.name,
        menuItemId: values.menuItemId || undefined,
        ingredients: validIngredients.map((r) => ({
          inventoryItemId: r.inventoryItemId,
          quantity: parseFloat(r.quantity),
        })),
      });
      toast.success('Recipe created');
      router.push('/inventory/recipes');
    } catch {
      toast.error('Failed to create recipe');
    } finally {
      setSubmitting(false);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
          Inventory / Recipes
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">New Recipe</h1>
        <p className="mt-2 text-sm text-slate-600">
          Define a recipe and optionally link it to a menu item for automatic stock deduction.
        </p>
      </div>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <Input
            label="Recipe Name"
            placeholder="e.g. Margherita Pizza"
            {...register('name')}
            error={errors.name?.message}
          />

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>
              Linked Menu Item{' '}
              <span className="font-normal text-slate-400">(optional — for auto-deduction)</span>
            </span>
            <select
              {...register('menuItemId')}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
            >
              <option value="">— No menu item —</option>
              {menuItems.map((mi) => (
                <option key={mi.id} value={mi.id}>
                  {mi.name}
                </option>
              ))}
            </select>
          </label>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Ingredients</span>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 text-sm font-medium text-[color:var(--accent)] hover:opacity-80"
              >
                <Plus size={14} />
                Add ingredient
              </button>
            </div>

            {inventoryItems.length === 0 && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                No inventory items found.{' '}
                <button
                  type="button"
                  onClick={() => router.push('/inventory/add')}
                  className="underline font-medium"
                >
                  Add inventory items first
                </button>
              </p>
            )}

            {ingredients.map((row, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={row.inventoryItemId}
                  onChange={(e) => updateIngredient(index, 'inventoryItemId', e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
                >
                  <option value="">Select ingredient</option>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={row.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="w-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[color:var(--accent)]"
                />

                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="rounded-xl p-2 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="submit" isLoading={submitting}>
              Save Recipe
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/inventory/recipes')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
