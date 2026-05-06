import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { products, totalProductCount } from '../data/products';
import type { Product } from '../data/products';
import { brands } from '../data/brands';
import { brandBySlug } from '../data/brands';
import { Tin } from './Tin';
import { productImage } from '../data/images';
import { BrandLogo } from './BrandLogo';

const RECENT_KEY = 'pouches-recent-searches';
const SUGGESTIONS = ['MINT', 'STRONG', 'ZYN', 'COOL MINT', 'CINNAMON', 'KILLA', 'X-STRONG', 'FUMI'];

/**
 * Full-screen search overlay.
 *
 * - Mobile: full bleed, sticky search header, body scrolls.
 * - Desktop: full bleed centered with a max-width inner column.
 * - No backdrop blur (user feedback) — solid bg-primary surface so the page
 *   never bleeds through.
 * - Live results below the input as the user types: brand jumps + product
 *   list with thumbnails and prices.
 * - Recent searches persisted in localStorage.
 * - Keyboard: ESC closes, Enter goes to /shop?q=, ↑↓ to navigate results.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Lock body scroll while open + keyboard handler
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Restore recent searches when opened
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    // Focus input slightly delayed so iOS keyboard reliably opens.
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  const term = q.toLowerCase().trim();
  const { matchedProducts, matchedBrands } = useMemo(() => {
    if (!term) {
      return {
        matchedProducts: products.filter((p) => p.bestseller).slice(0, 4) as Product[],
        matchedBrands: [] as typeof brands,
      };
    }
    const productMatches = products
      .filter(
        (p) =>
          p.flavor.toLowerCase().includes(term) ||
          p.brandSlug.toLowerCase().includes(term) ||
          p.flavorFamily.toLowerCase().includes(term) ||
          p.strengthTier.toLowerCase().includes(term) ||
          `${p.strengthMg}mg`.includes(term)
      )
      .slice(0, 8);
    const brandMatches = brands
      .filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.slug.toLowerCase().includes(term)
      )
      .slice(0, 4);
    return { matchedProducts: productMatches, matchedBrands: brandMatches };
  }, [term]);

  const persistRecent = (query: string) => {
    if (!query.trim()) return;
    const next = [query, ...recent.filter((r) => r !== query)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    persistRecent(q.trim());
    // For now, push the user to the first matched product or to /shop
    if (matchedProducts.length === 1) {
      window.location.href = `/products/${matchedProducts[0].slug}`;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col animate-fade-in">
      {/* STICKY SEARCH HEADER */}
      <header className="shrink-0 border-b border-edge-muted">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-3 md:py-5 flex items-center gap-3">
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brands, flavors, strengths…"
              className="w-full h-12 md:h-14 pl-12 pr-12 bg-bg-secondary border border-edge text-white text-base md:text-lg placeholder:text-ink-muted focus:outline-none focus:border-accent transition"
              aria-label="Search products"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ink-secondary hover:text-white transition"
              >
                <X size={16} />
              </button>
            )}
          </form>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 px-3 h-12 md:h-14 inline-flex items-center gap-1.5 text-mono-badge text-white hover:text-accent transition"
          >
            CLOSE
            <span className="hidden md:inline-flex items-center justify-center w-5 h-5 border border-edge text-[9px] text-ink-secondary font-mono">
              ESC
            </span>
          </button>
        </div>
      </header>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-5 md:py-8">
          {/* QUICK CHIPS — only when no term */}
          {!term && (
            <>
              {recent.length > 0 && (
                <section className="mb-6">
                  <SectionHead label="RECENT" rightLabel="CLEAR" onRightClick={clearRecent} />
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => setQ(r)}
                        className="h-9 px-3 border border-edge text-white text-[11px] font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition no-tap-highlight"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="mb-6">
                <SectionHead label="POPULAR" />
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQ(t.toLowerCase())}
                      className="h-9 px-3 border border-edge text-white text-[11px] font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition no-tap-highlight"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* BRAND MATCHES */}
          {term && matchedBrands.length > 0 && (
            <section className="mb-7">
              <SectionHead label={`BRANDS · ${matchedBrands.length}`} />
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {matchedBrands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to={`/brands/${b.slug}`}
                      onClick={() => {
                        persistRecent(b.name);
                        onClose();
                      }}
                      className="group relative block aspect-[2/1] border border-edge bg-bg-secondary hover:border-accent transition overflow-hidden"
                    >
                      <span
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${b.swatch} 0%, ${b.swatch}55 50%, #0A0A0A 100%)`,
                        }}
                        aria-hidden
                      />
                      <span className="relative h-full flex items-center justify-center p-3">
                        <BrandLogo brandSlug={b.slug} height={20} color="#FFFFFF" className="sm:!h-6" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* PRODUCT MATCHES */}
          <section>
            <SectionHead
              label={
                term
                  ? `PRODUCTS · ${matchedProducts.length} OF ${totalProductCount}`
                  : 'TRENDING NOW'
              }
              rightLabel="BROWSE ALL"
              rightLink="/shop"
              onRightLinkClick={onClose}
            />
            {term && matchedProducts.length === 0 ? (
              <div className="border border-edge-muted py-10 text-center px-4">
                <div className="text-mono-eyebrow text-accent mb-2">NO MATCHES</div>
                <p className="font-display italic text-white text-2xl md:text-3xl leading-tight">
                  Nothing matched "{q}".
                </p>
                <p className="mt-3 text-ink-secondary text-sm">
                  Try a brand name (ZYN, KILLA), a flavor (mint, cinnamon), or a strength tier.
                </p>
                <Link
                  to="/quiz"
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-1 text-accent text-sm underline underline-offset-4"
                >
                  Take the Flavor Finder quiz <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-edge-muted border-y border-edge-muted">
                {matchedProducts.map((p) => {
                  const brand = brandBySlug(p.brandSlug);
                  return (
                    <li key={p.slug}>
                      <Link
                        to={`/products/${p.slug}`}
                        onClick={() => {
                          if (term) persistRecent(q);
                          onClose();
                        }}
                        className="flex items-center gap-3 sm:gap-4 py-3 group hover:bg-white/[0.02] transition px-2 -mx-2"
                      >
                        <span className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden border border-edge-muted">
                          <Tin
                            brand={brand?.name || ''}
                            swatch={p.swatch}
                            textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                            surface={brand?.surface || 'concrete'}
                            size={120}
                            image={productImage(p.slug, p.brandSlug)}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-mono-badge text-ink-secondary leading-none">
                            {brand?.name}
                          </div>
                          <div className="text-white text-[15px] font-bold leading-tight mt-1 truncate">
                            <Highlight text={p.flavor} term={term} />
                          </div>
                          <div className="text-mono-badge text-ink-secondary mt-0.5">
                            {p.strengthMg}MG <span className="text-accent">·</span>{' '}
                            {p.strengthTier.toUpperCase().replace('-', ' ')}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white font-bold text-base tabular-nums">
                            ${p.price.toFixed(2)}
                          </div>
                          <CornerDownLeft
                            size={14}
                            className="text-ink-muted group-hover:text-accent inline-block mt-1.5 transition"
                            strokeWidth={2}
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* JUMP TO A BRAND — only when no term */}
          {!term && (
            <section className="mt-7">
              <SectionHead label="OR JUMP TO A BRAND" />
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to={`/brands/${b.slug}`}
                      onClick={onClose}
                      className="group relative block aspect-[2/1] border border-edge bg-bg-secondary hover:border-accent transition overflow-hidden"
                    >
                      <span
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${b.swatch} 0%, ${b.swatch}55 50%, #0A0A0A 100%)`,
                        }}
                        aria-hidden
                      />
                      <span className="relative h-full flex items-center justify-center p-3">
                        <BrandLogo brandSlug={b.slug} height={20} color="#FFFFFF" className="sm:!h-6" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHead({
  label,
  rightLabel,
  rightLink,
  onRightClick,
  onRightLinkClick,
}: {
  label: string;
  rightLabel?: string;
  rightLink?: string;
  onRightClick?: () => void;
  onRightLinkClick?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-mono-eyebrow text-accent shrink-0">{label}</span>
      <span aria-hidden className="flex-1 h-px bg-accent/30" />
      {rightLink ? (
        <Link
          to={rightLink}
          onClick={onRightLinkClick}
          className="text-mono-badge text-white hover:text-accent transition inline-flex items-center gap-1 shrink-0"
        >
          {rightLabel} <ArrowRight size={11} />
        </Link>
      ) : rightLabel ? (
        <button
          type="button"
          onClick={onRightClick}
          className="text-mono-badge text-ink-secondary hover:text-accent transition shrink-0"
        >
          {rightLabel}
        </button>
      ) : null}
    </div>
  );
}

/** Inline highlight of the matched substring. */
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/25 text-accent px-0.5">{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  );
}
