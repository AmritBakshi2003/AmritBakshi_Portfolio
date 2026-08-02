import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Layers, Cpu, BookOpen, Wrench, Database, Code, Briefcase, Hash, Sparkles } from 'lucide-react';
import type { TreeNode, Project, ProjectLink } from '../../types/cms';
import { TechLogo } from './TechLogo';

interface TechDetailModalProps {
  node: TreeNode | null;
  domainColor: string;
  projects: Project[];
  projectLinks: ProjectLink[];
  onClose: () => void;
}

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  domain: <Layers size={11} />,
  skill: <Cpu size={11} />,
  sub_skill: <Code size={11} />,
  library: <BookOpen size={11} />,
  framework: <Wrench size={11} />,
  database: <Database size={11} />,
  tool: <Wrench size={11} />,
  professional_skill: <Briefcase size={11} />,
  concept: <Hash size={11} />,
};

const LEVEL_COLOR: Record<string, string> = {
  Learning: 'text-blue-400 bg-blue-900/30 border-blue-800/50',
  Beginner: 'text-green-400 bg-green-900/30 border-green-800/50',
  Intermediate: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50',
  Advanced: 'text-orange-400 bg-orange-900/30 border-orange-800/50',
  Expert: 'text-red-400 bg-red-900/30 border-red-800/50',
};

export const TechDetailModal: React.FC<TechDetailModalProps> = ({
  node, domainColor, projects, projectLinks, onClose
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (node) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [node]);

  const linkedProjects = node
    ? projectLinks
        .filter(l => l.nodeId === node.id)
        .map(l => ({ link: l, proj: projects.find(p => p.id === l.projectId) }))
        .filter((x): x is { link: ProjectLink; proj: Project } => !!x.proj)
    : [];

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — slides up from bottom on mobile, slides in from right on desktop */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed z-50 bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-auto md:right-6 md:-translate-y-1/2 md:w-[400px] max-h-[85vh] overflow-y-auto bg-[#0f0f0f] border border-[#222] rounded-t-2xl md:rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#333]" />
            </div>

            {/* Header */}
            <div className="flex items-start gap-4 p-5 border-b border-[#1a1a1a]">
              {/* Logo */}
              <div
                className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-[#141414] border border-[#222]"
                style={{ boxShadow: `0 0 0 1px ${domainColor}22` }}
              >
                <TechLogo name={node.name} type={node.type} size={36} customIconUrl={node.icon} />
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg leading-tight truncate">{node.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {/* Type badge */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#2a2a2a] text-neutral-400">
                    {TYPE_ICON_MAP[node.type] ?? <Sparkles size={11} />}
                    {node.type.replace(/_/g, ' ')}
                  </span>
                  {/* Experience level */}
                  {node.experienceLevel && (
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border ${LEVEL_COLOR[node.experienceLevel] ?? 'text-neutral-400 bg-neutral-900 border-neutral-700'}`}>
                      {node.experienceLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-[#1e1e1e] transition-colors"
                aria-label="Close detail panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              {/* Description */}
              {node.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">About</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{node.description}</p>
                </div>
              )}

              {/* Sub-skills / children */}
              {(node.children?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                    Sub-skills & Concepts
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.children!
                      .filter(c => c.visibility !== false)
                      .map(c => (
                        <span
                          key={c.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#252525] text-neutral-300 font-mono"
                        >
                          {c.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Related projects */}
              {linkedProjects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                    Applied in Projects
                  </p>
                  <div className="space-y-2">
                    {linkedProjects.map(({ link, proj }) => (
                      <div
                        key={link.id}
                        className="rounded-lg p-3 bg-[#141414] border border-[#222]"
                        style={{ borderLeft: `3px solid ${domainColor}` }}
                      >
                        <a
                          href="#projects"
                          onClick={e => {
                            e.preventDefault();
                            onClose();
                            setTimeout(() => {
                              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                            }, 250);
                          }}
                          className="text-xs font-bold text-white hover:text-[#F2C230] transition-colors flex items-center gap-1 group"
                        >
                          <span>{proj.title}</span>
                          <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{proj.category}</p>
                        {link.usage && (
                          <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed border-t border-[#1e1e1e] pt-1.5">
                            {link.usage}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {(node.tags?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.tags!.map(tag => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#252525] text-neutral-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
