import React, { useState } from 'react';
import type { 
  PortfolioData, 
  SkillNode, 
  Project, 
  WorkExperience, 
  Certification 
} from '../../types/portfolio';
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
  Database
} from 'lucide-react';

interface AdminPortalProps {
  data: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
  isUnlocked: boolean;
  onUnlock: (pin: string) => boolean;
  onLock: () => void;
  onResetData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  data,
  onUpdateData,
  isUnlocked,
  onUnlock,
  onLock,
  onResetData
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'profile' | 'skills' | 'projects' | 'experience' | 'certs' | 'backup'>('profile');
  const [notification, setNotification] = useState<string | null>(null);

  // Local state copy for editing
  const [formData, setFormData] = useState<PortfolioData>(data);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlock(pinInput)) {
      setPinError(false);
      setPinInput('');
      setFormData(data);
    } else {
      setPinError(true);
    }
  };

  const handleSaveAll = () => {
    onUpdateData(formData);
    showNotification('System State Successfully Synchronized & Persisted!');
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amrit_bakshi_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data JSON exported for static deployment backup!');
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setFormData(imported);
        onUpdateData(imported);
        showNotification('JSON Data successfully imported and synchronized!');
      } catch (err) {
        alert('Invalid JSON file format!');
      }
    };
    reader.readAsText(file);
  };

  // Profile Image Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setFormData(prev => ({
        ...prev,
        profile: { ...prev.profile, avatarUrl: base64 }
      }));
      showNotification('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  // --- LOCKED AUTHENTICATION BARRIER ---
  if (!isUnlocked) {
    return (
      <section className="w-full min-h-[70vh] flex items-center justify-center p-4">
        <div className="cyber-card max-w-md w-full rounded-2xl p-8 border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/60 mx-auto flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              ADMIN CONTROL CENTER
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Enter security PIN to edit portfolio skills, projects & bio
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: admin123)"
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
              Authenticate & Unlock
            </button>
          </form>

          <p className="text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-4">
            Security Protected • Full CRUD Edit Rights Granted Upon Unlock
          </p>
        </div>
      </section>
    );
  }

  // --- UNLOCKED ADMIN MANAGEMENT INTERFACE ---
  return (
    <section className="w-full py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-xl font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Admin Top HUD Controls */}
      <div className="cyber-card p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-500/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
            <Unlock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ADMIN CONTROL CENTER
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                ACTIVE SESSION
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Full editing rights enabled • Changes saved locally & deployable via JSON
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all"
          >
            <Save className="w-4 h-4" />
            Save & Sync Live State
          </button>

          <button
            onClick={onLock}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-mono flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            Lock Portal
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveAdminTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'profile'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Profile & Bio
        </button>

        <button
          onClick={() => setActiveAdminTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'skills'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Skills & Mindmap ({formData.skills.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'projects'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects ({formData.projects.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('experience')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'experience'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Work Experience ({formData.experiences.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('certs')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'certs'
              ? 'bg-cyan-950/80 text-[#00f3ff] border border-[#00f3ff]/50 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Certifications ({formData.certifications.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeAdminTab === 'backup'
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
              : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-purple-400" />
          JSON Sync & Backup
        </button>
      </div>

      {/* --- TAB 1: PROFILE EDITOR --- */}
      {activeAdminTab === 'profile' && (
        <div className="cyber-card p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-[#00f3ff]" />
            Personal Details & Hero Intro Editor
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
              <label className="block text-xs font-mono text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.profile.phone}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, phone: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.profile.location}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, location: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.profile.github}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, github: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.profile.linkedin}
                onChange={e => setFormData({ ...formData, profile: { ...formData.profile, linkedin: e.target.value } })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Professional Summary Bio</label>
            <textarea
              rows={4}
              value={formData.profile.summary}
              onChange={e => setFormData({ ...formData, profile: { ...formData.profile, summary: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-[#00f3ff] outline-none"
            />
          </div>

          {/* Profile Picture Uploader */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-6">
            <img
              src={formData.profile.avatarUrl || '/profile.jpg'}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border border-cyan-400"
            />
            <div className="space-y-1">
              <span className="text-xs font-mono text-white block">Upload / Change Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-950 file:text-[#00f3ff]"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: SKILLS & MINDMAP EDITOR --- */}
      {activeAdminTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00f3ff]" />
              Mindmap Skill Graph Topology & Sub-libraries
            </h3>

            <button
              onClick={() => {
                const newSkill: SkillNode = {
                  id: `skill_${Date.now()}`,
                  name: "New Skill",
                  categoryId: formData.categories[0].id,
                  proficiency: 80,
                  levelName: "Advanced",
                  description: "Skill description...",
                  libraries: [{ name: "Library 1", description: "Details" }],
                  crossDomains: [],
                  projectsUsedIn: []
                };
                setFormData({ ...formData, skills: [...formData.skills, newSkill] });
                showNotification('New skill node created!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Skill Node
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.skills.map((skill, idx) => (
              <div key={skill.id} className="cyber-card p-5 rounded-2xl space-y-3 relative border border-slate-800">
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      skills: formData.skills.filter(s => s.id !== skill.id)
                    });
                    showNotification('Skill node deleted');
                  }}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => {
                        const updated = [...formData.skills];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Department Category</label>
                    <select
                      value={skill.categoryId}
                      onChange={e => {
                        const updated = [...formData.skills];
                        updated[idx].categoryId = e.target.value;
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      {formData.categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Proficiency % ({skill.proficiency}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.proficiency}
                      onChange={e => {
                        const updated = [...formData.skills];
                        updated[idx].proficiency = parseInt(e.target.value);
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Level Tier</label>
                    <select
                      value={skill.levelName}
                      onChange={e => {
                        const updated = [...formData.skills];
                        updated[idx].levelName = e.target.value as any;
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="Expert">Expert</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Proficient">Proficient</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block">Description</label>
                  <textarea
                    rows={2}
                    value={skill.description}
                    onChange={e => {
                      const updated = [...formData.skills];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, skills: updated });
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  />
                </div>

                {/* Sub-libraries Editor */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold block mb-1">
                    Sub-libraries ({skill.libraries.length})
                  </span>
                  <div className="space-y-1.5">
                    {skill.libraries.map((lib, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Library Name"
                          value={lib.name}
                          onChange={e => {
                            const updated = [...formData.skills];
                            updated[idx].libraries[lIdx].name = e.target.value;
                            setFormData({ ...formData, skills: updated });
                          }}
                          className="flex-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                        />
                        <button
                          onClick={() => {
                            const updated = [...formData.skills];
                            updated[idx].libraries.splice(lIdx, 1);
                            setFormData({ ...formData, skills: updated });
                          }}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const updated = [...formData.skills];
                        updated[idx].libraries.push({ name: "New Tool", description: "" });
                        setFormData({ ...formData, skills: updated });
                      }}
                      className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 mt-1"
                    >
                      <Plus className="w-3 h-3" /> Add Sub-Library
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: PROJECTS MANAGER --- */}
      {activeAdminTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#00f3ff]" />
              Featured Projects Manager
            </h3>

            <button
              onClick={() => {
                const newProj: Project = {
                  id: `proj_${Date.now()}`,
                  title: "New Project",
                  subtitle: "Project subtitle",
                  period: "2026",
                  category: "Full Stack / Analytics",
                  description: "Project details...",
                  highlights: ["Metric bullet 1"],
                  techStack: ["Python", "React"],
                  metrics: [{ label: "Accuracy", value: "95%" }],
                  featured: true
                };
                setFormData({ ...formData, projects: [...formData.projects, newProj] });
                showNotification('New project added!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </button>
          </div>

          {formData.projects.map((proj, pIdx) => (
            <div key={proj.id} className="cyber-card p-6 rounded-2xl space-y-4 relative border border-slate-800">
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    projects: formData.projects.filter(p => p.id !== proj.id)
                  });
                  showNotification('Project removed');
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Project Title</label>
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
                  <label className="text-xs font-mono text-slate-400 block mb-1">Subtitle / Summary</label>
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

              {/* Live & Source Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Live App URL</label>
                  <input
                    type="text"
                    value={proj.liveUrl || ''}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].liveUrl = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={proj.githubUrl || ''}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[pIdx].githubUrl = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- TAB 4: WORK EXPERIENCE MANAGER --- */}
      {activeAdminTab === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Work Experience & Proof Media Manager
            </h3>

            <button
              onClick={() => {
                const newExp: WorkExperience = {
                  id: `exp_${Date.now()}`,
                  role: "Role Title",
                  company: "Company Name",
                  period: "2026",
                  bullets: ["Key achievement..."],
                  skillsUsed: ["Data Analysis"],
                  proofTitle: "Certificate of Experience",
                  proofMediaType: "link",
                  proofMediaUrl: "#"
                };
                setFormData({ ...formData, experiences: [...formData.experiences, newExp] });
                showNotification('Work position added!');
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
                  setFormData({
                    ...formData,
                    experiences: formData.experiences.filter(e => e.id !== exp.id)
                  });
                  showNotification('Experience removed');
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Role Title</label>
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

              {/* Experience Proof Media URL */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-purple-300 font-semibold block">
                  Proof Media / Recommendation Letter Link
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Proof Media / Certificate URL"
                    value={exp.proofMediaUrl || ''}
                    onChange={e => {
                      const updated = [...formData.experiences];
                      updated[eIdx].proofMediaUrl = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Proof Title (e.g. Aerwok Case Study)"
                    value={exp.proofTitle || ''}
                    onChange={e => {
                      const updated = [...formData.experiences];
                      updated[eIdx].proofTitle = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- TAB 5: CERTIFICATIONS MANAGER --- */}
      {activeAdminTab === 'certs' && (
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
                  title: "New Certification Title",
                  issuer: "Oracle / Deloitte / Coursera",
                  issueDate: "2026",
                  credentialUrl: "#",
                  skillsValidated: ["SQL", "Analytics"]
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
                    setFormData({
                      ...formData,
                      certifications: formData.certifications.filter(c => c.id !== cert.id)
                    });
                    showNotification('Certification removed');
                  }}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block">Certification Title</label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={e => {
                        const updated = [...formData.certifications];
                        updated[cIdx].issuer = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block">Issue Date</label>
                    <input
                      type="text"
                      value={cert.issueDate}
                      onChange={e => {
                        const updated = [...formData.certifications];
                        updated[cIdx].issueDate = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block">Credential Verification URL</label>
                  <input
                    type="text"
                    value={cert.credentialUrl || ''}
                    onChange={e => {
                      const updated = [...formData.certifications];
                      updated[cIdx].credentialUrl = e.target.value;
                      setFormData({ ...formData, certifications: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: BACKUP & SYSTEM SYNC --- */}
      {activeAdminTab === 'backup' && (
        <div className="cyber-card p-6 rounded-2xl space-y-6 border border-purple-500/40">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-5 h-5 text-purple-400" />
            JSON Backup, Deployment Sync & Reset Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Export JSON */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <Download className="w-8 h-8 text-[#00f3ff] mx-auto" />
              <h4 className="font-bold text-white text-sm">Export Data JSON</h4>
              <p className="text-xs text-slate-400">
                Download current site data as a JSON file to commit to git for static hosting deployment.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-[#00f3ff] font-mono text-xs font-semibold hover:bg-cyan-900/50 transition-all"
              >
                Export JSON File
              </button>
            </div>

            {/* Import JSON */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Import Data JSON</h4>
              <p className="text-xs text-slate-400">
                Upload an existing JSON file backup to restore or batch-update all portfolio content.
              </p>
              <label className="w-full py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-semibold hover:bg-emerald-900/50 cursor-pointer block">
                Import JSON File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset Defaults */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center space-y-3">
              <RotateCcw className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Restore Resume Defaults</h4>
              <p className="text-xs text-slate-400">
                Reset all portfolio data back to the original pre-loaded resume defaults for Amrit Bakshi.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all portfolio data to initial resume defaults?')) {
                    onResetData();
                    showNotification('Restored initial resume defaults!');
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

    </section>
  );
};
