import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, ArrowRight } from 'lucide-react';
import { products, totalProductCount } from '../data/products';
import { brands } from '../data/brands';
import { ProductCard } from './ProductCard';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const term = q.toLowerCase().trim();
  const matches = term
    ? products.filter(
        (p) =>
          p.flavor.toLowerCase().includes(term) ||
          p.brandSlug.toLowerCase().includes(term) ||
          p.flavorFamily.toLowerCase().includes(term) ||
          p.strengthTier.toLowerCase().includes(term)
      ).slice(0, 6)
    : products.filter((p) => p.bestseller).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary/98 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-6 md:py-12">
        <div className="flex items-center justify-end mb-6">
          <button onClick={onClose} aria-label="Close search" className="w-10 h-10 flex items-center justify-center text-white">
            <X size={24} strokeWidth={2} />
          </button>
        </div>
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by brand, flavor, or strength"
            className="w-full h-16 md:h-20 pl-14 pr-6 bg-bg-secondary border border-edge rounded-input text-white text-xl md:text-3xl placeholder:text-ink-muted focus:outline-none focus:border-accent transition"
          />
        </div>

        {!term && (
          <div className="mt-8">
            <div className="text-mono-eyebrow text-accent mb-3">SUGGESTED SEARCHES</div>
            <div className="flex flex-wrap gap-2">
              {['MINT', 'STRONG', 'ZYN', 'BUILD A BOX', 'ICEBERG', 'CINNAMON', 'X-STRONG'].map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t.toLowerCase())}
                  className="px-4 py-2 rounded-pill border border-edge text-white text-mono-badge hover:border-accent hover:text-accent transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-mono-eyebrow text-accent">
              {term ? `${matches.length} RESULTS · ${totalProductCount} TOTAL` : 'TRENDING NOW'}
            </div>
            <Link to="/shop" onClick={onClose} className="text-white text-sm underline underline-offset-4 inline-flex items-center gap-1">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {matches.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="text-mono-eyebrow text-accent mb-3">OR JUMP TO A BRAND</div>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <Link
                key={b.slug}
                to={`/brands/${b.slug}`}
                onClick={onClose}
                className="px-4 py-2 rounded-pill border border-edge text-white text-mono-badge hover:border-accent hover:text-accent transition"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
