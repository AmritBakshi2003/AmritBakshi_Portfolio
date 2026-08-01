import React, { useState } from 'react';
import type { MediaItem } from '../../types/cms';
import { 
  Upload, 
  Trash2, 
  Search, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon
} from 'lucide-react';

interface MediaLibraryManagerProps {
  mediaLibrary: MediaItem[];
  onUpdateMediaLibrary: (updatedMedia: MediaItem[]) => void;
}

export const MediaLibraryManager: React.FC<MediaLibraryManagerProps> = ({
  mediaLibrary,
  onUpdateMediaLibrary
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = [];
    Array.from(files).forEach(file => {
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();
      reader.onload = (evt) => {
        const resultUrl = evt.target?.result as string;
        newItems.push({
          id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          url: resultUrl,
          type: isPdf ? 'pdf' : 'image',
          size: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          altText: file.name
        });
        if (newItems.length === files.length) {
          onUpdateMediaLibrary([...mediaLibrary, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Are you sure you want to delete this media item from the library?')) {
      onUpdateMediaLibrary(mediaLibrary.filter(m => m.id !== id));
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaLibrary.filter(item => {
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
            Centralized Media Library Manager
          </h3>
          <p className="text-xs font-mono text-slate-400">
            Upload & manage reusable media assets (Images, PDFs, Badges) across Projects, Experience & Certifications
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all shrink-0">
          <Upload className="w-4 h-4" />
          Upload Files
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${filterType === 'all' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
          >
            All ({mediaLibrary.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${filterType === 'image' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('pdf')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${filterType === 'pdf' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
          >
            PDFs
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map(item => (
          <div key={item.id} className="bg-slate-950/80 rounded-2xl border border-slate-800 p-3 space-y-3 flex flex-col justify-between hover:border-cyan-500/50 transition-all group">
            {/* Preview Box */}
            <div className="h-40 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
              {item.type === 'pdf' ? (
                <div className="text-center p-4">
                  <FileText className="w-12 h-12 text-[#00f3ff] mx-auto mb-2 animate-pulse" />
                  <span className="text-xs font-mono text-slate-300 block truncate max-w-[150px]">{item.name}</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.altText || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300';
                  }}
                />
              )}
            </div>

            {/* Asset Details */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block truncate" title={item.name}>{item.name}</span>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">{item.type}</span>
                <span>{item.uploadDate}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={() => handleCopyUrl(item.url, item.id)}
                className="flex-1 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1"
                title="Copy Data URL"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === item.id ? 'Copied' : 'Copy Link'}
              </button>

              <button
                onClick={() => handleDeleteMedia(item.id)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400"
                title="Delete Media Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
