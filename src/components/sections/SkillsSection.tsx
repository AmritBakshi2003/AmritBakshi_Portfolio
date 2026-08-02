import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreeNode, Project, ProjectLink } from '../../types/cms';
import { VerticalKnowledgeTree } from '../VerticalKnowledgeTree';
import { Gamepad2 } from 'lucide-react';

const SkillHuntGame = lazy(() => import('../skill-hunt/SkillHuntGame'));

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

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillTree, projects, projectLinks, showSkillHunt = true }) => {
  const [mode, setMode] = useState<'tree' | 'hunt'>('tree');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const allSkills = collectSkillNames(skillTree).filter(n => n !== skillTree.name);

  return (
    <section id="skills" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <p className="section-label">
              <span>02</span>
              <span className="text-neutral-600">—</span>
              Technical Skills
            </p>

            {/* Mode Switcher Toggle Button */}
            {showSkillHunt && (
              <button
                onClick={() => setMode(mode === 'tree' ? 'hunt' : 'tree')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#2a2a2a] hover:border-yellow-500/50 text-xs font-semibold text-neutral-200 hover:text-yellow-400 transition-all shadow-lg"
              >
                {mode === 'tree' ? (
                  <>
                    <Gamepad2 size={15} className="text-yellow-400" />
                    <span>Interactive Skill Hunt</span>
                  </>
                ) : (
                  <>
                    <span>Knowledge Tree View</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {mode === 'tree' ? 'Knowledge Tree' : 'Skill Hunt'}
            </h2>
            <p className="text-sm text-neutral-500 max-w-sm">
              {mode === 'tree'
                ? 'Expand any branch to explore skills, libraries, and concepts. Select a node to view details.'
                : 'Watch Pac-Man dynamically explore and discover technical skills across all domains!'}
            </p>
          </div>
        </motion.div>

        {/* Hidden skills list for ATS crawlers and search engines */}
        <div aria-hidden="true" className="sr-only">
          <h3>Technical Skills &amp; Competencies</h3>
          <ul>
            {allSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Main Content Area with Smooth Mode Transition */}
        <AnimatePresence mode="wait">
          {mode === 'tree' ? (
            <motion.div
              key="knowledge-tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <VerticalKnowledgeTree
                treeData={skillTree}
                projects={projects}
                projectLinks={projectLinks}
                highlightedNodeId={highlightedNodeId}
              />
            </motion.div>
          ) : (
            <motion.div
              key="skill-hunt"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
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
                  onClose={() => setMode('tree')}
                  onNavigateToNode={(nodeId) => {
                    // Switch to tree mode first so the tree mounts,
                    // then set the highlight on the next tick after mount
                    setMode('tree');
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
