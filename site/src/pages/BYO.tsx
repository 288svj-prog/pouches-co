import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Check, X, ChevronUp, Package, Search } from 'lucide-react';
import { celebrate } from '../lib/anim';
import { products } from '../data/products';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { Eyebrow } from '../components/Eyebrow';
import { useCart, BYO_CONFIG } from '../store/cart';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export default function BYO() {
  useDocumentMeta({
    title: 'Build a Box — mix any 6 pouches, save 15%',
    description: 'Pick six pouches from any Swedish brand. Any flavor, any strength. We assemble and ship from Uppsala. Free worldwide shipping over $49.',
  });
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const updateQty = useCart((s) => s.updateQty);
  const navigate = useNavigate();

  // Empty out every BYO item in one tap (with confirm) — leaves any non-BYO items intact.
  const clearBox = () => {
    const toRemove = items.filter((i) => i.byo);
    if (toRemove.length === 0) return;
    if (!window.confirm(`Clear all ${toRemove.length} item${toRemove.length === 1 ? '' : 's'} from your box?`)) return;
    toRemove.forEach((i) => remove(i.productSlug));
  };
  const [strengthFilter, setStrengthFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileBoxOpen, setMobileBoxOpen] = useState(false);

  // Refs for celebration animation when box hits 6/6
  const desktopBoxRef = useRef<HTMLElement | null>(null);
  const mobileBarRef = useRef<HTMLDivElement | null>(null);
  const lastByoCount = useRef(0);
  const byoItems = useMemo(() => items.filter((i) => i.byo), [items]);
  const byoCount = byoItems.reduce((s, i) => s + i.qty, 0);
  const byoTotal = byoItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = byoCount >= BYO_CONFIG.threshold ? +(byoTotal * BYO_CONFIG.rate).toFixed(2) : 0;
  const liveTotal = +(byoTotal - discount).toFixed(2);

  // Expand byoItems into one slot per pouch (qty 3 of A → 3 slots of A) so the
  // box visual stays in sync with the count, even when the user adjusts qty.
  const byoSlots = useMemo(
    () =>
      byoItems.flatMap((it) =>
        Array.from({ length: it.qty }, () => it),
      ),
    [byoItems],
  );
  const slotCount = Math.max(BYO_CONFIG.threshold, byoCount);

  const filtered = useMemo(() => {
    let list = products;
    if (strengthFilter) list = list.filter((p) => p.strengthTier === strengthFilter);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const brand = brandBySlug(p.brandSlug);
        return (
          p.flavor.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          (brand?.name.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return list;
  }, [strengthFilter, searchQuery]);
  const hasFilters = !!strengthFilter || !!searchQuery.trim();

  // Celebrate when the box transitions from <6 to ≥6
  useEffect(() => {
    if (byoCount >= 6 && lastByoCount.current < 6) {
      if (desktopBoxRef.current) celebrate(desktopBoxRef.current);
      if (mobileBarRef.current) celebrate(mobileBarRef.current);
    }
    lastByoCount.current = byoCount;
  }, [byoCount]);

  const headline = byoCount === 0 ? 'Build your box.' : byoCount < 6 ? 'Half built.' : 'Box ready.';
  const sub =
    byoCount === 0
      ? 'Pick 6 pouches across any brand. The cart applies 15% automatically when you hit six.'
      : byoCount < 6
        ? `Pick ${6 - byoCount} more pouches to lock in your 15% box discount. Mix and match across all 12 brands.`
        : 'Your box is complete and 15% off. Add more or check out.';

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="text-center mb-10">
          <Eyebrow className="mb-3">
            BYO BOX · {byoCount > BYO_CONFIG.threshold ? `${byoCount} POUCHES` : `${byoCount} OF ${BYO_CONFIG.threshold}`} SELECTED
          </Eyebrow>
          <h1 className="font-display italic text-white text-5xl md:text-6xl lg:text-7xl">{headline}</h1>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto">{sub}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10">
          {/* LEFT - product picker grid */}
          <div>
            {/* Search input */}
            <div className="mb-3 relative">
              <Search
                size={16}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand, flavor, or name…"
                className="w-full h-11 pl-10 pr-10 bg-bg-secondary border border-edge-muted text-white placeholder-ink-muted text-sm focus:outline-none focus:border-accent transition"
                aria-label="Search pouches"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-ink-secondary hover:text-white transition no-tap-highlight"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Toolbar — mobile: stacked (label+sort on row 1, segments on row 2);
                desktop: single row with segments inline. */}
            <div className="mb-5 border-y border-edge-muted">
              {/* Top row: STRENGTH label + SORT readout (always one line) */}
              <div className="flex items-center justify-between px-0.5 py-2.5">
                <span className="text-mono-eyebrow text-accent">STRENGTH</span>
                <span className="text-mono-badge text-ink-secondary">
                  <span className="text-ink-muted">SORT </span>BESTSELLERS
                </span>
              </div>
              {/* Segment-control: 5 contiguous cells, full-width on mobile, scrolls if cramped */}
              <div
                className="flex border-t border-edge-muted overflow-x-auto scrollbar-hide"
                role="tablist"
                aria-label="Strength filter"
              >
                <button
                  onClick={() => setStrengthFilter(null)}
                  className={`flex-1 shrink-0 min-w-[72px] h-10 px-3 text-[11px] font-bold uppercase tracking-wider border-r border-edge-muted last:border-r-0 transition no-tap-highlight ${
                    strengthFilter === null
                      ? 'bg-accent text-accent-on'
                      : 'text-white hover:bg-white/[0.03]'
                  }`}
                  aria-pressed={strengthFilter === null}
                >
                  ALL
                </button>
                {(['light', 'regular', 'strong', 'x-strong'] as const).map((s) => {
                  const active = strengthFilter === s;
                  const labelMap = { light: 'LIGHT', regular: 'REGULAR', strong: 'STRONG', 'x-strong': 'X-STRONG' };
                  return (
                    <button
                      key={s}
                      onClick={() => setStrengthFilter(active ? null : s)}
                      className={`flex-1 shrink-0 min-w-[80px] h-10 px-3 text-[11px] font-bold uppercase tracking-wider border-r border-edge-muted last:border-r-0 transition no-tap-highlight ${
                        active ? 'bg-accent text-accent-on' : 'text-white hover:bg-white/[0.03]'
                      }`}
                      aria-pressed={active}
                    >
                      {labelMap[s]}
                    </button>
                  );
                })}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-edge bg-bg-secondary/50 p-10 text-center">
                <div className="text-mono-eyebrow text-ink-secondary mb-2">NO MATCHES</div>
                <div className="text-white text-base">
                  No pouches match {searchQuery ? <>“<span className="text-accent">{searchQuery}</span>”</> : 'these filters'}.
                </div>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStrengthFilter(null);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-accent text-mono-badge hover:opacity-80 transition no-tap-highlight"
                  >
                    <X size={11} /> CLEAR FILTERS
                  </button>
                )}
              </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const brand = brandBySlug(p.brandSlug);
                const inBox = items.find((i) => i.productSlug === p.slug && i.byo);
                return (
                  <div
                    key={p.slug}
                    className={`relative rounded-card border bg-bg-secondary overflow-hidden transition ${
                      inBox ? 'border-accent shadow-glow-accent-strong' : 'border-edge'
                    }`}
                  >
                    {inBox && (
                      <span className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-accent text-accent-on flex items-center justify-center">
                        <Check size={16} strokeWidth={3} />
                      </span>
                    )}
                    <div className="relative aspect-square">
                      <Tin
                        brand={brand?.name || ''}
                        flavor={p.flavor.toUpperCase()}
                        swatch={p.swatch}
                        textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                        surface={brand?.surface || 'concrete'}
                        size={300}
                        image={productImage(p.slug, p.brandSlug)}
                      />
                      <div
                        className="absolute left-0 right-0 bottom-0 h-1.5"
                        style={{ background: p.swatch }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                      <div className="text-white font-bold text-sm mt-1">{p.flavor}</div>
                      <div className="text-mono-badge text-ink-secondary mt-1">
                        ${p.price.toFixed(2)} · {p.strengthMg}MG {p.strengthTier.toUpperCase()}
                      </div>
                      {inBox ? (
                        <div className="mt-3 flex h-10 border border-accent">
                          <button
                            onClick={() => updateQty(p.slug, inBox.qty - 1)}
                            className="w-10 shrink-0 bg-accent/10 text-accent hover:bg-accent/20 transition flex items-center justify-center no-tap-highlight"
                            aria-label={inBox.qty === 1 ? 'Remove from box' : 'Decrease quantity'}
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <div className="flex-1 bg-accent text-accent-on flex items-center justify-center gap-1.5 text-sm font-bold tabular-nums">
                            <Check size={14} strokeWidth={3} />
                            <span>{inBox.qty}</span>
                          </div>
                          <button
                            onClick={() => updateQty(p.slug, inBox.qty + 1)}
                            className="w-10 shrink-0 bg-accent/10 text-accent hover:bg-accent/20 transition flex items-center justify-center no-tap-highlight"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => add(p, 1, { byo: true })}
                          className="mt-3 w-full h-10 text-[11px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 border border-white text-white hover:bg-white/5"
                        >
                          <Plus size={12} strokeWidth={3} />
                          <span>ADD TO BOX</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>

          {/* RIGHT - sticky summary (desktop only — mobile uses sticky bottom bar) */}
          <aside ref={desktopBoxRef} className="hidden lg:block lg:sticky lg:top-32 self-start bg-bg-secondary border border-edge overflow-hidden">
            <div className="p-5 border-b border-edge-muted">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-mono-eyebrow text-accent">YOUR BOX</div>
                  <div className="text-white font-display italic text-3xl mt-1 leading-none tabular-nums">
                    {byoCount} {byoCount > BYO_CONFIG.threshold ? 'pouches' : `of ${BYO_CONFIG.threshold}`}
                  </div>
                </div>
                {byoCount > 0 && (
                  <button
                    onClick={clearBox}
                    className="shrink-0 inline-flex items-center gap-1 text-mono-badge text-ink-secondary hover:text-danger transition no-tap-highlight"
                    aria-label="Clear box"
                  >
                    <X size={11} /> CLEAR
                  </button>
                )}
              </div>
              <div className="text-ink-secondary text-xs mt-2">
                {byoCount >= 6 ? '✓ 15% box discount unlocked' : `${6 - byoCount} more to unlock 15% off`}
              </div>
            </div>

            <div className="p-5 border-b border-edge-muted">
              <div className="text-mono-eyebrow text-accent mb-3">BOX VISUAL</div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: slotCount }, (_, i) => {
                  const slot = byoSlots[i];
                  if (slot) {
                    const brand = brandBySlug(slot.brandSlug);
                    return (
                      <div key={i} className="relative aspect-square rounded overflow-hidden border border-accent/40 group">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={slot.swatch}
                          textColor={slot.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={100}
                          image={productImage(slot.productSlug, slot.brandSlug)}
                        />
                        <button
                          onClick={() => updateQty(slot.productSlug, slot.qty - 1)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-bg-primary/90 border border-edge flex items-center justify-center hover:border-danger hover:text-danger transition"
                          aria-label="Remove one pouch"
                        >
                          <X size={11} className="text-white" />
                        </button>
                        {slot.qty > 1 && (
                          <span className="absolute bottom-1 left-1 px-1.5 h-4 inline-flex items-center bg-accent text-accent-on text-[9px] font-bold tracking-wider tabular-nums">
                            ×{slot.qty}
                          </span>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded border border-dashed border-edge flex flex-col items-center justify-center text-edge"
                    >
                      <Plus size={20} />
                      <span className="text-mono-badge text-ink-muted mt-1">ADD</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 border-b border-edge-muted">
              <div className="text-mono-eyebrow text-accent mb-3">PRICE BREAKDOWN</div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-ink-secondary">Subtotal ({byoCount} items)</span>
                <span className="text-white">${byoTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-ink-secondary">Box discount (15%)</span>
                <span className={discount > 0 ? 'text-accent' : 'text-ink-secondary'}>
                  {discount > 0 ? `−$${discount.toFixed(2)}` : 'Unlocks at 6'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-edge-muted">
                <span className="text-mono-eyebrow text-white">TOTAL (CURRENT)</span>
                <span className="text-white font-bold text-lg">${liveTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-5">
              <button
                disabled={byoCount < 6}
                onClick={() => navigate('/checkout')}
                className="w-full h-12 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
              >
                {byoCount >= 6 ? 'PROCEED TO CHECKOUT →' : 'PROCEED TO CHECKOUT'}
              </button>
              {byoCount < 6 && (
                <div className="text-mono-badge text-ink-secondary text-center mt-2">
                  Add {6 - byoCount} more to unlock discount
                </div>
              )}
              <button className="mt-3 w-full h-12 rounded-pill border border-edge text-white font-bold uppercase tracking-wider hover:bg-white/5 transition">
                SAVE BOX FOR LATER →
              </button>
            </div>

            <div className="p-5 bg-bg-primary border-t border-edge-muted">
              <div className="text-mono-eyebrow text-accent mb-2">WHY BUILD A BOX?</div>
              <p className="text-ink-secondary text-xs leading-relaxed">
                Mix any 6 pouches across 12 brands. Save 15%. Free shipping over $49. Discover your next favorite without committing to a full roll.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile spacer — only needed when the sticky progress bar is visible
          (the bar appears once the user adds their first pouch). Without an item
          in the box, the bar is hidden so it doesn't intercept taps near the
          bottom of the viewport. */}
      <div className={`lg:hidden ${byoCount > 0 ? 'h-24' : 'h-4'}`} />

      {/* MOBILE STICKY PROGRESS BAR — hidden when box is empty */}
      {byoCount > 0 && (
        <div ref={mobileBarRef} className="lg:hidden fixed left-0 right-0 z-30 bg-bg-primary border-t border-accent/50 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]" style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => setMobileBoxOpen(true)}
            className="w-full px-4 py-3 flex items-center gap-3"
            aria-label={`View your box, ${byoCount} of 6 pouches`}
          >
            {/* Progress dots */}
            <div className="flex gap-1 shrink-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className={`block w-2 h-6 ${i < byoCount ? 'bg-accent' : 'bg-edge'}`}
                />
              ))}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-mono-badge text-accent leading-none">
                {byoCount >= 6 ? '15% UNLOCKED' : `${6 - byoCount} TO GO`}
              </div>
              <div className="text-white text-sm font-bold mt-1 truncate">
                {byoCount} of 6 · ${liveTotal.toFixed(2)}
                {discount > 0 && <span className="text-accent ml-1">(−${discount.toFixed(2)})</span>}
              </div>
            </div>
            <ChevronUp size={18} className="text-white shrink-0" />
          </button>
        </div>
      )}

      {/* MOBILE BOX BOTTOM-SHEET */}
      {mobileBoxOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileBoxOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 max-h-[85vh] bg-bg-primary border-t border-accent/40 flex flex-col animate-slide-up">
            <div className="pt-2 pb-1 flex justify-center">
              <span className="w-10 h-1 bg-edge rounded-full" />
            </div>
            <div className="px-4 pb-3 flex items-center justify-between border-b border-edge-muted">
              <div className="flex items-center gap-2 min-w-0">
                <Package size={16} className="text-accent shrink-0" strokeWidth={2} />
                <span className="text-mono-eyebrow text-white truncate">YOUR BOX · {byoCount} OF 6</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {byoCount > 0 && (
                  <button
                    onClick={clearBox}
                    className="inline-flex items-center gap-1 text-mono-badge text-ink-secondary hover:text-danger transition no-tap-highlight"
                    aria-label="Clear box"
                  >
                    <X size={11} /> CLEAR
                  </button>
                )}
                <button onClick={() => setMobileBoxOpen(false)} className="w-8 h-8 -mr-2 flex items-center justify-center" aria-label="Close">
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Grid of slots — one tile per pouch (expands beyond 6 if user adds extras) */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {Array.from({ length: slotCount }, (_, i) => {
                  const slot = byoSlots[i];
                  if (slot) {
                    const brand = brandBySlug(slot.brandSlug);
                    return (
                      <div key={i} className="relative aspect-square overflow-hidden border border-accent/40">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={slot.swatch}
                          textColor={slot.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={120}
                          image={productImage(slot.productSlug, slot.brandSlug)}
                        />
                        <button
                          onClick={() => updateQty(slot.productSlug, slot.qty - 1)}
                          className="absolute top-1 right-1 w-6 h-6 bg-bg-primary/90 border border-edge flex items-center justify-center"
                          aria-label="Remove one pouch"
                        >
                          <X size={11} className="text-white" />
                        </button>
                        {slot.qty > 1 && (
                          <span className="absolute top-1 left-1 px-1.5 h-5 inline-flex items-center bg-accent text-accent-on text-[10px] font-bold tracking-wider tabular-nums">
                            ×{slot.qty}
                          </span>
                        )}
                        <span
                          className="absolute left-0 right-0 bottom-0 h-1"
                          style={{ background: slot.swatch }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className="aspect-square border border-dashed border-edge flex items-center justify-center text-edge"
                    >
                      <Plus size={20} />
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary">Subtotal ({byoCount} items)</span>
                  <span className="text-white tabular-nums">${byoTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-secondary">Box discount (15%)</span>
                  <span className={discount > 0 ? 'text-accent tabular-nums' : 'text-ink-muted'}>
                    {discount > 0 ? `−$${discount.toFixed(2)}` : 'Unlocks at 6'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-edge-muted">
                  <span className="text-mono-eyebrow text-white">TOTAL</span>
                  <span className="text-white font-bold text-lg tabular-nums">${liveTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="border-t border-edge-muted p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2 shrink-0">
              <button
                disabled={byoCount < 6}
                onClick={() => {
                  setMobileBoxOpen(false);
                  navigate('/checkout');
                }}
                className="w-full h-13 py-3 bg-accent text-accent-on font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
              >
                {byoCount >= 6
                  ? `CHECKOUT · $${liveTotal.toFixed(2)}`
                  : `ADD ${6 - byoCount} MORE TO CHECKOUT`}
              </button>
              <button
                onClick={() => setMobileBoxOpen(false)}
                className="w-full h-11 text-ink-secondary text-sm hover:text-white transition"
              >
                Keep building
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
