import React from 'react';
import { motion } from 'framer-motion';
import type { Profile, MediaItem } from '../../types/cms';
import { MapPin, Mail, Phone, Download, ExternalLink, ArrowDown } from 'lucide-react';
import { toMediaSrc } from '../../utils/mediaUrl';

interface HeroSectionProps {
  profile: Profile;
  mediaLibrary: MediaItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, mediaLibrary }) => {
  const avatarItem = mediaLibrary.find(m => m.id === profile.avatarMediaId);
  const avatarSrc = toMediaSrc(avatarItem?.url || profile.avatarUrl || '/profile.jpg');

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 pb-16"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* ATS & crawler readable hidden metadata */}
      <meta itemProp="name" content={profile.name} />
      <meta itemProp="jobTitle" content={profile.title} />
      <meta itemProp="email" content={profile.email} />
      <meta itemProp="telephone" content={profile.phone} />
      <meta itemProp="url" content={typeof window !== 'undefined' ? window.location.origin : ''} />
      <meta itemProp="image" content="/profile.jpg" />
      <link itemProp="sameAs" href={profile.github || ''} />
      <link itemProp="sameAs" href={profile.linkedin || ''} />

      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}  
          className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20"
        >
          {/* Left: Text Content */}
          <div className="flex-1 order-2 lg:order-1 space-y-6">

            {/* Available Badge */}
            {profile.isAvailable !== false && (
              <motion.div variants={item}>
                <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.lookingForRole}
                </span>
              </motion.div>
            )}

            {/* Name */}
            <motion.div variants={item}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                {profile.name}
              </h1>
              <p className="text-lg sm:text-xl text-indigo-400 font-medium mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {profile.title}
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p variants={item} className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-xl">
              {profile.tagline}
            </motion.p>

            {/* Quick Info Pills */}
            <motion.div variants={item} className="flex flex-wrap gap-2">
              <span className="chip">
                <MapPin className="w-3 h-3 text-neutral-500" />
                {profile.location}
              </span>
              <a href={`mailto:${profile.email}`} className="chip hover:border-indigo-500/40 hover:text-white transition-all">
                <Mail className="w-3 h-3 text-neutral-500" />
                {profile.email}
              </a>
              <span className="chip">
                <Phone className="w-3 h-3 text-neutral-500" />
                {profile.phone}
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
              {profile.resumeUrl ? (
                <a href={profile.resumeUrl} download="Amrit_Bakshi_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              ) : (
                <span className="btn-primary opacity-60 cursor-not-allowed">
                  <Download className="w-4 h-4" />
                  Resume
                </span>
              )}

              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              )}

              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <ExternalLink className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: Photo */}
          <motion.div
            variants={item}
            className="order-1 lg:order-2 shrink-0"
          >
            <div className="relative">
              <div className="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-2xl overflow-hidden border border-[#222] bg-[#111]">
                <img
                  src={avatarSrc}
                  alt={`${profile.name} photo`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Subtle decorative ring */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex justify-center mt-20 lg:mt-28"
        >
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-neutral-600 hover:text-neutral-400 transition-colors group"
          >
            <span className="text-xs font-mono">scroll</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
