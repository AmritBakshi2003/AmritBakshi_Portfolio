import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  GameEngineState,
  GhostState,
  SkillDrop,
  CollectedSkill,
  GhostMode
} from '../types';
import type { TreeNode, Project, ProjectLink, WorkExperience, Certification } from '../../../types/cms';
import { GameConfig } from '../config/GameConfig';
import { MazeConfig } from '../config/MazeConfig';
import { MazeLayout } from './MazeLayout';
import { GhostAI } from './GhostAI';
import { PacManAI } from './PacManAI';
import { CMSAdapter } from '../adapters/CMSAdapter';
import { GhostDomainManager } from '../adapters/GhostDomainManager';
import { DiscoveryTracker } from '../adapters/DiscoveryTracker';
import { AnalyticsAdapter } from '../adapters/AnalyticsAdapter';

interface UsePacManEngineProps {
  treeData: TreeNode;
  projects?: Project[];
  projectLinks?: ProjectLink[];
  experience?: WorkExperience[];
  certifications?: Certification[];
  isPaused?: boolean;
}

export function usePacManEngine({
  treeData,
  projects = [],
  projectLinks = [],
  experience = [],
  certifications = [],
  isPaused = false,
}: UsePacManEngineProps) {
  const cmsAdapterRef = useRef(new CMSAdapter(treeData, projects, projectLinks, experience, certifications));
  const domainManagerRef = useRef(new GhostDomainManager(cmsAdapterRef.current.getDomains()));
  const discoveryTrackerRef = useRef(new DiscoveryTracker(cmsAdapterRef.current.getTotalSkillsCount()));

  // Function to build dynamic ghost state array for current domains
  const buildGhostStates = useCallback((cmsAdapter: CMSAdapter, tracker: DiscoveryTracker): GhostState[] => {
    const visibleDomains = cmsAdapter.getDomains();
    if (visibleDomains.length === 0) return [];

    // Spread ghost spawns around the walkable maze perimeter
    const spawnPositions = GameConfig.ghostSpawnPositions;

    return visibleDomains.map((domain, index) => {
      const color = cmsAdapter.getDomainColor(domain, index);
      const domainSkills = cmsAdapter.getSkillsForDomain(domain.id);
      const pendingSkill = tracker.getNextSkillToDiscover(domainSkills);
      // Spread ghosts to different positions so they don't all spawn on top of each other
      const spawnTile = spawnPositions[index % spawnPositions.length];
      // Stagger initial direction so ghosts immediately fan out
      const startDirs: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right', 'up', 'down', 'left', 'right'];

      return {
        id: index,
        mode: 'scatter',
        domainNode: domain,
        domainTitle: domain.name,
        color,
        pendingSkill,
        active: true,
        col: spawnTile[0],
        row: spawnTile[1],
        px: spawnTile[0] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        py: spawnTile[1] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        direction: startDirs[index % startDirs.length],
        nextDirection: startDirs[index % startDirs.length],
        moveProgress: 0,
        prevCol: spawnTile[0],
        prevRow: spawnTile[1],
      };
    });
  }, []);

  // Engine state initialization
  const [engineState, setEngineState] = useState<GameEngineState>(() => {
    const cmsAdapter = cmsAdapterRef.current;
    const tracker = discoveryTrackerRef.current;

    const initialGhosts = buildGhostStates(cmsAdapter, tracker);

    return {
      phase: 'playing',
      pacman: {
        col: GameConfig.pacManStart[0],
        row: GameConfig.pacManStart[1],
        px: GameConfig.pacManStart[0] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        py: GameConfig.pacManStart[1] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        direction: 'right',
        nextDirection: 'right',
        moveProgress: 0,
        prevCol: GameConfig.pacManStart[0],
        prevRow: GameConfig.pacManStart[1],
        mouthPhase: 0.5,
      },
      ghosts: initialGhosts,
      drops: [],
      collected: [],
      discoveredCount: 0,
      totalSkillsCount: cmsAdapter.getTotalSkillsCount(),
      pauseRemaining: 0,
      completionCountdown: 0,
    };
  });

  // Re-sync engine when CMS data props update dynamically
  useEffect(() => {
    cmsAdapterRef.current = new CMSAdapter(treeData, projects, projectLinks, experience, certifications);
    const cmsAdapter = cmsAdapterRef.current;
    
    domainManagerRef.current.updateDomains(cmsAdapter.getDomains());
    const totalSkills = cmsAdapter.getTotalSkillsCount();
    discoveryTrackerRef.current.setTotalSkillsCount(totalSkills);

    setEngineState(prev => ({
      ...prev,
      totalSkillsCount: totalSkills,
      ghosts: buildGhostStates(cmsAdapter, discoveryTrackerRef.current),
    }));
  }, [treeData, projects, projectLinks, experience, certifications, buildGhostStates]);

  const requestRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  // Throttle: only move a tile every N frames
  const pacMoveEvery = Math.round(GameConfig.fps / GameConfig.pacManSpeed);  // frames per tile
  const ghostMoveEvery = Math.round(GameConfig.fps / GameConfig.ghostSpeed); // frames per tile
  const modeTimerRef = useRef<number>(0); // ms elapsed in current scatter/chase phase
  const currentModeRef = useRef<'scatter' | 'chase'>('scatter');

  // Manual reset cycle function
  const resetGame = useCallback(() => {
    discoveryTrackerRef.current.reset();
    domainManagerRef.current.reset();

    const cmsAdapter = cmsAdapterRef.current;
    const freshGhosts = buildGhostStates(cmsAdapter, discoveryTrackerRef.current);

    setEngineState({
      phase: 'playing',
      pacman: {
        col: GameConfig.pacManStart[0],
        row: GameConfig.pacManStart[1],
        px: GameConfig.pacManStart[0] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        py: GameConfig.pacManStart[1] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
        direction: 'right',
        nextDirection: 'right',
        moveProgress: 0,
        prevCol: GameConfig.pacManStart[0],
        prevRow: GameConfig.pacManStart[1],
        mouthPhase: 0.5,
      },
      ghosts: freshGhosts,
      drops: [],
      collected: [],
      discoveredCount: 0,
      totalSkillsCount: cmsAdapter.getTotalSkillsCount(),
      pauseRemaining: 0,
      completionCountdown: 0,
    });
  }, [buildGhostStates]);

  // Main autonomous engine loop
  const updateGame = useCallback(() => {
    if (isPaused) return;

    setEngineState(prev => {
      const delta = 1 / GameConfig.fps;
      frameCountRef.current++;

      // 1. Completion State Handling
      if (prev.phase === 'completed') {
        const newCountdown = prev.completionCountdown - delta;
        if (newCountdown <= 0) {
          // Auto restart cycle
          discoveryTrackerRef.current.reset();
          domainManagerRef.current.reset();
          const cmsAdapter = cmsAdapterRef.current;
          const freshGhosts = buildGhostStates(cmsAdapter, discoveryTrackerRef.current);

          return {
            ...prev,
            phase: 'playing',
            ghosts: freshGhosts,
            drops: [],
            collected: [],
            discoveredCount: 0,
            pauseRemaining: 0,
            completionCountdown: 0,
          };
        }
        return { ...prev, completionCountdown: newCountdown };
      }

      if (prev.phase !== 'playing') return prev;

      // 2. Storytelling Pause (1.8s freeze after collecting a capsule)
      if (prev.pauseRemaining > 0) {
        return {
          ...prev,
          pauseRemaining: Math.max(0, prev.pauseRemaining - delta),
        };
      }

      // 3. Move Pac-Man Autopilot (BFS) — only every pacMoveEvery frames
      let newPacMan = { ...prev.pacman };
      let pacDir = newPacMan.direction;

      const shouldMovePac = frameCountRef.current % pacMoveEvery === 0;
      if (shouldMovePac) {
        if (frameCountRef.current % (pacMoveEvery * GameConfig.bfsRecomputeEvery) === 0) {
          pacDir = PacManAI.computeNextDirection(newPacMan, prev.ghosts);
        }
        const nextPacTile = MazeLayout.getNextTile(newPacMan.col, newPacMan.row, pacDir);
        if (MazeLayout.isWalkable(nextPacTile.col, nextPacTile.row)) {
          newPacMan.direction = pacDir;
          newPacMan.col = nextPacTile.col;
          newPacMan.row = nextPacTile.row;
          newPacMan.px = nextPacTile.col * MazeConfig.cellSize + MazeConfig.cellSize / 2;
          newPacMan.py = nextPacTile.row * MazeConfig.cellSize + MazeConfig.cellSize / 2;
        } else {
          // Try to find any walkable direction
          const dirs: Array<'up'|'down'|'left'|'right'> = ['up','down','left','right'];
          for (const d of dirs) {
            const t = MazeLayout.getNextTile(newPacMan.col, newPacMan.row, d);
            if (MazeLayout.isWalkable(t.col, t.row)) {
              newPacMan.direction = d;
              newPacMan.col = t.col;
              newPacMan.row = t.row;
              newPacMan.px = t.col * MazeConfig.cellSize + MazeConfig.cellSize / 2;
              newPacMan.py = t.row * MazeConfig.cellSize + MazeConfig.cellSize / 2;
              break;
            }
          }
        }
      }
      newPacMan.mouthPhase = (Math.sin(frameCountRef.current * 0.15) + 1) / 2;

      // 4. Move Ghosts & Detect Collisions — only every ghostMoveEvery frames
      const shouldMoveGhost = frameCountRef.current % ghostMoveEvery === 0;
      // Update scatter/chase mode timer
      modeTimerRef.current += (1 / GameConfig.fps) * 1000;
      const targetModeDuration = currentModeRef.current === 'scatter' ? GameConfig.scatterDuration : GameConfig.chaseDuration;
      if (modeTimerRef.current >= targetModeDuration) {
        modeTimerRef.current = 0;
        currentModeRef.current = currentModeRef.current === 'scatter' ? 'chase' : 'scatter';
      }
      const currentMode = currentModeRef.current;

      const blinkyPos = { col: prev.ghosts[0]?.col || 0, row: prev.ghosts[0]?.row || 0 };
      let newlyCollectedSkill: CollectedSkill | null = null;
      let newDrop: SkillDrop | null = null;

      let activeGhostsCount = 0;

      const newGhosts = prev.ghosts.map(ghost => {
        if (!ghost.active || ghost.mode === 'captured') return ghost;

        activeGhostsCount++;
        let g: GhostState = { ...ghost, mode: currentMode };

        if (shouldMoveGhost) {
          // Compute AI direction
          const nextDir = GhostAI.computeNextDirection(g, newPacMan, blinkyPos);
          const nextTile = MazeLayout.getNextTile(g.col, g.row, nextDir);

          if (MazeLayout.isWalkable(nextTile.col, nextTile.row)) {
            g.direction = nextDir;
            g.col = nextTile.col;
            g.row = nextTile.row;
            g.px = nextTile.col * MazeConfig.cellSize + MazeConfig.cellSize / 2;
            g.py = nextTile.row * MazeConfig.cellSize + MazeConfig.cellSize / 2;
          } else {
            // Unstick: try any valid direction
            const dirs: Array<'up'|'down'|'left'|'right'> = ['up','down','left','right'];
            for (const d of dirs) {
              if (d === g.direction) continue;
              const t = MazeLayout.getNextTile(g.col, g.row, d);
              if (MazeLayout.isWalkable(t.col, t.row)) {
                g.direction = d;
                g.col = t.col;
                g.row = t.row;
                g.px = t.col * MazeConfig.cellSize + MazeConfig.cellSize / 2;
                g.py = t.row * MazeConfig.cellSize + MazeConfig.cellSize / 2;
                break;
              }
            }
          }
        }

        // Collision check with Pac-Man
        const dx = Math.abs(g.px - newPacMan.px);
        const dy = Math.abs(g.py - newPacMan.py);

        if (dx < MazeConfig.cellSize * 0.8 && dy < MazeConfig.cellSize * 0.8) {
          // Capture Ghost / Knowledge Capsule!
          g.active = false;
          g.mode = 'captured';

          if (g.pendingSkill) {
            const skill = g.pendingSkill;
            discoveryTrackerRef.current.markDiscovered(skill.id);

            newDrop = {
              id: `${skill.id}-${Date.now()}`,
              skill,
              domain: g.domainNode,
              domainColor: g.color,
              ghostPx: g.px,
              ghostPy: g.py,
              createdAt: Date.now(),
            };

            newlyCollectedSkill = cmsAdapterRef.current.buildCollectedSkill(skill, g.domainNode, g.color);
            AnalyticsAdapter.trackEvent('skill_discovered', { skill: skill.name, domain: g.domainNode.name });
          }
        }

        return g;
      });

      const newDrops = newDrop ? [...prev.drops, newDrop] : prev.drops;
      const newCollected = newlyCollectedSkill ? [...prev.collected, newlyCollectedSkill] : prev.collected;
      const discoveredCount = discoveryTrackerRef.current.getDiscoveredCount();
      const isAllExplored = discoveryTrackerRef.current.isAllExplored();

      // Check if all active ghosts were captured, but skills remain to be discovered
      let updatedGhosts = newGhosts;
      if (!isAllExplored && activeGhostsCount <= 1 && newlyCollectedSkill) {
        // Respawn pending skills across remaining domains
        updatedGhosts = newGhosts.map(g => {
          if (!g.active || g.mode === 'captured') {
            const domainSkills = cmsAdapterRef.current.getSkillsForDomain(g.domainNode.id);
            const nextSkill = discoveryTrackerRef.current.getNextSkillToDiscover(domainSkills);
            if (nextSkill) {
              const spawnTile = GameConfig.ghostSpawnPositions[g.id % GameConfig.ghostSpawnPositions.length];
              return {
                ...g,
                active: true,
                mode: 'scatter' as GhostMode,
                pendingSkill: nextSkill,
                col: spawnTile[0],
                row: spawnTile[1],
                px: spawnTile[0] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
                py: spawnTile[1] * MazeConfig.cellSize + MazeConfig.cellSize / 2,
              };
            }
          }
          return g;
        });
      }

      return {
        ...prev,
        phase: isAllExplored ? 'completed' : 'playing',
        completionCountdown: isAllExplored ? GameConfig.completionDisplayMs / 1000 : 0,
        pauseRemaining: newlyCollectedSkill ? GameConfig.capturePauseMs / 1000 : 0,
        pacman: newPacMan,
        ghosts: updatedGhosts,
        drops: newDrops,
        collected: newCollected,
        discoveredCount,
      };
    });
  }, [isPaused, buildGhostStates]);

  useEffect(() => {
    const loop = () => {
      updateGame();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame]);

  return {
    engineState,
    resetGame,
  };
}
