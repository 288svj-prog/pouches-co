/**
 * Single-line acid-green strip pinned above the top nav. Currently shows
 * the shipping promise only — country / currency selection moved to the
 * footer + checkout to keep the top edge clean.
 */
export function UtilityBar() {
  return (
    <div className="bg-accent text-accent-on h-8 flex items-center justify-center text-mono-badge text-[10px] md:text-[11px] px-4 tracking-wider">
      FREE WORLDWIDE SHIPPING OVER $49
    </div>
  );
}
