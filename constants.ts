
import { Sector, SkillLevel } from './types';

export const SECTORS = [
  Sector.HEALTHCARE,
  Sector.AGRICULTURE,
  Sector.SMART_CITY,
  Sector.FINTECH,
  Sector.RENEWABLE_ENERGY
];

export const SKILL_LEVELS = [
  SkillLevel.BEGINNER,
  SkillLevel.INTERMEDIATE,
  SkillLevel.ADVANCED
];

export const SUGGESTED_SKILLS: Record<Sector, string[]> = {
  [Sector.HEALTHCARE]: ['Python', 'SQL', 'HL7/FHIR', 'Data Visualization', 'Medical Ethics', 'Pandas'],
  [Sector.AGRICULTURE]: ['IoT', 'GIS Systems', 'Python', 'Remote Sensing', 'Data Science', 'Sustainability'],
  [Sector.SMART_CITY]: ['Urban Planning', 'AutoCAD', 'Network Security', 'Public Policy', 'BIM', 'Big Data'],
  [Sector.FINTECH]: ['Blockchain', 'Java', 'Cryptography', 'Risk Management', 'APIs', 'Financial Modeling'],
  [Sector.RENEWABLE_ENERGY]: ['Energy Auditing', 'Solar Design', 'Project Management', 'CAD', 'Power Electronics', 'IoT']
};
