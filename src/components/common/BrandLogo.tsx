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
          <path d="M11.873 0c-3.14 0-4.996.15-6.19 1.187-1.196 1.037-1.196 2.47-1.196 4.39v1.93h6.386v.884H2.487c-1.92 0-3.353.456-4.39 1.652C-2.94 11.25-2.94 13.106-2.94 16.246c0 3.14.15 4.996 1.187 6.19 1.037 1.196 2.47 1.196 4.39 1.196h1.93v-6.386h.884v8.386c0 1.92.456 3.353 1.652 4.39 1.196 1.037 3.052 1.037 6.19 1.037 3.14 0 4.996-.15 6.19-1.187 1.196-1.037 1.196-2.47 1.196-4.39v-1.93h-6.386v-.884h8.386c1.92 0 3.353-.456 4.39-1.652 1.037-1.196 1.037-3.052 1.037-6.19 0-3.14-.15-4.996-1.187-6.19-1.037-1.196-2.47-1.196-4.39-1.196h-1.93v6.386h-.884V1.187c0-1.92-.456-3.353-1.652-4.39C16.869.15 15.013 0 11.873 0z" fill="none" />
          <path d="M12 2.16c3.48 0 5.48.24 6.32.96.84.72.84 2.16.84 4.56v1.92H12.84v1.44h6.36c1.92 0 3.24.48 3.96 1.2.72.72.72 2.04.72 4.68 0 2.64 0 3.96-.72 4.68-.72.72-2.04.72-3.96.72h-1.92v-6.36h-1.44v6.36H9.48c-3.48 0-5.48-.24-6.32-.96-.84-.72-.84-2.16-.84-4.56v-1.92h6.32v-1.44H2.28c-1.92 0-3.24-.48-3.96-1.2C-2.4 11.28-2.4 9.96-2.4 7.32c0-2.64 0-3.96.72-4.68.72-.72 2.04-.72 3.96-.72h1.92v6.36h1.44V2.16H12z" fill="currentColor"/>
          <circle cx="8.5" cy="5.5" r="1" fill="#000" />
          <circle cx="15.5" cy="18.5" r="1" fill="#000" />
        </svg>
      );
    case 'sql':
    case 'postgresql':
    case 'postgres':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.34 7 2s-3.13 2-7 2-7-1.34-7-2 3.13-2 7-2zm0 6c3.87 0 7-1.34 7-2v3c0 .66-3.13 2-7 2s-7-1.34-7-2V9c0 .66 3.13 2 7 2zm0 5c3.87 0 7-1.34 7-2v3c0 .66-3.13 2-7 2s-7-1.34-7-2v-3c0 .66 3.13 2 7 2z" />
        </svg>
      );
    case 'sqlite':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M4 4h16v3H4V4zm0 6h16v3H4v-3zm0 6h16v4H4v-4z" />
        </svg>
      );
    case 'pandas':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M5 3h4v18H5V3zm10 0h4v18h-4V3zm-5 4h4v10h-4V7z" />
        </svg>
      );
    case 'numpy':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M3 3h4.5l9 12V3H21v18h-4.5l-9-12v12H3V3z" />
        </svg>
      );
    case 'streamlit':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 5l6.5 13h-13L12 7z" />
        </svg>
      );
    case 'react':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case 'node.js':
    case 'nodejs':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 1.8l9.5 5.5v11L12 23.8 2.5 18.3v-11L12 1.8zm0 2.5L4.5 8.6v6.8l7.5 4.3 7.5-4.3V8.6L12 4.3z" />
        </svg>
      );
    case 'aws':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M6.5 7h3l3.5 10 3.5-10h3L14 20h-4L6.5 7zM3 17.5c4 2 10 3 18-2M18 17l3 1.5-1.5-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'figma':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M8 2h4v4H8V2zm4 4h4v4h-4V6zm-4 4h4v4H8v-4zm0 4h4v4a4 4 0 1 1-4-4zm8-4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      );
    case 'git':
    case 'github':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case 'html':
    case 'css':
    case 'javascript':
    case 'js':
    case 'tailwind':
      return (
        <svg {...svgProps} viewBox="0 0 24 24">
          <path d="M12 2L2 6l1.8 14.5L12 22l8.2-1.5L22 6L12 2zm0 2.3l7.6 3-1.4 11.5L12 20.2l-6.2-1.4L4.4 7.3 12 4.3z" />
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
