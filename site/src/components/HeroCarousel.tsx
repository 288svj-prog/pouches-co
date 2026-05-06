import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Eyebrow } from './Eyebrow';

export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  /** Two-line headline; rendered with <br/> between lines. */
  headlineLines: string[];
  body: string;
  /** Acid-green primary text link */
  primaryLink: { label: string; to: string };
  /** White text links */
  secondaryLinks?: { label: string; to: string }[];
  /** Override headline color; defaults white */
  headlineColor?: string;
};

const ROTATE_MS = 8000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Respect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (paused || reduceMotion || slides.length <= 1) return;
    tickRef.current = setTimeout(() => {
      setActive((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => {
      if (tickRef.current) clearTimeout(tickRef.current);
    };
  }, [active, paused, reduceMotion, slides.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('input, textarea, select, [contenteditable=true]')) return;
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % slides.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section
      className="relative bg-bg-primary overflow-hidden -mt-[88px] md:-mt-[96px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="POUCHES brand stories"
    >
      <div className="relative w-full h-[100vh] min-h-[680px] max-h-[1020px] overflow-hidden">
        {/* Stacked slides — only the active one is visible (cross-fade) */}
        {slides.map((s, i) => (
          <img
            key={s.id}
            src={s.image}
            alt={s.imageAlt}
            fetchPriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[700ms] ease-pouch-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={i !== active}
          />
        ))}
        {/* Top vignette — strong fade for transparent nav legibility */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-bg-primary via-bg-primary/60 to-transparent pointer-events-none" />
        {/* Bottom darkening — gives the copy + stat strip a clean surface */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-primary via-bg-primary/70 to-transparent pointer-events-none" />
        {/* Left darkening — gives the editorial copy a clean reading surface */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-bg-primary/85 via-bg-primary/30 to-transparent pointer-events-none" />

        {/* Decorative acid-green corner brackets */}
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        <div className="absolute inset-0">
          <div className="max-w-[1440px] mx-auto h-full px-4 md:px-10 flex flex-col justify-end pb-28 md:pb-32">
            {/* Slide content — keyed by id so it cross-fades */}
            <div key={slide.id} className="max-w-xl animate-fade-in">
              <Eyebrow className="mb-3">{slide.eyebrow}</Eyebrow>
              <h1
                className="font-display italic leading-[1.05] tracking-tight"
                style={{
                  fontSize: 'clamp(32px, 4.2vw, 56px)',
                  color: slide.headlineColor || '#FFFFFF',
                }}
              >
                {slide.headlineLines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < slide.headlineLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="mt-5 text-white/85 text-sm md:text-base leading-relaxed max-w-md">
                {slide.body}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <Link
                  to={slide.primaryLink.to}
                  className="inline-flex items-center gap-1 text-accent underline underline-offset-4 hover:opacity-80 transition"
                >
                  {slide.primaryLink.label} <ArrowRight size={13} />
                </Link>
                {slide.secondaryLinks?.map((link) => (
                  <span key={link.to} className="flex items-center gap-x-5">
                    <span className="hidden md:inline text-ink-muted">·</span>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-1 text-white hover:text-accent transition"
                    >
                      {link.label} <ArrowRight size={13} />
                    </Link>
                  </span>
                ))}
              </div>
            </div>

            {/* Carousel indicator strip */}
            {slides.length > 1 && (
              <div className="mt-10 md:mt-14 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-5">
                  {slides.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(i)}
                        className="group flex items-center gap-2 no-tap-highlight"
                        aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <span className="text-mono-badge text-ink-secondary group-hover:text-white transition w-7">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`relative h-px w-10 md:w-16 overflow-hidden ${
                            isActive ? 'bg-white/30' : 'bg-edge-muted'
                          }`}
                        >
                          {isActive && !paused && !reduceMotion && (
                            <span
                              className="absolute inset-y-0 left-0 bg-accent"
                              style={{ animation: `progress ${ROTATE_MS}ms linear` }}
                            />
                          )}
                          {isActive && (paused || reduceMotion) && (
                            <span className="absolute inset-y-0 left-0 right-0 bg-accent" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="hidden md:flex items-center gap-2 text-mono-badge text-white/70 hover:text-accent transition"
                  aria-label={paused ? 'Resume carousel' : 'Pause carousel'}
                >
                  {paused ? <Play size={11} /> : <Pause size={11} />}
                  {paused ? 'PLAY' : 'PAUSE'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inline keyframes for the progress bar */}
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </section>
  );
}

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute pointer-events-none w-8 h-8 md:w-12 md:h-12';
  const map = {
    tl: 'top-24 md:top-28 left-4 md:left-10 border-l border-t',
    tr: 'top-24 md:top-28 right-4 md:right-10 border-r border-t',
    bl: 'bottom-32 md:bottom-36 left-4 md:left-10 border-l border-b',
    br: 'bottom-32 md:bottom-36 right-4 md:right-10 border-r border-b',
  };
  return <span aria-hidden="true" className={`${base} ${map[position]} border-accent/60`} />;
}
