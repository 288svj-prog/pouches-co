import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { Tin } from '../components/Tin';
import { Eyebrow } from '../components/Eyebrow';
import { BRAND_IMAGES } from '../data/images';

export default function BrandsIndex() {
  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="text-center mb-12">
          <Eyebrow className="mb-4">12 BRANDS · {products.length} PRODUCTS</Eyebrow>
          <h1 className="font-display text-white text-4xl md:text-6xl lg:text-7xl">
            Every shelf from Sweden.
          </h1>
          <p className="mt-4 text-ink-secondary max-w-2xl mx-auto">
            Each brand we stock has its own story, its own specialty, its own flavor language. Browse by brand, or shop everything together.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {brands.map((b) => {
            const flagship = products.find((p) => p.brandSlug === b.slug);
            return (
              <Link
                key={b.slug}
                to={`/brands/${b.slug}`}
                className="group block bg-bg-secondary border border-edge rounded-card overflow-hidden hover:border-accent/40 transition"
              >
                <div className="relative aspect-square">
                  <span className="absolute top-3 left-3 z-10 text-mono-badge text-white">{b.productCount} PRODUCTS</span>
                  <Tin
                    brand={b.name}
                    swatch={flagship?.swatch || b.swatch}
                    textColor={b.textOnSwatch}
                    surface={b.surface}
                    size={300}
                    image={BRAND_IMAGES[b.slug]}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold uppercase tracking-wider">{b.name}</h3>
                    <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition" />
                  </div>
                  <p className="mt-1 text-ink-secondary text-xs leading-relaxed line-clamp-2">{b.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
