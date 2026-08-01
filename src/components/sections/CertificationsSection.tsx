import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Certification, MediaItem } from '../../types/cms';
import { ShieldCheck, ExternalLink, FileText, Maximize2 } from 'lucide-react';
import { MediaLightboxModal } from '../common/MediaLightboxModal';

interface CertificationsSectionProps {
  certifications: Certification[];
  mediaLibrary: MediaItem[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications, mediaLibrary }) => {
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    items: MediaItem[];
    initialIndex: number;
    title: string;
  }>({
    isOpen: false,
    items: [],
    initialIndex: 0,
    title: ''
  });

  const visible = certifications
    .filter(c => c.visibility)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visible.length) return null;

  const resolveMedia = (mediaIds: string[]) => {
    return (mediaIds || []).map(id => mediaLibrary.find(m => m.id === id)).filter(Boolean) as MediaItem[];
  };

  const openLightbox = (mediaItems: MediaItem[], index: number, certTitle: string) => {
    setLightboxState({
      isOpen: true,
      items: mediaItems,
      initialIndex: index,
      title: certTitle
    });
  };

  return (
    <section id="certifications" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label">
            <span>05</span>
            <span className="text-neutral-600">—</span>
            Certifications
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
            Credentials & Verified Certifications
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((cert, idx) => {
            const media = resolveMedia(cert.mediaIds);
            const coverItem = media[0];

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="card card-accent rounded-xl p-5 flex flex-col gap-4"
              >
                {/* Certificate Preview Image / PDF */}
                {coverItem ? (
                  <div
                    onClick={() => openLightbox(media, 0, cert.title)}
                    className="w-full h-40 rounded-lg overflow-hidden border border-[#222] bg-[#151515] relative group cursor-pointer hover:border-indigo-500/50 transition-all"
                  >
                    {coverItem.type === 'pdf' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-indigo-400 bg-neutral-900">
                        <FileText className="w-10 h-10 mb-2" />
                        <span className="text-xs font-mono text-neutral-300 text-center truncate max-w-[180px]">
                          {coverItem.name}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 mt-1">Click to View PDF</span>
                      </div>
                    ) : (
                      <img
                        src={coverItem.url}
                        alt={coverItem.altText || cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
                      <Maximize2 className="w-4 h-4" />
                      <span>Inspect Certificate</span>
                    </div>

                    {media.length > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-700">
                        +{media.length} documents
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white leading-snug">{cert.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">{cert.issuer} · {cert.issueDate}</p>
                </div>

                {/* Skills Validated */}
                {cert.skillsValidated && cert.skillsValidated.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skillsValidated.map(s => (
                      <span key={s} className="chip text-[10px]">{s}</span>
                    ))}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1a1a1a] mt-auto">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Verify Link
                    </a>
                  )}

                  {media.length > 0 && (
                    <button
                      onClick={() => openLightbox(media, 0, cert.title)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors ml-auto font-mono"
                    >
                      <Maximize2 className="w-3 h-3" /> View Doc
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for inspecting Certificate photos / PDFs */}
      <MediaLightboxModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
        items={lightboxState.items}
        initialIndex={lightboxState.initialIndex}
        title={lightboxState.title}
      />
    </section>
  );
};
