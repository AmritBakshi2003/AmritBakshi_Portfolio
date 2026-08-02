import React, { useState } from 'react';
import type { TreeNode, NodeType, ExperienceLevel, Project, ProjectLink } from '../../types/cms';
import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Copy, 
  RotateCcw,
  RotateCw,
  FolderGit2,
  X
} from 'lucide-react';

interface TreeEditorProps {
  treeData: TreeNode;
  onUpdateTree: (newTree: TreeNode) => void;
  projectLinks: ProjectLink[];
  projects: Project[];
  onUpdateProjectLinks: (links: ProjectLink[]) => void;
}

export const TreeEditor: React.FC<TreeEditorProps> = ({
  treeData,
  onUpdateTree,
  projectLinks,
  projects,
  onUpdateProjectLinks,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(treeData.id);
  const [searchTerm, setSearchTerm] = useState('');

  // History stack for Undo/Redo
  const [history, setHistory] = useState<TreeNode[]>([treeData]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // "Applied in projects" add-link form state
  const [newLinkProjectId, setNewLinkProjectId] = useState('');
  const [newLinkUsage, setNewLinkUsage] = useState('');

  const pushHistory = (newTree: TreeNode) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newTree);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    onUpdateTree(newTree);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      onUpdateTree(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      onUpdateTree(history[nextIdx]);
    }
  };

  // Helper to find node in tree recursively
  const findNode = (node: TreeNode, targetId: string): TreeNode | null => {
    if (node.id === targetId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper to update node in tree recursively
  const updateNodeRecursive = (node: TreeNode, targetId: string, mutator: (n: TreeNode) => TreeNode): TreeNode => {
    if (node.id === targetId) return mutator(node);
    if (node.children) {
      return { ...node, children: node.children.map(child => updateNodeRecursive(child, targetId, mutator)) };
    }
    return node;
  };

  // Helper to delete node from tree recursively
  const deleteNodeRecursive = (node: TreeNode, targetId: string): TreeNode => {
    if (!node.children) return node;
    return {
      ...node,
      children: node.children
        .filter(child => child.id !== targetId)
        .map(child => deleteNodeRecursive(child, targetId))
    };
  };

  const handleAddChild = (parentId: string) => {
    const newChild: TreeNode = {
      id: `node_${Date.now()}`,
      name: "New Node",
      type: "skill",
      experienceLevel: "Intermediate",
      visibility: true,
      children: []
    };
    const updatedTree = updateNodeRecursive(treeData, parentId, parent => ({
      ...parent,
      isExpanded: true,
      children: [...(parent.children || []), newChild]
    }));
    pushHistory(updatedTree);
    setSelectedNodeId(newChild.id);
  };

  const handleDuplicateNode = (nodeId: string) => {
    const target = findNode(treeData, nodeId);
    if (!target) return;

    const duplicateRecursive = (n: TreeNode): TreeNode => ({
      ...n,
      id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${n.name} (Copy)`,
      children: n.children ? n.children.map(duplicateRecursive) : undefined
    });

    const dup = duplicateRecursive(target);
    const addSiblingRecursive = (parent: TreeNode): TreeNode => {
      if (parent.children && parent.children.some(c => c.id === nodeId)) {
        const idx = parent.children.findIndex(c => c.id === nodeId);
        const updatedChildren = [...parent.children];
        updatedChildren.splice(idx + 1, 0, dup);
        return { ...parent, children: updatedChildren };
      }
      if (parent.children) return { ...parent, children: parent.children.map(addSiblingRecursive) };
      return parent;
    };

    pushHistory(addSiblingRecursive(treeData));
  };

  const handleMoveSibling = (nodeId: string, direction: 'up' | 'down') => {
    const moveRecursive = (parent: TreeNode): TreeNode => {
      if (parent.children && parent.children.some(c => c.id === nodeId)) {
        const idx = parent.children.findIndex(c => c.id === nodeId);
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= parent.children.length) return parent;
        const updated = [...parent.children];
        const [moved] = updated.splice(idx, 1);
        updated.splice(newIdx, 0, moved);
        return { ...parent, children: updated };
      }
      if (parent.children) return { ...parent, children: parent.children.map(moveRecursive) };
      return parent;
    };
    pushHistory(moveRecursive(treeData));
  };

  const setAllExpanded = (expand: boolean) => {
    const setExpandRecursive = (n: TreeNode): TreeNode => ({
      ...n,
      isExpanded: expand,
      children: n.children ? n.children.map(setExpandRecursive) : undefined
    });
    pushHistory(setExpandRecursive(treeData));
  };

  const selectedNode = selectedNodeId ? findNode(treeData, selectedNodeId) : null;

  // Project links for the selected node
  const selectedNodeLinks = selectedNodeId
    ? projectLinks.filter(l => l.nodeId === selectedNodeId)
    : [];

  const handleAddLink = () => {
    if (!selectedNodeId || !newLinkProjectId.trim()) return;
    const newLink: ProjectLink = {
      id: `pl_${Date.now()}`,
      projectId: newLinkProjectId,
      nodeId: selectedNodeId,
      usage: newLinkUsage.trim(),
    };
    onUpdateProjectLinks([...projectLinks, newLink]);
    setNewLinkProjectId('');
    setNewLinkUsage('');
  };

  const handleRemoveLink = (linkId: string) => {
    onUpdateProjectLinks(projectLinks.filter(l => l.id !== linkId));
  };

  // Recursive Tree Node Renderer
  const RenderTreeItem: React.FC<{ node: TreeNode; depth: number }> = ({ node, depth }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;

    if (searchTerm.trim() !== '') {
      const matchName = node.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !hasChildren) return null;
    }

    return (
      <div className="select-none text-xs font-mono">
        <div
          onClick={() => setSelectedNodeId(node.id)}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition-colors group ${
            isSelected
              ? 'bg-cyan-950/80 border border-cyan-400/50 text-[#00f3ff]'
              : 'hover:bg-slate-900/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = updateNodeRecursive(treeData, node.id, n => ({ ...n, isExpanded: !n.isExpanded }));
                  onUpdateTree(updated);
                }}
                className="text-slate-400 hover:text-white p-0.5"
              >
                {node.isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-4 inline-block text-center text-slate-600">•</span>
            )}

            <span
              className="text-[9px] uppercase px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300"
              style={{ borderColor: node.color || undefined }}
            >
              {node.type}
            </span>
            <span className="font-medium truncate">{node.name}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleAddChild(node.id); }}
              className="p-1 rounded text-slate-400 hover:text-[#00f3ff]"
              title="Add Child Node"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {node.id !== treeData.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete node "${node.name}" and all sub-branches?`)) {
                    pushHistory(deleteNodeRecursive(treeData, node.id));
                  }
                }}
                className="p-1 rounded text-slate-400 hover:text-red-400"
                title="Delete Node"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {hasChildren && node.isExpanded && (
          <div className="space-y-0.5">
            {node.children!.map(child => (
              <RenderTreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: TREE EXPLORER (7 Cols) */}
      <div className="lg:col-span-7 cyber-card p-5 rounded-2xl space-y-4 flex flex-col h-[750px]">
        
        {/* Header & Undo/Redo */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#00f3ff]" />
            <h3 className="font-bold text-white text-base">Knowledge Tree File Explorer</h3>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleUndo} disabled={historyIdx === 0}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40" title="Undo">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={handleRedo} disabled={historyIdx >= history.length - 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40" title="Redo">
              <RotateCw className="w-4 h-4" />
            </button>
            <button onClick={setAllExpanded.bind(null, true)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300">
              Expand All
            </button>
            <button onClick={setAllExpanded.bind(null, false)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              Collapse All
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes in knowledge tree..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00f3ff]"
          />
        </div>

        {/* Tree Container */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <RenderTreeItem node={treeData} depth={0} />
        </div>
      </div>

      {/* RIGHT COLUMN: NODE PROPERTIES (5 Cols) */}
      <div className="lg:col-span-5 cyber-card p-5 rounded-2xl space-y-5 h-[750px] overflow-y-auto">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Edit3 className="w-5 h-5 text-purple-400" />
          Node Properties Inspector
        </h3>

        {selectedNode ? (
          <div className="space-y-4 text-xs font-mono">
            {/* Node Name */}
            <div>
              <label className="text-slate-400 block mb-1">Node Name</label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={e => {
                  pushHistory(updateNodeRecursive(treeData, selectedNode.id, n => ({ ...n, name: e.target.value })));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:border-purple-400 outline-none"
              />
            </div>

            {/* Type + Experience */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Node Type</label>
                <select
                  value={selectedNode.type}
                  onChange={e => {
                    pushHistory(updateNodeRecursive(treeData, selectedNode.id, n => ({ ...n, type: e.target.value as NodeType })));
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="domain">Domain</option>
                  <option value="skill">Skill</option>
                  <option value="sub_skill">Sub Skill</option>
                  <option value="library">Library</option>
                  <option value="concept">Concept</option>
                  <option value="tool">Tool</option>
                  <option value="framework">Framework</option>
                  <option value="database">Database</option>
                  <option value="soft_skill">Soft Skill</option>
                  <option value="professional_skill">Professional Skill</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Experience Level</label>
                <select
                  value={selectedNode.experienceLevel || 'Intermediate'}
                  onChange={e => {
                    pushHistory(updateNodeRecursive(treeData, selectedNode.id, n => ({ ...n, experienceLevel: e.target.value as ExperienceLevel })));
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Learning">Learning</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="text-slate-400 block mb-1">Accent Hex Color (for Domains)</label>
              <input
                type="color"
                value={selectedNode.color || '#00f3ff'}
                onChange={e => {
                  pushHistory(updateNodeRecursive(treeData, selectedNode.id, n => ({ ...n, color: e.target.value })));
                }}
                className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-400 block mb-1">Description / Summary</label>
              <textarea
                rows={3}
                value={selectedNode.description || ''}
                onChange={e => {
                  pushHistory(updateNodeRecursive(treeData, selectedNode.id, n => ({ ...n, description: e.target.value })));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
              />
            </div>

            {/* ── Applied in Projects panel */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-[#00f3ff] font-semibold flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                Applied in Projects
              </span>

              {/* Existing links */}
              {selectedNodeLinks.length === 0 ? (
                <p className="text-slate-600 text-[11px]">No project links for this node yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedNodeLinks.map(link => {
                    const proj = projects.find(p => p.id === link.projectId);
                    return (
                      <div key={link.id} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-[11px] font-semibold truncate">
                            {proj?.title ?? <span className="text-red-400">⚠ Project not found (stale link)</span>}
                          </p>
                          {link.usage && (
                            <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-2">{link.usage}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveLink(link.id)}
                          className="shrink-0 p-0.5 text-slate-600 hover:text-red-400 transition-colors"
                          title="Remove link"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new link form */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Link a Project</p>
                <select
                  value={newLinkProjectId}
                  onChange={e => setNewLinkProjectId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:border-cyan-500 outline-none"
                >
                  <option value="">— Select a project —</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  placeholder="Describe how this node was used in the project…"
                  value={newLinkUsage}
                  onChange={e => setNewLinkUsage(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:border-cyan-500 outline-none resize-none"
                />
                <button
                  onClick={handleAddLink}
                  disabled={!newLinkProjectId}
                  className="w-full py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] text-[11px] font-mono flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Project Link
                </button>
              </div>
            </div>

            {/* Node Operations */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-purple-300 font-semibold block mb-2">Node Operations</span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddChild(selectedNode.id)}
                  className="py-2 px-3 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] text-xs font-mono flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Child
                </button>

                <button
                  onClick={() => handleDuplicateNode(selectedNode.id)}
                  className="py-2 px-3 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 text-xs font-mono flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMoveSibling(selectedNode.id, 'up')}
                  className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5"
                >
                  <ArrowUp className="w-3.5 h-3.5" /> Move Up
                </button>

                <button
                  onClick={() => handleMoveSibling(selectedNode.id, 'down')}
                  className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5"
                >
                  <ArrowDown className="w-3.5 h-3.5" /> Move Down
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            Select a node from the tree explorer on the left to inspect and edit properties.
          </div>
        )}
      </div>
    </div>
  );
};
