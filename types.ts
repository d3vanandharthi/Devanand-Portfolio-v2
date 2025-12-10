
export enum SectionId {
  HERO = 'hero',
  // ABOUT removed
  SKILLS = 'skills',
  EXPERIENCE = 'experience',
  PROJECTS = 'projects',
  CONTACT = 'contact'
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  tech: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  stats?: string;
}

export interface SkillNode {
  id: string;
  group: number;
  radius: number;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
