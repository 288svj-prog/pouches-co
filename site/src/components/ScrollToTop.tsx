import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Scroll the window to the top whenever the pathname changes.
 *
 * Rules:
 *   - Pathname change → instant scroll to top (most common case: user taps a link)
 *   - POP navigation (browser back/forward) → DON'T touch scroll, let the
 *     browser restore the previous position
 *   - Search-param-only changes (e.g. /shop?strength=light) → don't scroll;
 *     filter interactions shouldn't yank the user to the top of the grid
 *   - Hash navigation (e.g. /products/foo#reviews) → let the anchor handler do its thing
 *
 * Mobile-friendly: uses `window.scrollTo(0, 0)` which is instant. Smooth-scroll
 * on a 5,000px page on a budget Android phone feels janky; instant feels right.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Browser back/forward: respect the cached scroll position.
    if (navType === 'POP') {
      lastPath.current = pathname;
      return;
    }
    // Hash links: skip — the browser scrolls to the anchor itself.
    if (hash) {
      lastPath.current = pathname;
      return;
    }
    // First mount: don't scroll on initial render.
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }
    // Same pathname (search params changed only): don't scroll.
    if (lastPath.current === pathname) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    lastPath.current = pathname;
  }, [pathname, hash, navType]);

  return null;
}
