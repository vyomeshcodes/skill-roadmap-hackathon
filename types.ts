
export enum Sector {
  HEALTHCARE = 'Healthcare Informatics',
  AGRICULTURE = 'Agricultural Technology',
  SMART_CITY = 'Urban & Smart City Systems',
  FINTECH = 'Financial Technology',
  RENEWABLE_ENERGY = 'Renewable Energy Systems'
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export type ViewState = 'landing' | 'auth' | 'assessment' | 'dashboard' | 'projects' | 'portfolio' | 'mentors';

export interface Course {
  title: string;
  platform: string;
  url: string;
}

export interface Project {
  title: string;
  difficulty: string;
  description: string;
  milestones?: string[];
}

export interface RoadmapStep {
  week: number;
  topic: string;
  description: string;
  resources: string[];
  tasks: string[];
  suggestedCourses: Course[];
}

export interface UserProfile {
  name: string;
  goal: string;
  skills: string[];
  sector: Sector;
  studyHoursPerDay: number;
  level: SkillLevel;
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  recommendation: string;
  roadmap: RoadmapStep[];
  featuredProjects: Project[];
  readinessScore: number;
  baselineScore: number;
}

export interface PortfolioStrategy {
  tagline: string;
  sections: {
    title: string;
    description: string;
    items: string[];
  }[];
  personalBrandAdvice: string;
  suggestedCaseStudies: string[];
}

// Added Opportunity interface to fix import error in OpportunitiesView
export interface Opportunity {
  title: string;
  organization: string;
  type: 'Internship' | 'Job' | 'Program' | string;
  description: string;
  url: string;
}
