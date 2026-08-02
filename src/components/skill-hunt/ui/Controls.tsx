import React from 'react';
import { Play, Pause, Sparkles, X, Award } from 'lucide-react';

interface ControlsProps {
  isPaused: boolean;
  discoveredCount: number;
  totalSkillsCount: number;
  onTogglePause: () => void;
  onClose: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPaused,
  discoveredCount,
  totalSkillsCount,
  onTogglePause,
  onClose,
}) => {
  const percentage = totalSkillsCount > 0 ? Math.min(100, Math.round((discoveredCount / totalSkillsCount) * 100)) : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl shadow-lg">
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePause}
          className="p-2 rounded-lg bg-[#222] hover:bg-[#2e2e2e] text-neutral-200 transition-colors border border-[#333]"
          title={isPaused ? 'Resume Showcase' : 'Pause Showcase'}
        >
          {isPaused ? <Play size={16} className="text-emerald-400" /> : <Pause size={16} className="text-yellow-400" />}
        </button>

        {/* Showcase Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
          <Sparkles size={14} className="animate-pulse" />
          <span>Automated Portfolio Showcase</span>
        </div>
      </div>

      {/* Discovery Progress Indicator */}
      <div className="flex items-center gap-3 bg-[#0d0d0d] px-3 py-1.5 rounded-lg border border-[#222]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
          <Award size={14} className="text-emerald-400" />
          <span>Discovered Skills:</span>
          <span className="font-bold text-white">
            {discoveredCount} / {totalSkillsCount}
          </span>
          <span className="text-neutral-500 text-[11px]">({percentage}%)</span>
        </div>

        {/* Progress Mini Bar */}
        <div className="w-20 h-2 bg-[#222] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors"
      >
        <X size={14} /> Close
      </button>
    </div>
  );
};
