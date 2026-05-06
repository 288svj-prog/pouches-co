import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
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
 * Desktop-only search dropdown. Anchored beneath the top nav as a 560px panel
 * with a max-height; closes on outside click or ESC.
 *
 * Mobile uses the full-screen <SearchOverlay /> instead — this component is
 * `hidden md:block`-gated by the parent (TopNav).
 */
export function SearchDropdown({ open, onClose, anchorRef }: {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}) {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Open/close lifecycle
  useEffect(() => {
    if (!open) return;
    // Focus the input
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    // ESC key + click-outside dismiss
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose, anchorRef]);

  // Hydrate recent searches when opened
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [open]);

  const term = q.toLowerCase().trim();
  const { matchedProducts, matchedBrands } = useMemo(() => {
    if (!term) {
      return {
        matchedProducts: products.filter((p) => p.bestseller).slice(0, 5) as Product[],
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
      .slice(0, 6);
    const brandMatches = brands
      .filter((b) => b.name.toLowerCase().includes(term) || b.slug.toLowerCase().includes(term))
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop dim — clicks pass through to onClose via the document listener,
          but visually we still soften the page below the dropdown. */}
      <div className="fixed inset-0 top-[88px] md:top-24 z-30 bg-black/30 animate-fade-in pointer-events-none" />

      <div
        ref={panelRef}
        role="dialog"
        aria-label="Search"
        className="absolute right-4 md:right-10 top-full mt-2 z-40 w-[min(560px,calc(100vw-2rem))] max-h-[min(640px,calc(100vh-120px))] bg-bg-primary border border-edge shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col animate-fade-in"
      >
        {/* Search input */}
        <div className="shrink-0 p-3 border-b border-edge-muted">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brands, flavors, strengths…"
              className="w-full h-11 pl-10 pr-20 bg-bg-secondary border border-edge text-white text-sm placeholder:text-ink-muted focus:outline-none focus:border-accent transition"
              aria-label="Search products"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ('');
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="w-7 h-7 flex items-center justify-center text-ink-secondary hover:text-white transition"
                >
                  <X size={14} />
                </button>
              )}
              <span className="px-1.5 h-5 inline-flex items-center justify-center text-[9px] text-ink-secondary font-mono border border-edge">
                ESC
              </span>
            </div>
          </div>
        </div>

        {/* Results scroll area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!term && recent.length > 0 && (
            <Section
              label="RECENT"
              rightLabel="CLEAR"
              onRightClick={clearRecent}
            >
              <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQ(r)}
                    className="h-7 px-2.5 border border-edge text-white text-[10px] font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {!term && (
            <Section label="POPULAR">
              <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQ(t.toLowerCase())}
                    className="h-7 px-2.5 border border-edge text-white text-[10px] font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {term && matchedBrands.length > 0 && (
            <Section label={`BRANDS · ${matchedBrands.length}`}>
              <ul className="px-3 pb-3 grid grid-cols-2 gap-1.5">
                {matchedBrands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to={`/brands/${b.slug}`}
                      onClick={() => {
                        persistRecent(b.name);
                        onClose();
                      }}
                      className="group relative flex items-center gap-2 h-10 px-3 border border-edge bg-bg-secondary hover:border-accent transition overflow-hidden"
                    >
                      <span
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${b.swatch} 0%, transparent 70%)`,
                        }}
                        aria-hidden
                      />
                      <span className="relative">
                        <BrandLogo brandSlug={b.slug} height={14} color="#FFFFFF" />
                      </span>
                      <span className="relative text-mono-badge text-white ml-auto">
                        {b.productCount} →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section
            label={
              term
                ? `PRODUCTS · ${matchedProducts.length} OF ${totalProductCount}`
                : 'TRENDING NOW'
            }
            rightLink="/shop"
            rightLabel="ALL"
            onRightLinkClick={onClose}
          >
            {term && matchedProducts.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <div className="text-mono-eyebrow text-accent mb-1">NO MATCHES</div>
                <p className="font-display italic text-white text-xl leading-tight">
                  Nothing matched "{q}".
                </p>
                <Link
                  to="/quiz"
                  onClick={onClose}
                  className="mt-3 inline-flex items-center gap-1 text-accent text-xs underline underline-offset-4"
                >
                  Take the Flavor Finder quiz <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <ul className="border-t border-edge-muted">
                {matchedProducts.map((p) => {
                  const brand = brandBySlug(p.brandSlug);
                  return (
                    <li key={p.slug} className="border-b border-edge-muted last:border-b-0">
                      <Link
                        to={`/products/${p.slug}`}
                        onClick={() => {
                          if (term) persistRecent(q);
                          onClose();
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 group hover:bg-white/[0.03] transition"
                      >
                        <span className="w-11 h-11 shrink-0 overflow-hidden border border-edge-muted">
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
                          <div className="text-white text-sm font-bold leading-tight mt-1 truncate">
                            <Highlight text={p.flavor} term={term} />
                          </div>
                          <div className="text-mono-badge text-ink-secondary mt-0.5">
                            {p.strengthMg}MG <span className="text-accent">·</span>{' '}
                            {p.strengthTier.toUpperCase().replace('-', ' ')}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white font-bold text-sm tabular-nums">
                            ${p.price.toFixed(2)}
                          </div>
                          <CornerDownLeft
                            size={11}
                            className="text-ink-muted group-hover:text-accent inline-block mt-1 transition"
                            strokeWidth={2}
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        {/* Footer hint */}
        <div className="shrink-0 border-t border-edge-muted px-3 py-2 flex items-center justify-between text-mono-badge text-ink-secondary">
          <span>Press <KeyHint>↵</KeyHint> to open</span>
          <Link to="/shop" onClick={onClose} className="hover:text-accent transition inline-flex items-center gap-1">
            BROWSE ALL <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </>
  );
}

/* Sub-bits */

function KeyHint({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 h-4 inline-flex items-center justify-center text-[9px] text-ink-secondary font-mono border border-edge mx-0.5">
      {children}
    </span>
  );
}

function Section({
  label,
  rightLabel,
  rightLink,
  onRightClick,
  onRightLinkClick,
  children,
}: {
  label: string;
  rightLabel?: string;
  rightLink?: string;
  onRightClick?: () => void;
  onRightLinkClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-3">
      <div className="flex items-center justify-between gap-3 px-3 mb-2">
        <span className="text-mono-eyebrow text-accent">{label}</span>
        {rightLink ? (
          <Link
            to={rightLink}
            onClick={onRightLinkClick}
            className="text-mono-badge text-ink-secondary hover:text-accent transition inline-flex items-center gap-1"
          >
            {rightLabel} <ArrowRight size={11} />
          </Link>
        ) : rightLabel ? (
          <button
            type="button"
            onClick={onRightClick}
            className="text-mono-badge text-ink-secondary hover:text-accent transition"
          >
            {rightLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

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
