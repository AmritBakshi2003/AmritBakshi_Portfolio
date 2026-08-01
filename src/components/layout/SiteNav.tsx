import React, { useState, useEffect } from 'react';
import type { SectionVisibility } from '../../types/cms';
import { Menu, X, FileText } from 'lucide-react';

interface SiteNavProps {
  name: string;
  sectionVisibility: SectionVisibility;
  resumeUrl: string;
}

const SECTION_LABELS: Record<keyof SectionVisibility, string> = {
  hero: 'Home',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  education: 'Education',
  achievements: 'Achievements',
  contact: 'Contact',
};

const NAV_ORDER: (keyof SectionVisibility)[] = [
  'about', 'skills', 'projects', 'experience',
  'certifications', 'education', 'achievements', 'contact'
];

export const SiteNav: React.FC<SiteNavProps> = ({ name, sectionVisibility, resumeUrl }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for active section highlighting
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const visibleLinks = NAV_ORDER.filter((key) => sectionVisibility[key]);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm font-mono group-hover:bg-indigo-500/25 transition-all">
            {initials}
          </div>
          <span className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors hidden sm:block"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {name}
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleLinks.map((key) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                activeSection === key
                  ? 'text-white bg-white/5'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </nav>

        {/* Resume CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={resumeUrl || '/Amrit_Bakshi_Resume.pdf'}
            download="Amrit_Bakshi_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs py-1.5 px-3"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]/98 backdrop-blur-xl px-6 py-4 space-y-1">
          {visibleLinks.map((key) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
          <div className="pt-3 border-t border-[#1a1a1a]">
            <a href={resumeUrl || '/Amrit_Bakshi_Resume.pdf'} download="Amrit_Bakshi_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center text-sm">
              <FileText className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
