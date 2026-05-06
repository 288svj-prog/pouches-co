import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { CartDrawer } from './CartDrawer';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';
import { ScrollToTop } from './ScrollToTop';
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

  // Allow other components (e.g. mobile menu) to open the search overlay
  // without prop-drilling.
  useEffect(() => {
    const onOpenSearch = () => setSearch(true);
    document.addEventListener('open-search', onOpenSearch);
    return () => document.removeEventListener('open-search', onOpenSearch);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col">
      <ScrollToTop />
      {!isCheckout && (
        <TopNav onOpenMenu={() => setMenu(true)} onOpenSearch={() => setSearch(true)} />
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
      {!isCheckout && <CartDrawer />}
      {!isCheckout && <BottomNav />}
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      {/* mobile bottom-nav reserved space (64px + safe-area inset) */}
      {!isCheckout && (
        <div className="md:hidden h-16 pb-[env(safe-area-inset-bottom)]" aria-hidden />
      )}
    </div>
  );
}
