import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, User, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from './Wordmark';
import { useCart, selectItemCount } from '../store/cart';
import { UtilityBar } from './UtilityBar';
import { SearchDropdown } from './SearchDropdown';

export function TopNav({
  onOpenMenu,
  onOpenSearch,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  const cartCount = useCart((s) => selectItemCount(s.items));
  const openCart = useCart((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState(false);
  const desktopSearchBtnRef = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();

  // Close the desktop search dropdown whenever the route changes.
  useEffect(() => {
    setDesktopSearch(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pages that should let the hero photo flow behind a transparent nav
  // when at scroll position 0. Currently: homepage only.
  const transparentAtTop = pathname === '/' && !scrolled;

  return (
    <header className="sticky top-0 z-40">
      <UtilityBar />
      <div
        className={`transition-colors duration-base ${
          transparentAtTop
            ? 'bg-transparent'
            : `bg-bg-primary ${scrolled ? 'border-b border-edge-muted' : ''}`
        }`}
      >
        <div className="relative max-w-[1440px] mx-auto h-14 md:h-16 px-4 md:px-10 flex items-center justify-between gap-4">
          {/* Mobile: hamburger (left zone) */}
          <button
            onClick={onOpenMenu}
            className="md:hidden p-2 -ml-2 text-white"
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={2} />
          </button>

          {/*
            Wordmark — on mobile, absolutely centered horizontally between the
            hamburger (left) and the icon zone (right). On desktop, returns to
            the left of the row in the natural flex flow.
          */}
          <Link
            to="/"
            aria-label="Home"
            className="md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
          >
            <Wordmark height={18} className="md:!h-5" />
          </Link>

          {/* Center menu desktop */}
          <nav className="hidden md:flex items-center gap-0 text-mono-badge text-white">
            {[
              { label: 'SHOP', to: '/shop' },
              { label: 'DROPS', to: '/drops' },
              { label: 'BRANDS', to: '/brands' },
              { label: 'FLAVORS', to: '/flavors' },
              { label: 'BYO BOX', to: '/build' },
            ].map((item, i) => (
              <span key={item.to} className="flex items-center">
                {i > 0 && <span className="mx-3 text-ink-muted">/</span>}
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `tracking-widest hover:text-accent transition ${isActive ? 'text-accent' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </span>
            ))}
          </nav>

          {/* Right zone */}
          <div className="flex items-center gap-2 md:gap-5 text-mono-badge text-white">
            <Link to="/account" className="hidden md:flex items-center gap-1.5 hover:text-accent transition tracking-widest" aria-label="Account">
              <User size={14} strokeWidth={2} className="md:hidden" />
              ACCOUNT
            </Link>
            {/* Mobile: icon-only search; desktop: text label */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 -mr-1 text-white"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            <button
              ref={desktopSearchBtnRef}
              onClick={() => setDesktopSearch((v) => !v)}
              className={`hidden md:flex items-center gap-1.5 hover:text-accent transition tracking-widest ${
                desktopSearch ? 'text-accent' : ''
              }`}
              aria-label="Search"
              aria-expanded={desktopSearch}
            >
              SEARCH
            </button>
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 hover:text-accent transition tracking-widest"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} strokeWidth={2} className="md:hidden" />
              <span className="hidden md:inline">BAG</span>
              <span className={cartCount > 0 ? 'text-accent' : ''}>({cartCount})</span>
            </button>
          </div>
        </div>
      </div>
      {pathname !== '/' && pathname !== '/build' && (
        <div className="hidden md:block bg-bg-primary border-b border-edge-muted">
          <div className="max-w-[1440px] mx-auto px-10 h-8 flex items-center text-mono-badge text-ink-secondary">
            <Breadcrumbs />
          </div>
        </div>
      )}
      {/* Desktop search dropdown — anchored to the nav row, hidden on mobile */}
      <div className="hidden md:block">
        <SearchDropdown
          open={desktopSearch}
          onClose={() => setDesktopSearch(false)}
          anchorRef={desktopSearchBtnRef}
        />
      </div>
    </header>
  );
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  const crumbs = ['HOME', ...parts.map((p) => p.replace(/-/g, ' ').toUpperCase())];
  return (
    <div className="flex items-center gap-2">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-accent">·</span>}
          <span className={i === crumbs.length - 1 ? 'text-white' : ''}>{c}</span>
        </span>
      ))}
    </div>
  );
}
