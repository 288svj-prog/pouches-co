import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Lock, Truck, ShoppingBag } from 'lucide-react';
import { useCart, selectItemCount, selectByoCount, selectSubtotal, selectByoDiscount, selectTotal, selectFreeShipProgress } from '../store/cart';
import { Tin } from './Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { bestsellers, productBySlug, totalProductCount } from '../data/products';

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
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={close} />
      <aside
        className={`absolute right-0 top-0 bottom-0 w-full sm:max-w-[480px] bg-bg-primary border-l border-edge-muted flex flex-col animate-slide-right`}
      >
        {/* header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-edge-muted shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-white font-bold uppercase tracking-wider text-sm">YOUR BAG</span>
            <span
              className={`inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-pill text-mono-badge ${
                itemCount > 0 ? 'bg-accent text-accent-on' : 'bg-edge text-ink-secondary'
              }`}
            >
              ({itemCount})
            </span>
          </div>
          <button onClick={close} aria-label="Close cart" className="p-1 text-white">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {empty ? <EmptyState onClose={close} /> : (
          <>
            {/* free ship strip */}
            <div className="px-5 py-3 bg-bg-secondary shrink-0">
              <div className="text-center text-mono-badge text-white">
                {ship.remaining > 0 ? (
                  <>ADD ${ship.remaining.toFixed(2)} MORE FOR FREE WORLDWIDE SHIPPING</>
                ) : (
                  <span className="text-accent">🎉 FREE WORLDWIDE SHIPPING UNLOCKED</span>
                )}
              </div>
              <div className="mt-2 h-1 rounded-pill bg-edge overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-slow ease-pouch-out"
                  style={{ width: `${ship.pct}%` }}
                />
              </div>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto">
              {items.map((it) => {
                const brand = brandBySlug(it.brandSlug);
                const original = it.byo ? it.price : null;
                const display = it.byo ? +(it.price * 0.85).toFixed(2) : it.price;
                return (
                  <div
                    key={it.productSlug}
                    className={`flex gap-3 p-4 border-b border-edge-muted ${
                      it.justAdded ? 'border-l-2 border-l-accent' : ''
                    }`}
                  >
                    <div className="w-20 h-20 rounded-card overflow-hidden flex-shrink-0 relative">
                      <Tin
                        brand={brand?.name || ''}
                        swatch={it.swatch}
                        textColor={it.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                        surface={brand?.surface || 'concrete'}
                        size={160}
                        image={productImage(it.productSlug, it.brandSlug)}
                      />
                      {it.byo && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-accent text-accent-on text-[8px] font-mono font-bold tracking-wider">
                          BYO
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                          <div className="text-white font-bold text-sm leading-snug truncate">{it.name}</div>
                          <div className="text-xs text-ink-secondary mt-0.5">{it.variant}</div>
                        </div>
                        <div className="text-right shrink-0">
                          {original && (
                            <div className="text-xs text-ink-secondary line-through">${original.toFixed(2)}</div>
                          )}
                          <div className={`font-bold text-sm ${it.byo ? 'text-accent' : 'text-white'}`}>
                            ${display.toFixed(2)}
                          </div>
                          {it.byo && byoCount >= 6 && (
                            <div className="text-[10px] text-accent">15% BYO disc</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-edge rounded-pill h-8">
                          <button
                            onClick={() => updateQty(it.productSlug, it.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                            aria-label="Decrease"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-8 text-center text-white text-sm">{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.productSlug, it.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white"
                            aria-label="Increase"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.productSlug)}
                          className="text-xs text-ink-secondary hover:text-white inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          Remove <X size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* BYO upsell */}
              {byoCount > 0 && byoCount < 6 && (
                <div className="m-4 p-4 bg-bg-secondary border border-edge rounded-card text-center">
                  <div className="text-mono-eyebrow text-accent">
                    ADD {6 - byoCount} MORE TO COMPLETE YOUR BOX
                  </div>
                  <div className="mt-2 text-white text-sm">Mix any 6 — save 15% across the box</div>
                  <Link
                    to="/build"
                    onClick={close}
                    className="mt-3 inline-flex items-center justify-center w-full h-11 rounded-pill border border-white text-white text-mono-badge tracking-wider hover:bg-white/5 transition"
                  >
                    ADD MORE PRODUCTS →
                  </Link>
                </div>
              )}

              {/* summary */}
              <div className="px-5 py-4 space-y-2 border-t border-edge-muted">
                <Row label={`Subtotal (${itemCount} items)`} value={`$${subtotal.toFixed(2)}`} />
                {byoDiscount > 0 && <Row label="BYO Discount" value={`−$${byoDiscount.toFixed(2)}`} accent />}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">Shipping</span>
                  <span className="text-ink-secondary italic text-xs">
                    {ship.remaining > 0 ? 'Calculated at checkout' : 'FREE'}
                  </span>
                </div>
                <div className="border-t border-edge-muted pt-3 flex items-end justify-between">
                  <span className="text-mono-badge text-ink-secondary">TOTAL</span>
                  <span className="text-white font-bold text-2xl">${total.toFixed(2)} <span className="text-xs text-ink-secondary font-normal">USD</span></span>
                </div>
              </div>
            </div>

            {/* sticky footer */}
            <div className="border-t border-edge-muted p-5 shrink-0">
              <div className="text-mono-badge text-white text-center mb-3 flex items-center justify-center gap-2">
                <Truck size={12} strokeWidth={2} className="text-accent" />
                <span>SHIPS FROM UPPSALA · 47 COUNTRIES</span>
              </div>
              <button
                onClick={() => {
                  close();
                  navigate('/checkout');
                }}
                className="w-full h-14 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition"
              >
                <Lock size={14} strokeWidth={2} />
                <span>PROCEED TO CHECKOUT →</span>
              </button>
              <button
                onClick={close}
                className="w-full mt-3 text-white text-sm underline underline-offset-4 hover:text-accent transition"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );

  function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-secondary">{label}</span>
        <span className={accent ? 'text-accent font-medium' : 'text-white font-medium'}>{value}</span>
      </div>
    );
  }
}

function EmptyState({ onClose }: { onClose: () => void }) {
  const quickStartSlugs = ['zyn-cool-mint-6mg', 'velo-polar-mint-4mg', 'iceberg-spearmint-8mg'];
  const quickStart = quickStartSlugs.map((s) => productBySlug(s)).filter((x): x is NonNullable<typeof x> => !!x);
  const fallback = bestsellers().slice(0, 3);
  const list = quickStart.length === 3 ? quickStart : fallback;
  const add = useCart((s) => s.add);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-8">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <ShoppingBag size={72} strokeWidth={1.25} className="text-edge" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-bg-primary border border-accent text-accent text-[10px] font-mono flex items-center justify-center">
            0
          </span>
        </div>
      </div>
      <h3 className="font-display text-3xl text-white text-center leading-tight">
        Your bag<br />is empty.
      </h3>
      <p className="mt-3 text-center text-ink-secondary text-sm leading-relaxed">
        Nothing saved yet.<br />Start with our most-loved Swedish brands.
      </p>
      <div className="my-6 border-t border-edge-muted" />
      <div className="text-mono-eyebrow text-accent">QUICK START</div>
      <h4 className="font-display italic text-white text-lg mt-1">Where most users begin.</h4>
      {/* List-style with hairline dividers — no individual cards */}
      <div className="mt-4 border-t border-edge-muted">
        {list.map((p) => {
          const brand = brandBySlug(p.brandSlug);
          return (
            <div
              key={p.slug}
              className="group flex items-center gap-4 py-3 border-b border-edge-muted hover:bg-white/[0.02] transition -mx-1 px-1"
            >
              <div className="w-14 h-14 overflow-hidden flex-shrink-0 border border-edge-muted">
                <Tin
                  brand={brand?.name || ''}
                  swatch={p.swatch}
                  textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                  surface={brand?.surface || 'concrete'}
                  size={120}
                  image={productImage(p.slug, p.brandSlug)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                <div className="text-white text-sm font-bold truncate leading-snug">{p.flavor}</div>
                <div className="text-mono-badge text-ink-secondary mt-0.5">
                  {p.strengthMg}MG <span className="text-accent">·</span> ${p.price.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => add(p)}
                className="inline-flex items-center gap-1 h-9 px-4 bg-accent text-accent-on text-mono-badge font-bold tracking-wider hover:brightness-105 active:scale-95 transition"
                aria-label={`Add ${p.flavor} to cart`}
              >
                <Plus size={12} strokeWidth={3} />
                ADD
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="text-mono-eyebrow text-accent">OR EXPLORE</div>
        <div className="mt-3 space-y-2">
          <Link
            to="/shop"
            onClick={onClose}
            className="block text-white text-sm hover:text-accent transition"
          >
            Browse all {totalProductCount} products →
          </Link>
          <Link
            to="/build"
            onClick={onClose}
            className="block text-white text-sm hover:text-accent transition"
          >
            Build a Box (save 15%) →
          </Link>
          <Link
            to="/quiz"
            onClick={onClose}
            className="block text-white text-sm hover:text-accent transition"
          >
            Take the Flavor Finder quiz →
          </Link>
        </div>
      </div>
      <div className="mt-10 text-center">
        <button onClick={onClose} className="text-white text-sm underline underline-offset-4">
          Close
        </button>
      </div>
    </div>
  );
}
