import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { brandBySlug, brands } from '../data/brands';
import { productsByBrand, products } from '../data/products';
import { Tin } from '../components/Tin';
import { Eyebrow, StatStrip } from '../components/Eyebrow';
import { ProductCard } from '../components/ProductCard';
import { BRAND_IMAGES, productImage } from '../data/images';

export default function BrandPLP() {
  const { slug = '' } = useParams();
  const brand = brandBySlug(slug);
  const [aboutOpen, setAboutOpen] = useState(false);
  if (!brand) return <Navigate to="/brands" replace />;
  const list = productsByBrand(brand.slug);
  const flagship = list[0];
  const others = brands.filter((b) => b.slug !== brand.slug).slice(0, 4);

  return (
    <div className="bg-bg-primary">
      {/* Branded hero */}
      <section className="border-b border-accent/30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <Eyebrow className="mb-4">BRAND · {brand.productCount} PRODUCTS</Eyebrow>
            <h1
              className="font-display text-white leading-none"
              style={{
                fontSize: 'clamp(72px, 12vw, 180px)',
                color: brand.swatch === '#FFFFFF' || brand.swatch === '#E5E5E5' ? '#FFFFFF' : brand.swatch,
              }}
            >
              {brand.name}
            </h1>
            <p className="mt-6 text-white/85 text-base md:text-lg max-w-md leading-relaxed">{brand.description}</p>
            <div className="mt-6">
              <StatStrip
                items={[
                  `EST. ${brand.est}`,
                  brand.city.toUpperCase(),
                  `${brand.flavors} FLAVORS`,
                  `${brand.rating.toFixed(1)} ★`,
                ]}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#grid" className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider hover:brightness-105 transition">
                SHOP {brand.name} <ArrowRight size={16} />
              </a>
              <button
                onClick={() => setAboutOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-pill border border-white text-white font-bold uppercase tracking-wider hover:bg-white/5 transition"
              >
                ABOUT {brand.name}
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-card overflow-hidden border border-edge">
              <img
                src={BRAND_IMAGES[brand.slug]}
                alt={`${brand.name} flagship pouch tin photographed in lookbook style`}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section id="grid" className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-mono-badge text-ink-secondary">{list.length} {brand.name} PRODUCTS</h2>
          <Link to="/shop" className="text-white text-sm hover:text-accent transition">
            Browse all {products.length} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>

        {/* Cross-sell */}
        <div className="mt-16 md:mt-24 border-t border-edge-muted pt-10 md:pt-16">
          <Eyebrow className="mb-4">ALSO TRY</Eyebrow>
          <h3 className="font-display italic text-white text-3xl md:text-4xl leading-tight mb-6">
            Brands {brand.name} fans also stock.
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {others.map((b) => {
              const flag = products.find((p) => p.brandSlug === b.slug);
              return (
                <Link
                  key={b.slug}
                  to={`/brands/${b.slug}`}
                  className="group block bg-bg-secondary border border-edge rounded-card overflow-hidden hover:border-accent/40 transition"
                >
                  <div className="aspect-square">
                    <Tin
                      brand={b.name}
                      swatch={flag?.swatch || b.swatch}
                      textColor={b.textOnSwatch}
                      surface={b.surface}
                      size={240}
                      image={BRAND_IMAGES[b.slug]}
                    />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{b.name}</span>
                    <ArrowRight size={14} className="text-accent" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {aboutOpen && <AboutBrand brand={brand} onClose={() => setAboutOpen(false)} />}
    </div>
  );
}

function AboutBrand({ brand, onClose }: { brand: NonNullable<ReturnType<typeof brandBySlug>>; onClose: () => void }) {
  const list = productsByBrand(brand.slug);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-10 md:top-20 md:max-w-2xl bottom-10 bg-bg-secondary border border-edge rounded-modal overflow-hidden flex flex-col animate-fade-in">
        <div className="h-14 px-5 flex items-center justify-between border-b border-edge-muted">
          <span className="text-mono-eyebrow text-accent">ABOUT {brand.name}</span>
          <button onClick={onClose}><X size={20} className="text-white" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(56px, 8vw, 96px)',
              color: brand.swatch === '#FFFFFF' || brand.swatch === '#E5E5E5' ? '#FFFFFF' : brand.swatch,
              lineHeight: 0.95,
            }}
          >
            {brand.name}
          </h2>
          <div className="mt-3 mb-6">
            <StatStrip
              items={[`EST. ${brand.est}`, brand.city.toUpperCase(), `${brand.flavors} FLAVORS`, `${brand.rating.toFixed(1)} ★`]}
            />
          </div>
          <p className="text-white/85 text-base leading-relaxed">{brand.story}</p>
          <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-2">
            {list.slice(0, 5).map((p) => (
              <div key={p.slug} className="rounded-card overflow-hidden">
                <Tin
                  brand={brand.name}
                  swatch={p.swatch}
                  textColor={brand.textOnSwatch}
                  surface={brand.surface}
                  size={140}
                  image={productImage(p.slug, p.brandSlug)}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="MANUFACTURER" value={brand.manufacturer} />
            <Stat label="ORIGIN" value={`${brand.city}, Sweden`} />
            <Stat label="EST." value={brand.est} />
            <Stat label="PRODUCTS" value={`${brand.productCount}`} />
          </div>
        </div>
        <div className="border-t border-edge-muted p-4">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-pill border border-accent text-accent text-mono-badge font-bold tracking-wider hover:bg-accent/10 transition"
          >
            VIEW ALL {brand.productCount} {brand.name} PRODUCTS →
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-edge-muted rounded-card p-3">
      <div className="text-mono-badge text-ink-secondary">{label}</div>
      <div className="text-white text-sm mt-1">{value}</div>
    </div>
  );
}
