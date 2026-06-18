import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product_id: string;
  crop_name: string;
  farmer_name: string;
  price_per_kg: number;
  quantity: number;
  photo: string;
  organic: boolean;
  farmer_id: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const exists = items.find((i) => i.product_id === item.product_id);
        if (exists) {
          set({ items: items.map((i) => i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i) });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (product_id) => set({ items: get().items.filter((i) => i.product_id !== product_id) }),
      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(product_id);
          return;
        }
        set({ items: get().items.map((i) => i.product_id === product_id ? { ...i, quantity } : i) });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.price_per_kg * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'farmconnect-cart' }
  )
);

interface UIStore {
  theme: 'light' | 'dark';
  language: 'en' | 'hi' | 'te';
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'farmconnect-ui' }
  )
);
