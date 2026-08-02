import type { GhostState, PacManState, Direction, TilePos } from '../types';
import { MazeLayout } from './MazeLayout';
import { GameConfig } from '../config/GameConfig';

/**
 * GhostAI
 * Implements four distinct ghost personalities matching classic Pac-Man AI:
 * - Blinky (Red): Aggressive direct chaser (targets Pac-Man tile)
 * - Pinky (Blue): Interceptor (targets 4 tiles ahead of Pac-Man)
 * - Inky (Green): Unpredictable flanker
 * - Clyde (Purple): Ambush / coward (chases when far, retreats to corner when close)
 */
export class GhostAI {
  static computeNextDirection(
    ghost: GhostState,
    pacman: PacManState,
    blinkyPos: TilePos
  ): Direction {
    if (ghost.mode === 'eaten') {
      // Eaten ghosts return to ghost house center [10, 9]
      return MazeLayout.findShortestPath({ col: ghost.col, row: ghost.row }, { col: 10, row: 9 });
    }

    const targetTile = this.getTargetTile(ghost, pacman, blinkyPos);
    return this.getBestDirectionAtIntersection(ghost, targetTile);
  }

  private static getTargetTile(
    ghost: GhostState,
    pacman: PacManState,
    blinkyPos: TilePos
  ): TilePos {
    if (ghost.mode === 'scatter') {
      const scatterCorner = GameConfig.scatterTargets[ghost.id] || [0, 0];
      return { col: scatterCorner[0], row: scatterCorner[1] };
    }

    // Chase mode — assign behaviors based on ghost id mod 4 for variety
    const behaviorIndex = ghost.id % 4;
    switch (behaviorIndex) {
      case 0:
        // Direct chaser: target Pac-Man's exact tile
        return { col: pacman.col, row: pacman.row };

      case 1:
        // Interceptor: target tiles ahead of Pac-Man's direction
        return MazeLayout.getNextTile(pacman.col, pacman.row, pacman.direction);

      case 2: {
        // Flanker: vector offset from first ghost's position
        const offsetTile = MazeLayout.getNextTile(pacman.col, pacman.row, pacman.direction);
        const vx = offsetTile.col - blinkyPos.col;
        const vy = offsetTile.row - blinkyPos.row;
        return { col: blinkyPos.col + vx * 2, row: blinkyPos.row + vy * 2 };
      }

      case 3: {
        // Ambush: chase when far, retreat to corner when close
        const dx = ghost.col - pacman.col;
        const dy = ghost.row - pacman.row;
        const distSq = dx * dx + dy * dy;
        if (distSq > 64) {
          return { col: pacman.col, row: pacman.row };
        } else {
          const corner = GameConfig.scatterTargets[3];
          return { col: corner[0], row: corner[1] };
        }
      }

      default:
        return { col: pacman.col, row: pacman.row };
    }
  }

  private static getBestDirectionAtIntersection(
    ghost: GhostState,
    target: TilePos
  ): Direction {
    const validDirs: Direction[] = [];
    const possibleDirs: Direction[] = ['up', 'down', 'left', 'right'];

    // Opposite direction mapping (ghosts cannot turn 180° directly)
    const opposite: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
      none: 'none',
    };

    for (const dir of possibleDirs) {
      if (dir === opposite[ghost.direction]) continue; // Prevent direct 180° turnaround
      const next = MazeLayout.getNextTile(ghost.col, ghost.row, dir);
      if (MazeLayout.isWalkable(next.col, next.row)) {
        validDirs.push(dir);
      }
    }

    if (validDirs.length === 0) {
      // Fallback if trapped: allow turnaround
      return opposite[ghost.direction] !== 'none' ? opposite[ghost.direction] : 'right';
    }

    // Pick direction minimizing Euclidean distance to target tile
    let bestDir = validDirs[0];
    let minDistance = Infinity;

    for (const dir of validDirs) {
      const next = MazeLayout.getNextTile(ghost.col, ghost.row, dir);
      const dx = next.col - target.col;
      const dy = next.row - target.row;
      const dist = dx * dx + dy * dy;
      if (dist < minDistance) {
        minDistance = dist;
        bestDir = dir;
      }
    }

    return bestDir;
  }
}
