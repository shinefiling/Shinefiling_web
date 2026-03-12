import { useEffect } from 'react';

/**
 * SEOHead - Dynamic SEO meta tag manager (no external dependency)
 * Updates document head tags on mount/change for each page.
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://shinefiling.com/og-image.png',
  schema = null,
}) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Helper to set/create meta
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('property=') ? 'property' : 'name';
        const val = selector.match(/["']([^"']+)["']/)?.[1] || '';
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    if (title) {
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[name="twitter:title"]', title);
      setMeta('meta[name="title"]', title);
    }
    if (ogImage) {
      setMeta('meta[property="og:image"]', ogImage);
      setMeta('meta[name="twitter:image"]', ogImage);
    }

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // Schema.org (JSON-LD)
    if (schema) {
      let existing = document.getElementById('seo-schema-ld');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-schema-ld';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, canonical, ogImage, schema]);

  return null;
};

export default SEOHead;
