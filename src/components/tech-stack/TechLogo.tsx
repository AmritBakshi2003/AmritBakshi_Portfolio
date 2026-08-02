import React, { useState, useCallback } from 'react';
import { BrandLogo } from '../common/BrandLogo';

interface TechLogoProps {
  name: string;
  type: string;
  size?: number;
  className?: string;
  customIconUrl?: string;
}

function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Explicit Devicon Slug & Variant mapping for high quality logos */
const DEVICON_MAP: Record<string, { slug: string; variant?: string }> = {
  python: { slug: 'python', variant: 'original' },
  javascript: { slug: 'javascript', variant: 'original' },
  js: { slug: 'javascript', variant: 'original' },
  typescript: { slug: 'typescript', variant: 'original' },
  ts: { slug: 'typescript', variant: 'original' },
  react: { slug: 'react', variant: 'original' },
  reactjs: { slug: 'react', variant: 'original' },
  html: { slug: 'html5', variant: 'original' },
  html5: { slug: 'html5', variant: 'original' },
  css: { slug: 'css3', variant: 'original' },
  css3: { slug: 'css3', variant: 'original' },
  tailwind: { slug: 'tailwindcss', variant: 'original' },
  tailwindcss: { slug: 'tailwindcss', variant: 'original' },
  nodejs: { slug: 'nodejs', variant: 'original' },
  node: { slug: 'nodejs', variant: 'original' },
  express: { slug: 'express', variant: 'original' },
  expressjs: { slug: 'express', variant: 'original' },
  fastapi: { slug: 'fastapi', variant: 'original' },
  streamlit: { slug: 'streamlit', variant: 'original' },
  mongodb: { slug: 'mongodb', variant: 'original' },
  postgresql: { slug: 'postgresql', variant: 'original' },
  postgres: { slug: 'postgresql', variant: 'original' },
  sqlite: { slug: 'sqlite', variant: 'original' },
  git: { slug: 'git', variant: 'original' },
  github: { slug: 'github', variant: 'original' },
  vscode: { slug: 'vscode', variant: 'original' },
  visualstudiocode: { slug: 'vscode', variant: 'original' },
  vite: { slug: 'vitejs', variant: 'original' },
  vitejs: { slug: 'vitejs', variant: 'original' },
  npm: { slug: 'npm', variant: 'original-wordmark' },
  aws: { slug: 'amazonwebservices', variant: 'original-wordmark' },
  amazonwebservices: { slug: 'amazonwebservices', variant: 'original-wordmark' },
  vercel: { slug: 'vercel', variant: 'original' },
  cloudflare: { slug: 'cloudflare', variant: 'original' },
  netlify: { slug: 'netlify', variant: 'original' },
  figma: { slug: 'figma', variant: 'original' },
  canva: { slug: 'canva', variant: 'original' },
  framer: { slug: 'framer', variant: 'original' },
  pandas: { slug: 'pandas', variant: 'original' },
  numpy: { slug: 'numpy', variant: 'original' },
  matplotlib: { slug: 'matplotlib', variant: 'original' },
  plotly: { slug: 'plotly', variant: 'original' },
  postman: { slug: 'postman', variant: 'original' },
  jupyter: { slug: 'jupyter', variant: 'original' },
  jupyternotebook: { slug: 'jupyter', variant: 'original' },
  kaggle: { slug: 'kaggle', variant: 'original' },
  docker: { slug: 'docker', variant: 'original' },
  githubactions: { slug: 'githubactions', variant: 'original' },
  redis: { slug: 'redis', variant: 'original' },
  nextjs: { slug: 'nextjs', variant: 'original' },
  next: { slug: 'nextjs', variant: 'original' },
  webflow: { slug: 'webflow', variant: 'original' },
  wordpress: { slug: 'wordpress', variant: 'plain' },
  nginx: { slug: 'nginx', variant: 'original' },
};

/** Simple Icons Slug mapping (with color/white overrides) */
const SIMPLE_ICONS_MAP: Record<string, string> = {
  excel: 'microsoftexcel',
  microsoftexcel: 'microsoftexcel',
  powerbi: 'powerbi',
  tableau: 'tableau',
  postman: 'postman',
  chatgpt: 'openai/white',
  openai: 'openai/white',
  openaiapi: 'openai/white',
  claude: 'anthropic/white',
  anthropic: 'anthropic/white',
  gemini: 'googlegemini',
  geminiapi: 'googlegemini',
  googlegemini: 'googlegemini',
  cursor: 'cursor/white',
  cursorai: 'cursor/white',
  githubcopilot: 'githubcopilot/white',
  aws: 'amazonaws/FF9900',
  s3: 'amazons3/569A31',
  awss3: 'amazons3/569A31',
  cloudfront: 'amazonaws/FF9900',
  awscloudfront: 'amazonaws/FF9900',
  express: 'express/white',
  expressjs: 'express/white',
  vercel: 'vercel/white',
  github: 'github/white',
  restapi: 'postman',
  restapis: 'postman',
  cloudflare: 'cloudflare',
  netlify: 'netlify',
  vite: 'vite',
  npm: 'npm',
  fastapi: 'fastapi',
  streamlit: 'streamlit',
  canva: 'canva',
  framer: 'framer',
  figma: 'figma',
  docker: 'docker',
  githubactions: 'githubactions',
  redis: 'redis',
  nextjs: 'nextdotjs/white',
  webflow: 'webflow',
  wordpress: 'wordpress',
  nginx: 'nginx',
  seaborn: 'seaborn',
  openpyxl: 'python',
  googlesheets: 'googlesheets',
  razorpay: 'razorpay',
  mongodbatlas: 'mongodb',
  elasticbeanstalk: 'amazoneks',
  langchain: 'langchain',
  ollama: 'ollama/white',
};

function getDeviconUrl(name: string): string {
  const key = normalizeKey(name);
  const entry = DEVICON_MAP[key];
  if (entry) {
    const variant = entry.variant ?? 'original';
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${entry.slug}/${entry.slug}-${variant}.svg`;
  }
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
}

function getSimpleIconsUrl(name: string): string {
  const key = normalizeKey(name);
  const slug = SIMPLE_ICONS_MAP[key] ?? key;
  return `https://cdn.simpleicons.org/${slug}`;
}

type Stage = 'custom' | 'devicon' | 'simpleicons' | 'fallback';

export const TechLogo: React.FC<TechLogoProps> = ({
  name,
  type,
  size = 40,
  className = '',
  customIconUrl
}) => {
  const hasCustomUrl = Boolean(customIconUrl && (customIconUrl.startsWith('http') || customIconUrl.startsWith('/')));
  const [stage, setStage] = useState<Stage>(hasCustomUrl ? 'custom' : 'devicon');

  const handleCustomError = useCallback(() => setStage('devicon'), []);
  const handleDeviconError = useCallback(() => setStage('simpleicons'), []);
  const handleSimpleIconsError = useCallback(() => setStage('fallback'), []);

  if (stage === 'custom' && customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`object-contain ${className}`}
        onError={handleCustomError}
        style={{ width: size, height: size }}
      />
    );
  }

  if (stage === 'devicon') {
    return (
      <img
        src={getDeviconUrl(name)}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`object-contain ${className}`}
        onError={handleDeviconError}
        style={{ width: size, height: size }}
      />
    );
  }

  if (stage === 'simpleicons') {
    return (
      <img
        src={getSimpleIconsUrl(name)}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`object-contain ${className}`}
        onError={handleSimpleIconsError}
        style={{ width: size, height: size }}
      />
    );
  }

  // Layer 4 & 5: BrandLogo vector SVG or Lucide category icon
  return (
    <BrandLogo
      name={name}
      type={type}
      size={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};
