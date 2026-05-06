import { Link } from 'react-router-dom';
import { Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../data/products';
import { brandBySlug } from '../data/brands';
import { Tin } from './Tin';
import { Stars } from './Stars';
import { useCart } from '../store/cart';
import { useWishlist, selectIsWished } from '../store/wishlist';
import { productImage } from '../data/images';

/**
 * Editorial product card.
 * - Mobile: tight, photo-led, with a floating circular ADD button overlaid on the image.
 *   Single inline "BRAND · 6MG" line, big product name, price + stars on one row.
 * - Desktop: traditional 2-column row at bottom (price/stars left, ADD button right).
 *   Hover reveals widened ADD TO BAG label, glow, slight lift, photo zoom.
 * Stable height across all states — hover only mutates visuals.
 */
export function ProductCard({ product, byo }: { product: Product; byo?: boolean }) {
  const brand = brandBySlug(product.brandSlug);
  const [hovered, setHovered] = useState(false);
  const add = useCart((s) => s.add);
  const wishToggle = useWishlist((s) => s.toggle);
  const isWished = useWishlist((s) => selectIsWished(s.slugs, product.slug));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, 1, byo ? { byo: true } : undefined);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex flex-col bg-bg-secondary border transition-all duration-base ease-pouch-out h-full no-tap-highlight ${
        hovered
          ? 'border-accent shadow-glow-accent-strong md:-translate-y-0.5'
          : 'border-edge'
      }`}
    >
      {/* TL badges */}
      <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.bestseller && (
          <span className="px-1.5 py-0.5 md:px-2 bg-accent text-accent-on text-mono-badge font-bold tracking-wider">
            BESTSELLER
          </span>
        )}
        {product.newArrival && !product.bestseller && (
          <span className="px-1.5 py-0.5 md:px-2 bg-accent text-accent-on text-mono-badge font-bold tracking-wider">
            NEW
          </span>
        )}
      </div>

      {/* TR wishlist button — same on mobile + desktop */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          wishToggle(product.slug);
        }}
        className="absolute top-2 right-2 md:top-3 md:right-3 z-10 w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-black/60 transition no-tap-highlight"
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={18}
          className={isWished ? 'text-accent' : 'text-white'}
          fill={isWished ? '#CCFF00' : 'transparent'}
          strokeWidth={1.5}
        />
      </button>

      {/* Image area */}
      <div className="relative overflow-hidden aspect-square">
        <Tin
          brand={brand?.name || ''}
          flavor={product.flavor.toUpperCase()}
          swatch={product.swatch}
          textColor={product.swatch === '#FFFFFF' || product.swatch === '#E5E5E5' ? '#0A0A0A' : '#FFFFFF'}
          surface={brand?.surface || 'concrete'}
          size={320}
          rotation={hovered ? 4 : -8}
          image={productImage(product.slug, product.brandSlug)}
          imageAlt={`${brand?.name} ${product.flavor} ${product.strengthMg}mg pouch tin on textured surface`}
          className={`transition-transform duration-slow ease-pouch-out ${hovered ? 'scale-[1.04]' : 'scale-100'}`}
        />

        {/* Flavor accent strip */}
        <div
          className="absolute left-0 right-0 bottom-0 h-1.5 transition-all duration-base z-10"
          style={{
            background: product.swatch,
            opacity: hovered ? 1 : 0.85,
            boxShadow: hovered ? `0 0 16px ${product.swatch}` : 'none',
          }}
          aria-hidden="true"
        />

        {/* Mobile-only floating quick-add button — overlaid on the bottom-right of the image */}
        <button
          onClick={handleAdd}
          className="md:hidden absolute bottom-3 right-3 z-20 w-11 h-11 bg-accent text-accent-on flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-90 transition-transform no-tap-highlight"
          aria-label={`Add ${product.flavor} to bag`}
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-col p-3 md:p-4 md:pt-3.5 flex-1">
        {/* MOBILE: tight info layout */}
        <div className="md:hidden flex flex-col gap-1.5 flex-1">
          <div className="text-mono-badge text-ink-secondary">
            {brand?.name} <span className="text-accent">·</span> {product.strengthMg}MG
          </div>
          <h3 className="font-bold text-white text-[15px] leading-tight line-clamp-1">{product.flavor}</h3>
          <div className="mt-auto pt-1 flex items-end justify-between gap-2">
            <div className="text-white font-bold text-base leading-none">${product.price.toFixed(2)}</div>
            <div className="flex items-center gap-1">
              <Stars rating={product.rating} size={10} />
              <span className="text-[10px] text-ink-secondary">({product.reviews})</span>
            </div>
          </div>
        </div>

        {/* DESKTOP: full layout with hover-revealed ADD TO BAG */}
        <div className="hidden md:flex flex-col flex-1">
          <div className="text-mono-badge text-ink-secondary mb-1">{brand?.name}</div>
          <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-1">{product.flavor}</h3>
          <div className="text-mono-badge text-white/80 mb-3">
            {product.strengthMg}MG <span className="text-accent">·</span> {product.strengthTier.toUpperCase().replace('-', ' ')}
          </div>
          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white font-bold text-lg leading-none">${product.price.toFixed(2)}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Stars rating={product.rating} size={11} />
                <span className="text-[11px] text-ink-secondary">({product.reviews})</span>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className={`shrink-0 inline-flex items-center justify-center gap-1 h-9 text-mono-badge font-bold tracking-wider transition-all ease-pouch-out ${
                hovered
                  ? 'w-32 bg-accent text-accent-on'
                  : 'w-16 bg-accent text-accent-on hover:brightness-105'
              }`}
              aria-label={`Add ${product.flavor} to bag`}
            >
              <Plus size={12} strokeWidth={3} />
              <span>{hovered ? 'ADD TO BAG' : 'ADD'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MiniProductCard({ product, onAdd }: { product: Product; onAdd?: () => void }) {
  const brand = brandBySlug(product.brandSlug);
  return (
    <div className="flex items-center gap-3 p-3 border border-edge bg-bg-secondary">
      <div className="w-14 h-14 overflow-hidden flex-shrink-0">
        <Tin
          brand={brand?.name || ''}
          swatch={product.swatch}
          textColor={product.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
          surface={brand?.surface || 'concrete'}
          size={120}
          image={productImage(product.slug, product.brandSlug)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
        <div className="text-white font-bold text-sm truncate">{product.flavor}</div>
        <div className="text-mono-badge text-ink-secondary mt-1">
          {product.strengthMg}mg <span className="text-accent">·</span> ${product.price.toFixed(2)}
        </div>
      </div>
      <button
        onClick={onAdd}
        className="w-10 h-10 bg-accent text-accent-on flex items-center justify-center hover:brightness-105 active:scale-[0.95] transition"
        aria-label="Add to cart"
      >
        <Check size={18} strokeWidth={3} className="hidden" />
        <Plus size={18} strokeWidth={3} />
      </button>
    </div>
  );
}
