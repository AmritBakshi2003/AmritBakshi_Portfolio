export type MediaType = 'image' | 'pdf' | 'video' | 'svg';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  size?: number;
  uploadDate: string;
  altText?: string;
  caption?: string;
}

export type NodeType =
  | 'domain'
  | 'skill'
  | 'sub_skill'
  | 'library'
  | 'concept'
  | 'tool'
  | 'framework'
  | 'database'
  | 'soft_skill'
  | 'professional_skill';

export type ExperienceLevel = 'Learning' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  description?: string;
  icon?: string;
  color?: string;
  experienceLevel?: ExperienceLevel;
  yearsOfExperience?: number;
  sortOrder?: number;
  visibility?: boolean;
  isExpanded?: boolean;
  tags?: string[];
  notes?: string;
  relatedSkills?: string[];
  children?: TreeNode[];
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  metrics: ProjectMetric[];
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  mediaIds: string[];
  tags: string[];
  visibility: boolean;
  sortOrder: number;
  lastModified: string;
  featured: boolean;
  role?: string;
  teamSize?: number;
  problem?: string;
  solution?: string;
  challenges?: string[];
  learnings?: string[];
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  employmentType?: string;
  bullets: string[];
  skillsUsed: string[];
  mediaIds: string[];
  proofTitle?: string;
  proofUrl?: string;
  companyWebsite?: string;
  visibility: boolean;
  sortOrder: number;
  lastModified: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  mediaIds: string[];
  skillsValidated: string[];
  visibility: boolean;
  sortOrder: number;
  lastModified: string;
  featured?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  details?: string;
  achievements?: string[];
  mediaIds?: string[];
  visibility: boolean;
  sortOrder: number;
}

// NEW: Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link?: string;
  mediaIds: string[];
  tags?: string[];
  visibility: boolean;
  sortOrder: number;
}

// NEW: Section visibility config
export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  certifications: boolean;
  education: boolean;
  achievements: boolean;
  contact: boolean;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  about?: string; // Longer about text
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolioUrl?: string;
  avatarMediaId?: string;
  avatarUrl: string;
  resumeUrl: string;
  lookingForRole: string;
  isAvailable?: boolean;
}

export interface PortfolioCMSData {
  profile: Profile;
  skillTree: TreeNode;
  projects: Project[];
  experiences: WorkExperience[];
  certifications: Certification[];
  education: Education[];
  achievements: Achievement[];           // NEW
  sectionVisibility: SectionVisibility;  // NEW
  mediaLibrary: MediaItem[];
  adminPasscode: string;
}
