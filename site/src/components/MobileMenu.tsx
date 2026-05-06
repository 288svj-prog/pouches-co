import { Link, NavLink } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Wordmark } from './Wordmark';
import { brands } from '../data/brands';

const FLAVORS = ['MINT', 'FRUIT', 'CITRUS', 'CINNAMON', 'COFFEE', 'TOBACCO-FREE', 'SPICE', 'COLA'];
const STRENGTHS = ['LIGHT (2-3MG)', 'REGULAR (4-6MG)', 'STRONG (7-9MG)', 'X-STRONG (10-15MG)'];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[85%] bg-bg-primary animate-slide-left flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-edge-muted">
          <Link to="/" onClick={onClose}>
            <Wordmark height={18} />
          </Link>
          <button onClick={onClose} className="p-2 -mr-2 text-white" aria-label="Close menu">
            <X size={24} strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-edge-muted">
            <Link
              to="/account"
              onClick={onClose}
              className="block w-full h-12 border border-white text-white text-mono-badge uppercase tracking-wider flex items-center justify-center rounded-pill hover:bg-white/5 transition"
            >
              SIGN IN
            </Link>
            <Link
              to="/account"
              onClick={onClose}
              className="block mt-3 text-center text-accent text-sm underline underline-offset-4"
            >
              Create an account →
            </Link>
          </div>
          <nav className="px-4">
            {[
              { label: 'SHOP ALL', to: '/shop' },
              { label: 'DROPS', to: '/drops' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center h-14 text-white tracking-widest text-mono-badge border-b border-edge-muted ${
                    isActive ? 'text-accent' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Accordion
              label="BRANDS"
              isOpen={openSection === 'brands'}
              onToggle={() => setOpenSection(openSection === 'brands' ? null : 'brands')}
            >
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  to={`/brands/${b.slug}`}
                  onClick={onClose}
                  className="flex items-center h-11 text-white text-sm pl-4"
                >
                  {b.name}
                </Link>
              ))}
            </Accordion>
            <Accordion
              label="FLAVORS"
              isOpen={openSection === 'flavors'}
              onToggle={() => setOpenSection(openSection === 'flavors' ? null : 'flavors')}
            >
              {FLAVORS.map((f) => (
                <Link
                  key={f}
                  to={`/flavors/${f.toLowerCase()}`}
                  onClick={onClose}
                  className="flex items-center h-11 text-white text-sm pl-4"
                >
                  {f}
                </Link>
              ))}
            </Accordion>
            <Accordion
              label="STRENGTH"
              isOpen={openSection === 'strength'}
              onToggle={() => setOpenSection(openSection === 'strength' ? null : 'strength')}
            >
              {STRENGTHS.map((s) => (
                <Link
                  key={s}
                  to={`/strength/${s.split(' ')[0].toLowerCase()}`}
                  onClick={onClose}
                  className="flex items-center h-11 text-white text-sm pl-4"
                >
                  {s}
                </Link>
              ))}
            </Accordion>
            <NavLink
              to="/build"
              onClick={onClose}
              className="flex items-center h-14 text-accent tracking-widest text-mono-badge border-b border-edge-muted"
            >
              BUILD A BOX
            </NavLink>
            <NavLink
              to="/journal"
              onClick={onClose}
              className="flex items-center h-14 text-white tracking-widest text-mono-badge border-b border-edge-muted"
            >
              JOURNAL
            </NavLink>
          </nav>
          <div className="px-4 py-6 text-sm space-y-3 text-ink-secondary">
            {['Help & Shipping', 'Track Order', 'Wholesale', 'Affiliate'].map((l) => (
              <Link to="/help" key={l} onClick={onClose} className="block">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-edge-muted p-4 space-y-3">
          <button className="w-full h-10 rounded-pill border border-edge text-white text-mono-badge flex items-center justify-center">
            🇨🇦 CANADA · USD ▾
          </button>
          <div className="text-mono-badge text-accent text-center">FOR ADULTS 21+ ONLY</div>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-edge-muted">
      <button
        onClick={onToggle}
        className="w-full h-14 flex items-center justify-between text-white tracking-widest text-mono-badge"
      >
        <span>{label}</span>
        <ChevronDown
          size={18}
          className={`text-accent transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
}
