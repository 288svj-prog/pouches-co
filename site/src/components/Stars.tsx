import { Star } from 'lucide-react';

export function Stars({ rating, size = 14, color = '#CCFF00' }: { rating: number; size?: number; color?: string }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => {
        const filled = rating >= s;
        const half = !filled && rating > s - 1;
        return (
          <span key={s} className="relative" style={{ width: size, height: size }}>
            <Star size={size} strokeWidth={1.5} className="absolute inset-0 text-ink-muted" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star size={size} strokeWidth={1.5} fill={color} stroke={color} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
