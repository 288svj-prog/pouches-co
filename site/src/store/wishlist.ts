import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  slugs: string[];
  toggle: (slug: string) => void;
};

export const useWishlist = create<State>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
        })),
    }),
    { name: 'pouches-wishlist' }
  )
);

export const selectIsWished = (slugs: string[], slug: string) => slugs.includes(slug);
