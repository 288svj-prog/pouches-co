import { useEffect, useRef } from 'react';
import { staggerIn, slideIn } from './anim';

/**
 * Trigger an entrance animation when the bound element enters the viewport.
 * Honors prefers-reduced-motion (the underlying anim helpers no-op).
 *
 * Usage:
 *   const ref = useReveal();
 *   <div ref={ref}>...</div>
 *
 * For staggered children — pass `{ stagger: true, child: 'a' }` and the hook
 * will animate the matching descendants instead of the root.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  opts: { stagger?: boolean; childSelector?: string; each?: number; threshold?: number } = {}
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || played) continue;
          played = true;
          if (opts.stagger && opts.childSelector) {
            const children = el.querySelectorAll<HTMLElement>(opts.childSelector);
            if (children.length) {
              staggerIn(Array.from(children), { each: opts.each ?? 60 });
            } else {
              slideIn(el);
            }
          } else {
            slideIn(el);
          }
          io.disconnect();
        }
      },
      { threshold: opts.threshold ?? 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts.stagger, opts.childSelector, opts.each, opts.threshold]);
  return ref;
}
