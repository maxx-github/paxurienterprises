// src/features/ecommerce/store/use-quote-list-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuoteItem = {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  notes?: string;
};

type QuoteListStore = {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "quantity" | "notes">) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
  totalItems: () => number;
};

export const useQuoteListStore = create<QuoteListStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const exists = items.find((i) => i.id === newItem.id);
        if (exists) {
          set({ items: items.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearList: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),
    }),
    { name: "paxuri-quote-list" }
  )
);