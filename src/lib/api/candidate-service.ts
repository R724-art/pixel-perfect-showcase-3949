import { mockCandidates } from "@/lib/mock/candidates";
import type { Candidate, CandidateSearchParams } from "@/types/candidate";

export interface CandidateService {
  getCandidates(params?: CandidateSearchParams): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  searchCandidates(params: CandidateSearchParams): Promise<Candidate[]>;
  getResumeUrl(id: string): Promise<string | undefined>;
}

const matchesFreshness = (candidate: Candidate, freshness?: string) => {
  if (!freshness || freshness === "any") return true;
  const days = { week: 7, month: 30, quarter: 90, year: 365 }[freshness as "week" | "month" | "quarter" | "year"];
  return days === undefined || Date.now() - new Date(candidate.uploadedAt).getTime() <= days * 86400000;
};

const filterCandidates = (params: CandidateSearchParams) => {
  const query = params.query?.trim().toLocaleLowerCase();
  const skills = params.skills?.map((skill) => skill.toLocaleLowerCase()).filter(Boolean) ?? [];
  return mockCandidates.filter((candidate) => {
    const searchable = [candidate.name, candidate.currentRole, candidate.location, ...candidate.skills].join(" ").toLocaleLowerCase();
    return (!query || query.split(/\s+/).every((term) => searchable.includes(term)))
      && (params.minExperience === undefined || candidate.experienceYears >= params.minExperience)
      && (params.maxExperience === undefined || candidate.experienceYears <= params.maxExperience)
      && skills.every((skill) => candidate.skills.some((candidateSkill) => candidateSkill.toLocaleLowerCase() === skill))
      && (!params.role || candidate.currentRole.toLocaleLowerCase().includes(params.role.toLocaleLowerCase()))
      && (!params.location || candidate.location.toLocaleLowerCase().includes(params.location.toLocaleLowerCase()))
      && (!params.education || params.education === "any" || candidate.education.some((education) => education.level.toLowerCase() === params.education?.toLowerCase()))
      && matchesFreshness(candidate, params.freshness);
  }).sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt));
};

export const candidateService: CandidateService = {
  async getCandidates(params = {}) { return filterCandidates(params); },
  async getCandidate(id) { return mockCandidates.find((candidate) => candidate.id === id); },
  async searchCandidates(params) { return filterCandidates(params); },
  async getResumeUrl() { return undefined; },
};

export const candidateQueryKeys = {
  all: ["candidates"] as const,
  list: (params: CandidateSearchParams = {}) => ["candidates", "list", params] as const,
  detail: (id: string) => ["candidates", "detail", id] as const,
};
