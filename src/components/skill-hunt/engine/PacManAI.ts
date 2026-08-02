import type { PacManState, GhostState, Direction, TilePos } from '../types';
import { MazeLayout } from './MazeLayout';

/**
 * PacManAI
 * Computes BFS autopilot trajectory towards the nearest active ghost.
 */
export class PacManAI {
  static computeNextDirection(pacman: PacManState, ghosts: GhostState[]): Direction {
    const activeGhosts = ghosts.filter(g => g.active && g.mode !== 'eaten');
    if (activeGhosts.length === 0) return pacman.direction;

    // Find nearest ghost tile
    let nearestGhost: GhostState | null = null;
    let minDistance = Infinity;

    for (const ghost of activeGhosts) {
      const dx = ghost.col - pacman.col;
      const dy = ghost.row - pacman.row;
      const dist = dx * dx + dy * dy;
      if (dist < minDistance) {
        minDistance = dist;
        nearestGhost = ghost;
      }
    }

    if (!nearestGhost) return pacman.direction;

    const start: TilePos = { col: pacman.col, row: pacman.row };
    const target: TilePos = { col: nearestGhost.col, row: nearestGhost.row };

    const nextDir = MazeLayout.findShortestPath(start, target);
    return nextDir !== 'none' ? nextDir : pacman.direction;
  }
}
