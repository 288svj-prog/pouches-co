import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Package, User, ShoppingBag } from 'lucide-react';
import { useCart, selectItemCount } from '../store/cart';

export function BottomNav() {
  const cartCount = useCart((s) => selectItemCount(s.items));
  const openCart = useCart((s) => s.openDrawer);

  const items = [
    { to: '/', label: 'SHOP', icon: Home },
    { to: '/shop', label: 'BROWSE', icon: LayoutGrid },
    { to: '/build', label: 'BUILD', icon: Package },
    { to: '/account', label: 'ACCOUNT', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-bg-primary border-t border-accent/40 grid grid-cols-5 pb-safe">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 ${
              isActive ? 'text-accent' : 'text-white'
            } no-tap-highlight`
          }
        >
          <Icon size={20} strokeWidth={2} />
          <span className="text-[9px] font-mono uppercase tracking-widest">{label}</span>
        </NavLink>
      ))}
      <button
        onClick={openCart}
        className="flex flex-col items-center justify-center gap-1 text-white relative no-tap-highlight"
      >
        <ShoppingBag size={20} strokeWidth={2} />
        <span className="text-[9px] font-mono uppercase tracking-widest">CART ({cartCount})</span>
      </button>
    </div>
  );
}
