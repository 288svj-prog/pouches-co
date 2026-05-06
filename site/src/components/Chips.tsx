import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function StrengthChip({ mg, tier }: { mg: number; tier: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-pill border border-edge text-mono-badge text-white bg-bg-secondary">
      <span>{mg}mg</span>
      <span className="text-accent mx-1.5">·</span>
      <span className="uppercase">{tier}</span>
    </span>
  );
}

export function PillBadge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'verified';
}) {
  const cls =
    variant === 'accent'
      ? 'bg-accent text-accent-on'
      : variant === 'verified'
        ? 'border border-edge text-white'
        : 'border border-edge text-white bg-bg-secondary';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-mono-badge ${cls}`}>
      {children}
    </span>
  );
}

export function FilterChip({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill border border-accent/60 text-white text-mono-badge hover:bg-accent/10 transition"
    >
      <span>
        {label}: <span className="font-medium">{value}</span>
      </span>
      <X size={12} className="text-accent" />
    </button>
  );
}

export function SelectableChip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-pill text-mono-badge transition-all duration-fast border whitespace-nowrap ${
        selected
          ? 'border-accent text-accent bg-bg-secondary shadow-[0_0_12px_rgba(204,255,0,0.15)]'
          : 'border-edge text-white bg-bg-secondary hover:border-white/40'
      }`}
    >
      {children}
    </button>
  );
}
