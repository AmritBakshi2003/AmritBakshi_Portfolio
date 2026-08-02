import type { TreeNode } from '../../../types/cms';

/** Fisher-Yates shuffle array utility */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * GhostDomainManager
 * Manages domain rotation using a shuffled queue so every visible domain
 * is assigned exactly once before repeating.
 */
export class GhostDomainManager {
  private domains: TreeNode[] = [];
  private domainQueue: TreeNode[] = [];

  constructor(domains: TreeNode[]) {
    this.updateDomains(domains);
  }

  /** Sync active domains list when CMS updates */
  updateDomains(domains: TreeNode[]) {
    this.domains = domains;
    this.refillQueue();
  }

  /** Refill and shuffle the domain queue */
  private refillQueue() {
    if (this.domains.length === 0) {
      this.domainQueue = [];
      return;
    }
    this.domainQueue = shuffleArray(this.domains);
  }

  /** Get the next domain from the queue (refilling if empty) */
  getNextDomain(): TreeNode | null {
    if (this.domains.length === 0) return null;
    if (this.domainQueue.length === 0) {
      this.refillQueue();
    }
    return this.domainQueue.shift() || null;
  }

  /** Get all available visible domains */
  getDomains(): TreeNode[] {
    return this.domains;
  }

  getTotalDomainsCount(): number {
    return this.domains.length;
  }

  reset() {
    this.refillQueue();
  }
}
