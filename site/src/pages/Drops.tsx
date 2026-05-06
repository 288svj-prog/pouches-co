import { Eyebrow } from '../components/Eyebrow';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { LinkButton } from '../components/Button';
import { ArrowRight } from 'lucide-react';
import { HERO_IMAGES } from '../data/images';

export default function Drops() {
  const drop = products.filter((p) => p.newArrival || p.bestseller).slice(0, 8);
  return (
    <div className="bg-bg-primary">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES.drops}
            alt=""
            className="w-full h-full object-cover opacity-50"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-bg-primary/60 to-bg-primary" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-10 py-16 md:py-24 text-center">
          <Eyebrow className="mb-4">DROP 04 · SS26 · NEW THIS WEEK</Eyebrow>
          <h1 className="font-display text-white text-5xl md:text-7xl">Latest drop.</h1>
          <p className="mt-4 text-white/85 max-w-xl mx-auto">
            New flavors, restocked rarities, and X-strong limited tins. Updated weekly.
          </p>
        </div>
      </section>
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {drop.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
        <div className="mt-12 text-center">
          <LinkButton to="/shop" variant="outline" iconRight={<ArrowRight size={14} />}>
            BROWSE THE FULL CATALOG
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
