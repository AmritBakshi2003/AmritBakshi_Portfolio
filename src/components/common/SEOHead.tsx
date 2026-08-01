import React, { useEffect } from 'react';

interface SEOHeadProps {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  github?: string;
  linkedin?: string;
}

/**
 * SEOHead — dynamically updates document.title and key meta tags
 * from live CMS data (in case the admin edits name/title/tagline).
 * Runs once on mount; re-runs if profile changes.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  name,
  title,
  tagline,
  email,
  location,
  github,
  linkedin,
}) => {
  useEffect(() => {
    // ── Document Title ──
    document.title = `${name} | ${title}`;

    // ── Helper to upsert a <meta> tag ──
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector.replace('[', '').replace(']', '').split('=');
        el.setAttribute(attrName.replace('meta', '').trim(), attrValue.replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    const description = `${name} — ${tagline}. Based in ${location}. Open to entry-level Data Analyst, Business Intelligence, and Analytics Engineering roles.`;

    // Standard meta
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="author"]', 'content', name);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', `${name} | ${title}`);
    setMeta('meta[property="og:description"]', 'content', description);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', `${name} | ${title}`);
    setMeta('meta[name="twitter:description"]', 'content', description);

    // ── JSON-LD: update sameAs if profile has social links ──
    const existingLd = document.querySelector('script[type="application/ld+json"]');
    if (existingLd) {
      try {
        const data = JSON.parse(existingLd.textContent || '{}');
        data.name = name;
        data.jobTitle = title;
        data.description = description;
        data.email = email;
        const sameAs = [];
        if (github) sameAs.push(github);
        if (linkedin) sameAs.push(linkedin);
        if (sameAs.length) data.sameAs = sameAs;
        existingLd.textContent = JSON.stringify(data, null, 2);
      } catch (_) {
        // ignore parse errors
      }
    }
  }, [name, title, tagline, email, location, github, linkedin]);

  return null; // renders nothing — only has DOM side effects
};
