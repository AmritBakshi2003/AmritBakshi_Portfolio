import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Folder, Sparkles } from 'lucide-react';
import type { CollectedSkill } from '../types';
import { SkillCard } from './SkillCard';

interface KnowledgeCollectionProps {
  collectedSkills: CollectedSkill[];
  totalSkillsCount: number;
}

export const KnowledgeCollection: React.FC<KnowledgeCollectionProps> = ({
  collectedSkills,
  totalSkillsCount,
}) => {
  // Group skills by Domain ID
  const groupedByDomain = collectedSkills.reduce((acc, item) => {
    const domainId = item.domain.id;
    if (!acc[domainId]) {
      acc[domainId] = {
        domain: item.domain,
        domainColor: item.domainColor,
        skills: [],
      };
    }
    acc[domainId].skills.push(item);
    return acc;
  }, {} as Record<string, { domain: any; domainColor: string; skills: CollectedSkill[] }>);

  const domainGroups = Object.values(groupedByDomain);
  const percentage = totalSkillsCount > 0 ? Math.min(100, Math.round((collectedSkills.length / totalSkillsCount) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4 w-full h-full max-h-[600px] overflow-y-auto pr-1">
      {/* Header with Title and Progress */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-yellow-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Collected Knowledge
          </h3>
        </div>
        <div className="text-xs text-neutral-400 font-medium">
          <span className="text-yellow-400 font-bold">{collectedSkills.length}</span> / {totalSkillsCount} Skills <span className="text-neutral-500">({percentage}%)</span>
        </div>
      </div>

      {domainGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#262626] rounded-xl bg-[#0f0f0f]">
          <Sparkles className="w-8 h-8 text-yellow-400/50 mb-2 animate-bounce" />
          <p className="text-sm font-medium text-neutral-300">Exploration in Progress</p>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            As Knowledge Capsules are revealed, skills will be organized here by parent domain.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {domainGroups.map(group => (
            <DomainSection
              key={group.domain.id}
              domain={group.domain}
              domainColor={group.domainColor}
              skills={group.skills}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface DomainSectionProps {
  domain: any;
  domainColor: string;
  skills: CollectedSkill[];
}

const DomainSection: React.FC<DomainSectionProps> = ({
  domain,
  domainColor,
  skills,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-[#222] rounded-xl overflow-hidden bg-[#111] shadow-md">
      {/* Domain Header Accordion Toggle */}
      <div
        className="flex items-center justify-between px-3.5 py-3 bg-[#161616] hover:bg-[#1c1c1c] cursor-pointer border-l-4 transition-colors"
        style={{ borderLeftColor: domainColor }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: domainColor }} />
          <span className="text-xs font-bold text-white tracking-wide">{domain.name}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#222] text-neutral-400 font-semibold border border-white/5">
            {skills.length}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 flex flex-col gap-2.5 bg-[#0d0d0d] border-t border-[#1a1a1a]"
          >
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                collectedSkill={skill}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
