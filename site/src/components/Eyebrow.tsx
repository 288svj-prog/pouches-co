import type { ReactNode } from 'react';

export function Eyebrow({
  children,
  tone = 'accent',
  className = '',
}: {
  children: ReactNode;
  tone?: 'accent' | 'white' | 'muted';
  className?: string;
}) {
  const toneClass =
    tone === 'accent'
      ? 'text-accent'
      : tone === 'white'
        ? 'text-white'
        : 'text-ink-secondary';
  return (
    <div className={`text-mono-eyebrow ${toneClass} ${className}`}>{children}</div>
  );
}

export function StatStrip({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-mono-eyebrow text-white ${className}`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-x-4">
          <span>{item}</span>
          {i < items.length - 1 && <span className="text-accent">·</span>}
        </span>
      ))}
    </div>
  );
}
