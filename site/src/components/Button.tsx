import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  sm: 'h-10 px-5 text-[13px]',
  md: 'h-12 px-6 text-sm',
  lg: 'h-14 px-7 text-[15px]',
};

const variantClass: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-on hover:brightness-105 active:scale-[0.98] active:brightness-95 disabled:opacity-30',
  outline:
    'border border-white text-white hover:bg-white/5 active:scale-[0.98] disabled:opacity-30',
  ghost: 'text-accent underline underline-offset-4 hover:opacity-80',
};

const baseClass =
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider rounded-pill transition-all duration-instant ease-pouch-out no-tap-highlight whitespace-nowrap';

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth,
  iconLeft,
  iconRight,
  className = '',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button {...rest} className={cls}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

type LinkButtonProps = Common & {
  to: string;
  external?: boolean;
};

export function LinkButton({
  to,
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth,
  iconLeft,
  iconRight,
  className = '',
  external,
}: LinkButtonProps) {
  const cls = `${baseClass} ${sizeClass[size]} ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={cls}>
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Link>
  );
}
