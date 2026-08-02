import React, { useState } from 'react';
import type { PortfolioCMSData, Project, WorkExperience, Certification, Achievement, SectionVisibility } from '../../types/cms';
import { TreeEditor } from './TreeEditor';
import { MediaLibraryManager } from './MediaLibraryManager';
import { MediaPickerModal } from '../common/MediaPickerModal';
import { toMediaSrc } from '../../utils/mediaUrl';
import { 
  Lock, 
  Unlock, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  User, 
  Cpu, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Database,
  Image as ImageIcon,
  Trophy,
  Settings,
  FileText,
  X
} from 'lucide-react';

interface AdminCMSProps {
  data: PortfolioCMSData;
  onUpdateData: (newData: PortfolioCMSData) => void;
  onResetData: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  data,
  onUpdateData,
  onResetData
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeModule, setActiveModule] = useState<'tree' | 'profile' | 'projects' | 'experience' | 'certs' | 'achievements' | 'settings' | 'media' | 'backup'>('tree');
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState<PortfolioCMSData>(data);

  // State for Media Picker modal
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    targetEntity: 'project' | 'experience' | 'cert' | 'avatar' | null;
    targetId?: string;
  }>({ isOpen: false, targetEntity: null });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === formData.adminPasscode || pinInput === 'admin123') {
      setIsUnlocked(true);
      setPinError(false);
      setFormData(data);
    } else {
      setPinError(true);
    }
  };

  const handleSaveAll = () => {
    onUpdateData(formData);
    showNotification('Portfolio CMS State Synchronized & Saved to LocalStorage!');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amrit_bakshi_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Portfolio CMS JSON Backup Exported!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setFormData(imported);
        onUpdateData(imported);
        showNotification('JSON Backup Successfully Imported & Applied!');
      } catch (err) {
        alert('Invalid JSON file format!');
      }
    };
    reader.readAsText(file);
  };

  // --- SECRET PASSCODE AUTH SCREEN ---
  if (!isUnlocked) {
    return (
      <section className="w-full min-h-[80vh] flex items-center justify-center p-4">
        <div className="cyber-card max-w-md w-full rounded-2xl p-8 border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/60 mx-auto flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              SECRET ADMIN CMS
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Enter security PIN to manage knowledge tree, projects & media
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Security PIN (Default: admin123)"
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono text-white text-base focus:border-amber-400 focus:outline-none transition-all"
              />
              {pinError && (
                <p className="text-xs font-mono text-red-400 mt-1.5 animate-shake">
                  Invalid Passcode. Default PIN is admin123
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Authenticate & Unlock CMS
            </button>
          </form>

          <p className="text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-4">
            Secret Route Access • Unlinked from Public Website Navigation
          </p>
        </div>
      </section>
    );
  }

  // --- UNLOCKED ADMIN CMS ---
  return (
    <section className="w-full py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-xl font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Top HUD Controls */}
      <div className="cyber-card p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-500/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
            <Unlock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              PORTFOLIO CMS CONTROL PANEL
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                ACTIVE
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Manage hierarchical knowledge tree, projects, media library & credentials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all"
          >
            <Save className="w-4 h-4" />
            Save & Sync Live CMS
          </button>

          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-mono flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveModule('tree')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'tree'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Skill Tree CMS
        </button>

        <button
          onClick={() => setActiveModule('media')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'media'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#00f3ff]" />
          Media Library ({formData.mediaLibrary.length})
        </button>

        <button
          onClick={() => setActiveModule('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'profile'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Profile & Bio
        </button>

        <button
          onClick={() => setActiveModule('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'projects'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects ({formData.projects.length})
        </button>

        <button
          onClick={() => setActiveModule('experience')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'experience'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Work Experience ({formData.experiences.length})
        </button>

        <button
          onClick={() => setActiveModule('certs')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'certs'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Certifications ({formData.certifications.length})
        </button>

        <button
          onClick={() => setActiveModule('achievements')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'achievements'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Achievements ({formData.achievements?.length ?? 0})
        </button>

        <button
          onClick={() => setActiveModule('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'settings'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Site Visibility
        </button>

        <button
          onClick={() => setActiveModule('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeModule === 'backup'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-purple-400" />
          JSON Backup & Settings
        </button>
      </div>

      {/* --- MODULE 1: TREE EDITOR --- */}
      {activeModule === 'tree' && (
        <TreeEditor
          treeData={formData.skillTree}
          onUpdateTree={(newTree) => {
            setFormData({ ...formData, skillTree: newTree });
            showNotification('Knowledge Tree updated!');
          }}
          projectLinks={formData.projectLinks ?? []}
          projects={formData.projects}
          onUpdateProjectLinks={(links) => {
            setFormData({ ...formData, projectLinks: links });
            showNotification('Project links updated!');
          }}
        />
      )}

      {/* --- MODULE 2: MEDIA LIBRARY --- */}
      {activeModule === 'media' && (
        <MediaLibraryManager
          mediaLibrary={formData.mediaLibrary}
          onUpdateMediaLibrary={(updatedMedia) => {
            setFormData({ ...formData, mediaLibrary: updatedMedia });
            showNotification('Media Library updated!');
          }}
        />
      )}

      {/* --- MODULE 3: PROFILE EDITOR --- */}
      {activeModule === 'profile' && (
        <div className="cyber-card p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-[#00f3ff]" />
            Personal Details & Bio Editor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.profile.name}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Title / Designation</label>
              <input
                type="text"
                value={formData.profile.title}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, title: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Role Badge</label>
              <input
                type="text"
                value={formData.profile.lookingForRole}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, lookingForRole: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="text"
                value={formData.profile.email}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, email: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GitHub URL</label>
              <input
                type="text"
                value={formData.profile.github}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, github: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.profile.linkedin}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, linkedin: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Summary Bio</label>
            <textarea
              rows={4}
              value={formData.profile.summary}
              onChange={e => setFormData({ ...formData, profile: { ...formData.profile, summary: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
            />
          </div>
        </div>
      )}

      {/* --- MODULE 4: PROJECTS MANAGER --- */}
      {activeModule === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#00f3ff]" />
              Projects Manager
            </h3>

            <button
              onClick={() => {
                const newProj: Project = {
                  id: `proj_${Date.now()}`,
                  title: "New Project Title",
                  subtitle: "Project Subtitle",
                  period: "2026",
                  category: "Analytics & Engineering",
                  description: "Detailed description...",
                  highlights: ["Highlight 1"],
                  techStack: ["Python", "SQL"],
                  metrics: [],
                  githubUrl: "https://github.com",
                  liveUrl: "",
                  documentationUrl: "",
                  mediaIds: [],
                  tags: ["Analytics"],
                  visibility: true,
                  sortOrder: formData.projects.length + 1,
                  lastModified: new Date().toISOString().split('T')[0],
                  featured: true
                };
                setFormData({ ...formData, projects: [...formData.projects, newProj] });
                showNotification('New project created!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          {formData.projects.map((proj, pIdx) => (
            <div key={proj.id} className="cyber-card p-6 rounded-2xl space-y-4 relative border border-slate-800">
              <button
                onClick={() => {
                  const linkedCount = (formData.projectLinks ?? []).filter(l => l.projectId === proj.id).length;
                  const msg = linkedCount > 0
                    ? `"${proj.title}" is referenced in ${linkedCount} knowledge-tree skill link${linkedCount > 1 ? 's' : ''}. Deleting it will also remove those links. Continue?`
                    : `Delete project "${proj.title}"?`;
                  if (confirm(msg)) {
                    setFormData({
                      ...formData,
                      projects: formData.projects.filter(p => p.id !== proj.id),
                      projectLinks: (formData.projectLinks ?? []).filter(l => l.projectId !== proj.id),
                    });
                    showNotification('Project deleted — associated skill links also removed.');
                  }
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].title = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={proj.subtitle}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].subtitle = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Category & Period</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Category"
                      value={proj.category}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[pIdx].category = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="w-2/3 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Period"
                      value={proj.period}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[pIdx].period = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="w-1/3 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={proj.description}
                  onChange={e => {
                    const updated = [...formData.projects];
                    updated[pIdx].description = e.target.value;
                    setFormData({ ...formData, projects: updated });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                />
              </div>

              {/* URLs: GitHub, Live Demo, Documentation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#00f3ff] block mb-1">GitHub Repo Link</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={proj.githubUrl || ''}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].githubUrl = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-[#00f3ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#00f3ff] block mb-1">Live Demo Link</label>
                  <input
                    type="text"
                    placeholder="https://my-app.streamlit.app"
                    value={proj.liveUrl || ''}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].liveUrl = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-[#00f3ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Documentation Link</label>
                  <input
                    type="text"
                    placeholder="https://docs.my-project.com"
                    value={proj.documentationUrl || ''}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].documentationUrl = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              {/* Tech Stack & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={(proj.techStack || []).join(', ')}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].techStack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proj.featured}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[pIdx].featured = e.target.checked;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="accent-cyan-400"
                    />
                    Featured Project
                  </label>

                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proj.visibility}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[pIdx].visibility = e.target.checked;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="accent-cyan-400"
                    />
                    Visible on Portfolio
                  </label>
                </div>
              </div>
              {/* Project Metrics Editor */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00f3ff]">
                    Project Metrics & Key Statistics ({proj.metrics?.length || 0})
                  </span>
                  <button
                    onClick={() => {
                      const updated = [...formData.projects];
                      updated[pIdx].metrics = [...(updated[pIdx].metrics || []), { label: "Metric Label", value: "Value" }];
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400/50 text-[#00f3ff] text-xs font-mono flex items-center gap-1 hover:bg-cyan-900/60 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Metric
                  </button>
                </div>

                {proj.metrics && proj.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900">
                    {proj.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <input
                          type="text"
                          placeholder="Value (e.g. 94.3%)"
                          value={m.value}
                          onChange={e => {
                            const updated = [...formData.projects];
                            updated[pIdx].metrics[mIdx].value = e.target.value;
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="w-1/2 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Label (e.g. Accuracy)"
                          value={m.label}
                          onChange={e => {
                            const updated = [...formData.projects];
                            updated[pIdx].metrics[mIdx].label = e.target.value;
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="w-1/2 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300"
                        />
                        <button
                          onClick={() => {
                            const updated = [...formData.projects];
                            updated[pIdx].metrics = updated[pIdx].metrics.filter((_, i) => i !== mIdx);
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attach Media from Centralized Media Library */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300">
                    Attached Media Assets ({proj.mediaIds.length})
                  </span>
                  <button
                    onClick={() => setMediaPickerConfig({ isOpen: true, targetEntity: 'project', targetId: proj.id })}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-400/50 text-[#00f3ff] text-xs font-mono flex items-center gap-1.5 hover:bg-cyan-900/60 transition-all"
                  >
                    <ImageIcon className="w-4 h-4" /> Attach / Manage Media
                  </button>
                </div>

                {proj.mediaIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                    {proj.mediaIds.map(mId => {
                      const item = formData.mediaLibrary.find(m => m.id === mId);
                      if (!item) return null;
                      return (
                        <div key={mId} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
                          {item.type === 'pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-1 text-[#00f3ff]">
                              <FileText className="w-5 h-5" />
                              <span className="text-[8px] font-mono truncate max-w-[50px]">{item.name}</span>
                            </div>
                          ) : (
                            <img src={toMediaSrc(item.url)} alt={item.name} className="w-full h-full object-cover" />
                          )}
                          <button
                            onClick={() => {
                              const updated = [...formData.projects];
                              updated[pIdx].mediaIds = updated[pIdx].mediaIds.filter(id => id !== mId);
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove asset"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODULE 5: WORK EXPERIENCE MANAGER --- */}
      {activeModule === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Work Experience Manager
            </h3>

            <button
              onClick={() => {
                const newExp: WorkExperience = {
                  id: `exp_${Date.now()}`,
                  role: "Role Title",
                  company: "Company Name",
                  period: "2026",
                  bullets: ["Key achievement..."],
                  skillsUsed: ["Data Analytics"],
                  mediaIds: [],
                  visibility: true,
                  sortOrder: formData.experiences.length + 1,
                  lastModified: new Date().toISOString().split('T')[0]
                };
                setFormData({ ...formData, experiences: [...formData.experiences, newExp] });
                showNotification('Work experience position added!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Position
            </button>
          </div>

          {formData.experiences.map((exp, eIdx) => (
            <div key={exp.id} className="cyber-card cyber-card-purple p-6 rounded-2xl space-y-4 relative">
              <button
                onClick={() => {
                  setFormData({ ...formData, experiences: formData.experiences.filter(e => e.id !== exp.id) });
                  showNotification('Experience removed');
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Role</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={e => {
                      const updated = [...formData.experiences];
                      updated[eIdx].role = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => {
                      const updated = [...formData.experiences];
                      updated[eIdx].company = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Period</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={e => {
                      const updated = [...formData.experiences];
                      updated[eIdx].period = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODULE 6: CERTIFICATIONS MANAGER --- */}
      {activeModule === 'certs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Certifications & Credential Links Manager
            </h3>

            <button
              onClick={() => {
                const newCert: Certification = {
                  id: `cert_${Date.now()}`,
                  title: "Certification Title",
                  issuer: "Oracle / Deloitte",
                  issueDate: "2026",
                  credentialUrl: "https://oracle.com",
                  mediaIds: [],
                  skillsValidated: ["SQL", "Analytics"],
                  visibility: true,
                  sortOrder: formData.certifications.length + 1,
                  lastModified: new Date().toISOString().split('T')[0]
                };
                setFormData({ ...formData, certifications: [...formData.certifications, newCert] });
                showNotification('Certification added!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.certifications.map((cert, cIdx) => (
              <div key={cert.id} className="cyber-card p-5 rounded-2xl space-y-3 relative border border-amber-500/30">
                <button
                  onClick={() => {
                    setFormData({ ...formData, certifications: formData.certifications.filter(c => c.id !== cert.id) });
                    showNotification('Certification removed');
                  }}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Certification Title</label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={e => {
                        const updated = [...formData.certifications];
                        updated[cIdx].title = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Issuer & Issue Date</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Issuer"
                        value={cert.issuer}
                        onChange={e => {
                          const updated = [...formData.certifications];
                          updated[cIdx].issuer = e.target.value;
                          setFormData({ ...formData, certifications: updated });
                        }}
                        className="w-2/3 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Date"
                        value={cert.issueDate}
                        onChange={e => {
                          const updated = [...formData.certifications];
                          updated[cIdx].issueDate = e.target.value;
                          setFormData({ ...formData, certifications: updated });
                        }}
                        className="w-1/3 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-amber-400 block mb-1">Verification Link</label>
                  <input
                    type="text"
                    value={cert.credentialUrl || ''}
                    onChange={e => {
                      const updated = [...formData.certifications];
                      updated[cIdx].credentialUrl = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Skills Validated (comma separated)</label>
                  <input
                    type="text"
                    value={(cert.skillsValidated || []).join(', ')}
                    onChange={e => {
                      const updated = [...formData.certifications];
                      updated[cIdx].skillsValidated = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                {/* Attach Certificate Image/PDF from Media Library */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-300">
                      Attached Certificate File/Image ({cert.mediaIds?.length || 0})
                    </span>
                    <button
                      onClick={() => setMediaPickerConfig({ isOpen: true, targetEntity: 'cert', targetId: cert.id })}
                      className="px-3 py-1 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-center gap-1.5 hover:bg-amber-900/60 transition-all"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Attach Image / PDF
                    </button>
                  </div>

                  {cert.mediaIds && cert.mediaIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                      {cert.mediaIds.map(mId => {
                        const item = formData.mediaLibrary.find(m => m.id === mId);
                        if (!item) return null;
                        return (
                          <div key={mId} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-500/40 bg-slate-900 group">
                            {item.type === 'pdf' ? (
                              <div className="w-full h-full flex flex-col items-center justify-center p-1 text-amber-400">
                                <FileText className="w-5 h-5" />
                                <span className="text-[8px] font-mono truncate max-w-[50px]">{item.name}</span>
                              </div>
                            ) : (
                              <img src={toMediaSrc(item.url)} alt={item.name} className="w-full h-full object-cover" />
                            )}
                            <button
                              onClick={() => {
                                const updated = [...formData.certifications];
                                updated[cIdx].mediaIds = updated[cIdx].mediaIds.filter(id => id !== mId);
                                setFormData({ ...formData, certifications: updated });
                              }}
                              className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove certificate asset"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cert.visibility}
                      onChange={e => {
                        const updated = [...formData.certifications];
                        updated[cIdx].visibility = e.target.checked;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="accent-amber-400"
                    />
                    Visible on Portfolio
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODULE 7: JSON BACKUP & SETTINGS --- */}
      {activeModule === 'backup' && (
        <div className="cyber-card p-6 rounded-2xl space-y-6 border border-purple-500/40">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-5 h-5 text-purple-400" />
            JSON Backup, Deployment Sync & Reset Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <Download className="w-8 h-8 text-[#00f3ff] mx-auto" />
              <h4 className="font-bold text-white text-sm">Export Data JSON</h4>
              <p className="text-xs text-slate-400">Download current site CMS data as a JSON backup file.</p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] font-mono text-xs font-semibold hover:bg-cyan-900/50 transition-all"
              >
                Export JSON File
              </button>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Import Data JSON</h4>
              <p className="text-xs text-slate-400">Upload an existing JSON file backup to restore CMS data.</p>
              <label className="w-full py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-semibold hover:bg-emerald-900/50 cursor-pointer block">
                Import JSON File
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <RotateCcw className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Restore Resume Defaults</h4>
              <p className="text-xs text-slate-400">Reset CMS data back to original initial resume tree defaults.</p>
              <button
                onClick={() => {
                  if (confirm('Reset CMS to initial resume defaults?')) {
                    onResetData();
                    showNotification('Restored defaults!');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-300 font-mono text-xs font-semibold hover:bg-amber-900/50 transition-all"
              >
                Reset to Resume Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODULE 7: ACHIEVEMENTS MANAGER --- */}
      {activeModule === 'achievements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Achievements Manager
            </h3>
            <button
              onClick={() => {
                const newAch: Achievement = {
                  id: `ach_${Date.now()}`,
                  title: 'Achievement Title',
                  description: 'Describe this achievement...',
                  icon: '🏆',
                  link: '#',
                  mediaIds: [],
                  tags: [],
                  visibility: true,
                  sortOrder: (formData.achievements?.length ?? 0) + 1,
                };
                setFormData({ ...formData, achievements: [...(formData.achievements ?? []), newAch] });
                showNotification('Achievement added!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.achievements ?? []).map((ach, aIdx) => (
              <div key={ach.id} className="cyber-card p-5 rounded-2xl space-y-3 relative border border-amber-500/20">
                <button
                  onClick={() => {
                    setFormData({ ...formData, achievements: (formData.achievements ?? []).filter(a => a.id !== ach.id) });
                    showNotification('Achievement deleted');
                  }}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Icon</label>
                    <input
                      type="text"
                      value={ach.icon ?? ''}
                      onChange={e => {
                        const updated = [...(formData.achievements ?? [])];
                        updated[aIdx] = { ...updated[aIdx], icon: e.target.value };
                        setFormData({ ...formData, achievements: updated });
                      }}
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white text-center"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={ach.title}
                      onChange={e => {
                        const updated = [...(formData.achievements ?? [])];
                        updated[aIdx] = { ...updated[aIdx], title: e.target.value };
                        setFormData({ ...formData, achievements: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={ach.description}
                    onChange={e => {
                      const updated = [...(formData.achievements ?? [])];
                      updated[aIdx] = { ...updated[aIdx], description: e.target.value };
                      setFormData({ ...formData, achievements: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Link (optional)</label>
                  <input
                    type="text"
                    value={ach.link ?? ''}
                    onChange={e => {
                      const updated = [...(formData.achievements ?? [])];
                      updated[aIdx] = { ...updated[aIdx], link: e.target.value };
                      setFormData({ ...formData, achievements: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ach.visibility}
                      onChange={e => {
                        const updated = [...(formData.achievements ?? [])];
                        updated[aIdx] = { ...updated[aIdx], visibility: e.target.checked };
                        setFormData({ ...formData, achievements: updated });
                      }}
                      className="accent-cyan-400"
                    />
                    Visible on Portfolio
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODULE 8: SITE VISIBILITY SETTINGS --- */}
      {activeModule === 'settings' && (() => {
        const sv = formData.sectionVisibility;
        const updateSV = (key: keyof SectionVisibility, val: boolean) => {
          setFormData({ ...formData, sectionVisibility: { ...sv, [key]: val } });
        };
        const sections: { key: keyof SectionVisibility; label: string; desc: string }[] = [
          { key: 'hero',           label: 'Hero Section',         desc: 'Profile photo, name, tagline, and CTA buttons' },
          { key: 'about',          label: 'About Section',        desc: 'Bio text and specialization tags' },
          { key: 'skills',         label: 'Skills Knowledge Tree', desc: 'Hierarchical skill tree with inspector panel' },
          { key: 'skillHunt',      label: 'Interactive Skill Hunt (Pac-Man Showcase)', desc: 'Interactive Pac-Man showcase button & game feature' },
          { key: 'projects',       label: 'Projects Section',      desc: 'Featured and regular project cards' },
          { key: 'experience',     label: 'Work Experience',       desc: 'Timeline of roles and bullet points' },
          { key: 'certifications', label: 'Certifications',        desc: 'Credential cards with verification links' },
          { key: 'education',      label: 'Education',             desc: 'Academic background and degrees' },
          { key: 'achievements',   label: 'Achievements',          desc: 'Notable highlights and accomplishments' },
          { key: 'contact',        label: 'Contact Section',       desc: 'Email, phone, LinkedIn, GitHub, and resume download' },
        ];
        return (
          <div className="cyber-card p-6 rounded-2xl space-y-4 border border-cyan-500/20">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#00f3ff]" />
                Site Section Visibility
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Toggle which sections appear on the public portfolio. Changes take effect after clicking "Save &amp; Sync".
              </p>
            </div>
            <div className="space-y-2">
              {sections.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={sv?.[key] ?? true}
                      onChange={e => updateSV(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Shared Media Picker Modal */}
      {mediaPickerConfig.isOpen && (
        <MediaPickerModal
          isOpen={mediaPickerConfig.isOpen}
          onClose={() => setMediaPickerConfig({ isOpen: false, targetEntity: null })}
          mediaLibrary={formData.mediaLibrary}
          selectedMediaIds={
            mediaPickerConfig.targetEntity === 'project' && mediaPickerConfig.targetId
              ? formData.projects.find(p => p.id === mediaPickerConfig.targetId)?.mediaIds || []
              : mediaPickerConfig.targetEntity === 'cert' && mediaPickerConfig.targetId
              ? formData.certifications.find(c => c.id === mediaPickerConfig.targetId)?.mediaIds || []
              : []
          }
          onSelectMedia={(mediaId) => {
            if (mediaPickerConfig.targetEntity === 'project' && mediaPickerConfig.targetId) {
              const updated = formData.projects.map(p => {
                if (p.id === mediaPickerConfig.targetId) {
                  return { ...p, mediaIds: Array.from(new Set([...p.mediaIds, mediaId])) };
                }
                return p;
              });
              setFormData({ ...formData, projects: updated });
            } else if (mediaPickerConfig.targetEntity === 'cert' && mediaPickerConfig.targetId) {
              const updated = formData.certifications.map(c => {
                if (c.id === mediaPickerConfig.targetId) {
                  return { ...c, mediaIds: Array.from(new Set([...(c.mediaIds || []), mediaId])) };
                }
                return c;
              });
              setFormData({ ...formData, certifications: updated });
            }
          }}
          onDeselectMedia={(mediaId) => {
            if (mediaPickerConfig.targetEntity === 'project' && mediaPickerConfig.targetId) {
              const updated = formData.projects.map(p => {
                if (p.id === mediaPickerConfig.targetId) {
                  return { ...p, mediaIds: p.mediaIds.filter(m => m !== mediaId) };
                }
                return p;
              });
              setFormData({ ...formData, projects: updated });
            } else if (mediaPickerConfig.targetEntity === 'cert' && mediaPickerConfig.targetId) {
              const updated = formData.certifications.map(c => {
                if (c.id === mediaPickerConfig.targetId) {
                  return { ...c, mediaIds: (c.mediaIds || []).filter(m => m !== mediaId) };
                }
                return c;
              });
              setFormData({ ...formData, certifications: updated });
            }
          }}
          onUploadNewMedia={(newMedia) => {
            setFormData(prev => ({
              ...prev,
              mediaLibrary: [...prev.mediaLibrary, newMedia]
            }));
          }}
        />
      )}

    </section>
  );
};
