import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { TreeNode, Project, ProjectLink } from '../../types/cms';
import { TechLogo } from './TechLogo';
import { TechDetailModal } from './TechDetailModal';

interface TechStackViewProps {
  skillTree: TreeNode;
  projects: Project[];
  projectLinks: ProjectLink[];
}

/** Structural category containers that exist purely to group cards */
const STRUCTURAL_CONTAINERS = new Set([
  'frontend', 'backend', 'dev-databases', 'deployment', 'bi-analytics-tools'
]);

/**
 * Recursively collect technology cards from a subtree.
 * - domain nodes & structural containers: skip the container itself, recurse to collect children
 * - concepts (e.g. SELECT, WHERE, Data Cleaning): skip
 * - technology nodes (skills, tools, frameworks, databases, libraries): return as cards!
 *   If a technology node also has child libraries/tools (e.g. Python -> Pandas, NumPy),
 *   include the parent technology AND recurse into its child libraries/tools.
 */
function collectTechCards(node: TreeNode): TreeNode[] {
  if (node.visibility === false) return [];

  if (node.type === 'domain' || STRUCTURAL_CONTAINERS.has(node.id)) {
    return (node.children ?? []).flatMap(collectTechCards);
  }

  if (node.type === 'concept') {
    return [];
  }

  // Real technology node (skill, tool, framework, database, library, professional_skill)
  const current = [node];
  const childCards = (node.children ?? []).flatMap(collectTechCards);

  return [...current, ...childCards];
}



const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.28, ease: 'easeOut' as const },
  }),
};

const DOMAIN_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

// ── Single Tech Card ──────────────────────────────────────────────────────────
interface TechCardProps {
  node: TreeNode;
  domainColor: string;
  index: number;
  onClick: (node: TreeNode) => void;
}

const TechCard: React.FC<TechCardProps> = ({ node, domainColor, index, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.04, y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(node)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col items-center gap-2.5 p-3.5 rounded-xl border bg-[#0f0f0f] cursor-pointer text-center transition-all duration-250 w-full"
      style={{
        borderColor: hovered ? `${domainColor}55` : '#1e1e1e',
        boxShadow: hovered ? `0 4px 20px ${domainColor}18` : '0 1px 3px rgba(0,0,0,0.3)',
      }}
      aria-label={`View details for ${node.name}`}
    >
      {/* Logo container */}
      <div
        className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200"
        style={{ background: hovered ? `${domainColor}15` : '#141414' }}
      >
        <TechLogo name={node.name} type={node.type} size={28} customIconUrl={node.icon} />
      </div>

      {/* Name */}
      <span className="text-[11px] font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight line-clamp-2 w-full">
        {node.name}
      </span>

      {/* Experience badge */}
      {node.experienceLevel && (
        <span
          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full font-mono"
          style={{
            background: `${domainColor}20`,
            color: domainColor,
            border: `1px solid ${domainColor}30`,
          }}
        >
          {node.experienceLevel}
        </span>
      )}
    </motion.button>
  );
};

// ── Domain Section ────────────────────────────────────────────────────────────
interface DomainSectionProps {
  domain: TreeNode;
  onCardClick: (node: TreeNode, domainColor: string) => void;
  domainIndex: number;
}

const DomainSection: React.FC<DomainSectionProps> = ({
  domain, onCardClick, domainIndex
}) => {
  const color = domain.color ?? '#888888';
  const cards = useMemo(() => {
    const raw = collectTechCards(domain);
    const seen = new Set<string>();
    return raw.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [domain]);

  if (cards.length === 0) return null;

  return (
    <motion.div
      variants={DOMAIN_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="space-y-4"
      style={{ animationDelay: `${domainIndex * 0.08}s` }}
    >
      {/* Domain header */}
      <div className="flex items-center gap-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
        />
        <h3
          className="text-sm font-bold tracking-wide uppercase"
          style={{ color }}
        >
          {domain.name}
        </h3>
        <div
          className="flex-1 h-px opacity-20"
          style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
        />
        <span className="text-[10px] font-mono text-neutral-600">{cards.length}</span>
      </div>

      {/* Cards grid — responsive: 2 mobile → 3 sm → 4 md → 6 lg → 8 xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
        {cards.map((card, i) => (
          <TechCard
            key={card.id}
            node={card}
            domainColor={color}
            index={i}
            onClick={(n) => onCardClick(n, color)}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ── Main TechStackView ────────────────────────────────────────────────────────
export const TechStackView: React.FC<TechStackViewProps> = ({
  skillTree, projects, projectLinks
}) => {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedDomainColor, setSelectedDomainColor] = useState('#F2C230');

  const visibleDomains = useMemo(
    () =>
      (skillTree.children ?? [])
        .filter(d => d.visibility !== false && d.type === 'domain')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [skillTree]
  );

  const handleCardClick = useCallback((node: TreeNode, domainColor: string) => {
    setSelectedNode(node);
    setSelectedDomainColor(domainColor);
  }, []);

  const handleModalClose = useCallback(() => setSelectedNode(null), []);

  return (
    <>
      {/* Domains */}
      <div className="space-y-8">
        {visibleDomains.map((domain, i) => (
          <DomainSection
            key={domain.id}
            domain={domain}
            onCardClick={handleCardClick}
            domainIndex={i}
          />
        ))}

        {visibleDomains.length === 0 && (
          <div className="text-center text-neutral-500 text-sm py-16">
            No domains visible. Enable domains in the Admin CMS.
          </div>
        )}
      </div>

      {/* Detail modal */}
      <TechDetailModal
        node={selectedNode}
        domainColor={selectedDomainColor}
        projects={projects}
        projectLinks={projectLinks}
        onClose={handleModalClose}
      />
    </>
  );
};
