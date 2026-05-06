import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Wordmark } from './Wordmark';

const COLUMNS = [
  {
    label: 'SHOP',
    links: [
      ['All Brands', '/brands'],
      ['All Flavors', '/flavors'],
      ['By Strength', '/strength'],
      ['Bestsellers', '/shop?sort=bestsellers'],
      ['BYO Box', '/build'],
    ],
  },
  {
    label: 'BRANDS',
    links: [
      ['ZYN', '/brands/zyn'],
      ['VELO', '/brands/velo'],
      ['ACE', '/brands/ace'],
      ['ICEBERG', '/brands/iceberg'],
      ['View All 12 →', '/brands'],
    ],
  },
  {
    label: 'HELP',
    links: [
      ['Shipping', '/help/shipping'],
      ['Returns', '/help/returns'],
      ['FAQ', '/help/faq'],
      ['Track Order', '/account/orders'],
      ['Contact', '/help/contact'],
    ],
  },
  {
    label: 'COMPANY',
    links: [
      ['Our Story', '/about'],
      ['Journal', '/journal'],
      ['Wholesale', '/wholesale'],
      ['Press', '/press'],
      ['Affiliate', '/affiliate'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-primary mt-24 md:mt-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        {/* Wordmark moment */}
        <div className="py-12 md:py-16 border-b border-edge-muted">
          <div className="w-full flex flex-col items-center">
            <Wordmark height={120} />
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-mono-badge text-white">
              <span>EVERY SWEDISH BRAND</span>
              <span className="text-accent">·</span>
              <span>ONE CHECKOUT</span>
              <span className="text-accent">·</span>
              <span>47 COUNTRIES</span>
            </div>
          </div>
        </div>

        {/* Columns desktop */}
        <div className="hidden md:grid grid-cols-4 gap-8 py-12">
          {COLUMNS.map((col) => (
            <div key={col.label}>
              <h4 className="text-mono-eyebrow text-accent mb-4">{col.label}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-white text-sm hover:text-accent transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Mobile accordion */}
        <div className="md:hidden py-6">
          {COLUMNS.map((col) => (
            <details key={col.label} className="border-b border-edge-muted">
              <summary className="h-14 flex items-center justify-between text-mono-eyebrow text-accent list-none">
                {col.label}
                <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="pb-4 space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-white text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* Legal strip */}
        <div className="py-6 border-t border-edge-muted flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-mono-badge text-ink-secondary">© 2026 POUCHES.CO · UPPSALA, SWEDEN</div>
          <div className="flex items-center gap-3">
            {['VISA', 'MC', 'AMEX', 'APAY', 'GPAY'].map((p) => (
              <span
                key={p}
                className="h-7 px-2.5 rounded border border-edge bg-bg-secondary text-[10px] text-white flex items-center font-mono uppercase tracking-wider"
              >
                {p}
              </span>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-pill border border-edge text-white text-mono-badge">
            USD <ChevronDown size={11} />
          </button>
        </div>

        <div className="py-6 text-center text-mono-badge text-accent">
          FOR ADULTS 21+ ONLY · NICOTINE IS ADDICTIVE
        </div>
      </div>
    </footer>
  );
}
