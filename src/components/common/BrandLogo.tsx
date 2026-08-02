import React from 'react';
import {
  Layers, Cpu, Code, BookOpen, Database, Wrench,
  Briefcase, Sparkles, Hash
} from 'lucide-react';

interface BrandLogoProps {
  name: string;
  type: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  type,
  size = 14,
  className = '',
  style
}) => {
  const normalizedName = name.toLowerCase().trim();
  const normalizedType = type.toLowerCase().trim();

  // SVG Helper
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className,
    style
  };

  // Brand SVG matching
  switch (normalizedName) {
    case 'python':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2.16c3.48 0 5.48.24 6.32.96.84.72.84 2.16.84 4.56v1.92H12.84v1.44h6.36c1.92 0 3.24.48 3.96 1.2.72.72.72 2.04.72 4.68 0 2.64 0 3.96-.72 4.68-.72.72-2.04.72-3.96.72h-1.92v-6.36h-1.44v6.36H9.48c-3.48 0-5.48-.24-6.32-.96-.84-.72-.84-2.16-.84-4.56v-1.92h6.32v-1.44H2.28c-1.92 0-3.24-.48-3.96-1.2C-2.4 11.28-2.4 9.96-2.4 7.32c0-2.64 0-3.96.72-4.68.72-.72 2.04-.72 3.96-.72h1.92v6.36h1.44V2.16H12z" fill="currentColor"/>
          <circle cx="8.5" cy="5.5" r="1.2" fill="#3776AB" />
          <circle cx="15.5" cy="18.5" r="1.2" fill="#FFD43B" />
        </svg>
      );

    case 'excel':
    case 'microsoft excel':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M21.17 3H7.83A1.83 1.83 0 006 4.83v14.34A1.83 1.83 0 007.83 21h13.34A1.83 1.83 0 0023 19.17V4.83A1.83 1.83 0 0021.17 3z" fill="#107C41" />
          <path d="M1 6.5h8v11H1z" fill="#185ABD" />
          <path d="M3.2 8.5h1.8l1.4 2.5 1.4-2.5h1.8l-2.2 3.5 2.3 3.5H7.7l-1.5-2.6-1.5 2.6H2.9l2.3-3.5L3.2 8.5z" fill="#FFF" />
          <path d="M10 8h11v2H10V8zm0 4h11v2H10v-2zm0 4h11v2H10v-2z" fill="#FFF" opacity="0.4" />
        </svg>
      );

    case 'power bi':
    case 'powerbi':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M4 19.5A1.5 1.5 0 012.5 18V9.5A1.5 1.5 0 014 8h2a1.5 1.5 0 011.5 1.5V18A1.5 1.5 0 016 19.5H4z" fill="#F2C811" />
          <path d="M11 19.5a1.5 1.5 0 01-1.5-1.5V5.5A1.5 1.5 0 0111 4h2a1.5 1.5 0 011.5 1.5V18a1.5 1.5 0 01-1.5 1.5h-2z" fill="#E6AD10" />
          <path d="M18 19.5a1.5 1.5 0 01-1.5-1.5v-5A1.5 1.5 0 0118 11.5h2a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-2z" fill="#C98A0C" />
        </svg>
      );

    case 'tableau':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M11 2h2v4h-2V2zm-4 5h2v3H7V7zm8 0h2v3h-2V7zm-9 4h10v2H6v-2zm-4 4h2v3H2v-3zm16 0h2v3h-2v-3zm-9 3h2v4h-2v-4z" fill="#E97627" />
        </svg>
      );

    case 'sql':
    case 'postgresql':
    case 'postgres':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.34 7 2s-3.13 2-7 2-7-1.34-7-2 3.13-2 7-2zm0 6c3.87 0 7-1.34 7-2v3c0 .66-3.13 2-7 2s-7-1.34-7-2V9c0 .66 3.13 2 7 2zm0 5c3.87 0 7-1.34 7-2v3c0 .66-3.13 2-7 2s-7-1.34-7-2v-3c0 .66 3.13 2 7 2z" fill="#336791" />
        </svg>
      );

    case 'sqlite':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 3C6.48 3 2 4.79 2 7v10c0 2.21 4.48 4 10 4s10-1.79 10-4V7c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm-6 4.5l6 2.5 6-2.5v3l-6 2.5-6-2.5v-3z" fill="#003B57" />
        </svg>
      );

    case 'pandas':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M5 3h4v18H5V3zm10 0h4v18h-4V3zm-5 4h4v10h-4V7z" fill="#150458" />
        </svg>
      );

    case 'numpy':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M3 3h4.5l9 12V3H21v18h-4.5l-9-12v12H3V3z" fill="#013243" />
        </svg>
      );

    case 'statistics':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M3 3v18h18" stroke="#F2C230" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M6 16c2-8 4-10 6-4s4 2 6-8" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#F2C230" />
        </svg>
      );

    case 'etl':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 4l4 2-4 2M8 10l-4 2 4 2M16 16l4 2-4 2" stroke="#F2C230" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'business analytics':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M3 20h18" stroke="#666" strokeWidth="1.5" />
          <path d="M5 15l4-5 4 3 6-8" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="5" r="2" fill="#10b981" />
        </svg>
      );

    case 'streamlit':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 5l6.5 13h-13L12 7z" fill="#FF4B4B" />
        </svg>
      );

    case 'react':
    case 'react.js':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
        </svg>
      );

    case 'node.js':
    case 'nodejs':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 1.8l9.5 5.5v11L12 23.8 2.5 18.3v-11L12 1.8zm0 2.5L4.5 8.6v6.8l7.5 4.3 7.5-4.3V8.6L12 4.3z" fill="#339933" />
        </svg>
      );

    case 'aws':
    case 'amazon web services':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M18.75 14.25c-1.5 1.2-3.75 1.8-6.75 1.8-4.2 0-7.2-1.5-9.3-3.6-.3-.3-.6 0-.45.35 1.95 2.55 5.25 4.2 9.75 4.2 3.15 0 5.85-.9 7.65-2.25.4-.3.15-.8-.3-.5z" fill="#FF9900" />
          <path d="M19.95 13.05c-.3-.4-1.95-.2-2.7 0-.25.05-.3-.15-.1-.3.95-.75 2.45-.55 2.75-.15.3.4.05 1.9-.85 2.75-.2.2-.35.1-.25-.1.35-.7.45-1.8.15-2.2z" fill="#FF9900" />
        </svg>
      );

    case 'cloudfront':
    case 'aws cloudfront':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#FF9900" />
        </svg>
      );

    case 's3':
    case 'aws s3':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 14 12 14s-3.5-1.57-3.5-3.5S10.07 7 12 7zm7 11H5v-1.28c0-2.33 4.67-3.62 7-3.62s7 1.29 7 3.62V18z" fill="#569A31" />
        </svg>
      );

    case 'figma':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M8 2h4v4H8V2zm4 4h4v4h-4V6zm-4 4h4v4H8v-4zm0 4h4v4a4 4 0 1 1-4-4zm8-4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#F24E1E" />
        </svg>
      );

    case 'git':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M21.707 11.293l-9-9a.999.999 0 0 0-1.414 0l-9 9a.999.999 0 0 0 0 1.414l9 9c.39.39 1.024.39 1.414 0l9-9a.999.999 0 0 0 0-1.414zM12 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="#F05032" />
        </svg>
      );

    case 'github':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" fill="#FFF" />
        </svg>
      );

    case 'synthetic data':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'data annotation':
    case 'data labeling':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="7" y1="7" x2="7.01" y2="7" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'data quality assessment':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#F2C230" strokeWidth="2" fill="none" />
          <path d="M9 12l2 2 4-4" stroke="#F2C230" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'prompt engineering':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M4 17l6-6-6-6M12 19h8" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'llm workflows':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="3" fill="#a855f7" />
          <circle cx="18" cy="6" r="3" fill="#38bdf8" />
          <circle cx="12" cy="18" r="3" fill="#F2C230" />
          <path d="M8.5 7.5l7 0M7.5 8.5l3 7.5M16.5 8.5l-3 7.5" stroke="#666" strokeWidth="1.5" />
        </svg>
      );

    case 'ai-assisted development':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l7 4.5-7 4.5z" fill="#10b981" />
        </svg>
      );

    case 'rest api':
    case 'rest apis':
    case 'api integration':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#F2C230" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    default:
      break;
  }

  // Fallback to type icons
  const iconProps = { size, strokeWidth: 1.75, className, style };
  switch (normalizedType) {
    case 'domain':            return <Layers {...iconProps} />;
    case 'skill':             return <Cpu {...iconProps} />;
    case 'sub_skill':         return <Code {...iconProps} />;
    case 'library':           return <BookOpen {...iconProps} />;
    case 'database':          return <Database {...iconProps} />;
    case 'framework':         return <Wrench {...iconProps} />;
    case 'professional_skill':return <Briefcase {...iconProps} />;
    case 'concept':           return <Hash {...iconProps} />;
    default:                  return <Sparkles {...iconProps} />;
  }
};
