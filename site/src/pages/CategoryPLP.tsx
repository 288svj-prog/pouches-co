import { Navigate, useParams } from 'react-router-dom';
import { products, productsByFlavor, productsByStrength } from '../data/products';
import type { FlavorFamily, Strength } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Eyebrow } from '../components/Eyebrow';
import { HERO_IMAGES } from '../data/images';

const FLAVOR_LABELS: Record<string, { title: string; sub: string; bg?: string }> = {
  mint: { title: 'Mint Pouches.', sub: "Cool, fresh, long-throw. Sweden's most-stocked flavor family — refined to a fine point.", bg: HERO_IMAGES.flavorMint },
  fruit: { title: 'Fruit Pouches.', sub: 'Berry, mango, citrus, and beyond. The flavor lab category.' },
  citrus: { title: 'Citrus Pouches.', sub: 'Sharp, bright, occasionally herbal. The wake-up flavor.' },
  cinnamon: { title: 'Cinnamon Pouches.', sub: 'Warm spice, slow burn. Polarizing on purpose.' },
  coffee: { title: 'Coffee Pouches.', sub: 'Espresso, dark roast, and beyond.' },
  spice: { title: 'Spice Pouches.', sub: 'Pepper, ginger, anise. The unconventional shelf.' },
  cola: { title: 'Cola & Soda Pouches.', sub: 'Caramel, ginger, dark sugar. Borderline weird, deliberate.' },
  'tobacco-free': { title: 'Tobacco-Free Pouches.', sub: 'Every product on our shelf, by definition. Browse anyway.' },
};

const STRENGTH_LABELS: Record<string, { title: string; sub: string; bg?: string }> = {
  light: { title: 'Light Strength.', sub: '2-3mg. The starting line. Easy on the gum, gentle on the throat.' },
  regular: { title: 'Regular Strength.', sub: '4-6mg. The all-day rotation tier.' },
  strong: { title: 'Strong.', sub: '7-9mg. Where most experienced users settle in.', bg: HERO_IMAGES.strong },
  'x-strong': { title: 'X-Strong.', sub: '10mg+. KILLA, PABLO, ACE Black. Not for new users.', bg: HERO_IMAGES.strong },
};

export default function CategoryPLP({ kind }: { kind: 'flavor' | 'strength' }) {
  const { value = '' } = useParams();
  if (kind === 'flavor') {
    const list = productsByFlavor(value as FlavorFamily);
    if (list.length === 0) return <Navigate to="/shop" replace />;
    const meta = FLAVOR_LABELS[value] || { title: value.toUpperCase(), sub: '' };
    return <Layout title={meta.title} sub={meta.sub} eyebrow={`FLAVOR · ${value.toUpperCase()} · ${list.length} PRODUCTS`} list={list} bg={meta.bg} />;
  }
  const list = productsByStrength(value as Strength);
  if (list.length === 0) return <Navigate to="/shop" replace />;
  const meta = STRENGTH_LABELS[value] || { title: value.toUpperCase(), sub: '' };
  return <Layout title={meta.title} sub={meta.sub} eyebrow={`STRENGTH · ${value.toUpperCase()} · ${list.length} PRODUCTS`} list={list} bg={meta.bg} />;
}

function Layout({
  title, sub, eyebrow, list, bg,
}: {
  title: string;
  sub: string;
  eyebrow: string;
  list: typeof products;
  bg?: string;
}) {
  return (
    <div className="bg-bg-primary">
      <section className="relative overflow-hidden">
        {bg && (
          <div className="absolute inset-0">
            <img src={bg} alt="" className="w-full h-full object-cover opacity-50" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-bg-primary/60 to-bg-primary" />
          </div>
        )}
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-20 text-center">
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          <h1 className="font-display text-white text-5xl md:text-7xl leading-tight">{title}</h1>
          <p className="mt-4 text-white/85 leading-relaxed max-w-2xl mx-auto">{sub}</p>
        </div>
      </section>
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </div>
  );
}
