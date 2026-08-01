import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../../types/cms';
import { ExternalLink } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const visible = achievements
    .filter(a => a.visibility)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visible.length) return null;

  return (
    <section id="achievements" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label">
            <span>07</span>
            <span className="text-neutral-600">—</span>
            Achievements
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
            Notable Highlights
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="card card-accent rounded-xl p-5 flex flex-col gap-3"
            >
              {/* Icon */}
              <div className="text-2xl">{ach.icon || '🎯'}</div>

              <div>
                <h3 className="text-sm font-semibold text-white leading-snug">{ach.title}</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{ach.description}</p>
              </div>

              {/* Tags */}
              {ach.tags && ach.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                  {ach.tags.map(t => (
                    <span key={t} className="chip text-[10px]">{t}</span>
                  ))}
                </div>
              )}

              {/* Link */}
              {ach.link && ach.link !== '#' && (
                <a href={ach.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Learn more
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
