import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customizations?: any;
  specialNote?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantSlug: string | null;
  orderType: 'DINE_IN' | 'TAKEAWAY' | null;
  tableNumber?: string;
  qrCodeId?: string;
  qrCode?: string;
  outletId?: string;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string) => void;
  setRestaurantSlug: (slug: string) => void;
  setOrderType: (type: 'DINE_IN' | 'TAKEAWAY', tableNumber?: string) => void;
  setTableNumber: (tableNumber?: string) => void;
  setQrContext: (context: { qrCodeId?: string; qrCode?: string; tableNumber?: string; outletId?: string }) => void;
  clearQrContext: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
    items: [],
    restaurantId: null,
    restaurantSlug: null,
    orderType: null,
    tableNumber: undefined,
    qrCodeId: undefined,
    qrCode: undefined,
    outletId: undefined,

      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find((i) => i.menuItemId === item.menuItemId);

        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...state.items, item] });
        }
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({
          items: [],
          orderType: null,
          tableNumber: undefined,
          qrCodeId: undefined,
          qrCode: undefined,
          outletId: undefined,
        });
      },

      setRestaurant: (restaurantId) => {
        const currentRestaurantId = get().restaurantId;

        // Keep carts isolated per restaurant so items from one menu do not
        // accidentally carry over into another restaurant's checkout flow.
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          set({
            restaurantId,
            restaurantSlug: null,
            items: [],
            orderType: null,
            tableNumber: undefined,
            qrCodeId: undefined,
            qrCode: undefined,
            outletId: undefined,
          });
          return;
        }

        set({ restaurantId });
      },

      setRestaurantSlug: (slug) => {
        set({ restaurantSlug: slug });
      },

      setOrderType: (type, tableNumber) => {
        set({ orderType: type, tableNumber });
      },

      setTableNumber: (tableNumber) => {
        set({ tableNumber });
      },

      setQrContext: ({ qrCodeId, qrCode, tableNumber, outletId }) => {
        set({
          qrCodeId,
          qrCode,
          tableNumber,
          outletId,
          orderType: 'DINE_IN',
        });
      },

      clearQrContext: () => {
        set({
          qrCodeId: undefined,
          qrCode: undefined,
          tableNumber: undefined,
          outletId: undefined,
        });
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'restaurant-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
