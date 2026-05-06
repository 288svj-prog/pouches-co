// Map of brand slug → flagship product photo URL.
// These are AI-generated lookbook shots living in /public/img/products/.

export const BRAND_IMAGES: Record<string, string> = {
  zyn: '/img/products/zyn.jpg',
  velo: '/img/products/velo.jpg',
  ace: '/img/products/ace.jpg',
  iceberg: '/img/products/iceberg.jpg',
  fumi: '/img/products/fumi.jpg',
  loop: '/img/products/loop.jpg',
  'nordic-spirit': '/img/products/nordic-spirit.jpg',
  killa: '/img/products/killa.jpg',
  skruf: '/img/products/skruf.jpg',
  helwit: '/img/products/helwit.jpg',
  pablo: '/img/products/pablo.jpg',
  'white-fox': '/img/products/white-fox.jpg',
};

export const HERO_IMAGES = {
  wordmark: '/img/hero/hero-wordmark.jpg',
  byoBox: '/img/hero/byo-box.jpg',
  provenance: '/img/hero/provenance.jpg',
  packaging: '/img/hero/packaging.jpg',
  flavorMint: '/img/hero/flavor-mint.jpg',
  strong: '/img/hero/strong.jpg',
  drops: '/img/hero/drops.jpg',
};

// Macro icons used by the Flavor Finder quiz
export const QUIZ_ICONS = {
  fresh: '/img/icons/quiz-fresh.jpg',
  icy: '/img/icons/quiz-icy.jpg',
  sharp: '/img/icons/quiz-sharp.jpg',
};

// Per-product overrides — fall back to the brand image when no override.
export const PRODUCT_IMAGES: Record<string, string> = {};

export const productImage = (productSlug: string, brandSlug: string): string | undefined =>
  PRODUCT_IMAGES[productSlug] ?? BRAND_IMAGES[brandSlug];
