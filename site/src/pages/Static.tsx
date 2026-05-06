import { Eyebrow, StatStrip } from '../components/Eyebrow';
import { HERO_IMAGES } from '../data/images';

export function About() {
  return (
    <div className="bg-bg-primary">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGES.provenance} alt="" className="w-full h-full object-cover opacity-40" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-bg-primary/70 to-bg-primary" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 md:px-10 py-16 md:py-32">
          <Eyebrow className="mb-4">FROM UPPSALA, WITH CARE</Eyebrow>
          <h1 className="font-display italic text-white text-5xl md:text-6xl leading-tight">
            We ship every Swedish brand.<br />Direct from the makers.
          </h1>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 md:px-10 pb-20">
        <div className="mt-8 space-y-5 text-white/85 text-base leading-relaxed">
          <p>
            Sweden has been making nicotine pouches longer than anyone — the modern format was invented here, refined here, and is still made here. The category is full of brilliant small manufacturers, but their products rarely leave the country in one place.
          </p>
          <p>
            We started Pouches.co to fix that. We work directly with twelve Swedish manufacturers — no resellers, no markup layers, no warehouse-grade utility-first competitors trying to sell you the same six bestsellers everyone else stocks.
          </p>
          <p>
            Every order leaves Uppsala within 24 hours. Sealed tins, hand-packed, trackable to 47 countries. The matte black box has the green wordmark on the lid. We hope you keep it.
          </p>
        </div>
        <div className="mt-10 pt-8 border-t border-edge-muted">
          <StatStrip
            items={[
              'EST. 1822 · SWEDISH HERITAGE',
              '47 COUNTRIES · WEEKLY SHIPMENTS',
              '0 INTERMEDIARIES · DIRECT FROM MAKER',
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function Help() {
  return (
    <div className="bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-10 md:py-16">
        <Eyebrow className="mb-3">HELP & SHIPPING</Eyebrow>
        <h1 className="font-display italic text-white text-4xl md:text-5xl">How can we help?</h1>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {[
            ['Shipping', '4-7 days to most countries via DHL Express.'],
            ['Returns', 'Free returns within 30 days on sealed tins.'],
            ['Tracking', 'Email and SMS updates from Uppsala to your door.'],
            ['Contact', 'support@pouches.co · usually within 4 hours.'],
            ['Wholesale', 'Apply for a wholesale account.'],
            ['Affiliate', 'Earn 10% on every referral.'],
          ].map(([t, b]) => (
            <div key={t} className="border border-edge rounded-card p-5">
              <div className="text-white font-bold">{t}</div>
              <div className="text-ink-secondary text-sm mt-1">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Journal() {
  return (
    <div className="bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 md:px-10 py-10 md:py-16">
        <Eyebrow className="mb-3">JOURNAL</Eyebrow>
        <h1 className="font-display italic text-white text-4xl md:text-5xl">Notes from Uppsala.</h1>
        <p className="mt-4 text-ink-secondary">Long-form notes on Swedish snus history, brand origins, factory visits, and flavor science. Coming soon.</p>
      </div>
    </div>
  );
}
