import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { useCart, selectItemCount, selectByoCount, selectSubtotal, selectByoDiscount, selectFreeShipProgress } from '../store/cart';
import { Tin } from '../components/Tin';
import { productImage } from '../data/images';
import { brandBySlug } from '../data/brands';
import { FloatingInput } from '../components/Input';

type Step = 'information' | 'shipping' | 'payment' | 'done';

export default function Checkout() {
  const items = useCart((s) => s.items);
  const subtotal = selectSubtotal(items);
  const byoDiscount = selectByoDiscount(items);
  const byoCount = selectByoCount(items);
  const ship = selectFreeShipProgress(items);
  const clear = useCart((s) => s.clear);
  const itemCount = selectItemCount(items);
  useNavigate();
  const [step, setStep] = useState<Step>('information');
  const [shipMethod, setShipMethod] = useState<'standard' | 'express' | 'priority'>('standard');
  const [pay, setPay] = useState<'card' | 'paypal' | 'klarna' | 'crypto'>('card');

  if (items.length === 0 && step !== 'done') {
    return (
      <div className="bg-bg-primary min-h-screen">
        <CheckoutNav />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-display italic text-white text-4xl">Nothing to check out.</h1>
          <p className="mt-3 text-ink-secondary">Your bag is empty. Add some products first.</p>
          <Link to="/shop" className="mt-6 inline-block text-accent underline underline-offset-4">
            Browse all products →
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = shipMethod === 'standard' ? (ship.remaining > 0 ? 6.99 : 0) : shipMethod === 'express' ? 12.99 : 24.99;
  const tax = +(subtotal * 0.115).toFixed(2);
  const total = +(subtotal - byoDiscount + shippingCost + tax).toFixed(2);

  if (step === 'done') {
    return (
      <div className="bg-bg-primary min-h-screen">
        <CheckoutNav />
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <img src="/img/hero/packaging.jpg" alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-bg-primary/70 to-bg-primary" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-accent text-accent-on flex items-center justify-center mx-auto mb-6 shadow-glow-accent-strong">
              <Check size={32} strokeWidth={3} />
            </div>
            <div className="text-mono-eyebrow text-accent mb-3">ORDER #PNC-08442</div>
            <h1 className="font-display italic text-white text-4xl md:text-5xl leading-tight">
              Your box is on its way.
            </h1>
            <p className="mt-4 text-white/85">
              Confirmation email sent. Tracking starts when your box leaves Uppsala — usually within 24 hours.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/account/orders" className="h-12 px-6 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-105 transition">
                TRACK YOUR ORDER <ArrowRight size={14} />
              </Link>
              <Link to="/" className="h-12 px-6 rounded-pill border border-white text-white font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/5 transition">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <CheckoutNav />
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-8 md:py-12 grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-16">
        {/* LEFT - form */}
        <div>
          <div className="text-mono-eyebrow text-accent mb-3">ONE-PAGE CHECKOUT</div>
          <h1 className="font-display italic text-white text-5xl md:text-6xl leading-none">Checkout.</h1>
          <p className="mt-3 text-ink-secondary">Quick — most orders take under 60 seconds.</p>

          <div className="mt-8">
            <div className="text-mono-eyebrow text-accent mb-3">EXPRESS CHECKOUT · SKIP THE FORM</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Apple Pay', 'bg-black border border-white'],
                ['Shop Pay', 'bg-[#5A31F4]'],
                ['G Pay', 'bg-white text-black'],
              ].map(([label, cls]) => (
                <button
                  key={label}
                  className={`h-12 rounded-pill flex items-center justify-center text-mono-badge font-bold tracking-wider ${cls}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="text-center text-mono-badge text-ink-secondary mt-3">
              Auto-fills shipping & payment from your wallet
            </div>
          </div>

          <div className="my-8 flex items-center gap-4">
            <span className="flex-1 h-px bg-edge-muted" />
            <span className="text-mono-eyebrow text-ink-secondary">OR CONTINUE WITH EMAIL</span>
            <span className="flex-1 h-px bg-edge-muted" />
          </div>

          {/* CONTACT */}
          <Section label="CONTACT">
            <FloatingInput
              label="Email address"
              required
              defaultValue="marcus@example.com"
              type="email"
            />
            <Checkbox label="Email me about new drops and promotions" defaultChecked />
          </Section>

          {/* SHIPPING ADDRESS */}
          <Section label="SHIPPING ADDRESS">
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput label="Country/Region" defaultValue="Canada" className="col-span-2" />
              <FloatingInput label="First" defaultValue="Marcus" />
              <FloatingInput label="Last" defaultValue="Karlsson" />
              <FloatingInput label="Street" defaultValue="47 Wellesley St" className="col-span-2" />
              <FloatingInput label="Apt (optional)" />
              <FloatingInput label="City" defaultValue="Toronto" />
              <FloatingInput label="Province" defaultValue="Ontario" />
              <FloatingInput label="Postal" defaultValue="M4Y 1H4" />
              <FloatingInput label="Phone" defaultValue="+1 416 555 0142" />
            </div>
            <Checkbox label="Save this address" defaultChecked />
          </Section>

          {/* DELIVERY METHOD */}
          <Section label="DELIVERY METHOD">
            {[
              { id: 'standard' as const, name: 'Standard', sub: '5-7 days · DHL', price: ship.remaining > 0 ? '$6.99' : 'FREE' },
              { id: 'express' as const, name: 'Express', sub: '2-3 days · DHL', price: '$12.99' },
              { id: 'priority' as const, name: 'Priority', sub: 'Next day · Signature', price: '$24.99' },
            ].map((m) => {
              const sel = shipMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setShipMethod(m.id)}
                  className={`w-full flex items-center justify-between p-4 mb-2 rounded-card border transition text-left ${
                    sel ? 'border-accent bg-accent/5 shadow-glow-accent-strong' : 'border-edge'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        sel ? 'border-accent' : 'border-white'
                      }`}
                    >
                      {sel && <span className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </span>
                    <div>
                      <div className="text-white font-bold text-sm">{m.name}</div>
                      <div className="text-ink-secondary text-xs">{m.sub}</div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${m.price === 'FREE' ? 'text-accent' : 'text-white'}`}>
                    {m.price}
                  </span>
                </button>
              );
            })}
          </Section>

          {/* PAYMENT */}
          <Section label="PAYMENT">
            <div className="grid grid-cols-4 gap-2">
              {[
                ['card', 'CREDIT CARD'],
                ['paypal', 'PAYPAL'],
                ['klarna', 'KLARNA · 4 INTEREST-FREE'],
                ['crypto', 'CRYPTO'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setPay(id as typeof pay)}
                  className={`h-12 px-3 rounded-card border text-mono-badge tracking-wider transition ${
                    pay === id ? 'border-accent text-accent' : 'border-edge text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {pay === 'card' && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <FloatingInput label="Card" defaultValue="4242 4242 4242 4242" className="col-span-3" />
                <FloatingInput label="Expiry" defaultValue="12/27" />
                <FloatingInput label="CVC" defaultValue="•••" />
                <FloatingInput label="Name" defaultValue="Marcus Karlsson" />
                <Toggle label="Billing same as shipping" defaultOn />
              </div>
            )}
          </Section>

          <Section label="AGE VERIFICATION REQUIRED ⚠">
            <Checkbox
              label="I confirm I am 21+ and authorized to receive nicotine products at the delivery address."
              defaultChecked
            />
          </Section>

          <button
            onClick={() => {
              clear();
              setStep('done');
            }}
            className="w-full h-16 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(204,255,0,0.4)]"
          >
            <Lock size={18} strokeWidth={2.5} />
            PLACE ORDER · ${total.toFixed(2)} USD
          </button>
          <div className="mt-3 text-center text-mono-badge text-ink-secondary">
            YOUR CARD WILL BE CHARGED ${total.toFixed(2)} USD <span className="text-accent">·</span> Free returns within 30 days
          </div>
        </div>

        {/* RIGHT - order summary */}
        <aside className="bg-bg-secondary border border-edge rounded-card p-5 self-start lg:sticky lg:top-32">
          <div className="flex items-center justify-between mb-4">
            <span className="text-mono-eyebrow text-white">YOUR ORDER · {itemCount} ITEMS</span>
          </div>
          {byoCount >= 6 && (
            <div className="mb-4">
              <div className="text-white font-display italic text-2xl">BYO Box (Build Your Own)</div>
              <div className="mt-1 inline-block px-2 py-1 rounded bg-accent text-accent-on text-mono-badge">
                BYO BOX · 15% OFF
              </div>
            </div>
          )}
          <div className="space-y-3 mb-4">
            {items.map((it) => {
              const brand = brandBySlug(it.brandSlug);
              const display = it.byo ? +(it.price * 0.85).toFixed(2) : it.price;
              return (
                <div key={it.productSlug} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Tin
                      brand={brand?.name || ''}
                      swatch={it.swatch}
                      textColor={it.swatch === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'}
                      surface={brand?.surface || 'concrete'}
                      size={80}
                      image={productImage(it.productSlug, it.brandSlug)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-mono-badge text-ink-secondary">{brand?.name}</div>
                    <div className="text-white text-sm truncate">{it.name}</div>
                  </div>
                  <span className="text-white text-sm shrink-0">${(display * it.qty).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              placeholder="Discount code"
              className="flex-1 h-10 px-3 bg-bg-primary border border-edge rounded text-white text-sm focus:outline-none focus:border-accent"
            />
            <button className="h-10 px-4 rounded border border-edge text-white text-mono-badge">APPLY</button>
          </div>
          <div className="space-y-1 text-sm">
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            {byoDiscount > 0 && <Row label="BYO Discount" value={`−$${byoDiscount.toFixed(2)}`} accent />}
            <Row
              label="Shipping"
              value={shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              accent={shippingCost === 0}
            />
            <Row label="Tax" value={`$${tax.toFixed(2)}`} />
            <div className="pt-3 mt-3 border-t border-edge-muted flex items-center justify-between">
              <span className="text-mono-eyebrow text-white">TOTAL</span>
              <span className="text-white font-bold text-xl">${total.toFixed(2)} USD</span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-edge-muted">
            <div className="text-mono-badge text-ink-secondary mb-2 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-accent" />
              SSL · 256-BIT · STRIPE
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['VISA', 'MC', 'AMEX', 'PP', 'APAY', 'GPAY', 'KLAR', 'CRYP'].map((p) => (
                <span
                  key={p}
                  className="h-6 px-2 rounded bg-bg-primary border border-edge text-[9px] text-white flex items-center font-mono uppercase"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-ink-secondary">{label}</span>
        <span className={accent ? 'text-accent font-bold' : 'text-white'}>{value}</span>
      </div>
    );
  }
}

function CheckoutNav() {
  return (
    <div className="border-b border-edge-muted bg-bg-primary">
      <div className="bg-accent text-accent-on h-8 flex items-center justify-center text-mono-badge px-4">
        SECURE CHECKOUT <span className="opacity-70 mx-2">·</span> SSL ENCRYPTED <span className="opacity-70 mx-2">·</span> 21+ VERIFIED <span className="opacity-70 mx-2">·</span> USD ▾
      </div>
      <div className="max-w-[1440px] mx-auto h-16 px-4 md:px-10 flex items-center justify-between">
        <Link to="/" aria-label="Home" className="flex items-center">
          <Wordmark height={20} />
        </Link>
        <Link to="/" className="text-mono-badge text-white inline-flex items-center gap-2 hover:text-accent transition">
          <ArrowLeft size={14} /> BACK TO BAG
        </Link>
        <Link to="/help" className="text-mono-badge text-white hover:text-accent transition">
          NEED HELP?
        </Link>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <div className="text-mono-eyebrow text-accent mb-4">{label}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Checkbox({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex items-start gap-3 cursor-pointer mt-3">
      <span
        className={`w-5 h-5 rounded-[3px] border flex items-center justify-center mt-0.5 ${
          on ? 'bg-accent border-accent' : 'border-white'
        }`}
        onClick={() => setOn(!on)}
      >
        {on && <Check size={14} strokeWidth={3} className="text-accent-on" />}
      </span>
      <span className="text-white text-sm leading-relaxed flex-1">{label}</span>
      <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="sr-only" />
    </label>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <label className="col-span-3 flex items-center gap-3 cursor-pointer mt-2">
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`w-10 h-6 rounded-full p-0.5 transition ${on ? 'bg-accent' : 'bg-edge'}`}
        aria-label={label}
      >
        <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : ''}`} />
      </button>
      <span className="text-white text-sm">{label}</span>
    </label>
  );
}
