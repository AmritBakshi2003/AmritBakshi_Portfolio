import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreeNode, Project, ProjectLink } from '../types/cms';
import { BrandLogo } from './common/BrandLogo';
import {
  ChevronRight, Search, X, FolderGit2, ExternalLink
} from 'lucide-react';

interface VerticalKnowledgeTreeProps {
  treeData: TreeNode;
  projects: Project[];
  projectLinks: ProjectLink[];
  highlightedNodeId?: string | null;
}

// ── Yellow Accent Color Constant ──
const YELLOW_ACCENT = '#F2C230';
const DIM_LINE_COLOR = '#3a3a3a';
const EXPAND_STORAGE_KEY = 'kt_expand_state';

function loadExpandState(defaultIds: Set<string>): Set<string> {
  try {
    const raw = localStorage.getItem(EXPAND_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch (_) { }
  return defaultIds;
}

function saveExpandState(ids: Set<string>) {
  try {
    localStorage.setItem(EXPAND_STORAGE_KEY, JSON.stringify([...ids]));
  } catch (_) { }
}

function findNode(node: TreeNode, id: string): TreeNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function findBreadcrumb(node: TreeNode, id: string, path: TreeNode[] = []): TreeNode[] | null {
  const next = [...path, node];
  if (node.id === id) return next;
  for (const child of node.children ?? []) {
    const found = findBreadcrumb(child, id, next);
    if (found) return found;
  }
  return null;
}

// Ordered list of visible node IDs for keyboard nav
function collectVisibleIds(
  node: TreeNode,
  expandedIds: Set<string>,
  isSearching: boolean,
  matchingIds: Set<string>,
  result: string[] = []
): string[] {
  const isVisible = !isSearching || matchingIds.has(node.id);
  if (!isVisible) return result;
  result.push(node.id);
  if (expandedIds.has(node.id) && node.children) {
    for (const child of node.children) {
      collectVisibleIds(child, expandedIds, isSearching, matchingIds, result);
    }
  }
  return result;
}

// Search matching node IDs + ancestors + project title matches
function collectMatchingIds(
  node: TreeNode,
  q: string,
  projectLinks: ProjectLink[],
  projects: Project[]
): Set<string> {
  const result = new Set<string>();
  function recurse(n: TreeNode, ancestorIds: string[]): boolean {
    const nameMatch = n.name.toLowerCase().includes(q) || (n.description ?? '').toLowerCase().includes(q);
    const projectMatch = projectLinks
      .filter(l => l.nodeId === n.id)
      .some(l => {
        const proj = projects.find(p => p.id === l.projectId);
        return proj?.title.toLowerCase().includes(q) || proj?.category.toLowerCase().includes(q);
      });
    const match = nameMatch || projectMatch;
    let childMatch = false;
    const nextAncestors = [...ancestorIds, n.id];
    for (const child of n.children ?? []) {
      if (recurse(child, nextAncestors)) childMatch = true;
    }
    if (match || childMatch) {
      result.add(n.id);
      ancestorIds.forEach(a => result.add(a));
    }
    return match || childMatch;
  }
  recurse(node, []);
  return result;
}

// Active path derivation — strict ancestor chain highlighting (stops at collapsed ancestor nodes)
function deriveActivePath(
  treeData: TreeNode,
  selectedId: string | null,
  expandedIds: Set<string>
): Set<string> {
  if (!selectedId) return new Set();
  const chain = findBreadcrumb(treeData, selectedId) ?? [];
  const activePath = new Set<string>();

  for (const n of chain) {
    activePath.add(n.id);
    // Skip early-stop check for the root node — it is never stored in expandedIds
    // but is always conceptually expanded (its children are the visible domain rows).
    if (n.id === treeData.id) continue;
    // If an intermediate ancestor has children but is NOT expanded, stop here
    if (n.id !== selectedId && (n.children?.length ?? 0) > 0 && !expandedIds.has(n.id)) {
      break;
    }
  }
  return activePath;
}


// ── Helper to calculate strict route active states for connector lines ──
function getActiveLineStates(
  treeData: TreeNode,
  activePath: Set<string>,
  nodeId: string,
  ancestorIds: string[],
  depth: number
) {
  const lineStates: Array<{
    isTopVerticalActive: boolean;
    isBottomVerticalActive: boolean;
    isElbowActive: boolean;
  }> = [];

  for (let d = 0; d < depth; d++) {
    const parentId = ancestorIds[d];
    if (!parentId || !activePath.has(parentId)) {
      lineStates.push({ isTopVerticalActive: false, isBottomVerticalActive: false, isElbowActive: false });
      continue;
    }

    const parentNode = findNode(treeData, parentId);
    if (!parentNode || !parentNode.children) {
      lineStates.push({ isTopVerticalActive: false, isBottomVerticalActive: false, isElbowActive: false });
      continue;
    }

    const activeChild = parentNode.children.find(c => activePath.has(c.id));
    if (!activeChild) {
      lineStates.push({ isTopVerticalActive: false, isBottomVerticalActive: false, isElbowActive: false });
      continue;
    }

    const activeChildIdx = parentNode.children.findIndex(c => c.id === activeChild.id);
    const currentBranchChildId = (d + 1 < ancestorIds.length) ? ancestorIds[d + 1] : nodeId;
    const currentBranchChildIdx = parentNode.children.findIndex(c => c.id === currentBranchChildId);

    if (currentBranchChildIdx < 0) {
      lineStates.push({ isTopVerticalActive: false, isBottomVerticalActive: false, isElbowActive: false });
      continue;
    }

    const isElbow = (d === depth - 1);

    if (currentBranchChildIdx < activeChildIdx) {
      // Row is ABOVE active child: trunk passes down through this row to reach active child below
      lineStates.push({
        isTopVerticalActive: true,
        isBottomVerticalActive: true,
        isElbowActive: false
      });
    } else if (currentBranchChildIdx === activeChildIdx) {
      // Row IS the active child branch (or contains it)
      lineStates.push({
        isTopVerticalActive: true,
        isBottomVerticalActive: !isElbow, // If not elbow, trunk continues down into sub-branch; if elbow, trunk ends at elbow
        isElbowActive: isElbow
      });
    } else {
      // Row is BELOW active child branch: active path already turned off to active child above
      lineStates.push({
        isTopVerticalActive: false,
        isBottomVerticalActive: false,
        isElbowActive: false
      });
    }
  }

  return lineStates;
}

// ── Connector Guide Lines Component with Draw-in & Pulse Animations ──
interface ConnectorProps {
  depth: number;
  isLastSibling: boolean;
  activePath: Set<string>;
  nodeId: string;
  ancestorIds: string[];
  treeData: TreeNode;
}

const ConnectorLines: React.FC<ConnectorProps> = ({
  depth, isLastSibling, activePath, nodeId, ancestorIds, treeData
}) => {
  const lineStates = getActiveLineStates(treeData, activePath, nodeId, ancestorIds, depth);
  const segments: React.ReactNode[] = [];

  for (let d = 0; d < depth; d++) {
    const isElbow = (d === depth - 1);
    const state = lineStates[d] || { isTopVerticalActive: false, isBottomVerticalActive: false, isElbowActive: false };

    const topColor = state.isTopVerticalActive ? YELLOW_ACCENT : DIM_LINE_COLOR;
    const bottomColor = state.isBottomVerticalActive ? YELLOW_ACCENT : DIM_LINE_COLOR;
    const elbowColor = state.isElbowActive ? YELLOW_ACCENT : DIM_LINE_COLOR;

    segments.push(
      <span
        key={d}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100px',
          flexShrink: 0,
          alignSelf: 'stretch',
          position: 'relative',
        }}
      >
        {/* Vertical guide line (for ancestor levels before elbow) */}
        {!isElbow && (
          <span
            className={`kt-line-draw ${state.isTopVerticalActive ? 'kt-line-active' : ''}`}
            style={{
              position: 'absolute',
              left: '14px',
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: topColor,
              borderRadius: '1px',
            }}
          />
        )}

        {/* Elbow: top vertical + bottom vertical + horizontal arm + arrowhead */}
        {isElbow && (
          <>
            {/* Top vertical line */}
            <span
              className={`kt-line-draw ${state.isTopVerticalActive ? 'kt-line-active' : ''}`}
              style={{
                position: 'absolute',
                left: '14px',
                top: 0,
                height: '50%',
                width: '2px',
                backgroundColor: topColor,
                borderRadius: '1px',
              }}
            />
            {/* Bottom vertical line */}
            {!isLastSibling && (
              <span
                className={`kt-line-draw ${state.isBottomVerticalActive ? 'kt-line-active' : ''}`}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  bottom: 0,
                  width: '2px',
                  backgroundColor: bottomColor,
                  borderRadius: '1px',
                }}
              />
            )}
            {/* Horizontal elbow arm */}
            <span
              className={`kt-line-draw ${state.isElbowActive ? 'kt-line-active' : ''}`}
              style={{
                position: 'absolute',
                left: '14px',
                top: 'calc(50% - 1px)',
                width: '90px',
                height: '2px',
                backgroundColor: elbowColor,
                borderRadius: '1px',
              }}
            />
            {/* Arrowhead pointing right at line tip */}
            <svg
              width="8"
              height="10"
              viewBox="0 0 8 10"
              className={`kt-line-draw ${state.isElbowActive ? 'kt-line-active' : ''}`}
              style={{
                position: 'absolute',
                left: '100px',
                top: 'calc(50% - 5px)',
              }}
            >
              <polygon points="0,1 8,5 0,9" fill={elbowColor} />
            </svg>
          </>
        )}
      </span>
    );
  }
  return <>{segments}</>;
};

// ── Inline Detail Panel Component (Renders directly beneath clicked row) ──
interface InlineDetailPanelProps {
  node: TreeNode;
  treeData: TreeNode;
  projects: Project[];
  projectLinks: ProjectLink[];
  onSelectNode: (id: string) => void;
  onExpandParent: (parentId: string) => void;
  onClose: () => void;
}

const InlineDetailPanel: React.FC<InlineDetailPanelProps> = ({
  node, treeData, projects, projectLinks, onSelectNode, onExpandParent, onClose
}) => {
  const breadcrumb = findBreadcrumb(treeData, node.id) ?? [];
  const nodeLinks = projectLinks.filter(l => l.nodeId === node.id);
  const linkedProjectCards = nodeLinks
    .map(l => {
      const proj = projects.find(p => p.id === l.projectId);
      if (!proj) return null; // Null-guard for stale links
      return { link: l, proj };
    })
    .filter(Boolean) as Array<{ link: ProjectLink; proj: Project }>;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -6 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -6 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="overflow-hidden my-2 mx-1 rounded-xl border border-[#262626] bg-[#141414] p-4 text-xs shadow-xl relative"
    >
      {/* Breadcrumb Trail + Close Button */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#222]">
        {breadcrumb.length > 1 ? (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-400">
            {breadcrumb.slice(1).map((b, i, arr) => (
              <React.Fragment key={b.id}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(b.id);
                  }}
                  className={`hover:text-[#F2C230] transition-colors truncate max-w-[120px] ${i === arr.length - 1 ? 'text-[#F2C230] font-semibold' : 'text-neutral-400'
                    }`}
                >
                  {b.name}
                </button>
                {i < arr.length - 1 && <span className="text-neutral-600">›</span>}
              </React.Fragment>
            ))}
          </div>
        ) : <div />}

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#222] transition-colors shrink-0"
          title="Close details"
          aria-label="Close detail panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Header Info */}
      <div className="flex items-start gap-3 mb-3">
        <span className="mt-0.5 p-1.5 rounded-lg bg-[#222] text-[#F2C230] shrink-0">
          <BrandLogo name={node.name} type={node.type} size={18} />
        </span>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-white tracking-tight">{node.name}</h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize bg-[#222] text-neutral-300 border border-[#333]">
              {node.type.replace('_', ' ')}
            </span>
            {node.experienceLevel && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#2a2410] text-[#F2C230] border border-[#524115]">
                {node.experienceLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Overview Description */}
      {node.description && (
        <div className="mb-3 text-neutral-300 leading-relaxed text-xs">
          {node.description}
        </div>
      )}

      {/* Child Badges "Includes (N)" */}
      {node.children && node.children.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
            Includes ({node.children.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {node.children.map(child => (
              <button
                key={child.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onExpandParent(node.id);
                  onSelectNode(child.id);
                }}
                className="px-2 py-1 rounded bg-[#222] border border-[#333] text-neutral-300 hover:text-[#F2C230] hover:border-[#F2C230]/40 text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BrandLogo name={child.name} type={child.type} size={12} />
                <span>{child.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* "Applied in Projects" Cards */}
      {linkedProjectCards.length > 0 && (
        <div className="pt-3 border-t border-[#222]">
          <p className="text-[10px] font-mono text-[#F2C230] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
            <FolderGit2 size={12} />
            Applied in Projects ({linkedProjectCards.length})
          </p>
          <div className="space-y-2">
            {linkedProjectCards.map(({ link, proj }) => (
              <div
                key={link.id}
                className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-3 hover:border-[#444] transition-colors"
                style={{ borderLeft: `3px solid ${YELLOW_ACCENT}` }}
              >
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-white hover:text-[#F2C230] transition-colors flex items-center gap-1 group"
                >
                  <span>{proj.title}</span>
                  <ExternalLink size={11} className="opacity-60 group-hover:opacity-100 text-[#F2C230] transition-opacity" />
                </a>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{proj.category}</p>
                {link.usage && (
                  <p className="text-[11px] text-neutral-300 leading-relaxed mt-1.5 pt-1.5 border-t border-[#262626]">
                    {link.usage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── Single Tree Row Component ──
interface TreeRowProps {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isVisible: boolean;
  isSearchMatch: boolean;
  isOnActivePath: boolean;
  isLastSibling: boolean;
  ancestorIds: string[];
  activePath: Set<string>;
  treeData: TreeNode;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  nodeRef?: React.RefObject<HTMLDivElement | null>;
}

const TreeRow: React.FC<TreeRowProps> = ({
  node, depth, isExpanded, isSelected, isVisible, isSearchMatch,
  isOnActivePath, isLastSibling, ancestorIds, activePath, treeData,
  onToggle, onSelect, nodeRef
}) => {
  if (!isVisible) return null;
  const hasChildren = (node.children?.length ?? 0) > 0;
  const domainDepth = depth - 1; // 0 for domains

  return (
    <div
      ref={nodeRef as React.RefObject<HTMLDivElement>}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={`tree-node-v2 ${isSelected ? 'active-row' : isOnActivePath ? 'route-row' : ''} ${isSearchMatch && !isSelected && !isOnActivePath ? 'bg-[#222] border-[#444]' : ''
        }`}
      onClick={() => onSelect(node.id)}
    >
      {/* Connector lines for sub-domain depths */}
      {domainDepth > 0 && (
        <ConnectorLines
          depth={domainDepth}
          isLastSibling={isLastSibling}
          activePath={activePath}
          nodeId={node.id}
          ancestorIds={ancestorIds.slice(1)}
          treeData={treeData}
        />
      )}

      {/* Expand/Collapse Caret */}
      {hasChildren ? (
        <button
          tabIndex={-1}
          className="shrink-0 p-0.5 rounded text-neutral-500 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            <ChevronRight size={14} strokeWidth={2} style={{ color: isSelected || isOnActivePath ? YELLOW_ACCENT : undefined }} />
          </motion.span>
        </button>
      ) : (
        <span className="w-5 shrink-0" />
      )}

      {/* Brand or Type Icon */}
      <span
        className="shrink-0 transition-colors"
        style={{
          color: isSelected || isOnActivePath ? YELLOW_ACCENT : '#999999',
          filter: isSelected ? 'drop-shadow(0 0 4px rgba(242,194,48,0.4))' : isOnActivePath ? 'drop-shadow(0 0 3px rgba(242,194,48,0.25))' : undefined,
        }}
      >
        <BrandLogo name={node.name} type={node.type} size={15} />
      </span>

      {/* Node Name Label */}
      <span
        className={`truncate text-sm leading-none ml-1.5 ${depth === 1
          ? 'font-bold text-white'
          : isSelected
            ? 'font-bold text-white'
            : isOnActivePath
              ? 'font-medium text-neutral-100'
              : isSearchMatch
                ? 'text-neutral-200'
                : 'text-neutral-400'
          }`}
      >
        {node.name}
      </span>

      {/* Right side: Experience Badge + Children count */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {node.experienceLevel && (isSelected || isOnActivePath) && (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#2a2410] text-[#F2C230] border border-[#524115]">
            {node.experienceLevel}
          </span>
        )}
        {hasChildren && (
          <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#222] text-[#F2C230]' : 'text-neutral-500'
            }`}>
            {node.children!.length}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Recursive Branch Renderer with Inline Detail Panel ──
interface TreeBranchProps {
  node: TreeNode;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  matchingIds: Set<string>;
  exactMatchIds: Set<string>;
  activePath: Set<string>;
  treeData: TreeNode;
  projects: Project[];
  projectLinks: ProjectLink[];
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onExpandParent: (parentId: string) => void;
  selectedRef: React.RefObject<HTMLDivElement | null>;
  isSearching: boolean;
  ancestorIds: string[];
  isLastSibling: boolean;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node, depth, expandedIds, selectedId, matchingIds, exactMatchIds,
  activePath, treeData, projects, projectLinks, onToggle, onSelect,
  onExpandParent, selectedRef, isSearching, ancestorIds, isLastSibling
}) => {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isVisible = !isSearching || matchingIds.has(node.id);
  const isSearchMatch = exactMatchIds.has(node.id);
  const isOnActivePath = activePath.has(node.id);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <>
      <TreeRow
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isVisible={isVisible}
        isSearchMatch={isSearchMatch}
        isOnActivePath={isOnActivePath}
        isLastSibling={isLastSibling}
        ancestorIds={ancestorIds}
        activePath={activePath}
        treeData={treeData}
        onToggle={onToggle}
        onSelect={onSelect}
        nodeRef={isSelected ? selectedRef : undefined}
      />

      {/* Accordion Single Panel: Render Inline Detail Panel directly under the clicked row */}
      <AnimatePresence>
        {isSelected && (
          <InlineDetailPanel
            key={`inline-detail-${node.id}`}
            node={node}
            treeData={treeData}
            projects={projects}
            projectLinks={projectLinks}
            onSelectNode={onSelect}
            onExpandParent={onExpandParent}
            onClose={() => onSelect('')}
          />
        )}
      </AnimatePresence>

      {/* Children Sub-branch */}
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key={`branch-${node.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {node.children!.map((child, idx) => (
                <TreeBranch
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  matchingIds={matchingIds}
                  exactMatchIds={exactMatchIds}
                  activePath={activePath}
                  treeData={treeData}
                  projects={projects}
                  projectLinks={projectLinks}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onExpandParent={onExpandParent}
                  selectedRef={selectedRef}
                  isSearching={isSearching}
                  ancestorIds={[...ancestorIds, node.id]}
                  isLastSibling={idx === node.children!.length - 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

// ── Main Knowledge Tree v2 Component ──
export const VerticalKnowledgeTree: React.FC<VerticalKnowledgeTreeProps> = ({
  treeData, projects, projectLinks, highlightedNodeId
}) => {
  // Default expanded: all top domain nodes
  const defaultExpanded = useMemo(() => {
    const ids = new Set<string>();
    treeData.children?.forEach(d => ids.add(d.id));
    return ids;
  }, [treeData]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
    loadExpandState(defaultExpanded)
  );

  // Selected Node (Accordion Single-panel active node)
  const [selectedId, setSelectedId] = useState<string | null>(
    treeData.children?.[0]?.id ?? null
  );

  // Handle externally passed highlightedNodeId (e.g., navigation from Skill Hunt Game)
  // Uses double-rAF to ensure DOM has settled after re-mount before scrolling
  useEffect(() => {
    if (!highlightedNodeId) return;
    const breadcrumb = findBreadcrumb(treeData, highlightedNodeId);
    if (!breadcrumb) return;
    // Expand all ancestor nodes so the target is visible
    setExpandedIds(prev => {
      const next = new Set(prev);
      breadcrumb.forEach(n => next.add(n.id));
      saveExpandState(next);
      return next;
    });
    setSelectedId(highlightedNodeId);
    // Double-rAF: wait for React to commit + browser to paint before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }, [highlightedNodeId, treeData]);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Active path with strict ancestor route highlighting (respects expanded state)
  const activePath = useMemo(() =>
    deriveActivePath(treeData, selectedId, expandedIds),
    [treeData, selectedId, expandedIds]
  );

  // Search filter calculation
  const q = searchTerm.toLowerCase().trim();
  const matchingIds = useMemo(
    () => q ? collectMatchingIds(treeData, q, projectLinks, projects) : new Set<string>(),
    [treeData, q, projectLinks, projects]
  );
  const exactMatchIds = useMemo(() => {
    if (!q) return new Set<string>();
    const result = new Set<string>();
    function walk(node: TreeNode) {
      const nameMatch = node.name.toLowerCase().includes(q) || (node.description ?? '').toLowerCase().includes(q);
      const projectMatch = projectLinks
        .filter(l => l.nodeId === node.id)
        .some(l => {
          const proj = projects.find(p => p.id === l.projectId);
          return proj?.title.toLowerCase().includes(q);
        });
      if (nameMatch || projectMatch) result.add(node.id);
      node.children?.forEach(walk);
    }
    walk(treeData);
    return result;
  }, [treeData, q, projectLinks, projects]);

  // Auto-expand matching branches on search
  useEffect(() => {
    if (!q) return;
    setExpandedIds(prev => {
      const next = new Set(prev);
      matchingIds.forEach(id => next.add(id));
      return next;
    });
  }, [matchingIds, q]);

  // Scroll active item into view when selected via normal UI interactions
  useEffect(() => {
    // Only scroll if triggered by user interaction, not by the highlightedNodeId effect
    // which handles its own scroll via double-rAF above
    if (highlightedNodeId && selectedId === highlightedNodeId) return;
    requestAnimationFrame(() => {
      selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      const isCollapsing = next.has(id);
      if (isCollapsing) {
        next.delete(id);
        // If selectedId is id or a descendant inside id, deselect selectedId to close card & clear path
        setSelectedId(curr => {
          if (!curr) return null;
          if (curr === id) return null;
          const chain = findBreadcrumb(treeData, curr);
          if (chain && chain.some(n => n.id === id)) {
            return null;
          }
          return curr;
        });
      } else {
        next.add(id);
      }
      saveExpandState(next);
      return next;
    });
  }, [treeData]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setExpandedIds(prev => {
      const node = findNode(treeData, id);
      if (node && (node.children?.length ?? 0) > 0 && !prev.has(id)) {
        const next = new Set(prev);
        next.add(id);
        saveExpandState(next);
        return next;
      }
      return prev;
    });
  }, [treeData]);

  const handleExpandParent = useCallback((parentId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.add(parentId);
      saveExpandState(next);
      return next;
    });
  }, []);

  const expandAll = () => {
    const ids = new Set<string>();
    function walk(n: TreeNode) { ids.add(n.id); n.children?.forEach(walk); }
    walk(treeData);
    setExpandedIds(ids);
    saveExpandState(ids);
  };

  const collapseAll = () => {
    const ids = new Set<string>();
    treeData.children?.forEach(d => ids.add(d.id));
    setExpandedIds(ids);
    setSelectedId(null);
    saveExpandState(ids);
  };

  // Keyboard navigation visible rows array
  const visibleRows = useMemo(() => {
    const rows: string[] = [];
    treeData.children?.forEach(domain =>
      collectVisibleIds(domain, expandedIds, !!q, matchingIds, rows)
    );
    return rows;
  }, [treeData, expandedIds, q, matchingIds]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedId) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = visibleRows.indexOf(selectedId);
      if (idx === -1) return;
      const nextIdx = e.key === 'ArrowDown' ? Math.min(idx + 1, visibleRows.length - 1) : Math.max(idx - 1, 0);
      setSelectedId(visibleRows[nextIdx]);
      return;
    }

    const node = findNode(treeData, selectedId);
    if (!node) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if ((node.children?.length ?? 0) > 0) {
        if (!expandedIds.has(selectedId)) handleToggle(selectedId);
        else if (node.children![0]) setSelectedId(node.children![0].id);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (expandedIds.has(selectedId)) {
        handleToggle(selectedId);
      } else {
        const chain = findBreadcrumb(treeData, selectedId);
        if (chain && chain.length > 2) setSelectedId(chain[chain.length - 2].id);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if ((node.children?.length ?? 0) > 0) handleToggle(selectedId);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4" onKeyDown={handleKeyDown}>
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search skills, libraries, tools, projects…"
            className="w-full bg-[#111111] border border-[#222222] rounded-xl pl-10 pr-8 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F2C230]/60 transition-colors shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626] text-xs font-mono text-neutral-300 hover:text-[#F2C230] hover:border-[#F2C230]/40 transition-all whitespace-nowrap"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="px-3.5 py-2 rounded-xl bg-[#141414] border border-[#262626] text-xs font-mono text-neutral-400 hover:text-white hover:border-neutral-700 transition-all whitespace-nowrap"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Horizontal scroll wrapper — activates on small / mobile screens */}
      <div className="overflow-x-auto custom-tree-x-scrollbar rounded-2xl">
        {/* Main Single-Column Tree Container with Inline Panels & Smart Scrollbar */}
        <div
          role="tree"
          aria-label="Knowledge Tree"
          className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl p-4 min-h-[420px] max-h-[600px] overflow-y-auto custom-tree-scrollbar shadow-2xl space-y-1 scroll-smooth min-w-[560px]"
        >
          {treeData.children?.map((domain, idx) => (
            <TreeBranch
              key={domain.id}
              node={domain}
              depth={1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              matchingIds={matchingIds}
              exactMatchIds={exactMatchIds}
              activePath={activePath}
              treeData={treeData}
              projects={projects}
              projectLinks={projectLinks}
              onToggle={handleToggle}
              onSelect={handleSelect}
              onExpandParent={handleExpandParent}
              selectedRef={selectedRef}
              isSearching={!!q}
              ancestorIds={[treeData.id]}
              isLastSibling={idx === (treeData.children!.length - 1)}
            />
          ))}
        </div>
      </div>


      <p className="text-xs text-neutral-500 font-mono px-1">
        ↑↓ navigate · → expand · ← collapse · Enter toggle · click node to inspect details inline
      </p>
    </div>
  );
};
