import { useEffect } from 'react';

/**
 * Lightweight per-route head manager — sets <title>, meta description,
 * canonical URL, and OG/Twitter title/description for the current page.
 * No router-tied effect dependency: the consumer passes whatever inputs
 * should trigger an update.
 */
export type DocumentMeta = {
  /** Final <title>. The site name suffix is appended automatically unless `noSuffix` is set. */
  title: string;
  description?: string;
  /** Path component appended to the canonical origin. Defaults to current path. */
  pathname?: string;
  /** Full URL of the page-specific OG image. Falls back to the site default. */
  ogImage?: string;
  /** Override OG type (e.g. `product`). Defaults to `website`. */
  ogType?: string;
  /** Skip the " | POUCHES" suffix on the title. */
  noSuffix?: boolean;
  /** Inject Schema.org JSON-LD for this route. Adds a single <script> tag, replaces previous. */
  jsonLd?: object | object[];
};

const SITE_NAME = 'POUCHES';
const DEFAULT_OG_IMAGE = 'https://pouches.co/img/hero/hero-wordmark.jpg';
const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://pouches.co';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkRel(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'route-jsonld';
function setJsonLd(value?: object | object[]) {
  // Remove any prior route-injected ld+json (keep the static org one).
  const old = document.getElementById(JSON_LD_ID);
  if (old) old.remove();
  if (!value) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSON_LD_ID;
  script.text = JSON.stringify(value);
  document.head.appendChild(script);
}

export function useDocumentMeta(meta: DocumentMeta) {
  useEffect(() => {
    const fullTitle = meta.noSuffix || meta.title.includes(SITE_NAME)
      ? meta.title
      : `${meta.title} | ${SITE_NAME}`;
    document.title = fullTitle;

    if (meta.description) {
      setMeta('description', meta.description);
      setMeta('og:description', meta.description, 'property');
      setMeta('twitter:description', meta.description);
    }

    setMeta('og:title', fullTitle, 'property');
    setMeta('twitter:title', fullTitle);

    const path = meta.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const url = `${ORIGIN}${path}`;
    setMeta('og:url', url, 'property');
    setLinkRel('canonical', url);

    const img = meta.ogImage ?? DEFAULT_OG_IMAGE;
    setMeta('og:image', img, 'property');
    setMeta('twitter:image', img);

    setMeta('og:type', meta.ogType ?? 'website', 'property');

    setJsonLd(meta.jsonLd);
  }, [
    meta.title,
    meta.description,
    meta.pathname,
    meta.ogImage,
    meta.ogType,
    meta.noSuffix,
    JSON.stringify(meta.jsonLd),
  ]);
}
