// Renders a nicotine pouch tin. If an `image` URL is supplied (real lookbook photo),
// it's used directly; otherwise we fall back to a CSS-rendered tin so every product
// always has a visual.

type Surface = 'concrete' | 'denim' | 'leather' | 'metal';

type Props = {
  brand: string;
  swatch: string; // tin lid color (used by CSS fallback)
  textColor?: string;
  surface?: Surface;
  size?: number; // px (informs internal scale only)
  flavor?: string;
  className?: string;
  rotation?: number;
  image?: string; // optional lookbook photo URL — rendered instead of CSS fallback
  imageAlt?: string;
};

export function Tin({
  brand,
  swatch,
  textColor = '#FFFFFF',
  surface = 'concrete',
  size = 320,
  flavor,
  className = '',
  rotation = -8,
  image,
  imageAlt,
}: Props) {
  const surfaceClass = `surface-${surface}`;
  const tinSize = size * 0.66;
  const ringSize = tinSize * 0.92;

  if (image) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: '1 / 1' }}>
        <img
          src={image}
          alt={imageAlt || `${brand} ${flavor || ''} pouch tin`.trim()}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-base ease-pouch-out"
          style={{ transform: `scale(1.02) rotate(${rotation > 0 ? rotation * 0.15 : 0}deg)` }}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${surfaceClass} ${className}`} style={{ aspectRatio: '1 / 1' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 75% 80%, rgba(0,0,0,0.4), transparent 40%)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: tinSize,
          height: tinSize,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          background: `radial-gradient(circle at 35% 30%, ${lighten(swatch, 0.18)}, ${swatch} 55%, ${darken(swatch, 0.3)})`,
          boxShadow: `0 ${size * 0.05}px ${size * 0.08}px rgba(0,0,0,0.6), inset 0 -${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.4)`,
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: ringSize,
            height: ringSize,
            transform: 'translate(-50%, -50%)',
            border: `${size * 0.005}px solid ${darken(swatch, 0.3)}`,
            background: `radial-gradient(circle at 35% 25%, ${lighten(swatch, 0.1)}, ${swatch} 80%)`,
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              style={{
                fontFamily: 'Anton, Impact, sans-serif',
                fontStyle: 'italic',
                fontWeight: 800,
                color: textColor,
                fontSize: tinSize * 0.18,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              {brand}
            </span>
            {flavor && (
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: tinSize * 0.06,
                  color: textColor,
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: tinSize * 0.04,
                }}
              >
                {flavor}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;
}
export function lighten(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
export function darken(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
