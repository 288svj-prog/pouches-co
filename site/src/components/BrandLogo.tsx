import { BRAND_LOGOS } from '../data/images';

type Props = {
  brandSlug: string;
  className?: string;
  /** approximate height in px */
  height?: number;
  /** color override; defaults to white */
  color?: string;
  ariaLabel?: string;
};

/**
 * Renders a brand wordmark from /public/brands/{slug}.svg.
 * The SVG fill is tinted via CSS `mask-image` so the same monochrome asset can
 * render in any color — essential for hover states, brand-tinted backgrounds,
 * and dark/light contexts. Width auto-scales from height to preserve each
 * brand's native aspect ratio.
 */
export function BrandLogo({
  brandSlug,
  className = '',
  height = 32,
  color = '#FFFFFF',
  ariaLabel,
}: Props) {
  const src = BRAND_LOGOS[brandSlug];
  if (!src) return null;
  return (
    <span
      role="img"
      aria-label={ariaLabel || `${brandSlug} logo`}
      className={`inline-block ${className}`}
      style={{
        height,
        // The SVG is monochrome white; we mask it with the desired color so
        // the asset can be tinted to any brand color or theme.
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        // Width is set by aspect-ratio on render; we use a wide reserve and let
        // the mask trim. For per-brand exact widths we render via aspect-ratio
        // attached to the SVG's intrinsic aspect.
        width: 'auto',
        aspectRatio: 'auto',
        // Fallback: the inline-block + display ensures the span lays out.
        display: 'inline-block',
      }}
    >
      {/* The img element provides intrinsic aspect ratio + accessible alt;
          it's sized to the height and made transparent so only the mask shows */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          height,
          width: 'auto',
          opacity: 0,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}
