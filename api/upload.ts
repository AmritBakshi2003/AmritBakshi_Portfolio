import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body as HandleUploadBody;
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: 'BLOB_READ_WRITE_TOKEN environment variable is missing on Vercel.',
    });
  }

  try {
    // Pass the Node request directly — handleUpload accepts IncomingMessage.
    // Avoid re-wrapping headers in a Fetch Request (can break callback URL inference).
    const jsonResponse = await handleUpload({
      body,
      request: req,
      token,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/*',
          'application/pdf',
        ],
        maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
        addRandomSuffix: true,
        allowOverwrite: false,
      }),
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('[Vercel Blob] Upload error:', error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
