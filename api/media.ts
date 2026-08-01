import { get } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const url = typeof req.query.url === 'string' ? req.query.url : null;
  const pathname = typeof req.query.pathname === 'string' ? req.query.pathname : null;
  const target = url || pathname;

  if (!target) {
    return res.status(400).json({ error: 'Missing url or pathname query parameter.' });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN is not set.' });
  }

  try {
    const result = await get(target, { access: 'private', token });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return res.status(404).json({ error: 'Media not found.' });
    }

    res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    const nodeStream = Readable.fromWeb(result.stream as NodeReadableStream);
    nodeStream.pipe(res);
  } catch (error) {
    console.error('[Media API] GET error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
