import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { products, productBySlug } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../store/cart';

export default function Account() {
  const add = useCart((s) => s.add);
  const orderProducts = ['zyn-cool-mint-6mg', 'velo-freeze-7mg', 'iceberg-spearmint-8mg', 'fumi-spicy-cola-6mg']
    .map((s) => productBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const recos = products.filter((p) => p.strengthTier === 'strong' || p.strengthTier === 'x-strong').slice(0, 4);

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="text-center mb-10">
          <Eyebrow className="mb-3">MEMBER SINCE FEB 2026</Eyebrow>
          <h1 className="font-display italic text-white text-4xl md:text-6xl">Welcome back, Marcus.</h1>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6 lg:gap-10">
          <aside className="bg-bg-secondary border border-edge rounded-card p-2 lg:p-3 self-start sticky top-32">
            {[
              { label: 'Dashboard', count: '', active: true },
              { label: 'Orders', count: '7' },
              { label: 'Subscriptions', count: '+ 2' },
              { label: 'Wishlist', count: '+ 14' },
              { label: 'Addresses', count: '+ 2' },
              { label: 'Payment methods', count: '+ 3' },
              { label: 'Notifications', count: '•' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full px-3 h-10 rounded flex items-center justify-between text-sm transition ${
                  item.active ? 'bg-accent/10 text-accent border-l-2 border-accent' : 'text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-mono-badge text-ink-secondary">{item.count}</span>
              </button>
            ))}
            <div className="border-t border-edge-muted my-2" />
            <button className="w-full px-3 h-10 rounded text-left text-sm text-ink-secondary hover:bg-white/5">
              Help & Shipping
            </button>
            <button className="w-full px-3 h-10 rounded text-left text-sm text-ink-secondary hover:bg-white/5">
              Sign out
            </button>
          </aside>

          <div className="space-y-6">
            {/* Active order */}
            <div className="bg-bg-secondary border border-edge rounded-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-mono-eyebrow text-accent">ORDER #PNC-08442</span>
                <span className="text-mono-badge text-ink-secondary">Placed Apr 24</span>
              </div>
              <h2 className="font-display italic text-white text-3xl md:text-4xl leading-tight">
                Your box is on its way.
              </h2>
              <div className="mt-6 flex items-center justify-between">
                {['ORDERED', 'PACKED', 'IN TRANSIT', 'DELIVERED'].map((label, i) => {
                  const reached = i <= 2;
                  return (
                    <div key={label} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            reached ? 'bg-accent text-accent-on' : 'border border-edge text-ink-muted'
                          }`}
                        >
                          {reached ? <Check size={14} strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </span>
                        <span className={`mt-2 text-mono-badge ${i === 2 ? 'text-accent' : reached ? 'text-white' : 'text-ink-secondary'}`}>
                          {i === 2 && <span className="block text-[8px]">CURRENT</span>}
                          {label}
                        </span>
                      </div>
                      {i < 3 && (
                        <span
                          className={`flex-1 h-px mx-2 ${i < 2 ? 'bg-accent' : 'bg-edge'}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-ink-secondary">
                  Estimated delivery: Apr 30 — Tracked via DHL Express
                </span>
                <Link to="#" className="text-accent inline-flex items-center gap-1">
                  TRACK SHIPMENT <ArrowRight size={12} />
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {orderProducts.map((p) => {
                  const brand = brandBySlug(p.brandSlug);
                  return (
                    <div key={p.slug} className="flex items-center gap-2 p-2 border border-edge-muted rounded">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={80}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                        <div className="text-white text-xs truncate">{p.flavor}</div>
                        <div className="text-mono-badge text-ink-secondary">x1</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-edge-muted text-mono-badge text-ink-secondary">
                4 OF 6 BYO BOX ITEMS · TOTAL $24.43
              </div>
            </div>

            {/* Quick reorder + subscribe */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-bg-secondary border border-edge rounded-card p-5">
                <div className="text-mono-eyebrow text-accent mb-3">QUICK REORDER</div>
                <div className="font-display italic text-white text-xl mb-4">Your most-ordered.</div>
                <div className="space-y-2">
                  {orderProducts.slice(0, 3).map((p) => {
                    const brand = brandBySlug(p.brandSlug);
                    return (
                      <div
                        key={p.slug}
                        className="flex items-center gap-3 p-2 border border-edge-muted rounded"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
                          <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                          <div className="text-white text-xs truncate">{p.flavor}</div>
                          <div className="text-mono-badge text-ink-secondary">Ordered 7×</div>
                        </div>
                        <button
                          onClick={() => add(p)}
                          className="px-3 h-8 rounded-pill border border-accent text-accent text-mono-badge font-bold hover:bg-accent/10 transition"
                        >
                          REORDER
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-bg-secondary border border-edge rounded-card p-5">
                <div className="text-mono-eyebrow text-accent mb-3">SAVE 20% · NEVER RUN OUT</div>
                <div className="font-display italic text-white text-xl mb-3">Subscribe & Save.</div>
                <p className="text-ink-secondary text-sm leading-relaxed mb-4">
                  Auto-deliver your favorites every 4 weeks. Cancel anytime. Free worldwide shipping included.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {orderProducts.slice(0, 3).map((p) => {
                    const brand = brandBySlug(p.brandSlug);
                    return (
                      <div key={p.slug} className="w-10 h-10 rounded-full overflow-hidden border border-edge">
                        <Tin
                          brand={brand?.name || ''}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand?.surface || 'concrete'}
                          size={60}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </div>
                    );
                  })}
                </div>
                <button className="w-full h-11 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2">
                  SET UP SUBSCRIPTION <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="text-mono-eyebrow text-accent mb-3">RECOMMENDED FOR YOU</div>
              <h3 className="font-display italic text-white text-3xl mb-6">New strong-tier discoveries.</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recos.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
