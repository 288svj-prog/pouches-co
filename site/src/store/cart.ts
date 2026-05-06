import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/products';

export type CartItem = {
  productSlug: string;
  brandSlug: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  swatch: string;
  byo?: boolean;
  justAdded?: boolean;
};

const FREE_SHIP_THRESHOLD = 49;
const BYO_THRESHOLD = 6;
const BYO_DISCOUNT_RATE = 0.15;

type State = {
  items: CartItem[];
  drawerOpen: boolean;
  add: (p: Product, qty?: number, opts?: { byo?: boolean; silent?: boolean }) => void;
  remove: (productSlug: string) => void;
  updateQty: (productSlug: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      add: (p, qty = 1, opts) => {
        // BYO additions and explicit silent calls don't auto-open the drawer.
        // The user is on /build with their own progress UI; the drawer is noisy.
        const shouldOpen = !opts?.byo && !opts?.silent;
        set((s) => {
          const existingIdx = s.items.findIndex((i) => i.productSlug === p.slug);
          let next: CartItem[];
          if (existingIdx >= 0) {
            next = s.items.map((it, idx) =>
              idx === existingIdx ? { ...it, qty: it.qty + qty, justAdded: true } : { ...it, justAdded: false }
            );
          } else {
            next = [
              ...s.items.map((i) => ({ ...i, justAdded: false })),
              {
                productSlug: p.slug,
                brandSlug: p.brandSlug,
                name: p.name,
                variant: `${p.strengthMg}mg · ${p.format[0].toUpperCase() + p.format.slice(1)} Format`,
                price: p.price,
                qty,
                swatch: p.swatch,
                byo: opts?.byo,
                justAdded: true,
              },
            ];
          }
          return shouldOpen ? { items: next, drawerOpen: true } : { items: next };
        });
        setTimeout(() => {
          set((s) => ({ items: s.items.map((i) => ({ ...i, justAdded: false })) }));
        }, 3000);
      },
      remove: (productSlug) => set((s) => ({ items: s.items.filter((i) => i.productSlug !== productSlug) })),
      updateQty: (productSlug, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productSlug !== productSlug)
              : s.items.map((i) => (i.productSlug === productSlug ? { ...i, qty } : i)),
        })),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
      clear: () => set({ items: [] }),
    }),
    { name: 'pouches-cart' }
  )
);

// Pure selectors — return primitives so they're stable for React subscriptions.
export const selectItemCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.qty, 0);
export const selectByoCount = (items: CartItem[]) => items.filter((i) => i.byo).reduce((sum, i) => sum + i.qty, 0);
export const selectSubtotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectByoDiscount = (items: CartItem[]) => {
  const byoCount = selectByoCount(items);
  if (byoCount < BYO_THRESHOLD) return 0;
  const byoTotal = items.filter((i) => i.byo).reduce((sum, i) => sum + i.price * i.qty, 0);
  return +(byoTotal * BYO_DISCOUNT_RATE).toFixed(2);
};
export const selectTotal = (items: CartItem[]) => +(selectSubtotal(items) - selectByoDiscount(items)).toFixed(2);
export const selectFreeShipProgress = (items: CartItem[]) => {
  const subtotal = selectSubtotal(items);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  return { current: subtotal, threshold: FREE_SHIP_THRESHOLD, pct, remaining };
};

export const BYO_CONFIG = { threshold: BYO_THRESHOLD, rate: BYO_DISCOUNT_RATE };
