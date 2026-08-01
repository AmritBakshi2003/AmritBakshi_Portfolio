import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project, MediaItem } from '../../types/cms';
import { ExternalLink, ChevronDown, ChevronUp, ArrowUpRight, Image as ImageIcon, FileText, Maximize2 } from 'lucide-react';
import { MediaLightboxModal } from '../common/MediaLightboxModal';
import { toMediaSrc } from '../../utils/mediaUrl';

interface ProjectsSectionProps {
  projects: Project[];
  mediaLibrary: MediaItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, mediaLibrary }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Lightbox Modal state
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

  const visible = projects
    .filter(p => p.visibility)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.sortOrder - b.sortOrder;
    });

  const resolveMedia = (mediaIds: string[]) => {
    return mediaIds.map(id => mediaLibrary.find(m => m.id === id)).filter(Boolean) as MediaItem[];
  };

  const openLightbox = (mediaItems: MediaItem[], index: number, projectTitle: string) => {
    setLightboxState({
      isOpen: true,
      items: mediaItems,
      initialIndex: index,
      title: projectTitle
    });
  };

  if (!visible.length) return null;

  return (
    <section id="projects" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label">
            <span>03</span>
            <span className="text-neutral-600">—</span>
            Projects
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
            Featured Work
          </h2>
        </motion.div>

        <div className="space-y-6">
          {visible.map((project, idx) => {
            const media = resolveMedia(project.mediaIds);
            const coverImage = media.find(m => m.type === 'image') || media[0];
            const isExpanded = expandedId === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="card card-accent rounded-xl overflow-hidden"
              >
                {/* Card Header — always visible */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    
                    {/* Cover Image / Thumbnail button */}
                    {coverImage && (
                      <div 
                        onClick={() => openLightbox(media, media.indexOf(coverImage), project.title)}
                        className="w-full sm:w-28 h-28 rounded-lg overflow-hidden border border-[#222] shrink-0 bg-[#151515] relative group cursor-pointer hover:border-indigo-500/50 transition-all"
                      >
                        {coverImage.type === 'pdf' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-indigo-400">
                            <FileText className="w-8 h-8 mb-1" />
                            <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[80px]">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={toMediaSrc(coverImage.url)} 
                            alt={coverImage.altText || project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs font-medium">
                          <Maximize2 className="w-4 h-4" />
                          <span>Inspect</span>
                        </div>

                        {/* Media Count Badge */}
                        {media.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-700">
                            +{media.length}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="chip text-[10px]">{project.category}</span>
                        {project.featured && (
                          <span className="chip chip-accent text-[10px]">Featured</span>
                        )}
                        <span className="text-xs text-neutral-600 font-mono">{project.period}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-sm text-neutral-400 mt-0.5">{project.subtitle}</p>

                      <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Metrics Row */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-4">
                          {project.metrics.map((m, i) => (
                            <div key={i} className="text-center">
                              <div className="text-base font-bold text-indigo-400 font-mono">{m.value}</div>
                              <div className="text-[11px] text-neutral-500">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.techStack.map(t => (
                          <span key={t} className="chip text-[11px]">{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row sm:flex-col items-center gap-2 shrink-0">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-ghost py-1.5 px-3 text-xs w-full justify-center"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary py-1.5 px-3 text-xs w-full justify-center"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" /> Demo
                        </a>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                        className="btn-ghost py-1.5 px-3 text-xs w-full justify-center"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Case Study Panel & Media Gallery */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[#1a1a1a]"
                    >
                      <div className="p-6 pt-5 space-y-6">
                        
                        {/* Attached Media Assets Gallery */}
                        {media.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                              Media Gallery ({media.length} Assets Attached) — Click any item to inspect full resolution
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                              {media.map((item, mIdx) => (
                                <div
                                  key={item.id}
                                  onClick={() => openLightbox(media, mIdx, project.title)}
                                  className="relative aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 cursor-pointer group hover:border-indigo-500 transition-all"
                                >
                                  {item.type === 'pdf' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-indigo-400">
                                      <FileText className="w-6 h-6 mb-1" />
                                      <span className="text-[9px] font-mono text-neutral-400 truncate max-w-[80px]">{item.name}</span>
                                    </div>
                                  ) : (
                                    <img
                                      src={toMediaSrc(item.url)}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono">
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.problem && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Problem</h4>
                            <p className="text-sm text-neutral-300 leading-relaxed">{project.problem}</p>
                          </div>
                        )}
                        {project.solution && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Solution</h4>
                            <p className="text-sm text-neutral-300 leading-relaxed">{project.solution}</p>
                          </div>
                        )}
                        {project.highlights && project.highlights.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Key Features</h4>
                            <ul className="space-y-1.5">
                              {project.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                                  <span className="text-indigo-400 mt-0.5 shrink-0">→</span> {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.role && (
                          <div className="flex flex-wrap gap-4 pt-2 border-t border-[#1a1a1a] text-xs text-neutral-500">
                            <span>Role: <span className="text-neutral-300">{project.role}</span></span>
                            {project.teamSize && <span>Team: <span className="text-neutral-300">{project.teamSize} members</span></span>}
                          </div>
                        )}
                        {project.documentationUrl && (
                          <a 
                            href={project.documentationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View Documentation
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for inspecting images / documents */}
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
