
import { DomainType } from '../types';
import { generateRoadmap as callGeminiRoadmap } from './geminiService';

export const roadmapService = {
  generateRoadmap: async (skills: string[], sector: DomainType, goal: string) => {
    try {
      const roadmap = await callGeminiRoadmap(sector, skills, goal);
      return roadmap;
    } catch (error) {
      console.error('Roadmap generation failed, using fallback:', error);
      // Fallback mock roadmap
      return [
        {
          title: 'Foundational Mastery',
          description: 'Deep dive into core domain principles and initial toolset acquisition.',
          estimatedWeeks: 4,
          courseLink: 'https://www.coursera.org/'
        },
        {
          title: 'Advanced Implementation',
          description: 'Hands-on project work focusing on sector-specific challenges.',
          estimatedWeeks: 6,
          courseLink: 'https://www.udemy.com/'
        },
        {
          title: 'System Architecture',
          description: 'Learning to design high-level solutions for large scale problems.',
          estimatedWeeks: 8,
          courseLink: 'https://www.edx.org/'
        }
      ];
    }
  }
};
