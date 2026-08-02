import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SkillDrop } from '../types';

interface SkillDropOverlayProps {
  drops: SkillDrop[];
}

export const SkillDropOverlay: React.FC<SkillDropOverlayProps> = ({ drops }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {drops.map(drop => (
          <motion.div
            key={drop.id}
            initial={{ opacity: 1, scale: 0.8, x: drop.ghostPx - 40, y: drop.ghostPy - 10 }}
            animate={{ opacity: 0, scale: 1.2, y: drop.ghostPy - 60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute px-2.5 py-1 rounded bg-[#161616] border text-xs font-bold shadow-lg"
            style={{
              borderColor: drop.domainColor,
              color: drop.domainColor,
            }}
          >
            +{drop.skill.name}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
