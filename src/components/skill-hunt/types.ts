import type { TreeNode, Project, WorkExperience, Certification } from '../../types/cms';

/** All shared types for Skill Hunt game entities */

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
export type GhostMode = 'scatter' | 'chase' | 'eaten' | 'captured';
export type GamePhase = 'idle' | 'playing' | 'paused' | 'completed';

export interface TilePos {
  col: number;
  row: number;
}

export interface SpriteState {
  /** Current tile (integer) */
  col: number;
  row: number;
  /** Pixel position of sprite centre */
  px: number;
  py: number;
  direction: Direction;
  nextDirection: Direction;
  /** 0.0 – 1.0 progress between prevTile → currentTile */
  moveProgress: number;
  prevCol: number;
  prevRow: number;
}

export interface GhostState extends SpriteState {
  id: number;
  mode: GhostMode;
  /** CMS domain currently assigned to this ghost */
  domainNode: TreeNode;
  /** CMS domain title */
  domainTitle: string;
  /** Hex accent color derived from CMS domain.color or fallback */
  color: string;
  /** Next skill this ghost will reveal when captured */
  pendingSkill: TreeNode | null;
  /** Is ghost active on the board? */
  active: boolean;
}

export interface PacManState extends SpriteState {
  /** Mouth angle 0 (closed) → 1 (fully open), drives mouth animation */
  mouthPhase: number;
}

export interface SkillDrop {
  id: string;
  skill: TreeNode;
  domain: TreeNode;
  domainColor: string;
  ghostPx: number;
  ghostPy: number;
  createdAt: number;
}

export interface CollectedSkill {
  id: string;
  skill: TreeNode;
  domain: TreeNode;
  domainColor: string;
  collectedAt: number;
  /** Sub-skills from CMS */
  subSkills: TreeNode[];
  /** Related projects from projectLinks */
  relatedProjects: Project[];
  /** Related experience entries */
  relatedExperience: WorkExperience[];
  /** Related certifications */
  relatedCertifications: Certification[];
}

export interface GameEngineState {
  phase: GamePhase;
  pacman: PacManState;
  ghosts: GhostState[];
  drops: SkillDrop[];
  collected: CollectedSkill[];
  discoveredCount: number;
  totalSkillsCount: number;
  /** Seconds remaining for capture reveal pause (0 when moving) */
  pauseRemaining: number;
  /** Seconds remaining for completion summary screen */
  completionCountdown: number;
}
