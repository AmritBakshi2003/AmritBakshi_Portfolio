import React from 'react';
import { motion } from 'framer-motion';
import type { Education } from '../../types/cms';
import { GraduationCap } from 'lucide-react';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const visible = education
    .filter(e => e.visibility)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visible.length) return null;

  return (
    <section id="education" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label">
            <span>06</span>
            <span className="text-neutral-600">—</span>
            Education
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
            Academic Background
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a1a1a] hidden sm:block" />

          <div className="space-y-8">
            {visible.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="sm:pl-10 relative"
              >
                <div className="hidden sm:flex absolute left-0 top-1.5 -translate-x-[calc(50%-0.5px)] w-6 h-6 rounded-full bg-[#111] border border-[#2a2a2a] items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-indigo-400" />
                </div>

                <div className="card rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-white">{edu.degree}</h3>
                      <p className="text-sm text-indigo-400 mt-0.5">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {edu.grade && (
                        <span className="chip chip-accent text-xs">
                          {edu.grade}
                        </span>
                      )}
                      <span className="text-xs font-mono text-neutral-500 bg-[#1a1a1a] px-2.5 py-1 rounded-md">
                        {edu.period}
                      </span>
                    </div>
                  </div>

                  {edu.details && (
                    <p className="text-sm text-neutral-400 mt-3 leading-relaxed">{edu.details}</p>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="space-y-1 mt-3">
                      {edu.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                          <span className="text-indigo-500 shrink-0">→</span> {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
