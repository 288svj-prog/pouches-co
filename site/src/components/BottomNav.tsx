import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Package, User, ShoppingBag } from 'lucide-react';
import { useCart, selectItemCount } from '../store/cart';
import { pulse } from '../lib/anim';

/**
 * Mobile-only bottom navigation.
 * Five evenly-spaced tap targets with a top hairline and an active-state
 * indicator pill. The cart count badge pulses with anime.js when items are
 * added (subscribes to cart store and animates on change).
 */
export function BottomNav() {
  const cartCount = useCart((s) => selectItemCount(s.items));
  const openCart = useCart((s) => s.openDrawer);
  const { pathname } = useLocation();
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const lastCount = useRef(cartCount);

  // Pulse the count badge any time the count actually grows.
  useEffect(() => {
    if (cartCount > lastCount.current && badgeRef.current) {
      pulse(badgeRef.current);
    }
    lastCount.current = cartCount;
  }, [cartCount]);

  const items: { to?: string; label: string; icon: typeof Home; onClick?: () => void; isCart?: boolean }[] = [
    { to: '/', label: 'SHOP', icon: Home },
    { to: '/shop', label: 'BROWSE', icon: LayoutGrid },
    { to: '/build', label: 'BUILD', icon: Package },
    { to: '/account', label: 'ACCOUNT', icon: User },
    { label: 'CART', icon: ShoppingBag, onClick: openCart, isCart: true },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-bg-primary border-t border-edge-muted pb-[env(safe-area-inset-bottom)] grid grid-cols-5"
    >
      {/* acid-green hairline above */}
      <span aria-hidden className="absolute top-0 inset-x-0 h-px bg-accent/40" />

      {items.map((item) => {
        const Icon = item.icon;
        const isActiveStatic =
          item.isCart ? false : item.to === '/' ? pathname === '/' : pathname.startsWith(item.to!);

        const inner = (active: boolean) => (
          <span
            className={`relative h-full flex flex-col items-center justify-center gap-1 no-tap-highlight ${
              active ? 'text-accent' : 'text-white'
            }`}
          >
            {/* active indicator — short bar at top */}
            {active && (
              <span
                aria-hidden
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent"
              />
            )}
            <span className="relative">
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 2}
                className="transition-transform duration-fast"
              />
              {item.isCart && cartCount > 0 && (
                <span
                  ref={badgeRef}
                  className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-accent text-accent-on text-[9px] font-mono font-bold flex items-center justify-center"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest">{item.label}</span>
          </span>
        );

        if (item.onClick) {
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              aria-label={`${item.label.toLowerCase()}${cartCount ? ` (${cartCount} items)` : ''}`}
              className="active:scale-[0.96] transition-transform"
            >
              {inner(isActiveStatic)}
            </button>
          );
        }
        return (
          <NavLink
            key={item.to}
            to={item.to!}
            end={item.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {({ isActive }) => inner(isActive)}
          </NavLink>
        );
      })}
    </nav>
  );
}
