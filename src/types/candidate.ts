export type EducationLevel = "Bachelor's" | "Master's" | "PhD";

export interface CandidateExperience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface CandidateEducation {
  degree: string;
  school: string;
  period: string;
  level: EducationLevel;
}

export interface CandidateProject {
  name: string;
  description: string;
  stack: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  currentRole: string;
  experienceYears: number;
  skills: string[];
  education: CandidateEducation[];
  experience: CandidateExperience[];
  projects: CandidateProject[];
  certifications: string[];
  summary: string;
  resumeUrl?: string;
  uploadedAt: string;
  availability: "Available" | "Open to opportunities" | "Not specified";
}

export interface CandidateSearchParams {
  query?: string;
  minExperience?: number;
  maxExperience?: number;
  skills?: string[];
  role?: string;
  location?: string;
  education?: string;
  freshness?: string;
  page?: number;
  limit?: number;
}
