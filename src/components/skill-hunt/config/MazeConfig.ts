/** Central config for all maze layout parameters.
 *  Adjust here; the engine and renderer read from this object.
 */
export const MazeConfig = {
  /** Number of tile columns */
  cols: 21,

  /** Number of tile rows */
  rows: 21,

  /** Tile size in pixels — desktop */
  cellSize: 30,

  /** Tile size in pixels — mobile (viewport < 640 px) */
  cellSizeMobile: 20,

  /** Corner radius for wall tiles (px) */
  wallRadius: 4,

  /** Wall fill color */
  wallColor: '#1d1d1d',

  /** Path (corridor) fill color */
  pathColor: '#0d0d0d',

  /** Wall stroke/outline color */
  wallStroke: '#2a2a2a',

  /** Canvas border padding (px) */
  padding: 0,

  /** Rows that act as left↔right tunnels (entities wrap col 0 ↔ col max) */
  tunnelRows: [9] as number[],

  /** Canvas background behind the maze */
  canvasBg: '#080808',
} as const;
