import React, { useEffect, useRef } from 'react';
import type { GameEngineState } from '../types';
import { MazeConfig } from '../config/MazeConfig';
import { MAZE_GRID } from '../engine/MazeLayout';
import { PacManSprite } from './PacManSprite';
import { GhostSprite } from './GhostSprite';
import { SkillDropOverlay } from './SkillDropOverlay';

interface GameCanvasProps {
  engineState: GameEngineState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engineState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvasWidth = MazeConfig.cols * MazeConfig.cellSize;
  const canvasHeight = MazeConfig.rows * MazeConfig.cellSize;

  // Render Maze Background to HTML Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = MazeConfig.pathColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Walls
    ctx.fillStyle = MazeConfig.wallColor;
    ctx.strokeStyle = MazeConfig.wallStroke;
    ctx.lineWidth = 1;

    const size = MazeConfig.cellSize;

    for (let r = 0; r < MAZE_GRID.length; r++) {
      for (let c = 0; c < MAZE_GRID[r].length; c++) {
        const tile = MAZE_GRID[r][c];
        if (tile === 1) {
          const x = c * size;
          const y = r * size;
          ctx.beginPath();
          ctx.roundRect(x + 1, y + 1, size - 2, size - 2, MazeConfig.wallRadius);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-[#222] bg-[#0d0d0d] shadow-2xl"
      style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="block" />

      {/* Pac-Man Character Overlay */}
      <PacManSprite pacman={engineState.pacman} />

      {/* Ghost Characters Overlay */}
      {engineState.ghosts.map(ghost => (
        <GhostSprite key={ghost.id} ghost={ghost} />
      ))}

      {/* Floating Skill Drops */}
      <SkillDropOverlay drops={engineState.drops} />
    </div>
  );
};
