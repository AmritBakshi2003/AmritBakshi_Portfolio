/** True when the URL points at Vercel Blob (private or public). */
export function isBlobCloudUrl(url: string): boolean {
  return (
    url.includes('.blob.vercel-storage.com') ||
    url.startsWith('/api/media?')
  );
}

/**
 * Private Blob URLs are not browser-readable. Rewrite them through
 * `/api/media` so <img>, <a>, and iframe can load the file.
 */
export function toMediaSrc(url: string): string {
  if (!url) return url;
  if (url.startsWith('/api/media?')) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  // Local public assets (/profile.jpg, etc.)
  if (url.startsWith('/') && !url.startsWith('//')) return url;

  if (url.includes('.blob.vercel-storage.com')) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }

  // Bare pathname stored in CMS (e.g. media/123-photo.jpg)
  if (!/^https?:\/\//i.test(url)) {
    return `/api/media?pathname=${encodeURIComponent(url)}`;
  }

  return url;
}
