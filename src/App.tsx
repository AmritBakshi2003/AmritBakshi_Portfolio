import { useState } from 'react';
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

// Admin (unchanged)
import { AdminCMS } from './components/admin/AdminCMS';

const CMS_STORAGE_KEY = 'AMRIT_BAKSHI_CMS_DATA_V3';

// Merge saved data with INITIAL to safely handle new fields added in updates
function mergeWithDefaults(saved: PortfolioCMSData): PortfolioCMSData {
  const merged = {
    ...INITIAL_CMS_DATA,
    ...saved,
    profile: { ...INITIAL_CMS_DATA.profile, ...saved.profile },
    sectionVisibility: { ...INITIAL_CMS_DATA.sectionVisibility, ...saved.sectionVisibility },
    achievements: saved.achievements ?? INITIAL_CMS_DATA.achievements,
  };
  if (!merged.profile.resumeUrl || merged.profile.resumeUrl === '#') {
    merged.profile.resumeUrl = '/Amrit_Bakshi_Resume.pdf';
  }
  // Migrate education achievements text if saved from earlier
  if (merged.education) {
    merged.education = merged.education.map(edu => {
      if (edu.achievements) {
        return {
          ...edu,
          achievements: edu.achievements.map(a =>
            a === 'Active in data science and analytics coursework'
              ? 'Active and interested in data analytics and science coursework'
              : a
          )
        };
      }
      return edu;
    });
  }
  return merged;
}

export function App() {
  const [cmsData, setCmsData] = useState<PortfolioCMSData>(() => {
    try {
      const saved = localStorage.getItem(CMS_STORAGE_KEY);
      if (saved) return mergeWithDefaults(JSON.parse(saved));
    } catch (e) {
      console.error('Failed loading saved CMS data:', e);
    }
    return INITIAL_CMS_DATA;
  });

  const handleUpdateCMSData = (newData: PortfolioCMSData) => {
    setCmsData(newData);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to persist CMS data:', e);
    }
  };

  const handleResetCMSData = () => {
    setCmsData(INITIAL_CMS_DATA);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(INITIAL_CMS_DATA));
    } catch (e) {
      console.error('Failed to reset CMS data:', e);
    }
  };

  const sv = cmsData.sectionVisibility;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Routes>

        {/* ─── PUBLIC: Single-page scrolling portfolio ─── */}
        <Route
          path="*"
          element={
            <>
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

        {/* ─── SECRET: Admin CMS — unlinked from public site ─── */}
        <Route
          path="/admin/*"
          element={
            <main className="min-h-screen bg-[#080b11]">
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
