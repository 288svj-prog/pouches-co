import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { Eyebrow } from '../components/Eyebrow';
import { BrandLogo } from '../components/BrandLogo';
import { useDocumentMeta } from '../lib/useDocumentMeta';

export default function BrandsIndex() {
  useDocumentMeta({
    title: `${brands.length} Swedish nicotine pouch brands — every shelf, one checkout`,
    description: `Browse every Swedish nicotine pouch brand we stock — ZYN, VELO, ACE, ICEBERG, FUMI, LOOP, NORDIC SPIRIT, KILLA, SKRUF, HELWIT, PABLO, WHITE FOX. Direct from Uppsala.`,
  });
  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        <div className="text-center mb-12">
          <Eyebrow className="mb-4 inline-flex items-center gap-3 justify-center">
            <span aria-hidden className="h-px w-10 bg-accent/50" />
            <span>{brands.length} BRANDS · {products.length} PRODUCTS</span>
            <span aria-hidden className="h-px w-10 bg-accent/50" />
          </Eyebrow>
          <h1 className="font-display text-white text-4xl md:text-6xl lg:text-7xl">
            Every shelf from Sweden.
          </h1>
          <p className="mt-4 text-ink-secondary max-w-2xl mx-auto">
            Each brand we stock has its own story, its own specialty, its own flavor language. Browse by brand, or shop everything together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {brands.map((b) => (
            <Link
              key={b.slug}
              to={`/brands/${b.slug}`}
              className="group relative block bg-bg-secondary border border-edge overflow-hidden hover:border-accent transition no-tap-highlight"
            >
              {/* Brand-tinted gradient backdrop */}
              <div
                className="absolute inset-0 transition-opacity duration-base"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${b.swatch} 0%, ${b.swatch}66 45%, #0A0A0A 100%)`,
                  opacity: 0.55,
                }}
                aria-hidden="true"
              />
              <div className="relative aspect-square flex items-center justify-center p-6">
                <span className="absolute top-3 left-3 z-10 text-mono-badge text-white">{b.productCount} PRODUCTS</span>
                <BrandLogo
                  brandSlug={b.slug}
                  height={64}
                  color="#FFFFFF"
                  ariaLabel={`${b.name} wordmark`}
                  className="md:!h-20 lg:!h-24 transition-transform duration-base group-hover:scale-105"
                />
              </div>
              <div className="relative p-4 border-t border-edge-muted bg-bg-primary/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold uppercase tracking-wider">{b.name}</h3>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition" />
                </div>
                <p className="mt-1 text-ink-secondary text-xs leading-relaxed line-clamp-2">{b.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
