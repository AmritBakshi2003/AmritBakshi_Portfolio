import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase, Award, Code2, Layers, BookOpen } from 'lucide-react';
import type { CollectedSkill } from '../types';

interface SkillCardProps {
  collectedSkill: CollectedSkill;
}

export const SkillCard: React.FC<SkillCardProps> = ({ collectedSkill }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { skill, domainColor, subSkills, relatedProjects, relatedExperience, relatedCertifications } = collectedSkill;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
        isExpanded
          ? 'bg-[#181818] border-yellow-500/40 shadow-lg'
          : 'bg-[#141414] border-[#262626] hover:border-neutral-700 hover:bg-[#161616]'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: domainColor }} />
          <span className="text-sm font-semibold text-white truncate">{skill.name}</span>
          {skill.experienceLevel && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#222] text-neutral-300 border border-[#333] shrink-0 font-medium">
              {skill.experienceLevel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-neutral-500 font-medium">
            {isExpanded ? 'Hide Info' : 'Details'}
          </span>
          <ChevronDown
            size={16}
            className={`text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-yellow-400' : ''}`}
          />
        </div>
      </div>

      {/* Expanded Inline Detail Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-[#262626] text-xs flex flex-col gap-3"
          >
            {/* Skill Description / Context */}
            {skill.description ? (
              <p className="text-neutral-300 leading-relaxed bg-[#0d0d0d] p-2.5 rounded-md border border-[#222]">
                {skill.description}
              </p>
            ) : (
              <div className="flex items-start gap-2 bg-[#0d0d0d] p-2.5 rounded-md border border-[#222]">
                <BookOpen size={14} className="text-yellow-400/80 mt-0.5 shrink-0" />
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Key technical skill under <span className="text-white font-medium">{collectedSkill.domain.name}</span>.
                </p>
              </div>
            )}

            {/* Subskills & Concepts */}
            {subSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Layers size={12} className="text-yellow-400" /> Sub-skills & Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subSkills.map(sub => (
                    <span
                      key={sub.id}
                      className="px-2 py-0.5 rounded bg-[#1f1f1f] text-neutral-200 border border-[#333] text-[11px] font-medium"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Applied in Projects */}
            {relatedProjects.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Code2 size={12} className="text-emerald-400" /> Practical Projects
                </span>
                <div className="flex flex-col gap-1">
                  {relatedProjects.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-1.5 rounded bg-[#161616] border border-[#222]"
                    >
                      <span className="text-white font-medium">{p.title}</span>
                      {p.category && (
                        <span className="text-[10px] text-neutral-500 uppercase">{p.category}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {relatedExperience.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Briefcase size={12} className="text-blue-400" /> Professional Experience
                </span>
                <div className="flex flex-col gap-1">
                  {relatedExperience.map(e => (
                    <div key={e.id} className="p-1.5 rounded bg-[#161616] border border-[#222]">
                      <span className="text-white font-medium">{e.role}</span>
                      <span className="text-neutral-400"> @ {e.company}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validated Certifications */}
            {relatedCertifications.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Award size={12} className="text-purple-400" /> Certifications
                </span>
                <div className="flex flex-col gap-1">
                  {relatedCertifications.map(c => (
                    <div key={c.id} className="p-1.5 rounded bg-[#161616] border border-[#222] text-neutral-300">
                      {c.title} {c.issuer ? <span className="text-neutral-500">({c.issuer})</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
