import type { TreeNode } from '../../../types/cms';

/**
 * DiscoveryTracker
 * Tracks unique skill discoveries to prevent duplication.
 * Ensures every available skill is discovered exactly once per cycle.
 */
export class DiscoveryTracker {
  private discoveredSkillIds: Set<string> = new Set();
  private totalSkillsCount = 0;

  constructor(totalSkillsCount = 0) {
    this.totalSkillsCount = totalSkillsCount;
  }

  setTotalSkillsCount(count: number) {
    this.totalSkillsCount = count;
  }

  markDiscovered(skillId: string) {
    this.discoveredSkillIds.add(skillId);
  }

  isDiscovered(skillId: string): boolean {
    return this.discoveredSkillIds.has(skillId);
  }

  /**
   * Get next undiscovered skill from a domain's skill pool.
   * If all skills in this domain are discovered, fallback to any undiscovered skill.
   */
  getNextSkillToDiscover(domainSkills: TreeNode[], allSkillsPool: TreeNode[] = []): TreeNode | null {
    // 1. Try to find undiscovered skill in current domain
    const undiscoveredInDomain = (domainSkills || []).filter(s => !this.discoveredSkillIds.has(s.id));
    if (undiscoveredInDomain.length > 0) {
      return undiscoveredInDomain[Math.floor(Math.random() * undiscoveredInDomain.length)];
    }

    // 2. Fallback: try to find undiscovered skill in global pool
    const undiscoveredGlobal = (allSkillsPool || []).filter(s => !this.discoveredSkillIds.has(s.id));
    if (undiscoveredGlobal.length > 0) {
      return undiscoveredGlobal[Math.floor(Math.random() * undiscoveredGlobal.length)];
    }

    return null;
  }

  getDiscoveredCount(): number {
    return this.discoveredSkillIds.size;
  }

  getTotalSkillsCount(): number {
    return this.totalSkillsCount;
  }

  getProgressPercentage(): number {
    if (this.totalSkillsCount <= 0) return 0;
    return Math.min(100, Math.round((this.discoveredSkillIds.size / this.totalSkillsCount) * 100));
  }

  isAllExplored(): boolean {
    return this.totalSkillsCount > 0 && this.discoveredSkillIds.size >= this.totalSkillsCount;
  }

  reset() {
    this.discoveredSkillIds.clear();
  }
}
