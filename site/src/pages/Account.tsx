import { Link } from 'react-router-dom';
import { Check, ArrowRight, Package, Truck, RotateCw } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { products, productBySlug } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../store/cart';
import { useDocumentMeta } from '../lib/useDocumentMeta';

const NAV_ITEMS = [
  { label: 'Dashboard', count: '', active: true },
  { label: 'Orders', count: '7' },
  { label: 'Subscriptions', count: '2' },
  { label: 'Wishlist', count: '14' },
  { label: 'Addresses', count: '2' },
  { label: 'Payment', count: '3' },
  { label: 'Notifications', count: '·' },
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
  const recos = products
    .filter((p) => p.strengthTier === 'strong' || p.strengthTier === 'x-strong')
    .slice(0, 4);

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8 md:py-16">
        {/* HEADER */}
        <div className="mb-8 md:mb-10">
          <Eyebrow className="mb-2">MEMBER SINCE FEB 2026</Eyebrow>
          <h1 className="font-display italic text-white text-4xl md:text-6xl leading-[1.05]">
            Welcome back,<br className="md:hidden" /> Marcus.
          </h1>
        </div>

        {/* MOBILE TAB STRIP — horizontal scroll, sticky */}
        <div className="lg:hidden sticky top-[56px] z-20 -mx-4 px-4 py-3 bg-bg-primary border-b border-edge-muted mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`shrink-0 px-3 h-9 inline-flex items-center gap-2 text-mono-badge tracking-wider transition no-tap-highlight ${
                  item.active
                    ? 'border border-accent text-accent bg-accent/5'
                    : 'border border-edge text-white hover:border-white/40'
                }`}
              >
                {item.label.toUpperCase()}
                {item.count && <span className="text-ink-secondary">({item.count})</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-10">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:sticky lg:top-32 self-start">
            <div className="border border-edge bg-bg-secondary">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className={`w-full px-4 h-11 flex items-center justify-between text-sm border-b border-edge-muted last:border-b-0 transition no-tap-highlight ${
                    item.active
                      ? 'bg-accent/5 text-accent border-l-2 border-l-accent'
                      : 'text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count && (
                    <span className="text-mono-badge text-ink-secondary">{item.count}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 border border-edge-muted">
              <button className="w-full px-4 h-11 flex items-center text-left text-sm text-ink-secondary hover:text-white transition border-b border-edge-muted">
                Help &amp; Shipping
              </button>
              <button className="w-full px-4 h-11 flex items-center text-left text-sm text-ink-secondary hover:text-white transition">
                Sign out
              </button>
            </div>
          </aside>

          {/* MAIN COLUMN */}
          <div className="space-y-6 md:space-y-8">
            {/* ACTIVE ORDER */}
            <section className="bg-bg-secondary border border-edge p-5 md:p-6">
              <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
                <span className="text-mono-eyebrow text-accent">ORDER #PNC-08442</span>
                <span className="text-mono-badge text-ink-secondary">PLACED APR 24</span>
              </div>
              <h2 className="font-display italic text-white text-2xl md:text-3xl leading-tight">
                Your box is on its way.
              </h2>

              {/* Progress tracker — stacks vertically on mobile, horizontal on md+ */}
              <ol className="mt-5 md:mt-6 grid md:grid-cols-4 gap-3 md:gap-0">
                {SHIPMENT_STEPS.map((label, i) => {
                  const reached = i <= CURRENT_STEP;
                  const isCurrent = i === CURRENT_STEP;
                  return (
                    <li key={label} className="md:flex md:items-start md:relative">
                      <div className="flex md:flex-col items-center gap-3 md:gap-2">
                        <span
                          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                            reached
                              ? 'bg-accent text-accent-on'
                              : 'border border-edge text-ink-muted'
                          }`}
                        >
                          {reached ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </span>
                        <div className="md:text-center">
                          {isCurrent && (
                            <span className="block text-[9px] font-mono text-accent tracking-widest mb-0.5">
                              CURRENT
                            </span>
                          )}
                          <span
                            className={`text-mono-badge ${
                              isCurrent ? 'text-accent' : reached ? 'text-white' : 'text-ink-secondary'
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      </div>
                      {/* Connector line — desktop only, between non-last steps */}
                      {i < SHIPMENT_STEPS.length - 1 && (
                        <span
                          aria-hidden
                          className={`hidden md:block absolute top-3.5 left-[calc(50%+14px)] right-0 h-px ${
                            i < CURRENT_STEP ? 'bg-accent' : 'bg-edge'
                          }`}
                          style={{ width: 'calc(100% - 28px)' }}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="mt-5 md:mt-6 pt-4 border-t border-edge-muted flex items-center justify-between gap-3 flex-wrap text-sm">
                <span className="text-ink-secondary inline-flex items-center gap-1.5">
                  <Truck size={13} className="text-accent" />
                  Est. delivery <span className="text-white">Apr 30</span> · DHL Express
                </span>
                <Link
                  to="#"
                  className="text-accent text-mono-badge inline-flex items-center gap-1 hover:opacity-80 transition"
                >
                  TRACK SHIPMENT <ArrowRight size={12} />
                </Link>
              </div>

              {/* Order items mini-grid */}
              <ul className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {orderProducts.map((p) => {
                  const brand = brandBySlug(p.brandSlug);
                  return (
                    <li
                      key={p.slug}
                      className="flex items-center gap-2.5 p-2 border border-edge-muted bg-bg-primary"
                    >
                      <div className="w-10 h-10 shrink-0 overflow-hidden border border-edge-muted">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={80}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-mono-badge text-ink-secondary leading-none">
                          {brand?.name}
                        </div>
                        <div className="text-white text-xs font-bold truncate mt-1 leading-tight">
                          {p.flavor}
                        </div>
                        <div className="text-[10px] text-ink-secondary mt-0.5">×1</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 pt-3 border-t border-edge-muted text-mono-badge text-ink-secondary flex items-center justify-between">
                <span>4 OF 6 BYO BOX ITEMS</span>
                <span className="text-white">TOTAL <span className="tabular-nums">$24.43</span></span>
              </div>
            </section>

            {/* Quick reorder + subscribe — 2-column grid on md+ */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* QUICK REORDER */}
              <section className="bg-bg-secondary border border-edge p-5">
                <div className="flex items-center gap-2 mb-1">
                  <RotateCw size={14} className="text-accent" />
                  <span className="text-mono-eyebrow text-accent">QUICK REORDER</span>
                </div>
                <h3 className="font-display italic text-white text-xl mb-4">
                  Your most-ordered.
                </h3>
                <ul className="divide-y divide-edge-muted">
                  {orderProducts.slice(0, 3).map((p) => {
                    const brand = brandBySlug(p.brandSlug);
                    return (
                      <li key={p.slug} className="flex items-center gap-3 py-3">
                        <div className="w-10 h-10 shrink-0 overflow-hidden border border-edge-muted">
                          <Tin
                            brand={brand?.name || ''}
                            swatch={p.swatch}
                            textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                            surface={brand?.surface || 'concrete'}
                            size={80}
                            image={productImage(p.slug, p.brandSlug)}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-mono-badge text-ink-secondary leading-none">
                            {brand?.name}
                          </div>
                          <div className="text-white text-xs font-bold truncate mt-1 leading-tight">
                            {p.flavor}
                          </div>
                          <div className="text-[10px] text-ink-secondary mt-0.5">Ordered 7×</div>
                        </div>
                        <button
                          onClick={() => add(p)}
                          className="px-3 h-9 border border-accent text-accent text-mono-badge font-bold tracking-wider hover:bg-accent/10 transition no-tap-highlight"
                        >
                          REORDER
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* SUBSCRIBE & SAVE */}
              <section className="bg-bg-secondary border border-edge p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Package size={14} className="text-accent" />
                  <span className="text-mono-eyebrow text-accent">SAVE 20% · NEVER RUN OUT</span>
                </div>
                <h3 className="font-display italic text-white text-xl mb-3">
                  Subscribe &amp; Save.
                </h3>
                <p className="text-ink-secondary text-sm leading-relaxed mb-4">
                  Auto-deliver your favorites every 4 weeks. Cancel anytime. Free worldwide shipping included.
                </p>
                <div className="flex items-center gap-2 mb-5 mt-auto">
                  {orderProducts.slice(0, 3).map((p) => {
                    const brand = brandBySlug(p.brandSlug);
                    return (
                      <div
                        key={p.slug}
                        className="w-10 h-10 overflow-hidden border border-edge-muted"
                      >
                        <Tin
                          brand={brand?.name || ''}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={80}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </div>
                    );
                  })}
                </div>
                <button className="w-full h-11 bg-accent text-accent-on font-bold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2 no-tap-highlight">
                  SET UP SUBSCRIPTION <ArrowRight size={14} />
                </button>
              </section>
            </div>

            {/* RECOMMENDATIONS */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-mono-eyebrow text-accent shrink-0">RECOMMENDED FOR YOU</span>
                <span aria-hidden className="flex-1 h-px bg-accent/40" />
              </div>
              <h3 className="font-display italic text-white text-2xl md:text-3xl mb-5 md:mb-6">
                New strong-tier discoveries.
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {recos.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
