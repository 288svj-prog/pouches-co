import type { InputHTMLAttributes, ReactNode } from 'react';

export function TextInput({
  label,
  required,
  error,
  helper,
  className = '',
  iconRight,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helper?: string;
  iconRight?: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-secondary mb-2">
          {label}
          {required && <span className="text-accent">*</span>}
        </span>
      )}
      <span className="relative block">
        <input
          {...rest}
          className={`w-full h-14 px-4 bg-bg-secondary border rounded-input text-white placeholder:text-ink-muted focus:outline-none focus:border-accent transition ${
            error ? 'border-danger' : 'border-edge'
          }`}
        />
        {iconRight && <span className="absolute right-4 top-1/2 -translate-y-1/2">{iconRight}</span>}
      </span>
      {helper && !error && <span className="block mt-2 text-xs text-ink-secondary">{helper}</span>}
      {error && <span className="block mt-2 text-xs text-danger">{error}</span>}
    </label>
  );
}

export function FloatingInput({
  label,
  required,
  error,
  className = '',
  iconRight,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  iconRight?: ReactNode;
}) {
  return (
    <label className={`relative block ${className}`}>
      <input
        {...rest}
        placeholder=" "
        className={`peer w-full h-[58px] px-4 pt-5 pb-1 bg-bg-secondary border rounded-input text-white text-sm focus:outline-none focus:border-accent transition placeholder-shown:pt-3 ${
          error ? 'border-danger' : 'border-edge'
        }`}
      />
      <span className="absolute left-4 top-1.5 text-[10px] font-mono uppercase tracking-wider text-ink-secondary peer-focus:text-accent peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-body peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-ink-muted transition-all duration-fast pointer-events-none">
        {label}
        {required && <span className="text-accent">*</span>}
      </span>
      {iconRight && <span className="absolute right-4 top-1/2 -translate-y-1/2">{iconRight}</span>}
      {error && <span className="block mt-2 text-xs text-danger">{error}</span>}
    </label>
  );
}
