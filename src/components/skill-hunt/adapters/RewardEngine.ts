import type { TreeNode, Project, Certification, Achievement, WorkExperience } from '../../../types/cms';

export type RewardType = 'skill' | 'project' | 'certification' | 'achievement' | 'experience';

export interface Reward {
  type: RewardType;
  id: string;
  title: string;
  data: TreeNode | Project | Certification | Achievement | WorkExperience;
}

/**
 * RewardEngine
 * Extensible reward system that supports revealing skills, projects, achievements, etc.
 */
export class RewardEngine {
  static createSkillReward(skill: TreeNode): Reward {
    return {
      type: 'skill',
      id: skill.id,
      title: skill.name,
      data: skill,
    };
  }

  static createProjectReward(project: Project): Reward {
    return {
      type: 'project',
      id: project.id,
      title: project.title,
      data: project,
    };
  }
}
