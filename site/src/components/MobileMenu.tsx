import { Link, NavLink } from 'react-router-dom';
import { X, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from './Wordmark';
import { brands } from '../data/brands';
import { staggerIn } from '../lib/anim';

const FLAVORS = ['MINT', 'FRUIT', 'CITRUS', 'CINNAMON', 'COFFEE', 'TOBACCO-FREE', 'SPICE', 'COLA'];
const STRENGTHS = [
  { label: 'LIGHT', range: '2–3 MG', slug: 'light' },
  { label: 'REGULAR', range: '4–6 MG', slug: 'regular' },
  { label: 'STRONG', range: '7–9 MG', slug: 'strong' },
  { label: 'X-STRONG', range: '10–15 MG', slug: 'x-strong' },
];

const SECONDARY_LINKS = [
  { label: 'HELP & SHIPPING', to: '/help' },
  { label: 'TRACK ORDER', to: '/account' },
  { label: 'WHOLESALE', to: '/wholesale' },
  { label: 'AFFILIATE', to: '/affiliate' },
];

/**
 * Slide-in mobile drawer.
 * - Fonts unified: every nav row uses the mono uppercase label system; secondary
 *   links are smaller / dimmer but same family (was sans before — felt foreign).
 * - Each section/row staggers in with anime.js when the drawer opens.
 * - Accordions animate height + chevron rotation; only one open at a time.
 */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Stagger the nav rows + secondary section + footer when the drawer mounts
  useEffect(() => {
    if (!open || !drawerRef.current) return;
    const items = drawerRef.current.querySelectorAll<HTMLElement>('[data-stagger]');
    if (items.length) {
      // Reset opacity for replay on re-open
      items.forEach((el) => {
        el.style.opacity = '0';
      });
      requestAnimationFrame(() => {
        staggerIn(Array.from(items), { each: 38, distance: 12 });
      });
    }
    // Close any open accordion on re-open
    setOpenSection(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-[88%] max-w-[400px] bg-bg-primary animate-slide-left flex flex-col"
      >
        {/* HEADER */}
        <header className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-edge-muted">
          <Link to="/" onClick={onClose} aria-label="Home" className="flex items-center">
            <Wordmark height={18} />
          </Link>
          <button
            onClick={onClose}
            className="w-10 h-10 -mr-2 flex items-center justify-center text-white hover:text-accent transition"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </header>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* ACCOUNT BLOCK */}
          <section data-stagger className="p-4 border-b border-edge-muted">
            <Link
              to="/account"
              onClick={onClose}
              className="block w-full h-12 border border-white text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center hover:bg-white/5 transition no-tap-highlight"
            >
              SIGN IN
            </Link>
            <Link
              to="/account"
              onClick={onClose}
              className="block mt-3 text-center text-accent text-mono-badge"
            >
              CREATE AN ACCOUNT →
            </Link>
          </section>

          {/* PRIMARY NAV */}
          <nav>
            <NavRow data-stagger to="/shop" label="SHOP ALL" onClick={onClose} />
            <NavRow data-stagger to="/drops" label="DROPS" onClick={onClose} />

            <Accordion
              dataStagger
              label="BRANDS"
              count={brands.length}
              isOpen={openSection === 'brands'}
              onToggle={() => setOpenSection(openSection === 'brands' ? null : 'brands')}
            >
              <ul>
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      to={`/brands/${b.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between h-11 text-white text-mono-badge pl-6 pr-4 border-b border-edge-muted last:border-b-0 hover:bg-white/[0.03] hover:text-accent transition no-tap-highlight"
                    >
                      <span>{b.name}</span>
                      <span className="text-ink-secondary">{b.productCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              dataStagger
              label="FLAVORS"
              count={FLAVORS.length}
              isOpen={openSection === 'flavors'}
              onToggle={() => setOpenSection(openSection === 'flavors' ? null : 'flavors')}
            >
              <ul>
                {FLAVORS.map((f) => (
                  <li key={f}>
                    <Link
                      to={`/flavors/${f.toLowerCase()}`}
                      onClick={onClose}
                      className="flex items-center h-11 text-white text-mono-badge pl-6 pr-4 border-b border-edge-muted last:border-b-0 hover:bg-white/[0.03] hover:text-accent transition no-tap-highlight"
                    >
                      {f}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion
              dataStagger
              label="STRENGTH"
              count={STRENGTHS.length}
              isOpen={openSection === 'strength'}
              onToggle={() => setOpenSection(openSection === 'strength' ? null : 'strength')}
            >
              <ul>
                {STRENGTHS.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/strength/${s.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between h-11 text-white text-mono-badge pl-6 pr-4 border-b border-edge-muted last:border-b-0 hover:bg-white/[0.03] hover:text-accent transition no-tap-highlight"
                    >
                      <span>{s.label}</span>
                      <span className="text-ink-secondary">{s.range}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            <NavRow data-stagger to="/build" label="BUILD A BOX" accent onClick={onClose} />
            <NavRow data-stagger to="/journal" label="JOURNAL" onClick={onClose} />
            <NavRow data-stagger to="/quiz" label="FLAVOR FINDER QUIZ" onClick={onClose} />
          </nav>

          {/* SECONDARY NAV — same mono family, dimmer */}
          <section data-stagger className="px-4 pt-5 pb-4">
            <div className="text-mono-eyebrow text-accent mb-2">HELP &amp; SUPPORT</div>
            <ul className="divide-y divide-edge-muted">
              {SECONDARY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="flex items-center justify-between h-10 text-mono-badge text-ink-secondary hover:text-accent transition no-tap-highlight"
                  >
                    <span>{l.label}</span>
                    <ArrowRight size={11} className="text-ink-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* SEARCH SHORTCUT — closes drawer + opens search overlay */}
          <section data-stagger className="px-4 pb-5">
            <button
              onClick={() => {
                onClose();
                // Defer to next frame so the menu close animation runs first.
                requestAnimationFrame(() => {
                  document.dispatchEvent(new CustomEvent('open-search'));
                });
              }}
              className="w-full h-12 inline-flex items-center justify-between px-4 border border-edge text-white text-mono-badge hover:border-accent transition no-tap-highlight"
            >
              <span className="inline-flex items-center gap-2">
                <Search size={14} className="text-accent" />
                SEARCH PRODUCTS, BRANDS…
              </span>
              <span className="text-ink-secondary">↵</span>
            </button>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="shrink-0 border-t border-edge-muted p-4 space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            data-stagger
            className="w-full h-10 border border-edge text-white text-mono-badge flex items-center justify-center gap-2 hover:border-accent transition no-tap-highlight"
          >
            🇨🇦 CANADA <span className="text-accent">·</span> USD <ChevronDown size={11} className="text-ink-secondary" />
          </button>
          <div data-stagger className="text-mono-eyebrow text-accent text-center">
            FOR ADULTS 21+ ONLY
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function NavRow({
  to,
  label,
  accent,
  onClick,
  ...rest
}: {
  to: string;
  label: string;
  accent?: boolean;
  onClick?: () => void;
  'data-stagger'?: boolean;
}) {
  return (
    <NavLink
      {...rest}
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between h-12 px-4 text-mono-badge border-b border-edge-muted transition hover:bg-white/[0.03] no-tap-highlight ${
          accent ? 'text-accent' : isActive ? 'text-accent' : 'text-white'
        }`
      }
    >
      <span>{label}</span>
      <ArrowRight size={12} className="text-ink-muted" />
    </NavLink>
  );
}

function Accordion({
  label,
  count,
  isOpen,
  onToggle,
  children,
  dataStagger,
}: {
  label: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  dataStagger?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<number>(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen, children]);

  return (
    <div data-stagger={dataStagger ? '' : undefined} className="border-b border-edge-muted">
      <button
        onClick={onToggle}
        className="w-full h-12 flex items-center justify-between px-4 text-white text-mono-badge hover:bg-white/[0.03] transition no-tap-highlight"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-2">
          {label}
          {count !== undefined && (
            <span className="text-ink-secondary">({count})</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`text-accent transition-transform duration-base ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        style={{ maxHeight, transition: 'max-height 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        className="overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="bg-bg-secondary/30">
          {children}
        </div>
      </div>
    </div>
  );
}
