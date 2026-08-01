import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreeNode, Project } from '../types/cms';
import {
  ChevronRight, Search, X, FolderGit2,
  Layers, Cpu, Code, BookOpen, Database, Wrench,
  Briefcase, Sparkles, Hash
} from 'lucide-react';

interface VerticalKnowledgeTreeProps {
  treeData: TreeNode;
  projects: Project[];
}

// ── Domain color palette (matches original tree data)
const DOMAIN_COLORS: Record<string, string> = {
  'domain-data-analytics': '#6366f1',
  'domain-software-dev':   '#3b82f6',
  'domain-ai-data':        '#10b981',
  'domain-ui-ux':          '#a855f7',
  'domain-professional':   '#f59e0b',
  'domain-domains-explored': '#f43f5e',
};

const getNodeIcon = (type: string, size = 14) => {
  const props = { size, strokeWidth: 1.75 };
  switch (type) {
    case 'domain':            return <Layers {...props} />;
    case 'skill':             return <Cpu {...props} />;
    case 'sub_skill':         return <Code {...props} />;
    case 'library':           return <BookOpen {...props} />;
    case 'database':          return <Database {...props} />;
    case 'framework':         return <Wrench {...props} />;
    case 'professional_skill':return <Briefcase {...props} />;
    case 'concept':           return <Hash {...props} />;
    default:                  return <Sparkles {...props} />;
  }
};

// ── Utilities
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

// Collect all node IDs that match search AND their ancestor IDs
function collectMatchingIds(node: TreeNode, q: string): Set<string> {
  const result = new Set<string>();
  function recurse(n: TreeNode, ancestorIds: string[]): boolean {
    const match = n.name.toLowerCase().includes(q) || (n.description ?? '').toLowerCase().includes(q);
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

// ── Sub-component: a single tree row
interface TreeRowProps {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isVisible: boolean;        // passes search filter
  isSearchMatch: boolean;    // exact match (not just ancestor)
  domainColor: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  nodeRef?: React.RefObject<HTMLDivElement | null>;
}

const TreeRow: React.FC<TreeRowProps> = ({
  node, depth, isExpanded, isSelected, isVisible, isSearchMatch,
  domainColor, onToggle, onSelect, nodeRef
}) => {
  if (!isVisible) return null;
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div
      ref={nodeRef as React.RefObject<HTMLDivElement>}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={`tree-node ${isSelected ? 'selected' : ''} ${isSearchMatch && !isSelected ? 'bg-indigo-500/5 border-indigo-500/10' : ''}`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={() => onSelect(node.id)}
    >
      {/* Expand caret */}
      {hasChildren ? (
        <button
          tabIndex={-1}
          className="shrink-0 p-0.5 rounded text-neutral-600 hover:text-neutral-300 transition-colors"
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            <ChevronRight size={13} strokeWidth={2} />
          </motion.span>
        </button>
      ) : (
        <span className="w-5 shrink-0" />
      )}

      {/* Type icon */}
      <span
        className="shrink-0"
        style={{ color: isSelected ? domainColor : depth === 1 ? domainColor : '#6b7280' }}
      >
        {getNodeIcon(node.type)}
      </span>

      {/* Label */}
      <span className={`truncate text-sm leading-none ${
        depth === 1
          ? 'font-semibold text-white'
          : isSelected
          ? 'text-white font-medium'
          : isSearchMatch
          ? 'text-neutral-100'
          : 'text-neutral-400'
      }`}>
        {node.name}
      </span>

      {/* Right: experience badge + child count */}
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {node.experienceLevel && isSelected && (
          <span className="chip chip-accent text-[10px] hidden sm:inline-flex">{node.experienceLevel}</span>
        )}
        {hasChildren && (
          <span className="text-[10px] font-mono text-neutral-700 tabular-nums">{node.children!.length}</span>
        )}
      </div>
    </div>
  );
};

// ── Sub-component: recursively render children
interface TreeBranchProps {
  node: TreeNode;
  depth: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  matchingIds: Set<string>;
  exactMatchIds: Set<string>;
  domainMap: Map<string, string>; // nodeId → domainColor
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  selectedRef: React.RefObject<HTMLDivElement | null>;
  isSearching: boolean;
}

const TreeBranch: React.FC<TreeBranchProps> = ({
  node, depth, expandedIds, selectedId, matchingIds, exactMatchIds,
  domainMap, onToggle, onSelect, selectedRef, isSearching
}) => {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isVisible = !isSearching || matchingIds.has(node.id);
  const isSearchMatch = exactMatchIds.has(node.id);
  const domainColor = domainMap.get(node.id) || '#6366f1';
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
        domainColor={domainColor}
        onToggle={onToggle}
        onSelect={onSelect}
        nodeRef={isSelected ? selectedRef : undefined}
      />

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
              {node.children!.map(child => (
                <TreeBranch
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  matchingIds={matchingIds}
                  exactMatchIds={exactMatchIds}
                  domainMap={domainMap}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  selectedRef={selectedRef}
                  isSearching={isSearching}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

// ── Main component
export const VerticalKnowledgeTree: React.FC<VerticalKnowledgeTreeProps> = ({ treeData, projects }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Start with root and all domain children expanded
    const ids = new Set<string>([treeData.id]);
    treeData.children?.forEach(d => ids.add(d.id));
    return ids;
  });
  const [selectedId, setSelectedId] = useState<string | null>(treeData.id);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Build domainColor map (nodeId → color) once
  const domainMap = React.useMemo(() => {
    const map = new Map<string, string>();
    function walk(node: TreeNode, color: string) {
      map.set(node.id, color);
      node.children?.forEach(c => walk(c, node.type === 'domain' ? (node.color || DOMAIN_COLORS[node.id] || color) : color));
    }
    walk(treeData, '#6366f1');
    return map;
  }, [treeData]);

  // Search: compute matching IDs
  const q = searchTerm.toLowerCase().trim();
  const matchingIds = React.useMemo(() => q ? collectMatchingIds(treeData, q) : new Set<string>(), [treeData, q]);
  
  // Exact match IDs (the node itself matches, not just an ancestor)
  const exactMatchIds = React.useMemo(() => {
    if (!q) return new Set<string>();
    const result = new Set<string>();
    function walk(node: TreeNode) {
      if (node.name.toLowerCase().includes(q) || (node.description ?? '').toLowerCase().includes(q)) result.add(node.id);
      node.children?.forEach(walk);
    }
    walk(treeData);
    return result;
  }, [treeData, q]);

  // Auto-expand matching branches on search
  useEffect(() => {
    if (!q) return;
    setExpandedIds(prev => {
      const next = new Set(prev);
      matchingIds.forEach(id => next.add(id));
      return next;
    });
  }, [matchingIds, q]);

  // Auto-scroll to selected node
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const expandAll = () => {
    const ids = new Set<string>();
    function walk(n: TreeNode) { ids.add(n.id); n.children?.forEach(walk); }
    walk(treeData);
    setExpandedIds(ids);
  };

  const collapseAll = () => {
    setExpandedIds(new Set([treeData.id]));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedId) return;
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
      if (expandedIds.has(selectedId)) handleToggle(selectedId);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if ((node.children?.length ?? 0) > 0) handleToggle(selectedId);
    }
  };

  // Derived: selected node data
  const selectedNode = selectedId ? findNode(treeData, selectedId) : null;
  const breadcrumb = selectedId ? (findBreadcrumb(treeData, selectedId) ?? []) : [];
  const domainColor = domainMap.get(selectedId ?? '') || '#6366f1';

  const relatedProjects = selectedNode
    ? projects.filter(p =>
        p.visibility && (
          p.techStack.some(t => t.toLowerCase() === selectedNode.name.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase() === selectedNode.name.toLowerCase())
        ))
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-4" onKeyDown={handleKeyDown}>
      {/* ── LEFT: Tree Explorer */}
      <div className="lg:w-[55%] flex flex-col gap-3">
        {/* Search + Expand/Collapse toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search skills, libraries, concepts…"
              className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={expandAll} className="btn-ghost text-xs py-1.5 px-3 whitespace-nowrap">Expand all</button>
            <button onClick={collapseAll} className="btn-ghost text-xs py-1.5 px-3 whitespace-nowrap">Collapse</button>
          </div>
        </div>

        {/* Tree container */}
        <div
          role="tree"
          aria-label="Knowledge Tree"
          className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-2 max-h-[640px] overflow-y-auto"
          style={{ minHeight: 360 }}
        >
          {/* Root node children directly */}
          {treeData.children?.map(domain => (
            <TreeBranch
              key={domain.id}
              node={domain}
              depth={1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              matchingIds={matchingIds}
              exactMatchIds={exactMatchIds}
              domainMap={domainMap}
              onToggle={handleToggle}
              onSelect={handleSelect}
              selectedRef={selectedRef}
              isSearching={!!q}
            />
          ))}
        </div>

        <p className="text-xs text-neutral-700 font-mono px-1">
          ↑↓ navigate · → expand · ← collapse · click to inspect
        </p>
      </div>

      {/* ── RIGHT: Inspector Panel */}
      <div className="lg:w-[45%]">
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-5 h-full max-h-[700px] overflow-y-auto space-y-5"
            >
              {/* Breadcrumb */}
              {breadcrumb.length > 1 && (
                <div className="flex items-center gap-1 flex-wrap text-xs text-neutral-600">
                  {breadcrumb.slice(1).map((b, i, arr) => (
                    <React.Fragment key={b.id}>
                      <button
                        onClick={() => setSelectedId(b.id)}
                        className={`hover:text-neutral-300 transition-colors truncate max-w-[100px] ${i === arr.length - 1 ? 'text-white' : ''}`}
                      >
                        {b.name}
                      </button>
                      {i < arr.length - 1 && <ChevronRight size={10} className="text-neutral-700 shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Header */}
              <div className="pb-4 border-b border-[#1a1a1a]">
                <div className="flex items-start gap-3">
                  <span style={{ color: domainColor }} className="mt-0.5 shrink-0">
                    {getNodeIcon(selectedNode.type, 20)}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{selectedNode.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 font-mono capitalize">{selectedNode.type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                {selectedNode.experienceLevel && (
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                    <p className="text-[10px] font-mono text-neutral-600 uppercase mb-1">Experience</p>
                    <p className="text-sm font-semibold text-emerald-400">{selectedNode.experienceLevel}</p>
                  </div>
                )}
                {selectedNode.yearsOfExperience !== undefined && (
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                    <p className="text-[10px] font-mono text-neutral-600 uppercase mb-1">Years</p>
                    <p className="text-sm font-semibold text-white">{selectedNode.yearsOfExperience}+ yrs</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedNode.description && (
                <div>
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-2">Overview</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{selectedNode.description}</p>
                </div>
              )}

              {/* Child concepts */}
              {selectedNode.children && selectedNode.children.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-2">
                    Includes ({selectedNode.children.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setSelectedId(child.id);
                          setExpandedIds(prev => new Set([...prev, selectedNode.id]));
                        }}
                        className="chip text-[11px] hover:border-indigo-500/30 hover:text-white transition-all cursor-pointer"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related skills */}
              {selectedNode.relatedSkills && selectedNode.relatedSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-2">Related Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.relatedSkills.map(s => (
                      <span key={s} className="chip chip-accent text-[11px]">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.tags.map(t => (
                      <span key={t} className="chip text-[11px]">#{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedNode.notes && (
                <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-1.5">Notes</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">{selectedNode.notes}</p>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="pt-3 border-t border-[#1a1a1a]">
                  <p className="text-[10px] font-mono text-neutral-600 uppercase mb-2 flex items-center gap-1.5">
                    <FolderGit2 size={10} /> Applied in Projects
                  </p>
                  <div className="space-y-2">
                    {relatedProjects.map(p => (
                      <div key={p.id} className="bg-[#111] border border-[#1a1a1a] rounded-lg px-3 py-2">
                        <p className="text-xs font-semibold text-white">{p.title}</p>
                        <p className="text-[11px] text-neutral-500">{p.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-8 h-full flex items-center justify-center"
            >
              <p className="text-sm text-neutral-700 text-center">
                Select a node from the tree<br />to view details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
