/** Central config for all Skill Hunt gameplay & storytelling constants.
 *  Slower pacing optimized for portfolio exploration.
 */
export const GameConfig = {
  /** Target frames per second */
  fps: 60,

  /** Pac-Man tiles per second (auto storytelling mode) */
  pacManSpeed: 2.2,

  /** Ghost tiles per second */
  ghostSpeed: 1.8,

  /** Storytelling pause after capturing a ghost/capsule (ms) */
  capturePauseMs: 1_800,

  /** Scatter phase duration (ms) */
  scatterDuration: 8_000,

  /** Chase phase duration (ms) */
  chaseDuration: 18_000,

  /** Delay after CompletionSummary before auto-restart cycle (ms) */
  completionDisplayMs: 6_000,

  /** How many frames between BFS autopilot path recalcs */
  bfsRecomputeEvery: 8,

  /** How long the skill drop float animation lasts (ms) */
  skillDropDurationMs: 1_200,

  /** Pac-Man start tile [col, row] */
  pacManStart: [10, 15] as [number, number],

  /** Available ghost spawn tiles [col, row] in the maze center / corners */
  ghostSpawnPositions: [
    [10, 9],
    [9, 9],
    [11, 9],
    [10, 8],
    [9, 8],
    [11, 8],
    [8, 9],
    [12, 9],
  ] as [number, number][],

  /** Fallback ghost accent colors when domain.color is absent */
  ghostFallbackColors: ['#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],

  /** Scatter target corners [col, row] per ghost index */
  scatterTargets: [
    [20, 0],  // top-right
    [0, 0],   // top-left
    [20, 20], // bottom-right
    [0, 20],  // bottom-left
  ] as [number, number][],
} as const;
