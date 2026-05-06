export type Review = {
  id: string;
  productSlug?: string;
  brandSlug?: string;
  rating: number;
  headline: string;
  body: string;
  author: string;
  country: string;
  flag: string;
  date: string;
  verified: boolean;
  helpful: number;
};

export const homepageReviews: Review[] = [
  {
    id: 'r1',
    rating: 5,
    headline: 'Got my box in Toronto in 4 days.',
    body: 'Coming from Canada that\'s witchcraft. Tracking was real, packaging was tight, every tin sealed and fresh. Already on my second order — they remember my flavors.',
    author: 'Marcus K.',
    country: 'CANADA',
    flag: '🇨🇦',
    date: 'MAR 2026',
    verified: true,
    helpful: 47,
  },
  {
    id: 'r2',
    rating: 5,
    headline: 'BYO Box is the move.',
    body: 'Mixed three ZYN flavors with KILLA and FUMI. Saved 15% on stuff I\'d buy anyway. Smart business — I\'ll keep coming back as long as they keep stocking the heat.',
    author: 'Sarah L.',
    country: 'AUSTRALIA',
    flag: '🇦🇺',
    date: 'FEB 2026',
    verified: true,
    helpful: 31,
  },
  {
    id: 'r3',
    rating: 5,
    headline: 'Finally found ICEBERG outside Sweden.',
    body: 'Site is clean, checkout took 30 seconds, packaging is actual art. The matte black box with the green wordmark — I kept it. That\'s a first for me with any DTC brand.',
    author: 'David M.',
    country: 'GERMANY',
    flag: '🇩🇪',
    date: 'MAR 2026',
    verified: true,
    helpful: 29,
  },
];

export const productReviews = (slug: string): Review[] => {
  const seed = slug.length;
  return [
    {
      id: `${slug}-r1`,
      productSlug: slug,
      rating: 5,
      headline: 'Best of the bunch.',
      body: 'Bought a 5-roll on the BYO discount. Holds flavor for the full burn. Tin design is clean and it\'s genuinely my favorite of the brand right now.',
      author: 'Jordan T.',
      country: 'UK',
      flag: '🇬🇧',
      date: 'APR 2026',
      verified: true,
      helpful: 18 + seed,
    },
    {
      id: `${slug}-r2`,
      productSlug: slug,
      rating: 4,
      headline: 'Solid daily driver.',
      body: 'Strength is consistent and the slim format is easy to carry. Not the most exciting flavor in their catalog but it gets the job done — I rotate through this and a stronger one.',
      author: 'Eli R.',
      country: 'USA',
      flag: '🇺🇸',
      date: 'APR 2026',
      verified: true,
      helpful: 9 + seed,
    },
    {
      id: `${slug}-r3`,
      productSlug: slug,
      rating: 5,
      headline: 'Shipping under a week to Berlin.',
      body: 'No complaints — tin sealed, every pouch fresh. Will reorder. Pouches.co has become my default for Swedish brands now that they actually stock everything.',
      author: 'Lena B.',
      country: 'GERMANY',
      flag: '🇩🇪',
      date: 'MAR 2026',
      verified: true,
      helpful: 14 + seed,
    },
  ];
};

export const ratingDistribution = (avg: number) => {
  // Normalize to a believable 5-star distribution centered on avg
  const five = Math.round((avg - 4) * 100);
  const four = 100 - five - 8;
  return [
    { stars: 5, pct: Math.max(60, Math.min(92, 50 + five)) },
    { stars: 4, pct: Math.max(8, Math.min(30, four)) },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];
};
