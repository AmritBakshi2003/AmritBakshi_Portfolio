import { put, del, list } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CMS_BLOB_FILENAME = 'cms-data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for same-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passcode');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  // ── GET: Load CMS data from Blob ──
  if (req.method === 'GET') {
    try {
      if (!token) {
        return res.status(200).json({ connected: false, data: null, message: 'BLOB_READ_WRITE_TOKEN is not set.' });
      }

      const { blobs } = await list({ prefix: CMS_BLOB_FILENAME, token });
      if (blobs.length === 0) {
        return res.status(200).json({ connected: true, data: null });
      }

      // Get the most recent blob
      const latest = blobs.sort((a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];

      const response = await fetch(latest.url);
      const data = await response.json();
      return res.status(200).json({ connected: true, data });
    } catch (error) {
      console.error('[CMS API] GET error:', error);
      return res.status(200).json({ connected: false, data: null, error: (error as Error).message });
    }
  }

  // ── POST: Save CMS data to Blob ──
  if (req.method === 'POST') {
    const passcode = req.headers['x-admin-passcode'] as string;
    const adminPasscode = process.env.ADMIN_PASSCODE || 'admin123';

    if (passcode !== adminPasscode) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!token) {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN environment variable is missing on Vercel.' });
    }

    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ error: 'No data provided' });

      // Delete old CMS blobs to avoid accumulation
      const { blobs: existing } = await list({ prefix: CMS_BLOB_FILENAME, token });
      if (existing.length > 0) {
        await Promise.all(existing.map(b => del(b.url, { token })));
      }

      // Write new CMS JSON blob
      const blob = await put(CMS_BLOB_FILENAME, JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        token,
      });

      return res.status(200).json({ success: true, url: blob.url });
    } catch (error) {
      console.error('[CMS API] POST error:', error);
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
