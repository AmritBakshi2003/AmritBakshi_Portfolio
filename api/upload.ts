import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body as HandleUploadBody;

  try {
    // Construct standard Web Request object for @vercel/blob client helper
    const host = req.headers.host || 'localhost';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const webRequest = new Request(`${protocol}://${host}/api/upload`, {
      method: 'POST',
      headers: req.headers as unknown as HeadersInit,
    });

    const jsonResponse = await handleUpload({
      body,
      request: webRequest,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
          ],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Vercel Blob] Upload completed:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('[Vercel Blob] Upload error:', error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
