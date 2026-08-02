import type { TilePos, Direction } from '../types';
import { MazeConfig } from '../config/MazeConfig';

/**
 * Classic 21x21 Pac-Man inspired maze grid.
 * 0 = corridor (walkable)
 * 1 = wall
 * 2 = ghost house spawn / gate
 */
export const MAZE_GRID: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1],
  [0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0],
  [1,1,1,1,1,0,1,0,1,2,2,2,1,0,1,0,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,2,2,2,1,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
  [0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0],
  [1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export class MazeLayout {
  static isWalkable(col: number, row: number): boolean {
    const grid = MAZE_GRID;
    if (row < 0 || row >= grid.length) return false;
    // Tunnels wrapping
    if (MazeConfig.tunnelRows.includes(row)) {
      if (col < 0 || col >= MazeConfig.cols) return true;
    }
    if (col < 0 || col >= MazeConfig.cols) return false;
    const tile = grid[row][col];
    return tile === 0 || tile === 2;
  }

  static getNextTile(col: number, row: number, dir: Direction): TilePos {
    let nextCol = col;
    let nextRow = row;

    if (dir === 'up') nextRow--;
    if (dir === 'down') nextRow++;
    if (dir === 'left') nextCol--;
    if (dir === 'right') nextCol++;

    // Wrap around tunnels
    if (MazeConfig.tunnelRows.includes(nextRow)) {
      if (nextCol < 0) nextCol = MazeConfig.cols - 1;
      else if (nextCol >= MazeConfig.cols) nextCol = 0;
    }

    return { col: nextCol, row: nextRow };
  }

  /** BFS Pathfinding helper from start to target */
  static findShortestPath(start: TilePos, target: TilePos): Direction {
    if (start.col === target.col && start.row === target.row) return 'none';

    const queue: { pos: TilePos; firstDir: Direction }[] = [];
    const visited = new Set<string>();
    visited.add(`${start.col},${start.row}`);

    const directions: Direction[] = ['up', 'down', 'left', 'right'];

    for (const dir of directions) {
      const next = this.getNextTile(start.col, start.row, dir);
      if (this.isWalkable(next.col, next.row)) {
        if (next.col === target.col && next.row === target.row) return dir;
        visited.add(`${next.col},${next.row}`);
        queue.push({ pos: next, firstDir: dir });
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.pos.col === target.col && current.pos.row === target.row) {
        return current.firstDir;
      }

      for (const dir of directions) {
        const next = this.getNextTile(current.pos.col, current.pos.row, dir);
        const key = `${next.col},${next.row}`;
        if (this.isWalkable(next.col, next.row) && !visited.has(key)) {
          visited.add(key);
          queue.push({ pos: next, firstDir: current.firstDir });
        }
      }
    }

    return 'none';
  }
}
