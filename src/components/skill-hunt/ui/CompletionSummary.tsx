import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, RotateCcw } from 'lucide-react';

interface CompletionSummaryProps {
  totalDomainsExplored: number;
  totalSkillsDiscovered: number;
  countdownSeconds: number;
  onRestart: () => void;
}

export const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  totalDomainsExplored,
  totalSkillsDiscovered,
  countdownSeconds,
  onRestart,
}) => {
  const roundedCountdown = Math.max(0, Math.ceil(countdownSeconds));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-20 bg-[#0d0d0d]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-xl border border-yellow-500/20"
    >
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/10 animate-pulse">
        <Trophy size={32} className="text-yellow-400" />
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
        Knowledge Fully Explored
      </h2>
      <p className="text-xs text-neutral-400 mb-6 max-w-xs leading-relaxed">
        Technical expertise across all CMS domains has been completely revealed!
      </p>

      <div className="flex flex-col gap-2.5 w-full max-w-xs mb-6 text-left">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#161616] border border-[#262626]">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white">{totalDomainsExplored} Domains Explored</div>
            <div className="text-[10px] text-neutral-400">All visible portfolio domain capsules captured</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#161616] border border-[#262626]">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white">{totalSkillsDiscovered} Unique Skills Discovered</div>
            <div className="text-[10px] text-neutral-400">Complete tool, language & framework library</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-400 text-black font-semibold text-xs hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
        >
          <RotateCcw size={14} /> Restart Knowledge Cycle Now
        </button>

        {roundedCountdown > 0 && (
          <p className="text-[11px] text-neutral-500 mt-1">
            Auto-restarting in <span className="font-bold text-yellow-400">{roundedCountdown}s</span>...
          </p>
        )}
      </div>
    </motion.div>
  );
};
