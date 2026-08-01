import React from 'react';
import { motion } from 'framer-motion';
import type { TreeNode, Project } from '../../types/cms';
import { VerticalKnowledgeTree } from '../VerticalKnowledgeTree';

interface SkillsSectionProps {
  skillTree: TreeNode;
  projects: Project[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillTree, projects }) => {
  return (
    <section id="skills" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label">
            <span>02</span>
            <span className="text-neutral-600">—</span>
            Technical Skills
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Knowledge Tree
            </h2>
            <p className="text-sm text-neutral-500 max-w-sm">
              Expand any branch to explore skills, libraries, and concepts. Select a node to view details.
            </p>
          </div>
        </motion.div>

        <VerticalKnowledgeTree treeData={skillTree} projects={projects} />
      </div>
    </section>
  );
};
