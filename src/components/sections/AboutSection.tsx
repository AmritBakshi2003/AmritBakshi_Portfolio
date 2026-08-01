import React from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '../../types/cms';

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const specializations = [
    'Data Analysis', 'SQL & Python', 'Power BI', 'ETL Pipelines',
    'Synthetic Data', 'Business Intelligence', 'Streamlit Apps', 'Data Quality'
  ];

  return (
    <section id="about" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Label */}
          <p className="section-label">
            <span>01</span>
            <span className="text-neutral-600">—</span>
            About
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mt-6">
            {/* Left: Headline */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                About Me
              </h2>
              <div className="mt-6 space-y-2">
                {specializations.map((spec) => (
                  <div key={spec} className="flex items-center gap-2 text-sm text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Bio paragraphs */}
            <div className="lg:col-span-3 space-y-4 text-neutral-300 text-base leading-relaxed">
              {(profile.about || profile.summary).split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              {/* Degree + availability quick stats */}
              <div className="flex flex-wrap gap-3 pt-4">
                <span className="chip chip-accent">B.Tech CSE '26</span>
                <span className="chip chip-accent">Siliguri Institute of Technology</span>
                <span className="chip chip-accent">Open to Work</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
