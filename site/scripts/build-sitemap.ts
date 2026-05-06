/**
 * Build /public/sitemap.xml from the static product + brand data.
 * Run automatically as part of `npm run build` — `vite build` invokes this
 * via the `sitemap` script which is then chained from the Vite build.
 *
 * Usage: `node --import tsx scripts/build-sitemap.ts` or via package.json
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brands } from '../src/data/brands.ts';
import { products } from '../src/data/products.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE_URL?.replace(/\/$/, '') || 'https://pouches.co';
const today = new Date().toISOString().slice(0, 10);

const FLAVOR_SLUGS = ['mint', 'fruit', 'citrus', 'cinnamon', 'coffee', 'tobacco-free', 'spice', 'cola'];
const STRENGTH_SLUGS = ['light', 'regular', 'strong', 'x-strong'];

type Url = { loc: string; priority?: number; changefreq?: string };

const urls: Url[] = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/shop', priority: 0.95, changefreq: 'daily' },
  { loc: '/brands', priority: 0.9, changefreq: 'weekly' },
  { loc: '/build', priority: 0.9, changefreq: 'weekly' },
  { loc: '/quiz', priority: 0.8, changefreq: 'monthly' },
  { loc: '/drops', priority: 0.85, changefreq: 'weekly' },
  { loc: '/about', priority: 0.6, changefreq: 'monthly' },
  { loc: '/help', priority: 0.5, changefreq: 'monthly' },
  { loc: '/journal', priority: 0.5, changefreq: 'monthly' },
  ...brands.map((b) => ({ loc: `/brands/${b.slug}`, priority: 0.85, changefreq: 'weekly' })),
  ...products.map((p) => ({ loc: `/products/${p.slug}`, priority: 0.8, changefreq: 'weekly' })),
  ...FLAVOR_SLUGS.map((f) => ({ loc: `/flavors/${f}`, priority: 0.7, changefreq: 'weekly' })),
  ...STRENGTH_SLUGS.map((s) => ({ loc: `/strength/${s}`, priority: 0.7, changefreq: 'weekly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ''}
    ${u.priority !== undefined ? `<priority>${u.priority.toFixed(2)}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap.xml written with ${urls.length} URLs → ${outPath}`);
