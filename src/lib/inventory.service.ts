import { api } from './api-client';

export type InventoryStatus = 'LOW' | 'OK';
export type InventoryTransactionType = 'ADD' | 'REDUCE' | 'CONSUMPTION';
export type StockAdjustmentType = 'ADD' | 'REDUCE';
export type InventoryMode = 'MANUAL' | 'RECIPE_BASED';

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: InventoryTransactionType;
  quantity: number;
  note?: string | null;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity: number;
  status: InventoryStatus;
  outletId?: string | null;
  outlet?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  transactions?: InventoryTransaction[];
}

export interface CreateInventoryItemPayload {
  name: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity: number;
  outletId?: string;
}

export interface UpdateInventoryItemPayload extends Partial<CreateInventoryItemPayload> {}

export interface CreateInventoryTransactionPayload {
  type: StockAdjustmentType;
  quantity: number;
  note?: string;
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  inventoryItemId: string;
  quantity: number;
  inventoryItem: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface Recipe {
  id: string;
  name: string;
  restaurantId: string;
  menuItemId?: string | null;
  menuItem?: {
    id: string;
    name: string;
  } | null;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipePayload {
  name: string;
  menuItemId?: string;
  ingredients: { inventoryItemId: string; quantity: number }[];
}

export interface UpdateRecipePayload extends Partial<CreateRecipePayload> {}

class InventoryService {
  async getInventoryItems(outletId?: string): Promise<InventoryItem[]> {
    return api.getInventoryItems(outletId);
  }

  async getInventoryItem(id: string): Promise<InventoryItem> {
    return api.getInventoryItem(id);
  }

  async createInventoryItem(payload: CreateInventoryItemPayload): Promise<InventoryItem> {
    return api.createInventoryItem(payload);
  }

  async updateInventoryItem(id: string, payload: UpdateInventoryItemPayload): Promise<InventoryItem> {
    return api.updateInventoryItem(id, payload);
  }

  async deleteInventoryItem(id: string): Promise<{ success: boolean }> {
    return api.deleteInventoryItem(id);
  }

  async updateStock(
    id: string,
    payload: CreateInventoryTransactionPayload,
  ): Promise<InventoryItem & { lastTransaction: InventoryTransaction }> {
    return api.updateInventoryStock(id, payload);
  }

  async getTransactions(id: string): Promise<InventoryTransaction[]> {
    return api.getInventoryTransactions(id);
  }

  async getInventoryMode(): Promise<InventoryMode> {
    const data = await api.getInventoryMode();
    return data.inventoryMode;
  }

  async setInventoryMode(mode: InventoryMode): Promise<InventoryMode> {
    const data = await api.setInventoryMode(mode);
    return data.inventoryMode;
  }

  async getRecipes(): Promise<Recipe[]> {
    return api.getRecipes();
  }

  async getRecipe(id: string): Promise<Recipe> {
    return api.getRecipe(id);
  }

  async createRecipe(payload: CreateRecipePayload): Promise<Recipe> {
    return api.createRecipe(payload);
  }

  async updateRecipe(id: string, payload: UpdateRecipePayload): Promise<Recipe> {
    return api.updateRecipe(id, payload);
  }

  async deleteRecipe(id: string): Promise<{ success: boolean }> {
    return api.deleteRecipe(id);
  }
}

export const inventoryService = new InventoryService();
