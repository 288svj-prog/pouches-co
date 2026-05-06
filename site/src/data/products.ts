export type Strength = 'light' | 'regular' | 'strong' | 'x-strong';
export type Format = 'slim' | 'standard' | 'mini';
export type FlavorFamily = 'mint' | 'fruit' | 'citrus' | 'cinnamon' | 'coffee' | 'tobacco-free' | 'spice' | 'cola';

export type Product = {
  slug: string;
  brandSlug: string;
  name: string;
  flavor: string;
  flavorFamily: FlavorFamily;
  strengthMg: number;
  strengthTier: Strength;
  format: Format;
  pouchesPerRoll: number;
  durationMinutes: number;
  price: number;
  bulkPricing: { qty: number; price: number }[];
  rating: number;
  reviews: number;
  bestseller?: boolean;
  newArrival?: boolean;
  description: string;
  flavorProfile: string;
  swatch: string; // tin lid color
  altFlavors?: string[]; // sibling slugs
};

const tiers = (mg: number): Strength => {
  if (mg <= 3) return 'light';
  if (mg <= 6) return 'regular';
  if (mg <= 9) return 'strong';
  return 'x-strong';
};

const bulk = (price: number) => [
  { qty: 5, price: +(price * 5 * 0.9).toFixed(2) },
  { qty: 10, price: +(price * 10 * 0.85).toFixed(2) },
  { qty: 25, price: +(price * 25 * 0.8).toFixed(2) },
];

const make = (
  brandSlug: string,
  flavor: string,
  flavorFamily: FlavorFamily,
  strengthMg: number,
  price: number,
  options: Partial<Product> = {}
): Product => {
  const slugBase = `${brandSlug}-${flavor.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${strengthMg}mg`;
  return {
    slug: slugBase,
    brandSlug,
    name: flavor,
    flavor,
    flavorFamily,
    strengthMg,
    strengthTier: tiers(strengthMg),
    format: 'slim',
    pouchesPerRoll: 20,
    durationMinutes: 40,
    price,
    bulkPricing: bulk(price),
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(80 + Math.random() * 320),
    description: `${flavor} from ${brandSlug.toUpperCase()} — ${strengthMg}mg, slim format, 20 pouches per roll, ~40 minute burn.`,
    flavorProfile: '',
    swatch: '#FFFFFF',
    ...options,
  };
};

export const products: Product[] = [
  // ZYN — concrete surface
  make('zyn', 'Cool Mint', 'mint', 6, 4.99, {
    swatch: '#1F8FCC',
    bestseller: true,
    description: 'A wintery mint with a hint of cool sweetness. Slightly sweet, perfectly balanced — ZYN\'s gateway pouch and Sweden\'s #1 flavor. Around 40 minutes of clean nicotine release.',
    flavorProfile: 'Cool peppermint with a long, soft finish. The reference mint.',
    rating: 4.8, reviews: 248,
  }),
  make('zyn', 'Spearmint', 'mint', 6, 4.99, { swatch: '#2D9D5F', rating: 4.7, reviews: 192 }),
  make('zyn', 'Wintergreen', 'mint', 6, 4.99, { swatch: '#3DA85F', rating: 4.6, reviews: 174 }),
  make('zyn', 'Cool Mint', 'mint', 3, 4.99, { swatch: '#5DBFD9', rating: 4.7, reviews: 158 }),
  make('zyn', 'Citrus', 'citrus', 6, 4.99, { swatch: '#E89A1F', rating: 4.5, reviews: 98 }),
  make('zyn', 'Cinnamon', 'cinnamon', 6, 4.99, { swatch: '#8C3A1A', rating: 4.4, reviews: 142 }),
  make('zyn', 'Coffee', 'coffee', 6, 4.99, { swatch: '#3A2418', rating: 4.6, reviews: 88 }),
  make('zyn', 'Espresso', 'coffee', 9, 5.49, { swatch: '#241612', rating: 4.7, reviews: 76 }),

  // VELO — denim surface
  make('velo', 'Polar Mint', 'mint', 4, 4.79, {
    swatch: '#FFFFFF', bestseller: true, rating: 4.7, reviews: 192,
    description: 'A polar-cold peppermint hit with VELO\'s signature soft mouthfeel. Lower strength, slimmer pouch, all-day rotation.',
    flavorProfile: 'Cold, clean, slightly sweet. Less throat-burn than ZYN.',
  }),
  make('velo', 'Freeze', 'mint', 7, 4.79, { swatch: '#0066CC', rating: 4.6, reviews: 165 }),
  make('velo', 'Tropic Breeze', 'fruit', 6, 4.79, { swatch: '#F58600', rating: 4.5, reviews: 121 }),
  make('velo', 'Ruby Berry', 'fruit', 6, 4.79, { swatch: '#B8264C', rating: 4.6, reviews: 134 }),
  make('velo', 'Citrus Strong', 'citrus', 10, 5.29, { swatch: '#F2C200', rating: 4.4, reviews: 98 }),

  // ACE — metal surface
  make('ace', 'Superwhite', 'mint', 7, 5.99, {
    swatch: '#0A0A0A', bestseller: true, rating: 4.6, reviews: 178,
    description: 'ACE\'s flagship — strong, long-lasting, completely tobacco-free. Slim white pouch in a matte black tin.',
    flavorProfile: 'Sharp peppermint with a long burn. No fruit, no sugar.',
  }),
  make('ace', 'Arctic', 'mint', 9, 5.99, { swatch: '#5DA5C7', rating: 4.7, reviews: 145 }),
  make('ace', 'Black', 'tobacco-free', 12, 6.49, { swatch: '#000000', rating: 4.5, reviews: 88 }),

  // ICEBERG — denim surface
  make('iceberg', 'Spearmint', 'mint', 8, 4.49, {
    swatch: '#3FA9B5', bestseller: true, rating: 4.7, reviews: 150,
    description: 'A clean spearmint that holds its temperature for the full burn. ICEBERG\'s signature flavor.',
    flavorProfile: 'Spearmint with cooling agent. Cold from minute 0 to minute 40.',
  }),
  make('iceberg', 'Wintergreen', 'mint', 8, 4.49, { swatch: '#1A6E78', rating: 4.6, reviews: 132 }),
  make('iceberg', 'Mint Strong', 'mint', 10, 4.99, { swatch: '#0F4D5C', rating: 4.7, reviews: 108 }),
  make('iceberg', 'Polar', 'mint', 4, 4.49, { swatch: '#A8D8E0', rating: 4.5, reviews: 92 }),

  // FUMI — leather surface
  make('fumi', 'Spicy Cola', 'cola', 6, 5.49, {
    swatch: '#7B1818', bestseller: true, rating: 4.5, reviews: 98,
    description: 'A divisive flavor for people who are bored of mint. Cola syrup, black pepper, a finish of caramel.',
    flavorProfile: 'Cola, ginger heat, dark sugar. Polarizing on purpose.',
  }),
  make('fumi', 'Bourbon Vanilla', 'tobacco-free', 6, 5.49, { swatch: '#5C3A1A', rating: 4.4, reviews: 76 }),
  make('fumi', 'Grapefruit Basil', 'citrus', 4, 5.49, { swatch: '#D4585E', rating: 4.3, reviews: 64 }),
  make('fumi', 'Citrus', 'citrus', 6, 5.49, { swatch: '#E89A1F', rating: 4.5, reviews: 88 }),

  // LOOP — concrete surface
  make('loop', 'Pink Lemonade', 'fruit', 4, 5.29, { swatch: '#F2A6C3', rating: 4.6, reviews: 124 }),
  make('loop', 'Mango Mint', 'fruit', 6, 5.29, { swatch: '#F2C200', rating: 4.5, reviews: 98 }),
  make('loop', 'Eucalyptus', 'mint', 4, 5.29, { swatch: '#A8D2B0', rating: 4.4, reviews: 72 }),

  // NORDIC SPIRIT
  make('nordic-spirit', 'Polar', 'mint', 6, 4.89, {
    swatch: '#1B4376', bestseller: true, rating: 4.6, reviews: 135,
    description: 'Nordic Spirit\'s long-burn polar mint. The strength holds steady for the entire 40-minute window — uncommon at this tier.',
    flavorProfile: 'Cool peppermint with a clean, dry finish.',
  }),
  make('nordic-spirit', 'Smooth Mint', 'mint', 4, 4.89, { swatch: '#5DA5C7', rating: 4.5, reviews: 110 }),
  make('nordic-spirit', 'Spearmint', 'mint', 9, 5.29, { swatch: '#2D9D5F', rating: 4.7, reviews: 95 }),

  // KILLA
  make('killa', 'Cold Mint', 'mint', 12, 5.99, {
    swatch: '#1A1A1A', bestseller: true, rating: 4.6, reviews: 178,
    description: 'X-strong cold mint. Not for new users. KILLA\'s flagship — 12mg of peppermint with a freeze additive.',
    flavorProfile: 'Aggressive peppermint with a frost note. Goes hard.',
  }),
  make('killa', 'Cinnamon Storm', 'cinnamon', 12, 5.99, { swatch: '#8C3A1A', rating: 4.5, reviews: 132 }),
  make('killa', 'Apple Frost', 'fruit', 16, 6.49, { swatch: '#3A6E2D', rating: 4.4, reviews: 98, newArrival: true }),

  // SKRUF
  make('skruf', 'Super White', 'mint', 6, 4.69, { swatch: '#E5E5E5', rating: 4.7, reviews: 145 }),
  make('skruf', 'Fresh', 'mint', 4, 4.69, { swatch: '#A8D8E0', rating: 4.6, reviews: 112 }),
  make('skruf', 'Black', 'tobacco-free', 9, 5.19, { swatch: '#0A0A0A', rating: 4.7, reviews: 88 }),

  // HELWIT
  make('helwit', 'Mint', 'mint', 6, 4.49, { swatch: '#A8A8A8', rating: 4.5, reviews: 78 }),
  make('helwit', 'Polar', 'mint', 8, 4.79, { swatch: '#5DA5C7', rating: 4.6, reviews: 92 }),

  // PABLO
  make('pablo', 'Mint', 'mint', 12, 5.49, { swatch: '#8C0000', rating: 4.4, reviews: 88 }),
  make('pablo', 'Ice Cold', 'mint', 16, 5.99, { swatch: '#5C0000', rating: 4.5, reviews: 124, newArrival: true }),
  make('pablo', 'Exclusive Snowstorm', 'mint', 30, 7.49, { swatch: '#1A1A1A', rating: 4.3, reviews: 64 }),

  // WHITE FOX
  make('white-fox', 'Full Charge', 'mint', 12, 5.49, {
    swatch: '#FFFFFF', bestseller: true, rating: 4.6, reviews: 156,
    description: 'White Fox\'s strongest mint, with a long-throw flavor curve and a clean release. The cult favorite.',
    flavorProfile: 'Peppermint, eucalyptus, slight pine.',
  }),
  make('white-fox', 'Black Edition', 'mint', 16, 5.99, { swatch: '#0A0A0A', rating: 4.7, reviews: 132 }),
  make('white-fox', 'Peppered Mint', 'spice', 12, 5.49, { swatch: '#3A1A1A', rating: 4.5, reviews: 88 }),
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productsByBrand = (brandSlug: string) => products.filter((p) => p.brandSlug === brandSlug);
export const productsByFlavor = (family: FlavorFamily) => products.filter((p) => p.flavorFamily === family);
export const productsByStrength = (tier: Strength) => products.filter((p) => p.strengthTier === tier);
export const bestsellers = () => products.filter((p) => p.bestseller);

export const totalProductCount = products.length;

// Find sibling variants (same brand, same flavor family, different strength/flavor)
export const siblingVariants = (p: Product) =>
  products.filter((s) => s.brandSlug === p.brandSlug && s.slug !== p.slug);
