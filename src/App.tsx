import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { PortfolioCMSData } from './types/cms';
import { INITIAL_CMS_DATA } from './data/initialTreeData';

// Layout
import { SiteNav } from './components/layout/SiteNav';

// Sections
import { HeroSection }          from './components/sections/HeroSection';
import { AboutSection }         from './components/sections/AboutSection';
import { SkillsSection }        from './components/sections/SkillsSection';
import { ProjectsSection }      from './components/sections/ProjectsSection';
import { ExperienceSection }    from './components/sections/ExperienceSection';
import { CertificationsSection} from './components/sections/CertificationsSection';
import { EducationSection }     from './components/sections/EducationSection';
import { AchievementsSection }  from './components/sections/AchievementsSection';
import { ContactSection }       from './components/sections/ContactSection';

// SEO
import { SEOHead } from './components/common/SEOHead';

// Admin (unchanged)
import { AdminCMS } from './components/admin/AdminCMS';

const CMS_STORAGE_KEY = 'AMRIT_BAKSHI_CMS_DATA_V5';

function mergeTreeNodes(defaultNode: any, savedNode: any): any {
  if (!savedNode) return defaultNode;
  const mergedChildrenMap = new Map<string, any>();
  for (const child of savedNode.children ?? []) {
    mergedChildrenMap.set(child.id, child);
  }
  for (const defaultChild of defaultNode.children ?? []) {
    if (!mergedChildrenMap.has(defaultChild.id)) {
      mergedChildrenMap.set(defaultChild.id, defaultChild);
    } else {
      const existing = mergedChildrenMap.get(defaultChild.id);
      mergedChildrenMap.set(defaultChild.id, mergeTreeNodes(defaultChild, existing));
    }
  }
  return {
    ...defaultNode,
    ...savedNode,
    children: Array.from(mergedChildrenMap.values()),
  };
}

// ── Merge saved data with INITIAL defaults (handles new fields added across updates) ──
function mergeWithDefaults(saved: PortfolioCMSData): PortfolioCMSData {
  const mergedProjectsMap = new Map<string, any>();
  for (const p of saved.projects ?? []) mergedProjectsMap.set(p.id, p);
  for (const p of INITIAL_CMS_DATA.projects) {
    if (!mergedProjectsMap.has(p.id)) mergedProjectsMap.set(p.id, p);
  }

  const mergedLinksMap = new Map<string, any>();
  for (const l of saved.projectLinks ?? []) mergedLinksMap.set(l.id, l);
  for (const l of INITIAL_CMS_DATA.projectLinks ?? []) {
    if (!mergedLinksMap.has(l.id)) mergedLinksMap.set(l.id, l);
  }

  const merged: PortfolioCMSData = {
    ...INITIAL_CMS_DATA,
    ...saved,
    skillTree: saved.skillTree ? mergeTreeNodes(INITIAL_CMS_DATA.skillTree, saved.skillTree) : INITIAL_CMS_DATA.skillTree,
    projects: Array.from(mergedProjectsMap.values()),
    projectLinks: Array.from(mergedLinksMap.values()),
    profile: { ...INITIAL_CMS_DATA.profile, ...saved.profile },
    sectionVisibility: { ...INITIAL_CMS_DATA.sectionVisibility, ...saved.sectionVisibility },
    achievements: saved.achievements ?? INITIAL_CMS_DATA.achievements,
  };
  if (!merged.profile.resumeUrl || merged.profile.resumeUrl === '#') {
    merged.profile.resumeUrl = '/Amrit_Bakshi_Resume.pdf';
  }
  // Migrate older education coursework text
  if (merged.education) {
    merged.education = merged.education.map(edu => ({
      ...edu,
      achievements: edu.achievements?.map(a =>
        a === 'Active in data science and analytics coursework'
          ? 'Active and interested in data analytics and science coursework'
          : a
      ),
    }));
  }
  return merged;
}

// ── Load from localStorage (fast, synchronous, used as initial state) ──
function loadFromLocalStorage(): PortfolioCMSData {
  try {
    const saved = localStorage.getItem(CMS_STORAGE_KEY);
    if (saved) return mergeWithDefaults(JSON.parse(saved));
  } catch (e) {
    console.warn('[CMS] localStorage read failed:', e);
  }
  return INITIAL_CMS_DATA;
}

// ── Fetch live CMS data from Vercel Blob via API ──
async function fetchFromCloud(): Promise<{ connected: boolean; data: PortfolioCMSData | null }> {
  try {
    const res = await fetch('/api/cms', { cache: 'no-store' });
    if (!res.ok) return { connected: false, data: null };
    const resJson = await res.json();
    return {
      connected: !!resJson.connected,
      data: resJson.data ? mergeWithDefaults(resJson.data as PortfolioCMSData) : null,
    };
  } catch {
    return { connected: false, data: null };
  }
}

// ── Save CMS data to Vercel Blob via API ──
async function saveToCloud(data: PortfolioCMSData, passcode: string): Promise<boolean> {
  try {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode,
      },
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function App() {
  // ── Initialize from localStorage immediately (fast render) ──
  const [cmsData, setCmsData] = useState<PortfolioCMSData>(loadFromLocalStorage);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('idle');

  // ── On mount: fetch cloud data and merge if newer ──
  useEffect(() => {
    setCloudSyncStatus('syncing');
    fetchFromCloud().then(({ connected, data }) => {
      if (data) {
        setCmsData(data);
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
        } catch (_) {}
        setCloudSyncStatus('synced');
      } else if (connected) {
        // Blob store connected, but no save has been performed yet
        setCloudSyncStatus('synced');
      } else {
        setCloudSyncStatus('offline');
      }
    });
  }, []);

  const handleUpdateCMSData = useCallback(async (newData: PortfolioCMSData) => {
    // 1. Update local state immediately
    setCmsData(newData);

    // 2. Persist to localStorage as fast local cache
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn('[CMS] localStorage write failed:', e);
    }

    // 3. Save to Vercel Blob cloud (so other browsers see it)
    const passcode = newData.adminPasscode || 'admin123';
    const saved = await saveToCloud(newData, passcode);
    if (saved) {
      setCloudSyncStatus('synced');
    } else {
      setCloudSyncStatus('offline');
      console.warn('[CMS] Cloud save failed — data only in localStorage.');
    }
  }, []);

  const handleResetCMSData = useCallback(async () => {
    setCmsData(INITIAL_CMS_DATA);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
    } catch (_) {}
    await saveToCloud(INITIAL_CMS_DATA, INITIAL_CMS_DATA.adminPasscode);
  }, []);

  const sv = cmsData.sectionVisibility;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Routes>

        {/* ─── PUBLIC: Single-page scrolling portfolio ─── */}
        <Route
          path="*"
          element={
            <>
              <SEOHead
                name={cmsData.profile.name}
                title={cmsData.profile.title}
                tagline={cmsData.profile.tagline}
                email={cmsData.profile.email}
                location={cmsData.profile.location}
                github={cmsData.profile.github}
                linkedin={cmsData.profile.linkedin}
              />
              <SiteNav
                name={cmsData.profile.name}
                sectionVisibility={sv}
                resumeUrl={cmsData.profile.resumeUrl}
              />

              <main>
                {/* Hero — always shown */}
                <HeroSection
                  profile={cmsData.profile}
                  mediaLibrary={cmsData.mediaLibrary}
                />

                {sv.about && (
                  <AboutSection profile={cmsData.profile} />
                )}

                {sv.skills && (
                  <SkillsSection
                    skillTree={cmsData.skillTree}
                    projects={cmsData.projects}
                    projectLinks={cmsData.projectLinks}
                    showSkillHunt={sv.skillHunt ?? true}
                  />
                )}

                {sv.projects && (
                  <ProjectsSection
                    projects={cmsData.projects}
                    mediaLibrary={cmsData.mediaLibrary}
                  />
                )}

                {sv.experience && (
                  <ExperienceSection
                    experiences={cmsData.experiences}
                    mediaLibrary={cmsData.mediaLibrary}
                  />
                )}

                {sv.certifications && (
                  <CertificationsSection
                    certifications={cmsData.certifications}
                    mediaLibrary={cmsData.mediaLibrary}
                  />
                )}

                {sv.education && (
                  <EducationSection education={cmsData.education} />
                )}

                {sv.achievements && (
                  <AchievementsSection achievements={cmsData.achievements} />
                )}

                {sv.contact && (
                  <ContactSection profile={cmsData.profile} />
                )}
              </main>

              {/* Footer */}
              <footer className="border-t border-[#1a1a1a] py-8 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    © {new Date().getFullYear()} {cmsData.profile.name}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    B.Tech CSE '26 · Siliguri Institute of Technology
                  </span>
                </div>
              </footer>
            </>
          }
        />

        {/* ─── SECRET: Admin CMS ─── */}
        <Route
          path="/admin/*"
          element={
            <main className="min-h-screen bg-[#080b11]">
              {/* Cloud sync status bar */}
              {cloudSyncStatus === 'offline' && (
                <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-300 text-xs font-mono text-center py-2 px-4">
                  ⚠ Cloud sync unavailable — changes saved locally only. Set up Vercel Blob storage to enable cloud persistence.
                </div>
              )}
              {cloudSyncStatus === 'synced' && (
                <div className="bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-400 text-xs font-mono text-center py-1.5 px-4">
                  ✓ Connected to Vercel Blob — all changes sync across devices
                </div>
              )}
              <AdminCMS
                data={cmsData}
                onUpdateData={handleUpdateCMSData}
                onResetData={handleResetCMSData}
              />
            </main>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
