import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { useCart } from '../store/cart';

export function Layout() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { pathname } = useLocation();
  const isCheckout = pathname.startsWith('/checkout');
  const closeDrawer = useCart((s) => s.closeDrawer);

  // Auto-close cart drawer + overlays whenever the route changes.
  useEffect(() => {
    closeDrawer();
    setMenu(false);
    setSearch(false);
  }, [pathname, closeDrawer]);

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col">
      {!isCheckout && (
        <TopNav onOpenMenu={() => setMenu(true)} onOpenSearch={() => setSearch(true)} />
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
      {!isCheckout && <CartDrawer />}
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
