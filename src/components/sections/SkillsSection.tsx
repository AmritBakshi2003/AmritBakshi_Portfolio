import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreeNode, Project, ProjectLink } from '../../types/cms';
import { VerticalKnowledgeTree } from '../VerticalKnowledgeTree';
import { SkillExplorerDock } from '../tech-stack/SkillExplorerDock';
import type { SkillView } from '../tech-stack/SkillExplorerDock';

const SkillHuntGame = lazy(() => import('../skill-hunt/SkillHuntGame'));
const TechStackView = lazy(() => import('../tech-stack/TechStackView').then(m => ({ default: m.TechStackView })));

interface SkillsSectionProps {
  skillTree: TreeNode;
  projects: Project[];
  projectLinks: ProjectLink[];
  showSkillHunt?: boolean;
}

/** Recursively collect all skill names from the tree for ATS hidden list */
function collectSkillNames(node: TreeNode): string[] {
  const names: string[] = [node.name];
  if (node.children) {
    for (const child of node.children) {
      names.push(...collectSkillNames(child));
    }
  }
  return names;
}

const VIEW_META: Record<SkillView, { heading: string; description: string }> = {
  tree: {
    heading: 'Knowledge Tree',
    description: 'Expand any branch to explore skills, libraries, and concepts. Select a node to view details.',
  },
  stack: {
    heading: 'Tech Stack',
    description: 'Logo-first view of every technology I work with, grouped by domain.',
  },
  hunt: {
    heading: 'Skill Hunt',
    description: 'Watch Pac-Man dynamically explore and discover my technical skills across all domains!',
  },
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillTree, projects, projectLinks, showSkillHunt = true
}) => {
  const [view, setView] = useState<SkillView>('tree');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const allSkills = collectSkillNames(skillTree).filter(n => n !== skillTree.name);
  const meta = VIEW_META[view];

  return (
    <section id="skills" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Top row: label */}
          <p className="section-label">
            <span>02</span>
            <span className="text-neutral-600">—</span>
            Technical Skills
          </p>

          {/* Skill Explorer Dock — replaces old toggle button */}
          <SkillExplorerDock
            activeView={view}
            onViewChange={(v) => {
              // Clear highlight when navigating away from tree
              if (v !== 'tree') setHighlightedNodeId(null);
              setView(v);
            }}
            showSkillHunt={showSkillHunt}
          />

          {/* Heading + description — animates per view */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                {meta.heading}
              </h2>
              <p className="text-sm text-neutral-500 max-w-sm">
                {meta.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Hidden skills list for ATS crawlers */}
        <div aria-hidden="true" className="sr-only">
          <h3>Technical Skills &amp; Competencies</h3>
          <ul>
            {allSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* ── Main content — fade+slide between views ── */}
        <AnimatePresence mode="wait">

          {view === 'tree' && (
            <motion.div
              key="knowledge-tree"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <VerticalKnowledgeTree
                treeData={skillTree}
                projects={projects}
                projectLinks={projectLinks}
                highlightedNodeId={highlightedNodeId}
              />
            </motion.div>
          )}

          {view === 'stack' && (
            <motion.div
              key="tech-stack"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-64 flex items-center justify-center border border-[#1a1a1a] rounded-2xl bg-[#080808] text-neutral-500 text-sm">
                    Loading Tech Stack...
                  </div>
                }
              >
                <TechStackView
                  skillTree={skillTree}
                  projects={projects}
                  projectLinks={projectLinks}
                />
              </Suspense>
            </motion.div>
          )}

          {view === 'hunt' && (
            <motion.div
              key="skill-hunt"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-96 flex items-center justify-center border border-[#1a1a1a] rounded-2xl bg-[#080808] text-neutral-500 text-sm">
                    Loading Interactive Skill Hunt...
                  </div>
                }
              >
                <SkillHuntGame
                  treeData={skillTree}
                  projects={projects}
                  projectLinks={projectLinks}
                  onClose={() => setView('tree')}
                  onNavigateToNode={(nodeId) => {
                    // Switch to tree first so tree mounts, then set highlight
                    setView('tree');
                    setTimeout(() => setHighlightedNodeId(nodeId), 50);
                  }}
                />
              </Suspense>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
};
