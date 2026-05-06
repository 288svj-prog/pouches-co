import { ChevronDown } from 'lucide-react';

export function UtilityBar() {
  return (
    <div className="bg-accent text-accent-on h-8 flex items-center justify-center text-mono-badge text-[10px] md:text-[11px] px-4">
      <span className="flex items-center gap-2 md:gap-3">
        <span>FREE WORLDWIDE SHIPPING OVER $49</span>
        <span className="opacity-60">·</span>
        <span>21+ VERIFIED</span>
        <span className="opacity-60">·</span>
        <button className="inline-flex items-center gap-1 hover:opacity-80">
          USD <ChevronDown size={11} strokeWidth={2.5} />
        </button>
      </span>
    </div>
  );
}
