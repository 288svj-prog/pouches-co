import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Lock, Truck, ArrowRight, Package, Sparkles } from 'lucide-react';
import {
  useCart,
  selectItemCount,
  selectByoCount,
  selectSubtotal,
  selectByoDiscount,
  selectTotal,
  selectFreeShipProgress,
} from '../store/cart';
import { Tin } from './Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { bestsellers, productBySlug, totalProductCount } from '../data/products';

/**
 * Cart drawer — mobile-first.
 * - Mobile: full-screen overlay with drag handle, sticky header + sticky CTA footer.
 *   Content area is the only scrollable region. Touch-targets ≥ 44px.
 * - Desktop (sm+): 480px right-side panel with the same internal layout.
 */
export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const subtotal = selectSubtotal(items);
  const byoDiscount = selectByoDiscount(items);
  const total = selectTotal(items);
  const itemCount = selectItemCount(items);
  const byoCount = selectByoCount(items);
  const ship = selectFreeShipProgress(items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!open) return null;
  const empty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim overlay */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={close} />

      <aside
        role="dialog"
        aria-label="Shopping bag"
        className="absolute inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-[440px] md:w-[480px] bg-bg-primary sm:border-l sm:border-edge-muted flex flex-col animate-slide-right shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* HEADER — sticky at top of drawer */}
        <header className="shrink-0 px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between border-b border-edge-muted">
          <div className="flex items-center gap-2.5">
            <span className="text-white font-bold uppercase tracking-wider text-sm">Your Bag</span>
            <span
              className={`inline-flex items-center justify-center min-w-7 h-6 px-2 text-mono-badge ${
                itemCount > 0 ? 'bg-accent text-accent-on' : 'border border-edge text-ink-secondary'
              }`}
            >
              {itemCount}
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="w-10 h-10 -mr-2 flex items-center justify-center text-white hover:text-accent transition"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        {empty ? (
          <EmptyState onClose={close} />
        ) : (
          <>
            {/* FREE SHIPPING PROGRESS */}
            <div className="shrink-0 px-4 sm:px-5 py-3 bg-bg-secondary border-b border-edge-muted">
              <div className="flex items-center justify-between text-mono-badge mb-2">
                {ship.remaining > 0 ? (
                  <>
                    <span className="text-white inline-flex items-center gap-1.5">
                      <Truck size={11} className="text-accent" />
                      ADD <span className="text-accent">${ship.remaining.toFixed(2)}</span> FOR FREE SHIPPING
                    </span>
                    <span className="text-ink-secondary">{Math.round(ship.pct)}%</span>
                  </>
                ) : (
                  <span className="text-accent inline-flex items-center gap-1.5 font-bold">
                    <Sparkles size={12} /> FREE WORLDWIDE SHIPPING UNLOCKED
                  </span>
                )}
              </div>
              <div className="h-1 bg-edge overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-slow ease-pouch-out"
                  style={{ width: `${ship.pct}%` }}
                />
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* ITEMS LIST — rigid grid: every row is exactly the thumb's height
                  (96px), so the whole list reads as a clean stack. */}
              <ul className="divide-y divide-edge-muted">
                {items.map((it) => {
                  const brand = brandBySlug(it.brandSlug);
                  const original = it.byo ? it.price : null;
                  const display = it.byo ? +(it.price * 0.85).toFixed(2) : it.price;
                  return (
                    <li
                      key={it.productSlug}
                      className={`relative grid grid-cols-[88px_1fr] sm:grid-cols-[96px_1fr] gap-3 sm:gap-4 p-4 sm:px-5 transition ${
                        it.justAdded ? 'bg-accent/[0.03]' : ''
                      }`}
                    >
                      {it.justAdded && (
                        <span aria-hidden className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />
                      )}

                      {/* Thumb — fixed dimensions */}
                      <div className="relative w-[88px] h-[88px] sm:w-24 sm:h-24 overflow-hidden border border-edge-muted">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={it.swatch}
                          textColor={it.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={160}
                          image={productImage(it.productSlug, it.brandSlug)}
                        />
                        {it.byo && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-accent text-accent-on text-[8px] font-mono font-bold tracking-wider">
                            BYO
                          </span>
                        )}
                        <div
                          className="absolute left-0 right-0 bottom-0 h-1"
                          style={{ background: it.swatch }}
                        />
                      </div>

                      {/* Body — 2-row grid (top: meta+price; bottom: qty+remove)
                          with min-height matching the thumb so rows always align. */}
                      <div className="min-w-0 grid grid-rows-[1fr_auto] min-h-[88px] sm:min-h-24 gap-2">
                        {/* TOP: brand + name + variant on left, price stack on right */}
                        <div className="grid grid-cols-[1fr_auto] gap-2 min-w-0">
                          <div className="min-w-0">
                            <div className="text-mono-badge text-ink-secondary leading-none">{brand?.name}</div>
                            <h3 className="text-white font-bold text-[15px] leading-tight mt-1.5 truncate">{it.name}</h3>
                            <div className="text-[11px] text-ink-secondary mt-1">{it.variant}</div>
                          </div>
                          <div className="text-right shrink-0">
                            {original && (
                              <div className="text-[11px] text-ink-secondary line-through leading-none">
                                ${(original * it.qty).toFixed(2)}
                              </div>
                            )}
                            <div className={`font-bold text-base leading-tight tabular-nums ${it.byo ? 'text-accent mt-1' : 'text-white'}`}>
                              ${(display * it.qty).toFixed(2)}
                            </div>
                            {it.qty > 1 && (
                              <div className="text-[10px] text-ink-secondary mt-0.5 tabular-nums">${display.toFixed(2)} ea</div>
                            )}
                          </div>
                        </div>

                        {/* BOTTOM: qty stepper + remove — both h-8, identical baseline */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-edge h-8">
                            <button
                              onClick={() => updateQty(it.productSlug, it.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:text-accent transition no-tap-highlight"
                              aria-label={`Decrease ${it.name}`}
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="w-7 text-center text-white text-sm font-bold tabular-nums">{it.qty}</span>
                            <button
                              onClick={() => updateQty(it.productSlug, it.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white hover:text-accent transition no-tap-highlight"
                              aria-label={`Increase ${it.name}`}
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(it.productSlug)}
                            className="h-8 inline-flex items-center text-[11px] text-ink-secondary hover:text-danger transition px-1 -mr-1 font-mono uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* BYO UPSELL */}
              {byoCount > 0 && byoCount < 6 && (
                <div className="mx-4 sm:mx-5 my-5 border border-accent/40 bg-accent/[0.04] p-4 relative">
                  <span aria-hidden className="absolute top-0 left-0 w-8 h-px bg-accent" />
                  <span aria-hidden className="absolute top-0 left-0 h-8 w-px bg-accent" />
                  <span aria-hidden className="absolute bottom-0 right-0 w-8 h-px bg-accent" />
                  <span aria-hidden className="absolute bottom-0 right-0 h-8 w-px bg-accent" />
                  <div className="flex items-start gap-3">
                    <Package size={20} className="text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <div className="text-mono-badge text-accent">
                        ADD {6 - byoCount} MORE TO COMPLETE YOUR BOX
                      </div>
                      <div className="mt-1 text-white text-sm font-medium">
                        Mix any 6 — save 15% across the box.
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/build"
                    onClick={close}
                    className="mt-3 inline-flex items-center justify-center w-full h-11 border border-white text-white text-mono-badge tracking-wider hover:bg-white/5 transition"
                  >
                    BROWSE PRODUCTS
                    <ArrowRight size={13} className="ml-2" />
                  </Link>
                </div>
              )}

              {/* SUMMARY */}
              <div className="px-4 sm:px-5 py-5 border-t border-edge-muted">
                <Row label={`Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`} value={`$${subtotal.toFixed(2)}`} />
                {byoDiscount > 0 && (
                  <Row label="BYO Discount (15%)" value={`−$${byoDiscount.toFixed(2)}`} accent />
                )}
                <Row
                  label="Shipping"
                  value={ship.remaining > 0 ? 'At checkout' : 'FREE'}
                  accent={ship.remaining === 0}
                  italic={ship.remaining > 0}
                />
                <div className="border-t border-edge-muted mt-3 pt-3 flex items-end justify-between">
                  <div>
                    <div className="text-mono-badge text-ink-secondary">TOTAL</div>
                    <div className="text-[10px] text-ink-muted mt-0.5">Tax calculated at checkout</div>
                  </div>
                  <span className="text-white font-bold text-2xl tabular-nums">
                    ${total.toFixed(2)}
                    <span className="text-xs text-ink-secondary font-normal ml-1">USD</span>
                  </span>
                </div>
              </div>
            </div>

            {/* STICKY FOOTER CTA */}
            <footer className="shrink-0 border-t border-edge-muted bg-bg-primary px-4 sm:px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={() => {
                  close();
                  navigate('/checkout');
                }}
                className="w-full h-14 bg-accent text-accent-on font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 hover:brightness-105 active:scale-[0.99] transition no-tap-highlight"
              >
                <Lock size={15} strokeWidth={2.5} />
                <span>CHECKOUT · ${total.toFixed(2)}</span>
              </button>
              <button
                onClick={close}
                className="w-full mt-2.5 h-10 text-ink-secondary text-sm hover:text-white transition"
              >
                Continue shopping
              </button>
              <div className="mt-3 flex items-center justify-center gap-3 text-mono-badge text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Lock size={9} /> SSL
                </span>
                <span className="text-edge">·</span>
                <span className="inline-flex items-center gap-1">
                  <Truck size={10} /> SHIPS FROM UPPSALA
                </span>
                <span className="text-edge">·</span>
                <span>47 COUNTRIES</span>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );

  function Row({
    label,
    value,
    accent,
    italic,
  }: {
    label: string;
    value: string;
    accent?: boolean;
    italic?: boolean;
  }) {
    return (
      <div className="flex items-center justify-between text-sm py-1">
        <span className="text-ink-secondary">{label}</span>
        <span
          className={`tabular-nums ${
            accent ? 'text-accent font-bold' : italic ? 'text-ink-secondary italic text-xs' : 'text-white font-medium'
          }`}
        >
          {value}
        </span>
      </div>
    );
  }
}

/* ---------- Empty state ---------- */

function EmptyState({ onClose }: { onClose: () => void }) {
  const quickStartSlugs = ['zyn-cool-mint-6mg', 'velo-polar-mint-4mg', 'iceberg-spearmint-8mg'];
  const quickStart = quickStartSlugs
    .map((s) => productBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const fallback = bestsellers().slice(0, 3);
  const list = quickStart.length === 3 ? quickStart : fallback;
  const add = useCart((s) => s.add);

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      {/* HERO MESSAGE */}
      <div className="px-4 sm:px-5 pt-10 pb-8 text-center border-b border-edge-muted">
        <div className="relative inline-flex mb-5">
          <div className="w-16 h-16 border border-edge-muted flex items-center justify-center">
            <Package size={28} strokeWidth={1.5} className="text-ink-secondary" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-bg-primary border border-accent text-accent text-[10px] font-mono font-bold flex items-center justify-center">
            0
          </span>
        </div>
        <h3 className="font-display italic text-white text-3xl sm:text-4xl leading-[1.05]">
          Your bag<br />is empty.
        </h3>
        <p className="mt-3 text-ink-secondary text-sm leading-relaxed max-w-xs mx-auto">
          Start with one of our most-loved Swedish brands — or build a six-pack and save 15%.
        </p>
      </div>

      {/* QUICK START LIST */}
      <section className="px-4 sm:px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-mono-eyebrow text-accent">QUICK START</span>
          <span aria-hidden className="flex-1 h-px bg-accent/40" />
        </div>
        <ul className="divide-y divide-edge-muted">
          {list.map((p) => {
            const brand = brandBySlug(p.brandSlug);
            return (
              <li key={p.slug} className="flex items-center gap-3 py-3">
                <Link
                  to={`/products/${p.slug}`}
                  onClick={onClose}
                  className="w-14 h-14 shrink-0 overflow-hidden border border-edge-muted block"
                >
                  <Tin
                    brand={brand?.name || ''}
                    swatch={p.swatch}
                    textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                    surface={brand?.surface || 'concrete'}
                    size={120}
                    image={productImage(p.slug, p.brandSlug)}
                  />
                </Link>
                <Link
                  to={`/products/${p.slug}`}
                  onClick={onClose}
                  className="flex-1 min-w-0"
                >
                  <div className="text-mono-badge text-ink-secondary leading-none">{brand?.name}</div>
                  <div className="text-white text-sm font-bold truncate mt-1">{p.flavor}</div>
                  <div className="text-mono-badge text-ink-secondary mt-0.5">
                    {p.strengthMg}MG <span className="text-accent">·</span> ${p.price.toFixed(2)}
                  </div>
                </Link>
                <button
                  onClick={() => add(p)}
                  className="shrink-0 inline-flex items-center justify-center gap-1 h-10 px-4 bg-accent text-accent-on text-[11px] font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition no-tap-highlight"
                  aria-label={`Add ${p.flavor} to bag`}
                >
                  <Plus size={12} strokeWidth={3} />
                  ADD
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* OR EXPLORE */}
      <section className="px-4 sm:px-5 pt-3 pb-6 border-t border-edge-muted">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-mono-eyebrow text-accent">OR EXPLORE</span>
          <span aria-hidden className="flex-1 h-px bg-accent/40" />
        </div>
        <ul className="divide-y divide-edge-muted">
          {[
            { to: '/shop', label: `Browse all ${totalProductCount} products` },
            { to: '/build', label: 'Build a Box · Save 15%' },
            { to: '/quiz', label: 'Take the Flavor Finder quiz' },
          ].map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={onClose}
                className="flex items-center justify-between py-3.5 text-white text-sm font-medium hover:text-accent transition group"
              >
                <span>{link.label}</span>
                <ArrowRight size={14} className="text-ink-secondary group-hover:text-accent group-hover:translate-x-0.5 transition" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CLOSE TEXT LINK */}
      <div className="px-4 sm:px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <button onClick={onClose} className="text-ink-secondary hover:text-white text-sm py-2 transition">
          Close
        </button>
      </div>
    </div>
  );
}
