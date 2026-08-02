import React from 'react';
import type { GhostState } from '../types';
import { MazeConfig } from '../config/MazeConfig';

interface GhostSpriteProps {
  ghost: GhostState;
}

export const GhostSprite: React.FC<GhostSpriteProps> = ({ ghost }) => {
  if (!ghost.active || ghost.mode === 'captured' || ghost.mode === 'eaten') return null;

  const size = MazeConfig.cellSize;

  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        left: `${ghost.px - size / 2}px`,
        top: `${ghost.py - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        {/* Ghost body */}
        <path
          d="M6,16 C6,9 10,4 16,4 C22,4 26,9 26,16 L26,28 L22,25 L18,28 L14,25 L10,28 L6,25 Z"
          fill={ghost.color}
        />
        {/* White eyes */}
        <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
        <circle cx="20" cy="12" r="3.5" fill="#FFFFFF" />
        {/* Pupils */}
        <circle cx="13" cy="12" r="1.8" fill="#09090B" />
        <circle cx="21" cy="12" r="1.8" fill="#09090B" />
      </svg>
    </div>
  );
};
