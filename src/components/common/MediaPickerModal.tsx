import React, { useState } from 'react';
import type { MediaItem } from '../../types/cms';
import { X, Upload, Check, FileText, Image as ImageIcon, Search } from 'lucide-react';
import { toMediaSrc } from '../../utils/mediaUrl';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaLibrary: MediaItem[];
  selectedMediaIds: string[];
  onSelectMedia: (mediaId: string) => void;
  onDeselectMedia: (mediaId: string) => void;
  onUploadNewMedia: (newMedia: MediaItem) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  mediaLibrary,
  selectedMediaIds,
  onSelectMedia,
  onDeselectMedia,
  onUploadNewMedia
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf'>('all');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const reader = new FileReader();
    reader.onload = (evt) => {
      const resultUrl = evt.target?.result as string;
      const newMedia: MediaItem = {
        id: `media_${Date.now()}`,
        name: file.name,
        url: resultUrl,
        type: isPdf ? 'pdf' : 'image',
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        altText: file.name
      };
      onUploadNewMedia(newMedia);
      onSelectMedia(newMedia.id);
    };
    reader.readAsDataURL(file);
  };

  const filteredMedia = mediaLibrary.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchTerm.trim() !== '') {
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="cyber-card max-w-3xl w-full rounded-2xl p-6 relative border border-[#00f3ff]/40 shadow-[0_0_50px_rgba(0,243,255,0.2)] max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00f3ff]" />
              Centralized Media Library Asset Selector
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Select existing media or upload new attachments
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Upload */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
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

            <label className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs cursor-pointer flex items-center gap-1.5 hover:bg-emerald-900/50 transition-all shrink-0">
              <Upload className="w-3.5 h-3.5" />
              Upload New
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-1">
          {filteredMedia.map(item => {
            const isSelected = selectedMediaIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isSelected) onDeselectMedia(item.id);
                  else onSelectMedia(item.id);
                }}
                className={`relative rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
                  isSelected 
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Checkbox indicator */}
                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold z-10 ${isSelected ? 'bg-[#00f3ff] text-black' : 'bg-slate-900/80 text-slate-500 border border-slate-700'}`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>

                {/* Media Preview Thumbnail */}
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-slate-900 mb-2">
                  {item.type === 'pdf' ? (
                    <div className="text-center p-2">
                      <FileText className="w-8 h-8 text-[#00f3ff] mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[100px]">{item.name}</span>
                    </div>
                  ) : (
                    <img 
                      src={toMediaSrc(item.url)} 
                      alt={item.altText || item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300';
                      }}
                    />
                  )}
                </div>

                <div className="text-left">
                  <span className="text-[10px] font-mono text-slate-300 truncate block">{item.name}</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">{item.type}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-4 mt-4 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>{selectedMediaIds.length} Assets Selected</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase"
          >
            Confirm Selection
          </button>
        </div>

      </div>
    </div>
  );
};
