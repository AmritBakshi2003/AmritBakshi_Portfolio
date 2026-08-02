import React from 'react';
import type { GhostState } from '../types';

interface DomainLegendProps {
  ghosts: GhostState[];
}

/**
 * DomainLegend
 * Renders domain labels below the game canvas arranged in a 3x2 grid layout.
 * Each chip shows the CMS domain color and domain name.
 * Labels come 100% from CMS — no hardcoding.
 */
export const DomainLegend: React.FC<DomainLegendProps> = ({ ghosts }) => {
  // Deduplicate by domain ID (multiple ghosts may share a domain in some states)
  const seen = new Set<string>();
  const domains = ghosts.filter(g => {
    if (seen.has(g.domainNode.id)) return false;
    seen.add(g.domainNode.id);
    return true;
  });

  if (domains.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2 w-full max-w-[420px] px-1">
      {domains.map(ghost => (
        <div
          key={ghost.domainNode.id}
          className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-white/10 shadow-sm text-center truncate transition-transform hover:scale-[1.02]"
          style={{
            backgroundColor: `${ghost.color}1E`,
            borderColor: `${ghost.color}44`,
            color: ghost.color,
          }}
          title={ghost.domainTitle}
        >
          {/* Colored ghost silhouette icon */}
          <svg width="12" height="12" viewBox="0 0 32 32" className="shrink-0">
            <path
              d="M6,16 C6,9 10,4 16,4 C22,4 26,9 26,16 L26,28 L22,25 L18,28 L14,25 L10,28 L6,25 Z"
              fill={ghost.color}
            />
            <circle cx="12" cy="13" r="3" fill="#fff" />
            <circle cx="20" cy="13" r="3" fill="#fff" />
          </svg>
          <span className="truncate">{ghost.domainTitle}</span>
        </div>
      ))}
    </div>
  );
};
