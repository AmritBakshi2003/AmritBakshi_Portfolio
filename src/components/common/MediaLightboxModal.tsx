import React, { useState, useEffect } from 'react';
import type { MediaItem } from '../../types/cms';
import { X, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  initialIndex?: number;
  title?: string;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 transition-all"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-6xl flex items-center justify-between z-10 py-2 border-b border-neutral-800 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-wide text-neutral-200">
            {title || 'Media Asset Viewer'}
          </span>
          <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            download={currentItem.name}
            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Download or View Original File"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Original</span>
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Viewer area */}
      <div
        className="flex-1 w-full max-w-6xl flex items-center justify-center relative my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 border border-neutral-700 text-white hover:bg-neutral-800 hover:scale-105 transition-all shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Media Content */}
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {currentItem.type === 'pdf' ? (
            <div className="w-full h-full max-h-[75vh] flex flex-col items-center justify-center bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 text-center">
              <FileText className="w-16 h-16 text-indigo-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{currentItem.name}</h4>
              <p className="text-xs text-neutral-400 mb-6 font-mono">PDF Document Asset</p>
              <iframe
                src={currentItem.url}
                className="w-full h-full rounded-xl border border-neutral-800 bg-white"
                title={currentItem.name}
              />
            </div>
          ) : (
            <div className="relative max-w-full max-h-[75vh] flex flex-col items-center">
              <img
                src={currentItem.url}
                alt={currentItem.altText || currentItem.name}
                className="max-w-full max-h-[72vh] object-contain rounded-xl border border-neutral-800 shadow-2xl"
              />
              {currentItem.caption && (
                <p className="text-xs text-neutral-400 mt-2 text-center bg-neutral-900/80 px-3 py-1 rounded-md border border-neutral-800">
                  {currentItem.caption}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 border border-neutral-700 text-white hover:bg-neutral-800 hover:scale-105 transition-all shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {items.length > 1 && (
        <div
          className="w-full max-w-4xl flex items-center justify-center gap-2 pt-2 pb-1 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                  : 'border-neutral-800 opacity-50 hover:opacity-100 hover:border-neutral-600'
              }`}
            >
              {item.type === 'pdf' ? (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
              ) : (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
