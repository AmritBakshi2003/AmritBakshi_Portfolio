export interface Profile {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  avatarUrl: string;
  resumeUrl: string;
  lookingForRole: string;
}

export interface LibraryOrTool {
  name: string;
  description?: string;
  category?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  categoryId: string; // e.g. 'data-analytics', 'development-cloud', 'databases', 'tools-ai', 'professional'
  proficiency: number; // 0 to 100
  levelName: 'Expert' | 'Advanced' | 'Intermediate' | 'Proficient';
  description: string;
  libraries: LibraryOrTool[];
  crossDomains: string[]; // Category IDs of other branches this skill belongs/connects to
  projectsUsedIn: string[]; // Project IDs
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string; // Hex or CSS color
  glowColor: string;
  description: string;
  iconName: string;
}

export interface CrossSkillEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  type?: 'shared_tech' | 'data_flow' | 'dependency';
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
  imageUrl?: string;
  featured: boolean;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  bullets: string[];
  skillsUsed: string[];
  proofMediaUrl?: string;
  proofMediaType?: 'image' | 'pdf' | 'link';
  proofTitle?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  badgeImageUrl?: string;
  certificatePdfUrl?: string;
  skillsValidated: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  details?: string;
}

export interface PortfolioData {
  profile: Profile;
  categories: SkillCategory[];
  skills: SkillNode[];
  edges: CrossSkillEdge[];
  projects: Project[];
  experiences: WorkExperience[];
  certifications: Certification[];
  education: Education[];
  adminPasscode: string;
}
