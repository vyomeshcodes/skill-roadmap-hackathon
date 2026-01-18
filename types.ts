
export enum DomainType {
  HEALTHCARE_TECH = 'Healthcare Tech',
  AGRI_TECH = 'Agriculture Tech',
  SMART_CITY = 'Smart City'
}

export interface SkillScore {
  subject: string;
  current: number;
  required: number;
  fullMark: number;
}

export interface RoadmapStep {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedWeeks: number;
}

export interface PortfolioSection {
  id: string;
  type: 'text' | 'project' | 'skill-cloud' | 'experience';
  title: string;
  content: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  sector: DomainType;
  skills: string[];
  assessmentScore?: number;
  roadmaps: any[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
