import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Layers, Gamepad2 } from 'lucide-react';

export type SkillView = 'tree' | 'stack' | 'hunt';

interface DockItem {
  id: SkillView;
  label: string;
  icon: React.ReactNode;
}

const ALL_ITEMS: DockItem[] = [
  {
    id: 'tree',
    label: 'Knowledge Tree',
    icon: <TreePine size={18} strokeWidth={1.75} />,
  },
  {
    id: 'stack',
    label: 'Tech Stack',
    icon: <Layers size={18} strokeWidth={1.75} />,
  },
  {
    id: 'hunt',
    label: 'Skill Hunt',
    icon: <Gamepad2 size={18} strokeWidth={1.75} />,
  },
];

interface SkillExplorerDockProps {
  activeView: SkillView;
  onViewChange: (view: SkillView) => void;
  showSkillHunt?: boolean;
}

export const SkillExplorerDock: React.FC<SkillExplorerDockProps> = ({
  activeView,
  onViewChange,
  showSkillHunt = true,
}) => {
  const items = ALL_ITEMS.filter(item => item.id !== 'hunt' || showSkillHunt);

  return (
    <div className="flex flex-col items-start gap-2 mt-5">
      {/* Dock label */}
      <p className="text-[11px] text-neutral-600 font-mono uppercase tracking-widest pl-1">
        Explore My Skills
      </p>

      {/* Dock bar */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-[#1e1e1e]"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
        role="tablist"
        aria-label="Skill view selector"
      >
        {items.map(item => {
          const isActive = activeView === item.id;
          return (
            <DockTab
              key={item.id}
              item={item}
              isActive={isActive}
              onClick={() => onViewChange(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

// ── Individual Dock Tab ───────────────────────────────────────────────────────
interface DockTabProps {
  item: DockItem;
  isActive: boolean;
  onClick: () => void;
}

const DockTab: React.FC<DockTabProps> = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      role="tab"
      aria-selected={isActive}
      aria-label={item.label}
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C230]/40"
      style={{
        background: isActive ? 'rgba(242,194,48,0.1)' : 'transparent',
        color: isActive ? '#F2C230' : '#6b6b6b',
      }}
    >
      {/* Icon — slightly larger when active */}
      <motion.span
        animate={{ scale: isActive ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="flex items-center"
        style={{ color: isActive ? '#F2C230' : '#6b6b6b' }}
      >
        {item.icon}
      </motion.span>

      {/* Label */}
      <span
        className="text-xs font-semibold whitespace-nowrap hidden sm:inline transition-colors"
        style={{ color: isActive ? '#F2C230' : '#6b6b6b' }}
      >
        {item.label}
      </span>

      {/* Active indicator — animated underline */}
      {isActive && (
        <motion.span
          layoutId="dock-active-indicator"
          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full"
          style={{ background: '#F2C230' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
