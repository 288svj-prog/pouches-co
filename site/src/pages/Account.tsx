import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Package, RotateCw, Truck } from 'lucide-react';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { productBySlug } from '../data/products';
import { useCart } from '../store/cart';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const NAV_ITEMS = [
  { label: 'Dashboard', count: '', active: true },
  { label: 'Orders', count: '7' },
  { label: 'Subscriptions', count: '2' },
  { label: 'Wishlist', count: '14' },
  { label: 'Addresses', count: '2' },
  { label: 'Payment', count: '3' },
];

const SHIPMENT_STEPS = ['ORDERED', 'PACKED', 'IN TRANSIT', 'DELIVERED'] as const;
const CURRENT_STEP = 2;

export default function Account() {
  useDocumentMeta({
    title: 'Account · Welcome back',
    description: 'Track shipments, manage subscriptions, reorder favorites — your POUCHES account.',
  });
  const add = useCart((s) => s.add);
  const orderSlugs = ['zyn-cool-mint-6mg', 'velo-freeze-7mg', 'iceberg-spearmint-8mg', 'fumi-spicy-cola-6mg'];
  const orderProducts = orderSlugs
    .map((s) => productBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 md:py-12">
        {/* HEADER — compact one-line member identity */}
        <div className="mb-6 md:mb-8">
          <h1 className="font-display italic text-white text-3xl md:text-5xl leading-[1.05]">
            Welcome back, Marcus.
          </h1>
          <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-mono-badge text-ink-secondary">
            <span>MEMBER SINCE FEB 2026</span>
            <span className="text-edge">/</span>
            <span><span className="text-white">7</span> ORDERS</span>
            <span className="text-edge">/</span>
            <span><span className="text-accent">234</span> POINTS</span>
          </div>
        </div>

        {/* MOBILE TAB STRIP */}
        <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`shrink-0 px-3 h-9 inline-flex items-center gap-2 text-mono-badge tracking-wider transition no-tap-highlight ${
                  item.active
                    ? 'border border-accent text-accent bg-accent/5'
                    : 'border border-edge-muted text-ink-secondary hover:text-white'
                }`}
              >
                {item.label.toUpperCase()}
                {item.count && <span className={item.active ? 'text-accent' : 'text-ink-muted'}>({item.count})</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-10">
          {/* DESKTOP SIDEBAR — flatter, less heavy */}
          <aside className="hidden lg:block lg:sticky lg:top-32 self-start">
            <nav className="space-y-px">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className={`w-full px-3 h-10 flex items-center justify-between text-sm transition no-tap-highlight ${
                    item.active
                      ? 'text-accent bg-accent/5 border-l-2 border-accent pl-[10px]'
                      : 'text-white border-l-2 border-transparent hover:bg-white/[0.03] hover:text-accent'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="text-mono-badge text-ink-muted">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-edge-muted space-y-px">
              <button className="w-full px-3 h-9 flex items-center text-left text-sm text-ink-secondary hover:text-white transition">
                Help &amp; Shipping
              </button>
              <button className="w-full px-3 h-9 flex items-center text-left text-sm text-ink-secondary hover:text-white transition">
                Sign out
              </button>
            </div>
          </aside>

          {/* MAIN COLUMN */}
          <div className="space-y-5 md:space-y-6">
            {/* ACTIVE ORDER — compact, single focus */}
            <section className="bg-bg-secondary border border-edge p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-mono-eyebrow text-accent mb-1">IN TRANSIT</div>
                  <div className="font-display italic text-white text-2xl md:text-[28px] leading-tight">
                    Arrives Apr 30.
                  </div>
                  <div className="text-sm text-ink-secondary mt-1">
                    Order #PNC-08442 · 6 items · DHL Express
                  </div>
                </div>
                <Link
                  to="#"
                  className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-accent text-mono-badge hover:opacity-80 transition px-3 h-9 border border-accent/40"
                >
                  <Truck size={12} />
                  TRACK
                </Link>
              </div>

              {/* Inline horizontal tracker — minimal, single row */}
              <ol className="relative flex items-center justify-between gap-2">
                {/* Progress line */}
                <span aria-hidden className="absolute left-3 right-3 top-3 h-px bg-edge" />
                <span
                  aria-hidden
                  className="absolute left-3 top-3 h-px bg-accent transition-all"
                  style={{ width: `calc(${(CURRENT_STEP / (SHIPMENT_STEPS.length - 1)) * 100}% - 12px)` }}
                />
                {SHIPMENT_STEPS.map((label, i) => {
                  const reached = i <= CURRENT_STEP;
                  const isCurrent = i === CURRENT_STEP;
                  return (
                    <li key={label} className="relative flex flex-col items-center gap-2 z-10">
                      <span
                        className={`w-[14px] h-[14px] rounded-full ${
                          isCurrent
                            ? 'bg-accent ring-4 ring-accent/20'
                            : reached
                              ? 'bg-accent'
                              : 'bg-bg-secondary border border-edge'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-mono tracking-wider ${
                          isCurrent ? 'text-accent' : reached ? 'text-white' : 'text-ink-muted'
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* Mobile track button */}
              <Link
                to="#"
                className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-1.5 text-accent text-mono-badge h-10 border border-accent/40"
              >
                <Truck size={12} />
                TRACK SHIPMENT <ArrowRight size={12} />
              </Link>
            </section>

            {/* QUICK STATS — 3 mini cards replace the recommendations grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <Link
                to="#"
                className="group bg-bg-secondary border border-edge-muted p-3 md:p-4 hover:border-accent/40 transition"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Package size={12} className="text-accent" />
                  <span className="text-mono-badge text-ink-secondary">SUBS</span>
                </div>
                <div className="text-white text-xl md:text-2xl font-bold leading-none">2</div>
                <div className="text-mono-badge text-ink-muted mt-1.5 hidden md:block">
                  active
                </div>
              </Link>
              <Link
                to="#"
                className="group bg-bg-secondary border border-edge-muted p-3 md:p-4 hover:border-accent/40 transition"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Heart size={12} className="text-accent" />
                  <span className="text-mono-badge text-ink-secondary">WISHLIST</span>
                </div>
                <div className="text-white text-xl md:text-2xl font-bold leading-none">14</div>
                <div className="text-mono-badge text-ink-muted mt-1.5 hidden md:block">
                  saved items
                </div>
              </Link>
              <Link
                to="#"
                className="group bg-bg-secondary border border-edge-muted p-3 md:p-4 hover:border-accent/40 transition"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RotateCw size={12} className="text-accent" />
                  <span className="text-mono-badge text-ink-secondary">REWARDS</span>
                </div>
                <div className="text-accent text-xl md:text-2xl font-bold leading-none">234</div>
                <div className="text-mono-badge text-ink-muted mt-1.5 hidden md:block">
                  pts · $11 off
                </div>
              </Link>
            </div>

            {/* REORDER FAVORITES — flat list, more usable */}
            <section className="bg-bg-secondary border border-edge p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-mono-eyebrow text-accent mb-1">REORDER</div>
                  <div className="font-display italic text-white text-xl md:text-2xl leading-tight">
                    Your favorites.
                  </div>
                </div>
                <Link
                  to="#"
                  className="text-accent text-mono-badge hidden sm:inline-flex items-center gap-1 hover:opacity-80 transition"
                >
                  ALL ORDERS <ArrowRight size={12} />
                </Link>
              </div>
              <ul className="divide-y divide-edge-muted -mx-1">
                {orderProducts.map((p) => {
                  const brand = brandBySlug(p.brandSlug);
                  return (
                    <li key={p.slug} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 px-1 py-3">
                      <div className="w-11 h-11 overflow-hidden border border-edge-muted">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={88}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-mono-badge text-ink-secondary leading-none mb-1">
                          {brand?.name}
                        </div>
                        <div className="text-white text-sm font-bold truncate leading-tight">
                          {p.flavor}
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5 tabular-nums">
                          ${p.price.toFixed(2)} · ordered 7×
                        </div>
                      </div>
                      <button
                        onClick={() => add(p)}
                        className="px-3 h-9 border border-accent/60 text-accent text-[11px] font-bold uppercase tracking-wider hover:bg-accent/10 hover:border-accent transition no-tap-highlight"
                      >
                        REORDER
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="#"
                className="sm:hidden mt-3 inline-flex items-center gap-1 text-accent text-mono-badge hover:opacity-80 transition"
              >
                ALL ORDERS <ArrowRight size={12} />
              </Link>
            </section>

            {/* SUBSCRIBE CTA — single-row banner, minimal copy */}
            <section className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/30 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-mono-eyebrow text-accent mb-1">SAVE 20%</div>
                <div className="font-display italic text-white text-xl md:text-2xl leading-tight">
                  Subscribe &amp; never run out.
                </div>
                <div className="text-sm text-ink-secondary mt-1">
                  Auto-deliver every 4 weeks. Cancel anytime.
                </div>
              </div>
              <Link
                to="#"
                className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-6 bg-accent text-accent-on font-bold uppercase tracking-wider text-[11px] hover:brightness-105 transition no-tap-highlight"
              >
                SET UP <ArrowRight size={14} />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
