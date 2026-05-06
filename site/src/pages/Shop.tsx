import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { products, totalProductCount } from '../data/products';
import type { Product } from '../data/products';
import { brands } from '../data/brands';
import { ProductCard } from '../components/ProductCard';
import { Eyebrow } from '../components/Eyebrow';
import { FilterChip } from '../components/Chips';
import { useDocumentMeta } from '../lib/useDocumentMeta';

type SortKey = 'bestsellers' | 'newest' | 'price-asc' | 'price-desc' | 'strength-asc' | 'strength-desc' | 'top-rated';
const SORT_LABEL: Record<SortKey, string> = {
  bestsellers: 'Bestsellers',
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'strength-asc': 'Strength: Low to High',
  'strength-desc': 'Strength: High to Low',
  'top-rated': 'Top Rated',
};

const STRENGTH_OPTIONS = [
  { key: 'light', label: 'Light · 2-3mg' },
  { key: 'regular', label: 'Regular · 4-6mg' },
  { key: 'strong', label: 'Strong · 7-9mg' },
  { key: 'x-strong', label: 'X-Strong · 10-15mg' },
];
const FLAVOR_OPTIONS = [
  { key: 'mint', label: 'Mint' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'citrus', label: 'Citrus' },
  { key: 'cinnamon', label: 'Cinnamon' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'tobacco-free', label: 'Tobacco-free' },
  { key: 'spice', label: 'Spice' },
  { key: 'cola', label: 'Cola' },
];
const FORMAT_OPTIONS = [
  { key: 'slim', label: 'Slim' },
  { key: 'standard', label: 'Standard' },
  { key: 'mini', label: 'Mini' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [sortDrawer, setSortDrawer] = useState(false);

  useDocumentMeta({
    title: `Shop all nicotine pouches — ${totalProductCount} products from ${brands.length} Swedish brands`,
    description: `Every Swedish nicotine pouch we stock — ZYN, VELO, ACE, ICEBERG, FUMI, KILLA and more. Filter by strength, flavor, or format. Free worldwide shipping over $49.`,
  });

  const activeFilters = parseFilters(searchParams);
  const sort = (searchParams.get('sort') as SortKey) || 'bestsellers';

  const filtered = useMemo(() => filterAndSort(products, activeFilters, sort), [activeFilters, sort]);

  return (
    <div className="bg-bg-primary">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-8 md:pt-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Eyebrow className="mb-4">{totalProductCount} PRODUCTS · {brands.length} BRANDS</Eyebrow>
          <h1 className="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-tight">
            All Nicotine Pouches.
          </h1>
          <p className="mt-4 text-ink-secondary text-base md:text-lg leading-relaxed">
            Every Swedish brand we stock, in one searchable shelf. Filter by strength, flavor, or format. Shipped from Uppsala to 47 countries.
          </p>
        </div>

        {/* Active filter chips */}
        {activeFilterChips(activeFilters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {activeFilterChips(activeFilters).map(({ label, value, onRemove }, i) => (
              <FilterChip key={`${label}-${i}`} label={label} value={value} onRemove={() => updateFilter(setSearchParams, searchParams, onRemove)} />
            ))}
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-mono-badge text-accent underline underline-offset-4 ml-2"
            >
              CLEAR ALL
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-[260px_1fr] gap-6 md:gap-10 pb-16">
          {/* Sidebar - desktop */}
          <aside className="hidden md:block">
            <FilterSidebar searchParams={searchParams} setSearchParams={setSearchParams} />
          </aside>

          {/* Right side */}
          <div>
            {/* mobile filter / sort bar */}
            <div className="md:hidden sticky top-[88px] z-30 bg-bg-primary -mx-4 px-4 py-3 border-y border-edge-muted flex items-center gap-2">
              <button
                onClick={() => setFilterDrawer(true)}
                className="flex-1 h-10 rounded-pill border border-edge text-white text-mono-badge flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal size={14} /> FILTER
                {activeFilters.brands.length + activeFilters.strengths.length + activeFilters.flavors.length + activeFilters.formats.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-accent text-accent-on text-[9px]">
                    {activeFilters.brands.length + activeFilters.strengths.length + activeFilters.flavors.length + activeFilters.formats.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSortDrawer(true)}
                className="flex-1 h-10 rounded-pill border border-edge text-white text-mono-badge flex items-center justify-center gap-1.5"
              >
                <ArrowUpDown size={14} /> SORT
              </button>
            </div>

            {/* count + sort dropdown */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="text-mono-badge text-ink-secondary">{filtered.length} RESULTS</div>
              <div className="hidden md:block">
                <SortSelect value={sort} onChange={(v) => updateSort(setSearchParams, searchParams, v)} />
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 ? (
              <EmptyState searchParams={searchParams} setSearchParams={setSearchParams} />
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filtered.slice(0, 24).map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
                <Pagination total={filtered.length} />
              </>
            )}
          </div>
        </div>

        <SeoOutro />
      </div>

      {filterDrawer && <FilterDrawer onClose={() => setFilterDrawer(false)} searchParams={searchParams} setSearchParams={setSearchParams} count={filtered.length} />}
      {sortDrawer && <SortDrawer onClose={() => setSortDrawer(false)} sort={sort} onChange={(v) => { updateSort(setSearchParams, searchParams, v); setSortDrawer(false); }} />}
    </div>
  );
}

type Filters = {
  brands: string[];
  strengths: string[];
  flavors: string[];
  formats: string[];
};

function parseFilters(sp: URLSearchParams): Filters {
  return {
    brands: sp.get('brand')?.split(',').filter(Boolean) || [],
    strengths: sp.get('strength')?.split(',').filter(Boolean) || [],
    flavors: sp.get('flavor')?.split(',').filter(Boolean) || [],
    formats: sp.get('format')?.split(',').filter(Boolean) || [],
  };
}

function setFilters(sp: URLSearchParams, f: Filters) {
  const next = new URLSearchParams(sp);
  ['brand', 'strength', 'flavor', 'format'].forEach((k) => next.delete(k));
  if (f.brands.length) next.set('brand', f.brands.join(','));
  if (f.strengths.length) next.set('strength', f.strengths.join(','));
  if (f.flavors.length) next.set('flavor', f.flavors.join(','));
  if (f.formats.length) next.set('format', f.formats.join(','));
  return next;
}

function activeFilterChips(f: Filters) {
  const out: { label: string; value: string; onRemove: (next: Filters) => Filters }[] = [];
  f.brands.forEach((b) =>
    out.push({
      label: 'BRAND',
      value: brands.find((x) => x.slug === b)?.name || b.toUpperCase(),
      onRemove: (n) => ({ ...n, brands: n.brands.filter((x) => x !== b) }),
    })
  );
  f.strengths.forEach((s) =>
    out.push({
      label: 'STRENGTH',
      value: s.toUpperCase(),
      onRemove: (n) => ({ ...n, strengths: n.strengths.filter((x) => x !== s) }),
    })
  );
  f.flavors.forEach((fl) =>
    out.push({
      label: 'FLAVOR',
      value: fl.toUpperCase(),
      onRemove: (n) => ({ ...n, flavors: n.flavors.filter((x) => x !== fl) }),
    })
  );
  f.formats.forEach((fm) =>
    out.push({
      label: 'FORMAT',
      value: fm.toUpperCase(),
      onRemove: (n) => ({ ...n, formats: n.formats.filter((x) => x !== fm) }),
    })
  );
  return out;
}

function updateFilter(
  setSp: (sp: URLSearchParams) => void,
  sp: URLSearchParams,
  mutator: (f: Filters) => Filters
) {
  const next = mutator(parseFilters(sp));
  setSp(setFilters(sp, next));
}

function updateSort(setSp: (sp: URLSearchParams) => void, sp: URLSearchParams, v: SortKey) {
  const next = new URLSearchParams(sp);
  if (v === 'bestsellers') next.delete('sort');
  else next.set('sort', v);
  setSp(next);
}

function filterAndSort(items: Product[], f: Filters, sort: SortKey): Product[] {
  let out = items.filter((p) => {
    if (f.brands.length && !f.brands.includes(p.brandSlug)) return false;
    if (f.strengths.length && !f.strengths.includes(p.strengthTier)) return false;
    if (f.flavors.length && !f.flavors.includes(p.flavorFamily)) return false;
    if (f.formats.length && !f.formats.includes(p.format)) return false;
    return true;
  });
  switch (sort) {
    case 'price-asc':
      out = [...out].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = [...out].sort((a, b) => b.price - a.price);
      break;
    case 'strength-asc':
      out = [...out].sort((a, b) => a.strengthMg - b.strengthMg);
      break;
    case 'strength-desc':
      out = [...out].sort((a, b) => b.strengthMg - a.strengthMg);
      break;
    case 'top-rated':
      out = [...out].sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      out = [...out].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      break;
    case 'bestsellers':
    default:
      out = [...out].sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  }
  return out;
}

function FilterSidebar({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (sp: URLSearchParams) => void;
}) {
  const f = parseFilters(searchParams);
  const counts = brandCounts();

  return (
    <div className="text-white">
      <FilterSection label="BRAND" defaultOpen>
        <CheckList
          items={brands.map((b) => ({ key: b.slug, label: b.name, count: counts[b.slug] || 0 }))}
          selected={f.brands}
          onToggle={(key) =>
            updateFilter(setSearchParams, searchParams, (n) => ({
              ...n,
              brands: n.brands.includes(key) ? n.brands.filter((x) => x !== key) : [...n.brands, key],
            }))
          }
          showAllAt={5}
        />
      </FilterSection>
      <FilterSection label="STRENGTH" defaultOpen>
        <CheckList
          items={STRENGTH_OPTIONS}
          selected={f.strengths}
          onToggle={(key) =>
            updateFilter(setSearchParams, searchParams, (n) => ({
              ...n,
              strengths: n.strengths.includes(key) ? n.strengths.filter((x) => x !== key) : [...n.strengths, key],
            }))
          }
        />
      </FilterSection>
      <FilterSection label="FLAVOR" defaultOpen>
        <CheckList
          items={FLAVOR_OPTIONS}
          selected={f.flavors}
          onToggle={(key) =>
            updateFilter(setSearchParams, searchParams, (n) => ({
              ...n,
              flavors: n.flavors.includes(key) ? n.flavors.filter((x) => x !== key) : [...n.flavors, key],
            }))
          }
          showAllAt={5}
        />
      </FilterSection>
      <FilterSection label="FORMAT">
        <CheckList
          items={FORMAT_OPTIONS}
          selected={f.formats}
          onToggle={(key) =>
            updateFilter(setSearchParams, searchParams, (n) => ({
              ...n,
              formats: n.formats.includes(key) ? n.formats.filter((x) => x !== key) : [...n.formats, key],
            }))
          }
        />
      </FilterSection>
      <FilterSection label="PRICE">
        <div className="text-mono-badge text-ink-secondary mb-3">RANGE: $4 — $9</div>
        <div className="h-2 rounded-pill bg-edge relative">
          <div className="absolute h-2 rounded-pill bg-accent" style={{ left: '10%', right: '15%' }} />
          <div className="absolute -top-1.5 w-5 h-5 rounded-full bg-accent border-2 border-bg-primary" style={{ left: 'calc(10% - 10px)' }} />
          <div className="absolute -top-1.5 w-5 h-5 rounded-full bg-accent border-2 border-bg-primary" style={{ left: 'calc(85% - 10px)' }} />
        </div>
      </FilterSection>
      <FilterSection label="FEATURES">
        <CheckList
          items={[
            { key: 'tobacco-free', label: 'Tobacco-free' },
            { key: 'long-burn', label: 'Long burn (40min+)' },
            { key: 'slim', label: 'Slim format' },
            { key: 'bestseller', label: 'Bestsellers only' },
          ]}
          selected={[]}
          onToggle={() => {}}
        />
      </FilterSection>
    </div>
  );
}

function brandCounts() {
  const map: Record<string, number> = {};
  for (const p of products) map[p.brandSlug] = (map[p.brandSlug] || 0) + 1;
  return map;
}

function FilterSection({ label, children, defaultOpen }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-edge-muted py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left">
        <span className="text-mono-eyebrow text-accent">{label}</span>
        {open ? <ChevronUp size={16} className="text-accent" /> : <ChevronDown size={16} className="text-accent" />}
      </button>
      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
}

function CheckList({
  items,
  selected,
  onToggle,
  showAllAt,
}: {
  items: { key: string; label: string; count?: number }[];
  selected: string[];
  onToggle: (key: string) => void;
  showAllAt?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAllAt && !showAll ? items.slice(0, showAllAt) : items;
  return (
    <>
      {visible.map((it) => {
        const checked = selected.includes(it.key);
        return (
          <label key={it.key} className="flex items-center gap-3 cursor-pointer group">
            <span
              className={`w-5 h-5 rounded-[3px] border flex items-center justify-center transition ${
                checked ? 'bg-accent border-accent' : 'border-white group-hover:border-accent'
              }`}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-white text-sm flex-1">{it.label}</span>
            {it.count !== undefined && <span className="text-ink-secondary text-xs">({it.count})</span>}
            <input type="checkbox" className="sr-only" checked={checked} onChange={() => onToggle(it.key)} />
          </label>
        );
      })}
      {showAllAt && items.length > showAllAt && (
        <button onClick={() => setShowAll(!showAll)} className="text-accent text-xs underline underline-offset-2 mt-2">
          {showAll ? 'Show less' : `Show all ${items.length} →`}
        </button>
      )}
    </>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none h-10 pl-4 pr-10 rounded-pill border border-edge bg-bg-secondary text-white text-mono-badge"
      >
        {Object.entries(SORT_LABEL).map(([k, l]) => (
          <option key={k} value={k}>
            SORT: {l.toUpperCase()}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
    </div>
  );
}

function Pagination({ total }: { total: number }) {
  const perPage = 24;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const list = pages <= 5 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, '...', pages];
  return (
    <div className="mt-12 flex items-center justify-center gap-3 text-mono-badge">
      <button className="text-white inline-flex items-center gap-1 hover:text-accent transition disabled:opacity-30">
        <ArrowLeft size={14} /> PREVIOUS
      </button>
      <div className="flex items-center gap-2">
        {list.map((p, i) => (
          <span key={i} className={`px-2 ${p === 1 ? 'text-accent' : 'text-white'}`}>
            {p}
          </span>
        ))}
      </div>
      <button className="text-white inline-flex items-center gap-1 hover:text-accent transition">
        NEXT <ArrowRight size={14} />
      </button>
    </div>
  );
}

function EmptyState({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (sp: URLSearchParams) => void;
}) {
  const f = parseFilters(searchParams);
  const closest = useMemo(() => {
    return products
      .map((p) => {
        let score = 0;
        if (!f.brands.length || f.brands.includes(p.brandSlug)) score++;
        if (!f.strengths.length || f.strengths.includes(p.strengthTier)) score++;
        if (!f.flavors.length || f.flavors.includes(p.flavorFamily)) score++;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((x) => x.score >= 2)
      .map((x) => x.p)
      .slice(0, 4);
  }, [f]);

  const removable = f.brands[0] ? `BRAND: ${brands.find((x) => x.slug === f.brands[0])?.name || f.brands[0].toUpperCase()}` :
    f.strengths[0] ? `STRENGTH: ${f.strengths[0].toUpperCase()}` :
    f.flavors[0] ? `FLAVOR: ${f.flavors[0].toUpperCase()}` : null;

  return (
    <div className="border border-edge-muted rounded-card p-8 md:p-12 text-center">
      <div className="text-mono-eyebrow text-accent mb-4">0 RESULTS · {f.brands.length + f.strengths.length + f.flavors.length} FILTERS APPLIED</div>
      <h3 className="font-display italic text-white text-3xl md:text-4xl leading-tight">
        Nothing matches that combination.
      </h3>
      <p className="mt-3 text-ink-secondary max-w-lg mx-auto">
        Try loosening one of your filters — or let us suggest something close.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {removable && (
          <button
            onClick={() => {
              const next = parseFilters(searchParams);
              if (f.brands[0]) next.brands = next.brands.filter((x) => x !== f.brands[0]);
              else if (f.strengths[0]) next.strengths = next.strengths.filter((x) => x !== f.strengths[0]);
              else if (f.flavors[0]) next.flavors = next.flavors.filter((x) => x !== f.flavors[0]);
              setSearchParams(setFilters(searchParams, next));
            }}
            className="inline-flex items-center gap-2 h-12 px-6 bg-accent text-accent-on text-xs font-bold uppercase tracking-wider hover:brightness-105 transition"
          >
            REMOVE '{removable}' <X size={14} />
          </button>
        )}
        <button
          onClick={() => setSearchParams(new URLSearchParams())}
          className="inline-flex items-center gap-2 h-12 px-6 border border-white text-white text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition"
        >
          CLEAR ALL FILTERS
        </button>
      </div>
      {closest.length > 0 && (
        <div className="mt-12">
          <div className="text-mono-eyebrow text-accent mb-4">CLOSEST MATCHES</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {closest.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      )}
      <div className="mt-8">
        <Link to="/quiz" className="text-accent underline underline-offset-4 hover:opacity-80 transition">
          Take the Flavor Finder quiz instead →
        </Link>
      </div>
    </div>
  );
}

function FilterDrawer({
  onClose,
  searchParams,
  setSearchParams,
  count,
}: {
  onClose: () => void;
  searchParams: URLSearchParams;
  setSearchParams: (sp: URLSearchParams) => void;
  count: number;
}) {
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 max-h-[85vh] bg-bg-primary rounded-t-modal animate-slide-up flex flex-col">
        <div className="pt-2 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-edge" />
        </div>
        <div className="px-5 h-12 flex items-center justify-between border-b border-edge-muted">
          <span className="text-mono-eyebrow text-white">FILTERS</span>
          <button onClick={onClose}><X size={20} className="text-white" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          <FilterSidebar searchParams={searchParams} setSearchParams={setSearchParams} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-edge-muted">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-pill bg-accent text-accent-on font-bold uppercase tracking-wider"
          >
            APPLY FILTERS · {count} RESULTS
          </button>
        </div>
      </div>
    </div>
  );
}

function SortDrawer({
  onClose,
  sort,
  onChange,
}: {
  onClose: () => void;
  sort: SortKey;
  onChange: (v: SortKey) => void;
}) {
  return (
    <div className="md:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 bg-bg-primary rounded-t-modal animate-slide-up">
        <div className="pt-2 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-edge" />
        </div>
        <div className="px-5 h-12 flex items-center justify-between border-b border-edge-muted">
          <span className="text-mono-eyebrow text-white">SORT BY</span>
          <button onClick={onClose}><X size={20} className="text-white" /></button>
        </div>
        <div className="px-5 py-2">
          {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => {
            const selected = sort === k;
            return (
              <button
                key={k}
                onClick={() => onChange(k)}
                className="w-full flex items-center gap-3 py-3 text-left border-b border-edge-muted last:border-0"
              >
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'border-accent' : 'border-white'
                  }`}
                >
                  {selected && <span className="w-2.5 h-2.5 rounded-full bg-accent" />}
                </span>
                <span className="text-white text-base flex-1">{SORT_LABEL[k]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SeoOutro() {
  return (
    <section className="py-12 md:py-20 border-t border-edge-muted">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="font-display italic text-white text-3xl md:text-4xl leading-tight">
            What is a nicotine pouch?
          </h3>
          <p className="mt-4 text-ink-secondary leading-relaxed">
            A nicotine pouch is a small white sachet that sits between the lip and gum, releasing nicotine without smoke, vapor, or tobacco. Sweden invented the modern format. Pouches are smoke-free, odor-free, and discreet — designed for indoor use, travel, or anywhere combustibles aren't welcome.
          </p>
          <p className="mt-3 text-ink-secondary leading-relaxed">
            Strengths range from light (2-3mg) to extra-strong (10mg+). Slim formats fit comfortably under the lip; standard formats hold more material for a longer release. We stock all twelve major Swedish brands and ship sealed tins worldwide.
          </p>
        </div>
        <div>
          <h3 className="font-display italic text-white text-3xl md:text-4xl leading-tight">FAQ</h3>
          <div className="mt-4 space-y-2">
            {[
              ['How long does each pouch last?', 'Most pouches release nicotine for around 30-45 minutes, depending on the brand. ZYN, ACE, and Nordic Spirit are known for the steadiest 40-minute curve.'],
              ['Are these tobacco-free?', 'Yes — every product on this page is 100% tobacco-free. The nicotine is plant-derived, never combusted, never inhaled.'],
              ['Will it ship to my country?', 'We ship to 47 countries from Uppsala, Sweden. Delivery typically lands in 4-7 business days. Customs handling is included.'],
              ['How is the BYO Box discount calculated?', 'Add 6 or more products to a BYO Box and the cart applies a flat 15% across the box. Mix any brands, any strengths, any flavors.'],
            ].map(([q, a], i) => (
              <details key={i} className="border-b border-edge-muted py-3 group">
                <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                  {q}
                  <ChevronDown size={16} className="text-accent group-open:rotate-180 transition" />
                </summary>
                <p className="mt-3 text-ink-secondary leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="text-mono-eyebrow text-accent mb-3">RELATED CATEGORIES</div>
        <div className="flex flex-wrap gap-2">
          {['Strong pouches', 'Mint pouches', 'Beginner-friendly', 'X-strong', 'Cinnamon flavors'].map((c) => (
            <Link
              key={c}
              to="/shop"
              className="px-4 py-2 rounded-pill border border-edge text-white text-mono-badge hover:border-accent hover:text-accent transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
