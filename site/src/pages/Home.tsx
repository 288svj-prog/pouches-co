import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe } from 'lucide-react';
import { brands } from '../data/brands';
import { products, totalProductCount } from '../data/products';
import { homepageReviews } from '../data/reviews';
import { Tin } from '../components/Tin';
import { Eyebrow } from '../components/Eyebrow';
import { LinkButton } from '../components/Button';
import { Stars } from '../components/Stars';
import { PillBadge } from '../components/Chips';
import { HeroCarousel, type HeroSlide } from '../components/HeroCarousel';
import { useState } from 'react';
import { brandBySlug } from '../data/brands';
import { HERO_IMAGES, QUIZ_ICONS, productImage } from '../data/images';
import { BrandLogo } from '../components/BrandLogo';
// HERO_IMAGES is consumed by the slide config inside Hero(); keep the import.

export default function Home() {
  return (
    <>
      <Hero />
      <Lookbook />
      <BYOSection />
      <BrandWall />
      <FlavorFinder />
      <Reviews />
      <EmailCapture />
    </>
  );
}

/**
 * Editorial cinematic hero — auto-rotating carousel of brand stories.
 * Each slide is a full-bleed photograph with a copy block pinned lower-left.
 * The transparent nav flows over the top; the hero is pulled up behind it.
 */
function Hero() {
  const slides: HeroSlide[] = [
    {
      id: 'provenance',
      image: HERO_IMAGES.provenance,
      imageAlt: 'Swedish pouch tins on weathered wood near a frosted window with a snowy birch forest beyond',
      eyebrow: 'FROM UPPSALA, WITH CARE',
      headlineLines: ['Made in Sweden.', 'Stocked in Sweden.', 'Shipped from Sweden.'],
      body: 'Direct from twelve Swedish makers. Shipped from Uppsala within 24 hours.',
      primaryLink: { label: 'Read our story', to: '/about' },
      secondaryLinks: [
        { label: 'Shop all', to: '/shop' },
        { label: 'Build a Box', to: '/build' },
      ],
    },
    {
      id: 'drop-04',
      image: HERO_IMAGES.drops,
      imageAlt: 'Stack of new-arrival nicotine pouch tins on weathered concrete',
      eyebrow: 'DROP 04 · SS26 · OUT NOW',
      headlineLines: ['New flavors.', 'Restocked rarities.', 'Updated weekly.'],
      body: 'Eight new tins this week, including two X-strong limited editions and one returning fan favorite.',
      primaryLink: { label: 'See the drop', to: '/drops' },
      secondaryLinks: [{ label: 'Shop all', to: '/shop' }],
    },
    {
      id: 'byo',
      image: HERO_IMAGES.byoBox,
      imageAlt: 'Open black gift box containing six Swedish pouch tins arranged in a 2x3 grid',
      eyebrow: 'BUILD A BOX · SAVE 15%',
      headlineLines: ['Mix any 6.', 'Save 15%.', 'Free shipping.'],
      body: 'Pick from any brand, any flavor, any strength. We assemble and ship — anywhere in 47 countries.',
      primaryLink: { label: 'Build your box', to: '/build' },
      secondaryLinks: [{ label: 'Browse products', to: '/shop' }],
      headlineColor: '#CCFF00',
    },
    {
      id: 'killa',
      image: '/img/products/killa.jpg',
      imageAlt: 'KILLA Cold Mint nicotine pouch tin on brushed steel mesh',
      eyebrow: 'BRAND IN FOCUS · KILLA',
      headlineLines: ['Strong only.', 'Skull on the tin.', 'Not for new users.'],
      body: 'KILLA starts at 12mg and goes up. The cult brand for the strength-seeker who has tried everything else.',
      primaryLink: { label: 'Shop KILLA', to: '/brands/killa' },
      secondaryLinks: [{ label: 'X-strong shelf', to: '/strength/x-strong' }],
    },
  ];

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Stat strip with acid-green hairlines above + below */}
      <div className="relative bg-bg-primary">
        <div className="absolute top-0 inset-x-0 h-px bg-accent/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-5">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-mono-eyebrow text-white">
            <span>EST. 1822 <span className="text-accent">·</span> SWEDISH NICOTINE HERITAGE</span>
            <span>47 COUNTRIES <span className="text-accent">·</span> SHIPPED WEEKLY</span>
            <span>0 INTERMEDIARIES <span className="text-accent">·</span> DIRECT FROM MAKER</span>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-accent/30 pointer-events-none" />
      </div>
    </>
  );
}

function Lookbook() {
  const lookbookProducts = brands
    .slice(0, 8)
    .map((b) => products.find((p) => p.brandSlug === b.slug && p.bestseller) || products.find((p) => p.brandSlug === b.slug))
    .filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <section className="bg-bg-primary py-12 md:py-20 border-b border-edge-muted">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        {/* Tag pills — drop metadata moved here from old hero */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <PillBadge>DROP 04</PillBadge>
          <PillBadge>SS26</PillBadge>
          <PillBadge>{brands.length} BRANDS</PillBadge>
          <PillBadge>{totalProductCount} PRODUCTS</PillBadge>
          <span className="ml-auto inline-flex items-center gap-1 text-mono-badge text-ink-secondary">
            <Globe size={11} strokeWidth={2} />
            INTERNATIONAL SHIPPING — 47 COUNTRIES
          </span>
        </div>
        {/* Section header w/ acid-green hairline accent */}
        <SectionHead eyebrow="THIS WEEK" headline="Bestsellers, on the shelf." viewAllTo="/shop" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {lookbookProducts.map((p) => {
            const brand = brandBySlug(p.brandSlug);
            return (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className="group block bg-bg-secondary rounded-card border border-edge hover:border-accent/40 transition overflow-hidden"
              >
                <div className="aspect-square">
                  <Tin
                    brand={brand?.name || ''}
                    swatch={p.swatch}
                    textColor={p.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                    surface={brand?.surface || 'concrete'}
                    size={320}
                    image={productImage(p.slug, p.brandSlug)}
                  />
                </div>
                <div className="px-3.5 py-2.5 flex items-center justify-between text-mono-badge">
                  <span className="text-white truncate">{brand?.name} {p.flavor.toUpperCase()}</span>
                  <span className="text-ink-secondary shrink-0 ml-2">${p.price.toFixed(2)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Reusable section header with acid-green hairline accent and a "view all" link.
 * Adds the editorial cut-off line look the brand spec calls for.
 */
function SectionHead({
  eyebrow,
  headline,
  viewAllTo,
  viewAllLabel = 'SEE ALL',
}: {
  eyebrow: string;
  headline: string;
  viewAllTo?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-mono-eyebrow text-accent">{eyebrow}</span>
            <span aria-hidden="true" className="hidden md:inline-block h-px w-16 bg-accent/60" />
          </div>
          <h2 className="font-display italic text-white text-2xl md:text-4xl mt-1">{headline}</h2>
        </div>
        {viewAllTo && (
          <Link to={viewAllTo} className="text-mono-badge text-white hover:text-accent transition inline-flex items-center gap-1 shrink-0">
            {viewAllLabel} <ArrowRight size={12} />
          </Link>
        )}
      </div>
      {/* Cut-off line — acid-green to dark fade across the full content row */}
      <div aria-hidden="true" className="mt-4 h-px w-full bg-gradient-to-r from-accent/50 via-edge-muted to-transparent" />
    </div>
  );
}

function BYOSection() {
  return (
    <section className="bg-bg-primary py-16 md:py-24 border-t border-edge-muted">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <Eyebrow className="mb-6">BUILD YOUR OWN BOX</Eyebrow>
          <h2 className="font-display text-accent text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
            MIX ANY 6.<br />SAVE 15%.
          </h2>
          <p className="mt-6 text-white/90 text-lg max-w-md leading-relaxed">
            Pick from any brand. Any flavor. Any strength.<br />
            We assemble and ship — anywhere in 47 countries.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              ['01 PICK', `Choose 6 tins from\n${totalProductCount} products`],
              ['02 MIX', 'Any combo across\nall 12 brands'],
              ['03 SHIP', 'Trackable,\n47 countries'],
            ].map(([h, b]) => (
              <div key={h}>
                <div className="text-mono-eyebrow text-accent mb-2">{h}</div>
                <div className="text-white text-xs leading-snug whitespace-pre-line">{b}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <LinkButton to="/build" iconRight={<ArrowRight size={16} />}>
              BUILD YOUR BOX
            </LinkButton>
          </div>
          <div className="mt-6 text-mono-badge text-ink-secondary">
            SAVE 15% <span className="text-accent">·</span> FREE SHIPPING OVER $49 <span className="text-accent">·</span> CANCEL ANYTIME
          </div>
        </div>
        <div className="relative">
          <div className="rounded-card overflow-hidden border border-edge">
            <img
              src={HERO_IMAGES.byoBox}
              alt="Open black gift box containing six different Swedish nicotine pouch tins arranged in a 2x3 grid on cracked concrete"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandWall() {
  return (
    <section className="bg-bg-primary py-16 md:py-24 border-t border-edge-muted">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="text-center mb-12 relative">
          <Eyebrow className="mb-4 inline-flex items-center gap-3 justify-center">
            <span aria-hidden className="h-px w-10 bg-accent/50" />
            <span>12 BRANDS · ONE CHECKOUT</span>
            <span aria-hidden className="h-px w-10 bg-accent/50" />
          </Eyebrow>
          <h2 className="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-tight">
            EVERY SHELF FROM SWEDEN.
          </h2>
          <p className="mt-4 text-ink-secondary">Curated. Stocked. Shipped to 47 countries.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {brands.map((b) => (
            <Link
              to={`/brands/${b.slug}`}
              key={b.slug}
              className="group relative block bg-bg-secondary border border-edge overflow-hidden hover:border-accent transition no-tap-highlight"
            >
              {/* Brand-tinted gradient backdrop — uses the brand's swatch color */}
              <div
                className="absolute inset-0 transition-opacity duration-base"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${b.swatch} 0%, ${b.swatch}80 40%, #0A0A0A 100%)`,
                  opacity: 0.55,
                }}
                aria-hidden="true"
              />
              <div className="relative aspect-square flex items-center justify-center p-6">
                <span className="absolute top-3 left-3 z-10 text-mono-badge text-white">
                  {b.productCount} PRODUCTS
                </span>
                <BrandLogo
                  brandSlug={b.slug}
                  height={56}
                  color={b.textOnSwatch}
                  ariaLabel={`${b.name} wordmark`}
                  className="md:!h-20 transition-transform duration-base group-hover:scale-105"
                />
              </div>
              <div className="relative px-4 py-3 flex items-center justify-between border-t border-edge-muted bg-bg-primary/80 backdrop-blur-sm">
                <span className="text-white font-bold uppercase tracking-wider text-sm">{b.name}</span>
                <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


function FlavorFinder() {
  const [pick, setPick] = useState(1);
  return (
    <section className="bg-bg-primary py-16 md:py-24 border-t border-edge-muted">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Eyebrow className="mb-6">FLAVOR FINDER · 60 SECONDS</Eyebrow>
          <h2 className="font-display text-accent text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            DON'T KNOW<br />WHERE TO START?
          </h2>
          <p className="mt-6 text-white/90 text-lg leading-relaxed max-w-md">
            Answer six questions about how you like your mint, your strength, your moment. We'll narrow {totalProductCount} products down to the three you'll actually love.
          </p>
          <div className="mt-8">
            <LinkButton to="/quiz" iconRight={<ArrowRight size={16} />}>
              TAKE THE QUIZ
            </LinkButton>
          </div>
          <div className="mt-6 text-mono-badge text-ink-secondary">
            USED BY 8,400+ FIRST-TIME BUYERS <span className="text-accent">·</span> 94% SATISFACTION
          </div>
        </div>
        <div className="bg-bg-secondary border border-edge-muted p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-mono-eyebrow text-accent">QUESTION 4 OF 6</span>
            <span className="text-mono-badge text-ink-secondary">66% COMPLETE</span>
          </div>
          <div className="flex items-center gap-1 mb-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`flex-1 h-px ${n <= 4 ? 'bg-accent' : 'bg-edge'}`}
              />
            ))}
          </div>
          <h3 className="font-display italic text-white text-2xl md:text-3xl text-center mb-6">
            How do you take your mint?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 0, label: 'FRESH', sub: 'Cool, herbal', img: QUIZ_ICONS.fresh },
              { id: 1, label: 'ICY', sub: 'Cold, frosted', img: QUIZ_ICONS.icy },
              { id: 2, label: 'SHARP', sub: 'Strong, throat-y', img: QUIZ_ICONS.sharp },
            ].map((opt) => {
              const selected = pick === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPick(opt.id)}
                  className={`group relative text-left transition-all ease-pouch-out ${
                    selected ? '-translate-y-0.5' : ''
                  }`}
                >
                  <div
                    className={`relative aspect-square overflow-hidden border transition-all ${
                      selected
                        ? 'border-accent shadow-glow-accent-strong'
                        : 'border-edge group-hover:border-white/40'
                    }`}
                  >
                    <img
                      src={opt.img}
                      alt={opt.label.toLowerCase() + ' mint icon'}
                      className={`w-full h-full object-cover transition-transform duration-slow ${
                        selected ? 'scale-105' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/10 to-transparent" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-sm text-[9px] font-mono text-white tracking-wider">
                      0{opt.id + 1}
                    </span>
                    {selected && (
                      <span className="absolute top-2 right-2 w-6 h-6 bg-accent text-accent-on flex items-center justify-center">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                    <div className="absolute bottom-0 inset-x-0 p-2.5">
                      <div className={`text-mono-badge font-bold ${selected ? 'text-accent' : 'text-white'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[10px] font-mono text-ink-secondary mt-0.5">{opt.sub}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="border-t border-edge-muted mt-6 pt-4 flex items-center justify-between">
            <button className="text-mono-badge text-white/60 hover:text-white transition">
              ← BACK
            </button>
            <LinkButton
              to="/quiz"
              size="sm"
              variant="primary"
              iconRight={<ArrowRight size={13} />}
            >
              CONTINUE
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="bg-bg-primary py-16 md:py-24 border-t border-edge-muted">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-center">
        <Eyebrow className="mb-4">TRUSTED · 8,400+ REVIEWS</Eyebrow>
        <h2 className="font-display text-accent text-4xl md:text-6xl lg:text-7xl leading-tight">
          Don't take our word for it.
        </h2>
        <div className="mt-5 flex items-center justify-center gap-3 text-white/90 text-sm">
          <div className="inline-flex items-center gap-1.5 font-bold">
            <span className="text-verified">★</span> Trustpilot
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="w-5 h-5 bg-verified flex items-center justify-center text-white text-[10px]"
                style={{ borderRadius: 2 }}
              >
                ★
              </span>
            ))}
          </div>
          <span>4.8 / 5 — 8,427 verified reviews from 47 countries</span>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 text-left">
          {homepageReviews.map((r) => (
            <article
              key={r.id}
              className="bg-bg-secondary border border-edge rounded-card p-6"
            >
              <div className="flex items-center justify-between">
                <Stars rating={r.rating} size={16} />
                <PillBadge variant="verified">VERIFIED PURCHASE ✓</PillBadge>
              </div>
              <h3 className="mt-5 font-display italic text-white text-xl leading-tight">{r.headline}</h3>
              <p className="mt-3 text-white/80 text-sm leading-relaxed">{r.body}</p>
              <div className="mt-6 pt-4 border-t border-edge-muted flex items-center justify-between text-mono-badge text-ink-secondary">
                <span className="text-white">
                  {r.author} <span className="opacity-60">— {r.flag} {r.country}</span>
                </span>
                <span>{r.date}</span>
              </div>
            </article>
          ))}
        </div>

        <Link to="/reviews" className="mt-10 inline-flex items-center gap-1 text-ink-secondary hover:text-accent transition text-sm">
          Read all 8,427 reviews <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function EmailCapture() {
  return (
    <section className="bg-bg-primary py-16 md:py-32 relative overflow-hidden border-t border-edge-muted">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGES.packaging}
          alt=""
          className="w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/70 to-bg-primary" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 md:px-10 text-center">
        <Eyebrow className="mb-6">FIRST ORDER · 10% OFF</Eyebrow>
        <h2 className="font-display text-accent text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
          JOIN THE LIST.<br />MISS NOTHING.
        </h2>
        <p className="mt-6 text-white text-lg">Drops, restocks, flavor news. We don't spam — we ship.</p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:bg-bg-secondary sm:border sm:border-edge sm:rounded-pill sm:p-1.5"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full h-14 sm:h-12 px-6 bg-bg-secondary sm:bg-transparent border sm:border-0 border-edge rounded-pill text-white placeholder:text-ink-muted focus:outline-none"
          />
          <button className="w-full sm:w-auto h-14 sm:h-12 px-6 sm:px-8 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider hover:brightness-105 transition flex items-center justify-center gap-2 whitespace-nowrap">
            SUBSCRIBE <ArrowRight size={16} />
          </button>
        </form>
        <div className="mt-6 text-mono-badge text-ink-secondary">
          21+ ONLY <span className="text-accent">·</span> UNSUBSCRIBE ANYTIME <span className="text-accent">·</span> NO SPAM
        </div>
      </div>
    </section>
  );
}
