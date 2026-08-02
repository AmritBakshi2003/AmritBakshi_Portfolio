import React from 'react';
import type { PacManState } from '../types';
import { MazeConfig } from '../config/MazeConfig';

interface PacManSpriteProps {
  pacman: PacManState;
}

export const PacManSprite: React.FC<PacManSpriteProps> = ({ pacman }) => {
  const size = MazeConfig.cellSize;
  const rotationDegrees: Record<string, number> = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
    none: 0,
  };

  const rot = rotationDegrees[pacman.direction] || 0;
  // Mouth angle from 5deg to 45deg
  const mouthAngle = 5 + pacman.mouthPhase * 40;

  return (
    <div
      className="absolute pointer-events-none transition-all duration-75 ease-linear"
      style={{
        left: `${pacman.px - size / 2}px`,
        top: `${pacman.py - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rot}deg)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        {/* Yellow Body with animated wedge mouth cut */}
        <circle cx="16" cy="16" r="14" fill="#F2C230" />
        {/* Mouth wedge (black) */}
        <path
          d={`M16,16 L32,${16 - mouthAngle / 2} L32,${16 + mouthAngle / 2} Z`}
          fill="#0d0d0d"
        />
        {/* Eye */}
        <circle cx="18" cy="8" r="2" fill="#000" />
      </svg>
    </div>
  );
};
