/**
 * Centralized anime.js v4 wrappers.
 *
 * Why a wrapper layer:
 *   - Anime v4 uses tree-shakeable named exports (`animate`, `createTimeline`, …).
 *   - Wrapping each call gives us one place to enforce reduced-motion + brand
 *     defaults (timing curves, durations).
 *   - Components get tiny ergonomic helpers — `pulse(el)`, `slideIn(el)` —
 *     instead of relearning the API per call site.
 */
import { animate, createTimeline, stagger } from 'animejs';

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Brand easing tokens — matched to the CSS custom timing functions in tailwind.config.js. */
export const EASE = {
  out: 'cubicBezier(0.16, 1, 0.3, 1)',
  in: 'cubicBezier(0.7, 0, 0.84, 0)',
  inOut: 'cubicBezier(0.65, 0, 0.35, 1)',
  outBack: 'cubicBezier(0.34, 1.56, 0.64, 1)',
} as const;

/** Brand duration tokens. */
export const DUR = {
  instant: 100,
  fast: 150,
  base: 220,
  slow: 320,
  xslow: 480,
} as const;

type Target = HTMLElement | SVGElement | NodeList | HTMLElement[] | string;

/** Pulse the element — used for cart-count badge bumps, etc. */
export function pulse(target: Target) {
  if (reducedMotion) return;
  return animate(target, {
    scale: [{ to: 1.18, duration: 140, ease: EASE.out }, { to: 1, duration: 220, ease: EASE.outBack }],
  });
}

/**
 * Quick acid-green ring flash. Animates `outline` so we never overwrite the
 * element's own background — important for sticky bars / cards that already
 * have a `bg-bg-primary` we don't want to clobber.
 */
export function flashAccent(target: Target, opts?: { color?: string }) {
  if (reducedMotion) return;
  const color = opts?.color || '#CCFF00';
  return animate(target, {
    outlineColor: [{ to: color, duration: 80 }, { to: 'rgba(204,255,0,0)', duration: 320, ease: EASE.out }],
    outlineWidth: [{ to: '3px', duration: 0 }, { to: '0px', duration: 320, ease: EASE.out }],
    outlineStyle: [{ to: 'solid', duration: 0 }],
    outlineOffset: [{ to: '0px', duration: 0 }],
  });
}

/** Slide-up + fade-in. Used for cards, sections, list items entering. */
export function slideIn(target: Target, opts?: { delay?: number; distance?: number }) {
  if (reducedMotion) {
    return animate(target, { opacity: [0, 1], duration: 1 });
  }
  return animate(target, {
    opacity: [0, 1],
    translateY: [opts?.distance ?? 16, 0],
    duration: DUR.slow,
    ease: EASE.out,
    delay: opts?.delay ?? 0,
  });
}

/** Stagger a child list (e.g. product card reveal). */
export function staggerIn(target: Target, opts?: { each?: number; from?: number; distance?: number }) {
  if (reducedMotion) {
    return animate(target, { opacity: [0, 1], duration: 1 });
  }
  return animate(target, {
    opacity: [0, 1],
    translateY: [opts?.distance ?? 16, 0],
    duration: DUR.slow,
    ease: EASE.out,
    delay: stagger(opts?.each ?? 60, opts?.from !== undefined ? { from: opts.from } : undefined),
  });
}

/** Celebrate a milestone — bump + glow ring. Used when BYO hits 6/6. */
export function celebrate(target: Target) {
  if (reducedMotion) return;
  const tl = createTimeline({});
  tl.add(target, {
    scale: [1, 1.06, 1],
    duration: 540,
    ease: EASE.outBack,
  });
  tl.add(
    target,
    {
      boxShadow: [
        { to: '0 0 0 0 rgba(204,255,0,0.6)', duration: 0 },
        { to: '0 0 0 16px rgba(204,255,0,0)', duration: 600, ease: EASE.out },
      ],
    },
    0
  );
  return tl;
}

/** Number tween — animate from prevValue to nextValue, calling onUpdate each frame. */
export function tweenNumber(prev: number, next: number, onUpdate: (n: number) => void, durationMs = DUR.slow) {
  if (reducedMotion || prev === next) {
    onUpdate(next);
    return;
  }
  const obj = { v: prev };
  return animate(obj, {
    v: next,
    duration: durationMs,
    ease: EASE.out,
    onUpdate: () => onUpdate(obj.v),
  });
}

/** Re-export the raw animate() for ad-hoc cases. */
export { animate, createTimeline, stagger };
