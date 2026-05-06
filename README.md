# Pouches.co

Editorial DTC e-commerce frontend for Pouches.co — every Swedish nicotine pouch brand, one checkout.

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS 3
- React Router
- Zustand (cart + wishlist persistence)
- Lucide icons
- Hand-tuned wordmark SVG
- AI-generated lookbook photography (Google Nano Banana Pro via Replicate)

## Layout

```
pouches/
├── POUCHES-DESIGN-SYSTEM.md   # 1700-line brand spec (source of truth)
├── completed-website-renders/ # 62 reference screenshots
├── SVG/                       # Brand wordmark assets
├── logo.png                   # Wordmark raster fallback
└── site/                      # Vite app
    ├── public/img/            # Generated lookbook photography
    └── src/
        ├── components/        # Wordmark, TopNav, ProductCard, CartDrawer, HeroCarousel...
        ├── pages/             # Home, Shop, PDP, BYO, Checkout, Account, Quiz...
        ├── data/              # Brands, products, reviews, image map (mock)
        └── store/             # cart.ts, wishlist.ts (zustand + persist)
```

## Develop

```sh
cd site
npm install
npm run dev
```

Server runs at http://localhost:5173.

## What's built

- Editorial cinematic hero (auto-rotating 4-slide carousel)
- Mother PLP (`/shop`) with brand/strength/flavor/format/price filters, sort, empty-state with smart fallback
- Brand index + per-brand PLPs with About modal
- PDP with image gallery, variant chips (flavor + strength), reviews, star distribution chart, sticky mobile CTA
- Cart drawer with BYO 15% discount, free-ship progress, empty state
- BYO Box configurator with sticky summary sidebar
- Single-page checkout with Apple/Shop/Google Pay tabs, age verification, confirmation page
- Account dashboard with active order tracking
- Flavor Finder quiz with image-based questions and a real matching algorithm (scores all 41 products against 6 answers)
- Search overlay, mobile hamburger menu, 404 page
- Mobile-first responsive at all breakpoints

## Notes
- No backend yet — products / brands / reviews are static modules in `src/data/`
- Cart + wishlist persist via zustand-persist (localStorage)
- All payment / shipping / order data is mocked
