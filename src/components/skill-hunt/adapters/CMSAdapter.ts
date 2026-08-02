import type { TreeNode, Project, ProjectLink, WorkExperience, Certification } from '../../../types/cms';
import type { CollectedSkill } from '../types';

/** Fallback domain accent colors if domain.color is omitted in CMS */
export const FALLBACK_DOMAIN_COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

/**
 * CMSAdapter: Single source of truth.
 * Reads treeData and related CMS collections directly.
 * Automatically filters out hidden domains and empty/hidden skills.
 */
export class CMSAdapter {
  private treeData: TreeNode;
  private projects: Project[];
  private projectLinks: ProjectLink[];
  private experience: WorkExperience[];
  private certifications: Certification[];

  constructor(
    treeData: TreeNode,
    projects: Project[] = [],
    projectLinks: ProjectLink[] = [],
    experience: WorkExperience[] = [],
    certifications: Certification[] = []
  ) {
    this.treeData = treeData;
    this.projects = projects;
    this.projectLinks = projectLinks;
    this.experience = experience;
    this.certifications = certifications;
  }

  /** Check if a CMS node is visible */
  private isNodeVisible(node?: TreeNode | null): boolean {
    if (!node) return false;
    if (node.visibility === false) return false;
    if ((node as any).hidden === true) return false;
    return true;
  }

  /** Extract all visible, non-empty domain-level nodes (children of root) */
  getDomains(): TreeNode[] {
    if (!this.treeData.children) return [];
    return this.treeData.children.filter((domain: TreeNode) => {
      if (!this.isNodeVisible(domain)) return false;
      // Must contain at least one visible skill
      const skills = this.getSkillsForDomain(domain.id);
      return skills.length > 0;
    });
  }

  /** Get visible skills for a specific domain */
  getSkillsForDomain(domainId: string): TreeNode[] {
    const domain = (this.treeData.children || []).find((d: TreeNode) => d.id === domainId);
    if (!domain || !domain.children) return [];
    return domain.children.filter((s: TreeNode) => this.isNodeVisible(s));
  }

  /** Get sub-skills for a skill node */
  getSubSkills(skillNode: TreeNode): TreeNode[] {
    if (!skillNode.children) return [];
    return skillNode.children.filter((s: TreeNode) => this.isNodeVisible(s));
  }

  /** Get exact total number of visible skills across all active domains */
  getTotalSkillsCount(): number {
    const domains = this.getDomains();
    let total = 0;
    domains.forEach(d => {
      total += this.getSkillsForDomain(d.id).length;
    });
    return total;
  }

  /** Resolve dynamic domain color with fallback palette */
  getDomainColor(domain: TreeNode, index = 0): string {
    if (domain.color && domain.color.trim() !== '') {
      return domain.color;
    }
    return FALLBACK_DOMAIN_COLORS[index % FALLBACK_DOMAIN_COLORS.length];
  }

  /** Find related projects for a given skill node */
  getRelatedProjects(skillId: string): Project[] {
    const matchingLinks = this.projectLinks.filter(l => l.nodeId === skillId);
    const linkedProjectIds = new Set(matchingLinks.map(l => l.projectId));
    return this.projects.filter(p => linkedProjectIds.has(p.id));
  }

  /** Find related experience entries for a skill name */
  getRelatedExperience(skillName: string): WorkExperience[] {
    return this.experience.filter((e: WorkExperience) =>
      e.skillsUsed && e.skillsUsed.some((s: string) => s.toLowerCase() === skillName.toLowerCase())
    );
  }

  /** Find related certifications for a skill name */
  getRelatedCertifications(skillName: string): Certification[] {
    return this.certifications.filter((c: Certification) =>
      c.skillsValidated && c.skillsValidated.some((s: string) => s.toLowerCase() === skillName.toLowerCase())
    );
  }

  /** Build a complete CollectedSkill object from a skill node & domain */
  buildCollectedSkill(skill: TreeNode, domain: TreeNode, domainColor: string): CollectedSkill {
    return {
      id: `${domain.id}-${skill.id}`,
      skill,
      domain,
      domainColor,
      collectedAt: Date.now(),
      subSkills: this.getSubSkills(skill),
      relatedProjects: this.getRelatedProjects(skill.id),
      relatedExperience: this.getRelatedExperience(skill.name),
      relatedCertifications: this.getRelatedCertifications(skill.name),
    };
  }
}
