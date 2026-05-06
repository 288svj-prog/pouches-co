import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Minus, Lock, Truck, Package, ShoppingBag, ChevronDown, ThumbsUp, Globe } from 'lucide-react';
import { brandBySlug } from '../data/brands';
import { productBySlug, productsByBrand } from '../data/products';
import type { Product } from '../data/products';
import { productReviews, ratingDistribution } from '../data/reviews';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { Stars } from '../components/Stars';
import { Eyebrow } from '../components/Eyebrow';
import { PillBadge } from '../components/Chips';
import { useCart } from '../store/cart';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export default function PDP() {
  const { slug = '' } = useParams();
  const [activeSlug, setActiveSlug] = useState(slug);
  const product = productBySlug(activeSlug);
  const [thumb, setThumb] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSpec, setOpenSpec] = useState<string | null>('description');
  const add = useCart((s) => s.add);

  useEffect(() => {
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  if (!product) return <Navigate to="/shop" replace />;
  const brand = brandBySlug(product.brandSlug)!;
  const sameBrand = productsByBrand(product.brandSlug);

  // Strength chips show every strength this brand makes — strength is the
  // outer filter that narrows what flavors are available below.
  const strengthsToShow = Array.from(
    new Set(sameBrand.map((p) => p.strengthMg))
  ).sort((a, b) => a - b);

  // Flavor chips are filtered to ONLY flavors available at the currently
  // selected strength. So the PDP behaves like a mini category page:
  //   "show me everything {brand} makes at {strength}mg"
  // If a single flavor has multiple variants at this strength, dedupe by
  // flavor name — first match wins.
  const flavors = (() => {
    const atStrength = sameBrand.filter((p) => p.strengthMg === product.strengthMg);
    const byName = new Map<string, typeof sameBrand[number]>();
    for (const p of atStrength) {
      if (!byName.has(p.flavor)) byName.set(p.flavor, p);
    }
    return Array.from(byName.values()).slice(0, 8);
  })();

  // Switch active product when the user picks a strength chip. Preserve the
  // current flavor if it exists at the new strength; otherwise jump to the
  // first product at that strength.
  const switchStrength = (mg: number) => {
    const sameFlavor = sameBrand.find((p) => p.strengthMg === mg && p.flavor === product.flavor);
    if (sameFlavor) return setActiveSlug(sameFlavor.slug);
    const first = sameBrand.find((p) => p.strengthMg === mg);
    if (first) setActiveSlug(first.slug);
  };

  useDocumentMeta({
    title: `${brand.name} ${product.flavor} ${product.strengthMg}mg`,
    description: `${brand.name} ${product.flavor} — ${product.strengthMg}mg ${product.strengthTier} nicotine pouches. ${product.pouchesPerRoll} pouches per roll, ~${product.durationMinutes} minute burn. Tobacco-free. Shipped from Uppsala.`,
    ogType: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${brand.name} ${product.flavor} ${product.strengthMg}mg`,
      description: product.description,
      brand: { '@type': 'Brand', name: brand.name },
      sku: product.slug,
      image: typeof window !== 'undefined' ? `${window.location.origin}${productImage(product.slug, product.brandSlug) || ''}` : undefined,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviews,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
    },
  });

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-5 md:py-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden border border-edge bg-bg-secondary">
              <Tin
                brand={brand.name}
                flavor={product.flavor.toUpperCase()}
                swatch={product.swatch}
                textColor={product.swatch === '#FFFFFF' || product.swatch === '#E5E5E5' ? '#0A0A0A' : '#FFFFFF'}
                surface={brand.surface}
                size={620}
                rotation={[-8, 4, 12, -2][thumb]}
                image={productImage(product.slug, product.brandSlug)}
                imageAlt={`${brand.name} ${product.flavor} ${product.strengthMg}mg pouch tin, lookbook flash photography`}
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setThumb(i)}
                  className={`aspect-square overflow-hidden border-2 transition no-tap-highlight ${
                    thumb === i ? 'border-accent' : 'border-edge'
                  }`}
                >
                  <Tin
                    brand={brand.name}
                    swatch={product.swatch}
                    textColor={product.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                    surface={brand.surface}
                    size={120}
                    rotation={[-8, 4, 12, -2][i]}
                    image={productImage(product.slug, product.brandSlug)}
                  />
                </button>
              ))}
            </div>
            <div className="mt-2 text-mono-badge text-ink-secondary text-center">
              {thumb + 1} / 4 — TAP TO ZOOM
            </div>
          </div>

          {/* Info panel */}
          <div>
            {/* Brand + bestseller eyebrow */}
            <div className="text-mono-badge text-ink-secondary">
              <Link to={`/brands/${brand.slug}`} className="hover:text-accent transition">
                {brand.name}
              </Link>
              {product.bestseller && <> <span className="text-accent">·</span> <span className="text-accent">BESTSELLER</span></>}
            </div>

            {/* Headline — smaller on mobile */}
            <h1 className="font-display italic text-white text-[40px] md:text-6xl leading-[0.95] mt-1.5 md:mt-2">
              {product.flavor}
            </h1>
            <div className="mt-2 text-ink-secondary text-sm md:text-base">
              {product.strengthMg}mg <span className="text-accent">·</span> {capitalize(product.format)} Format
            </div>

            {/* Stars + reviews link */}
            <div className="mt-3 flex items-center gap-2 md:gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Stars rating={product.rating} size={13} />
                <span className="text-sm text-white tabular-nums">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs md:text-sm text-ink-secondary">— {product.reviews} reviews</span>
              <a href="#reviews" className="text-accent underline underline-offset-2 text-xs md:text-sm">
                Read all
              </a>
            </div>

            {/* Price */}
            <div className="mt-5 md:mt-6">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="text-white font-bold text-3xl md:text-4xl tabular-nums leading-none">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-mono-badge text-ink-secondary pb-1">PER ROLL · 20 POUCHES</div>
              </div>
              {/* Bulk save — stacks tighter on mobile */}
              <div className="mt-2.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-mono-badge text-accent">
                <span className="opacity-70 text-white">BULK SAVE</span>
                <span>5 ROLLS — ${product.bulkPricing[0].price.toFixed(2)}</span>
                <span className="text-accent/60">·</span>
                <span>10 ROLLS — ${product.bulkPricing[1].price.toFixed(2)}</span>
              </div>
            </div>

            {/* Spec strip — 2-col grid on mobile so it never breaks awkwardly */}
            <div className="mt-5 grid grid-cols-2 md:flex md:flex-wrap md:items-center md:gap-x-4 gap-y-1.5 text-mono-badge text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-accent" />
                {product.strengthMg}MG {tierLabel(product.strengthMg).toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-accent" />
                20 POUCHES
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-accent" />
                TOBACCO-FREE
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-accent" />
                MADE IN SWEDEN
              </span>
            </div>

            {/* Flavor variant — filtered by current strength so the PDP doubles
                as a brand-strength category page. */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="text-mono-eyebrow text-white">
                  FLAVOR · {flavors.length} AT {product.strengthMg}MG
                </div>
                <Link
                  to={`/brands/${brand.slug}`}
                  className="text-accent text-xs underline underline-offset-2 shrink-0"
                >
                  See all {sameBrand.length} →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                {flavors.map((p) => {
                  const selected = p.slug === activeSlug;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => setActiveSlug(p.slug)}
                      className={`relative flex items-center gap-2.5 h-12 pl-1.5 pr-3 border transition-all no-tap-highlight ${
                        selected
                          ? 'border-accent shadow-glow-accent-strong bg-accent/5'
                          : 'border-edge hover:border-white/40 bg-bg-secondary/40'
                      }`}
                      aria-pressed={selected}
                    >
                      <span className="w-9 h-9 overflow-hidden shrink-0 border border-edge-muted">
                        <Tin
                          brand={brand.name}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand.surface}
                          size={80}
                          image={productImage(p.slug, p.brandSlug)}
                        />
                      </span>
                      <span
                        className={`text-mono-badge truncate text-left flex-1 ${
                          selected ? 'text-accent' : 'text-white'
                        }`}
                      >
                        {p.flavor.toUpperCase()}
                      </span>
                      <span
                        className="absolute left-0 right-0 bottom-0 h-0.5"
                        style={{ background: p.swatch, opacity: selected ? 1 : 0.6 }}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strength acts as the OUTER filter — pick a strength, the flavor
                list above re-filters to whatever {brand} makes at that strength. */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="text-mono-eyebrow text-white">STRENGTH</div>
                <span className="text-mono-badge text-ink-secondary">
                  {strengthsToShow.length} AVAILABLE
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengthsToShow.map((mg) => {
                  const selected = mg === product.strengthMg;
                  const flavorsAtMg = sameBrand.filter((p) => p.strengthMg === mg);
                  return (
                    <button
                      key={mg}
                      onClick={() => switchStrength(mg)}
                      className={`h-11 px-3.5 border text-mono-badge transition no-tap-highlight inline-flex items-center gap-1.5 ${
                        selected
                          ? 'border-accent text-accent bg-accent/5 shadow-glow-accent-strong'
                          : 'border-edge text-white hover:border-white/40 bg-bg-secondary/40'
                      }`}
                      aria-pressed={selected}
                    >
                      <span>{mg}mg</span>
                      <span className="text-accent">·</span>
                      <span>{tierLabel(mg).toUpperCase()}</span>
                      <span className="text-ink-muted ml-1">({flavorsAtMg.length})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity — square stepper */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-mono-eyebrow text-white">QUANTITY</span>
                <span className="text-mono-badge text-accent">BOX SAVES 15% ON 6+</span>
              </div>
              <div className="flex items-stretch border border-edge h-12 w-full max-w-[260px]">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 flex items-center justify-center text-white hover:text-accent transition no-tap-highlight"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="flex-1 flex items-center justify-center text-white font-bold tabular-nums border-x border-edge">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 flex items-center justify-center text-white hover:text-accent transition no-tap-highlight"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* In-flow CTAs — desktop shows both, mobile shows only "BUILD A BOX" since sticky bottom handles ADD */}
            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => add(product, qty)}
                className="hidden md:flex w-full h-14 bg-accent text-accent-on font-bold uppercase tracking-wider items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition no-tap-highlight"
              >
                <ShoppingBag size={16} strokeWidth={2.5} />
                ADD TO BAG · ${(product.price * qty).toFixed(2)}
              </button>
              <Link
                to="/build"
                className="w-full h-12 md:h-14 border border-white text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/5 transition no-tap-highlight text-sm md:text-base"
              >
                <Package size={15} strokeWidth={2.5} />
                ADD TO BUILD A BOX
              </Link>
            </div>

            {/* Trust strip — vertical stack on mobile to avoid wrapping */}
            <div className="mt-5 grid grid-cols-1 md:flex md:flex-wrap md:gap-x-4 gap-y-2 text-mono-badge text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Truck size={12} className="text-accent" /> SHIPS FROM UPPSALA
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe size={12} className="text-accent" /> 47 COUNTRIES
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock size={12} className="text-accent" /> FREE RETURNS
              </span>
            </div>

            <p className="mt-6 text-white/85 text-sm md:text-base italic leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Accordion stack */}
        <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
          {[
            { id: 'description', label: 'DESCRIPTION', body: <p className="text-white/85 leading-relaxed">{product.description}</p> },
            {
              id: 'specifications',
              label: 'SPECIFICATIONS',
              body: <SpecTable product={product} brand={brand} />,
            },
            {
              id: 'shipping',
              label: 'SHIPPING & RETURNS',
              body: (
                <p className="text-white/85 leading-relaxed">
                  Ships from Uppsala, Sweden within 24 hours. Free worldwide shipping over $49. Trackable via DHL Express. Free returns within 30 days for any reason — sealed tins only.
                </p>
              ),
            },
            {
              id: 'pairs',
              label: `MORE FROM ${brand.name}`,
              body: (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sameBrand.filter((p) => p.slug !== product.slug).slice(0, 4).map((p) => (
                    <Link key={p.slug} to={`/products/${p.slug}`} className="group block">
                      <div className="rounded-card overflow-hidden border border-edge group-hover:border-accent/40 transition">
                        <Tin
                          brand={brand.name}
                          swatch={p.swatch}
                          textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                          surface={brand.surface}
                          image={productImage(p.slug, p.brandSlug)}
                          size={200}
                        />
                      </div>
                      <div className="text-mono-badge text-white mt-2">{p.flavor.toUpperCase()}</div>
                      <div className="text-mono-badge text-ink-secondary">${p.price.toFixed(2)}</div>
                    </Link>
                  ))}
                </div>
              ),
            },
          ].map((sec) => {
            const isOpen = openSpec === sec.id;
            return (
              <div key={sec.id} className="border-b border-edge-muted">
                <button
                  className="w-full flex items-center justify-between py-5 text-left"
                  onClick={() => setOpenSpec(isOpen ? null : sec.id)}
                >
                  <span className="text-mono-eyebrow text-white">{sec.label}</span>
                  <ChevronDown size={18} className={`text-accent transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className="pb-6">{sec.body}</div>}
              </div>
            );
          })}
        </div>

        {/* Reviews */}
        <ReviewsSection product={product} />
      </div>

      {/* Mobile sticky bottom CTA bar — sits above the bottom nav */}
      <div className="md:hidden fixed left-0 right-0 z-30 bg-bg-primary border-t border-accent/40" style={{ bottom: 64 }}>
        <div className="px-4 h-20 flex items-center gap-3">
          <div className="w-[30%] flex flex-col">
            <span className="text-mono-badge text-ink-secondary">TOTAL</span>
            <span className="text-white font-bold text-lg leading-none mt-1">${(product.price * qty).toFixed(2)}</span>
          </div>
          <button
            onClick={() => add(product, qty)}
            className="flex-1 h-14 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition"
          >
            <ShoppingBag size={16} strokeWidth={2.5} />
            ADD TO BAG
          </button>
        </div>
      </div>
      {/* Spacer so scroll content can clear the sticky CTA bar */}
      <div className="md:hidden h-20" />
    </div>
  );
}

function tierLabel(mg: number) {
  if (mg <= 3) return 'Light';
  if (mg <= 6) return 'Regular';
  if (mg <= 9) return 'Strong';
  return 'X-Strong';
}
function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

function SpecTable({ product, brand }: { product: Product; brand: NonNullable<ReturnType<typeof brandBySlug>> }) {
  const rows: [string, React.ReactNode][] = [
    ['STRENGTH', `${product.strengthMg}mg per pouch · ${capitalize(product.strengthTier)}`],
    ['FORMAT', `${capitalize(product.format)} · Standard size`],
    ['PIECES PER ROLL', `${product.pouchesPerRoll} pouches`],
    ['FLAVOR PROFILE', product.flavorProfile || product.description],
    ['DURATION', `~${product.durationMinutes} minutes per pouch`],
    ['INGREDIENTS', 'Plant-derived nicotine, microcrystalline cellulose, water, salt, food-grade flavoring, sweetener.'],
    ['TOBACCO CONTENT', '0% — Tobacco-free'],
    ['MANUFACTURER', brand.manufacturer],
    ['COUNTRY OF ORIGIN', '🇸🇪 Sweden'],
    ['BEST BEFORE', '12 months from manufacture date'],
    ['STORAGE', 'Cool, dry place. Refrigerate to extend freshness.'],
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-y-0">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <div className="text-mono-badge text-ink-secondary py-3 border-b border-edge-muted">{k}</div>
          <div className="text-white text-sm py-3 border-b border-edge-muted">{v}</div>
        </div>
      ))}
    </div>
  );
}

function ReviewsSection({ product }: { product: Product }) {
  const reviews = productReviews(product.slug);
  const dist = ratingDistribution(product.rating);
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<number | null>(null);
  const visible = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <section id="reviews" className="mt-16 md:mt-24 border-t border-edge-muted pt-10 md:pt-16">
      <Eyebrow className="mb-3">REVIEWS · {product.reviews} VERIFIED</Eyebrow>
      <h2 className="font-display italic text-white text-3xl md:text-4xl leading-tight">
        What buyers actually say.
      </h2>
      <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-10">
        <div>
          <div className="text-white font-bold text-5xl">{product.rating.toFixed(1)}</div>
          <Stars rating={product.rating} size={18} />
          <div className="text-mono-badge text-ink-secondary mt-2">{product.reviews} REVIEWS</div>
          <div className="mt-6 space-y-2">
            {dist.map((d) => (
              <button
                key={d.stars}
                onClick={() => setFilter(filter === d.stars ? null : d.stars)}
                className="w-full flex items-center gap-2 group"
              >
                <span className="w-10 text-mono-badge text-white">{d.stars} ★</span>
                <span className="flex-1 h-2 rounded-pill bg-edge overflow-hidden">
                  <span className="block h-full bg-accent transition-all" style={{ width: `${d.pct}%` }} />
                </span>
                <span className="w-10 text-mono-badge text-ink-secondary text-right">{d.pct}%</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {['ALL', 'STRENGTH', 'FLAVOR', 'SHIPPING', 'PACKAGING'].map((t, i) => (
              <button
                key={t}
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded-pill border text-mono-badge transition ${
                  i === 0 && !filter ? 'border-accent text-accent' : 'border-edge text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {visible.map((r) => {
              const helped = helpful[r.id];
              return (
                <article key={r.id} className="bg-bg-secondary border border-edge rounded-card p-5">
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} size={14} />
                    <PillBadge variant="verified">VERIFIED PURCHASE ✓</PillBadge>
                  </div>
                  <h3 className="mt-3 font-bold text-white text-base">{r.headline}</h3>
                  <p className="mt-2 text-white/85 text-sm leading-relaxed">{r.body}</p>
                  <div className="mt-4 pt-3 border-t border-edge-muted flex items-center justify-between">
                    <div className="text-mono-badge text-ink-secondary">
                      <span className="text-white">{r.author}</span> — {r.flag} {r.country} · {r.date}
                    </div>
                    <button
                      onClick={() => setHelpful((h) => ({ ...h, [r.id]: true }))}
                      disabled={helped}
                      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-pill border transition ${
                        helped ? 'border-accent text-accent animate-pulse-accent' : 'border-edge text-white hover:border-accent'
                      }`}
                    >
                      <ThumbsUp size={12} />
                      <span className="text-xs">Helpful ({r.helpful + (helped ? 1 : 0)})</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
