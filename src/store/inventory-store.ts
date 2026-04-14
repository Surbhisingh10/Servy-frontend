import { create } from 'zustand';
import {
  inventoryService,
  InventoryItem,
  InventoryTransaction,
  CreateInventoryItemPayload,
  UpdateInventoryItemPayload,
  CreateInventoryTransactionPayload,
} from '@/lib/inventory.service';

interface InventoryState {
  items: InventoryItem[];
  currentItem: InventoryItem | null;
  transactions: InventoryTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (outletId?: string) => Promise<void>;
  fetchItem: (id: string) => Promise<void>;
  fetchTransactions: (id: string) => Promise<void>;
  createItem: (payload: CreateInventoryItemPayload) => Promise<InventoryItem>;
  updateItem: (id: string, payload: UpdateInventoryItemPayload) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  updateStock: (id: string, payload: CreateInventoryTransactionPayload) => Promise<void>;
  clearCurrentItem: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  currentItem: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchItems: async (outletId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = await inventoryService.getInventoryItems(outletId);
      set({ items, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load inventory',
      });
    }
  },

  fetchItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await inventoryService.getInventoryItem(id);
      set({
        currentItem: item,
        transactions: item.transactions || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load inventory item',
      });
    }
  },

  fetchTransactions: async (id: string) => {
    try {
      const transactions = await inventoryService.getTransactions(id);
      set({ transactions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load inventory history',
      });
    }
  },

  createItem: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const item = await inventoryService.createInventoryItem(payload);
      set({
        items: [item, ...get().items],
        currentItem: item,
        transactions: item.transactions || [],
        isLoading: false,
      });
      return item;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create inventory item',
      });
      throw error;
    }
  },

  updateItem: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateInventoryItem(id, payload);
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
        currentItem: updated,
        transactions: updated.transactions || get().transactions,
        isLoading: false,
      });
      return updated;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update inventory item',
      });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryService.deleteInventoryItem(id);
      set({
        items: get().items.filter((item) => item.id !== id),
        currentItem: get().currentItem?.id === id ? null : get().currentItem,
        transactions: get().currentItem?.id === id ? [] : get().transactions,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete inventory item',
      });
      throw error;
    }
  },

  updateStock: async (id: string, payload) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await inventoryService.updateStock(id, payload);
      set({
        items: get().items.map((item) => (item.id === id ? updated : item)),
        currentItem: updated,
        transactions: [updated.lastTransaction, ...(get().transactions || [])].filter(Boolean),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update stock',
      });
      throw error;
    }
  },

  clearCurrentItem: () => {
    set({
      currentItem: null,
      transactions: [],
      error: null,
    });
  },
}));
