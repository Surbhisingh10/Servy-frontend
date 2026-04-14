'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Box, ChevronRight, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { inventoryService, Recipe } from '@/lib/inventory.service';

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRecipes(await inventoryService.getRecipes());
    } catch {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete recipe "${name}"?`)) return;
    setDeletingId(id);
    try {
      await inventoryService.deleteRecipe(id);
      toast.success('Recipe deleted');
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error('Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Recipes</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Link recipes to menu items so inventory auto-deducts when orders are placed.
          </p>
        </div>
        <Button className="whitespace-nowrap" onClick={() => router.push('/inventory/recipes/new')}>
          <Plus size={16} className="mr-2" />
          New Recipe
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">All Recipes</h2>
            <div className="text-sm text-slate-500">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            Loading recipes...
          </div>
        ) : recipes.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BookOpen size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-950">No recipes yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Create recipes and link them to menu items for automatic stock deduction.
            </p>
            <Button className="mt-6" onClick={() => router.push('/inventory/recipes/new')}>
              <Plus size={16} className="mr-2" />
              Create first recipe
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  <th className="px-6 py-4">Recipe Name</th>
                  <th className="px-6 py-4">Linked Menu Item</th>
                  <th className="px-6 py-4">Ingredients</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-950">{recipe.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {recipe.menuItem ? (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          {recipe.menuItem.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {recipe.ingredients.length} ingredient
                      {recipe.ingredients.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          disabled={deletingId === recipe.id}
                          onClick={() => void handleDelete(recipe.id, recipe.name)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          {deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/inventory/recipes/${recipe.id}`)}
                        >
                          <ChevronRight size={14} className="mr-2" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
