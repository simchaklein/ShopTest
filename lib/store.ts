import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,

      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
              isCartOpen: true, // Auto-open when adding
            };
          }
          return { items: [...state.items, newItem], isCartOpen: true };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !(state.isCartOpen ?? false) })),
      
      openCart: () => set({ isCartOpen: true }),
      
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'shoptest_cart',
      onRehydrateStorage: () => (state) => {
        // Ensure items is always an array post-hydration
        if (state && !Array.isArray(state.items)) {
          state.items = [];
        }
      }
    }
  )
);
