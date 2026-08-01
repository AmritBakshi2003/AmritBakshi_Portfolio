import React from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '../../types/cms';
import { Mail, Phone, MapPin, Download } from 'lucide-react';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  return (
    <section id="contact" className="py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">
            <span>08</span>
            <span className="text-neutral-600">—</span>
            Contact
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Let's connect
              </h2>
              <p className="text-neutral-400 mt-4 leading-relaxed max-w-md">
                I'm actively looking for entry-level Data Analyst, Business Intelligence, and Analytics Engineer roles.
                If you're hiring or have an opportunity, I'd love to hear from you.
              </p>
            </div>

            <div className="space-y-3">
              <a href={`mailto:${profile.email}`}
                className="card rounded-xl p-4 flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">{profile.email}</p>
                </div>
              </a>

              <a href={`tel:${profile.phone}`}
                className="card rounded-xl p-4 flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Phone</p>
                  <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">{profile.phone}</p>
                </div>
              </a>

              <div className="card rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Location</p>
                  <p className="text-sm text-white">{profile.location}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>

              {profile.resumeUrl ? (
                <a href={profile.resumeUrl} download="Amrit_Bakshi_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm">
                  <Download className="w-4 h-4" />
                  Download Resume PDF
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
