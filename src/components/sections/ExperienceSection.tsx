import React from 'react';
import { motion } from 'framer-motion';
import type { WorkExperience, MediaItem } from '../../types/cms';
import { ExternalLink, MapPin } from 'lucide-react';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  mediaLibrary: MediaItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, mediaLibrary: _mediaLibrary }) => {
  const visible = experiences
    .filter(e => e.visibility)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visible.length) return null;

  return (
    <section id="experience" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label">
            <span>04</span>
            <span className="text-neutral-600">—</span>
            Experience
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
            Work Experience
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a1a1a] hidden sm:block" />

          <div className="space-y-10">
            {visible.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="sm:pl-10 relative"
              >
                {/* Timeline dot */}
                <div className="hidden sm:block absolute left-0 top-1.5 -translate-x-[calc(50%-0.5px)] w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#0a0a0a]" />

                <div className="card rounded-xl p-6 hover:border-[#2a2a2a]">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">{exp.role}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="text-sm font-medium text-indigo-400">{exp.company}</span>
                        {exp.location && (
                          <span className="flex items-center gap-1 text-xs text-neutral-500">
                            <MapPin className="w-3 h-3" />{exp.location}
                          </span>
                        )}
                        {exp.employmentType && (
                          <span className="chip text-[10px]">{exp.employmentType}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-neutral-500 shrink-0 bg-[#1a1a1a] px-2.5 py-1 rounded-md">
                      {exp.period}
                    </span>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-4">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-300 leading-relaxed">
                        <span className="text-indigo-500 shrink-0 mt-0.5">→</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  {/* Footer: skills + proof link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1a1a1a]">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skillsUsed.map(s => (
                        <span key={s} className="chip text-[10px]">{s}</span>
                      ))}
                    </div>
                    {exp.proofUrl && exp.proofUrl !== '#' && (
                      <a href={exp.proofUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        {exp.proofTitle || 'View Proof'}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
