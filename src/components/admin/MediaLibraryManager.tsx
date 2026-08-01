import React, { useState } from 'react';
import { upload } from '@vercel/blob/client';
import type { MediaItem } from '../../types/cms';
import { isBlobCloudUrl, toMediaSrc } from '../../utils/mediaUrl';
import {
  Upload,
  Trash2,
  Search,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Cloud,
  Loader2,
} from 'lucide-react';

interface MediaLibraryManagerProps {
  mediaLibrary: MediaItem[];
  onUpdateMediaLibrary: (updatedMedia: MediaItem[]) => void;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
};

/** Build a Blob-safe pathname (no spaces/special chars; always has an extension). */
function buildBlobPathname(file: File): string {
  const rawExt = file.name.includes('.')
    ? file.name.split('.').pop()?.toLowerCase() ?? ''
    : '';
  const ext =
    (rawExt && /^[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : null) ||
    MIME_TO_EXT[file.type] ||
    'bin';

  const base =
    file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'upload';

  return `media/${Date.now()}-${base}.${ext}`;
}

function resolveContentType(file: File, pathname: string): string {
  if (file.type && file.type !== 'application/octet-stream') return file.type;
  const ext = pathname.split('.').pop()?.toLowerCase();
  const match = Object.entries(MIME_TO_EXT).find(([, e]) => e === ext);
  return match?.[0] || 'application/octet-stream';
}

/** Upload to Vercel Blob. Falls back to local base64 DataURL only in local Vite dev. */
async function uploadFileToCloud(file: File): Promise<string> {
  const pathname = buildBlobPathname(file);
  const contentType = resolveContentType(file, pathname);

  try {
    const blob = await upload(pathname, file, {
      access: 'private',
      handleUploadUrl: '/api/upload',
      contentType,
    });
    return blob.url;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // On the deployed site, do not silently fall back to huge data-URLs.
    const isLocalDev =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    if (!isLocalDev) {
      throw new Error(message || 'Vercel Blob upload failed');
    }

    console.warn('[Media] Vercel Blob unavailable, falling back to local DataURL:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const MediaLibraryManager: React.FC<MediaLibraryManagerProps> = ({
  mediaLibrary,
  onUpdateMediaLibrary,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const newItems: MediaItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(`Uploading ${i + 1} / ${fileArray.length}: ${file.name}`);
      try {
        const url = await uploadFileToCloud(file);
        const isPdf = file.type === 'application/pdf';
        newItems.push({
          id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          url,
          type: isPdf ? 'pdf' : 'image',
          size: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          altText: file.name,
        });
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        const detail = err instanceof Error ? err.message : 'Unknown error';
        alert(`Failed to upload ${file.name}.\n\n${detail}`);
      }
    }

    setUploading(false);
    setUploadProgress('');
    // Reset input so the same file can be re-selected
    e.target.value = '';

    if (newItems.length > 0) {
      onUpdateMediaLibrary([...mediaLibrary, ...newItems]);
    }
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Delete this media item from the library?')) {
      onUpdateMediaLibrary(mediaLibrary.filter((m) => m.id !== id));
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const playable = toMediaSrc(url);
    const absolute =
      playable.startsWith('/') && typeof window !== 'undefined'
        ? `${window.location.origin}${playable}`
        : playable;
    navigator.clipboard.writeText(absolute);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaLibrary.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchTerm.trim() !== '') {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="cyber-card p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#00f3ff]" />
            Centralized Media Library
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
              <Cloud className="w-3 h-3" /> Vercel Blob
            </span>
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Files upload to Vercel Blob cloud — permanent URLs visible to all visitors on all devices
          </p>
        </div>

        <label
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all shrink-0 ${
            uploading
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading…' : 'Upload Files'}
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress && (
        <div className="flex items-center gap-3 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          <span className="text-xs font-mono text-cyan-300">{uploadProgress}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'image', 'pdf'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
                filterType === t
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {t === 'all' ? `All (${mediaLibrary.length})` : t === 'image' ? 'Images' : 'PDFs'}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-mono text-sm">
          {mediaLibrary.length === 0
            ? 'No media uploaded yet. Click "Upload Files" to add images or PDFs.'
            : 'No assets match your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 rounded-2xl border border-slate-800 p-3 space-y-3 flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
            >
              {/* Preview */}
              <div className="h-40 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                {item.type === 'pdf' ? (
                  <div className="text-center p-4">
                    <FileText className="w-12 h-12 text-[#00f3ff] mx-auto mb-2 animate-pulse" />
                    <span className="text-xs font-mono text-slate-300 block truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                ) : (
                  <img
                    src={toMediaSrc(item.url)}
                    alt={item.altText || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300';
                    }}
                  />
                )}
                {/* Cloud badge */}
                {isBlobCloudUrl(item.url) && (
                  <span className="absolute top-1.5 right-1.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Cloud className="w-2.5 h-2.5" /> Cloud
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block truncate" title={item.name}>
                  {item.name}
                </span>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    {item.type}
                  </span>
                  <span>{item.uploadDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedId === item.id ? 'Copied!' : 'Copy URL'}
                </button>

                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400"
                  title="Delete Media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
