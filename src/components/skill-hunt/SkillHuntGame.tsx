import React, { useState } from 'react';
import type { TreeNode, Project, ProjectLink, WorkExperience, Certification } from '../../types/cms';
import { usePacManEngine } from './engine/usePacManEngine';
import { GameCanvas } from './ui/GameCanvas';
import { KnowledgeCollection } from './ui/KnowledgeCollection';
import { CompletionSummary } from './ui/CompletionSummary';
import { Controls } from './ui/Controls';
import { DomainLegend } from './ui/DomainLegend';

interface SkillHuntGameProps {
  treeData: TreeNode;
  projects?: Project[];
  projectLinks?: ProjectLink[];
  experience?: WorkExperience[];
  certifications?: Certification[];
  onClose: () => void;
  onNavigateToNode?: (nodeId: string) => void;
}

export const SkillHuntGame: React.FC<SkillHuntGameProps> = ({
  treeData,
  projects = [],
  projectLinks = [],
  experience = [],
  certifications = [],
  onClose,
  onNavigateToNode: _onNavigateToNode,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const { engineState, resetGame } = usePacManEngine({
    treeData,
    projects,
    projectLinks,
    experience,
    certifications,
    isPaused,
  });

  const uniqueDomainsCount = new Set(engineState.collected.map(c => c.domain.id)).size;

  return (
    <div className="relative w-full bg-[#080808] border border-[#1a1a1a] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-6">
      {/* Top Header & Controls */}
      <Controls
        isPaused={isPaused}
        discoveredCount={engineState.discoveredCount}
        totalSkillsCount={engineState.totalSkillsCount}
        onTogglePause={() => setIsPaused(!isPaused)}
        onClose={onClose}
      />

      {/* Main Experience Layout: Maze + Knowledge Collection */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
        {/* Left column: Game Canvas + Domain Legend below */}
        <div className="flex flex-col items-center shrink-0 gap-3">
          <div className="relative">
            <GameCanvas engineState={engineState} />

            {/* Completion Summary Overlay */}
            {engineState.phase === 'completed' && (
              <CompletionSummary
                totalDomainsExplored={uniqueDomainsCount || engineState.ghosts.length}
                totalSkillsDiscovered={engineState.discoveredCount}
                countdownSeconds={engineState.completionCountdown}
                onRestart={resetGame}
              />
            )}
          </div>

          {/* Domain Legend — colored ghost chips BELOW the maze, outside the map */}
          <DomainLegend ghosts={engineState.ghosts} />
        </div>

        {/* Knowledge Collection Side Panel */}
        <div className="w-full lg:w-[380px] shrink-0">
          <KnowledgeCollection
            collectedSkills={engineState.collected}
            totalSkillsCount={engineState.totalSkillsCount}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillHuntGame;
