import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CandidateResult } from "@/components/candidates/candidate-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { candidateQueryKeys, candidateService } from "@/lib/api/candidate-service";
import type { CandidateSearchParams } from "@/types/candidate";

interface SearchState { q?: string; minExperience?: string; maxExperience?: string; skills?: string; role?: string; location?: string; education?: string; freshness?: string; page?: string }
const skillOptions = ["Python", "FastAPI", "Django", "Java", "Spring Boot", "React", "Angular", "AWS", "Docker", "MongoDB", "PostgreSQL"];
const roleOptions = ["Python Developer", "Backend Developer", "Full Stack Developer", "Java Developer", "Frontend Developer", "Data Engineer"];
const parseSearch = (raw: Record<string, unknown>): SearchState => ({ q: typeof raw["q"] === "string" ? raw["q"] : "", minExperience: typeof raw["minExperience"] === "string" ? raw["minExperience"] : "", maxExperience: typeof raw["maxExperience"] === "string" ? raw["maxExperience"] : "", skills: typeof raw["skills"] === "string" ? raw["skills"] : "", role: typeof raw["role"] === "string" ? raw["role"] : "", location: typeof raw["location"] === "string" ? raw["location"] : "", education: typeof raw["education"] === "string" ? raw["education"] : "any", freshness: typeof raw["freshness"] === "string" ? raw["freshness"] : "any", page: typeof raw["page"] === "string" ? raw["page"] : "1" });
const paramsFor = (state: SearchState): CandidateSearchParams => ({
  ...(state.q ? { query: state.q } : {}),
  ...(state.minExperience ? { minExperience: Number(state.minExperience) } : {}),
  ...(state.maxExperience ? { maxExperience: Number(state.maxExperience) } : {}),
  ...(state.skills ? { skills: state.skills.split(",").filter(Boolean) } : {}),
  ...(state.role ? { role: state.role } : {}),
  ...(state.location ? { location: state.location } : {}),
  ...(state.education ? { education: state.education } : {}),
  ...(state.freshness ? { freshness: state.freshness } : {}),
});

export const Route = createFileRoute("/_workspace/search")({
  validateSearch: parseSearch,
  loaderDeps: ({ search }) => ({ ...search }),
  loader: ({ context, deps }) => { const state = parseSearch(deps); const params = paramsFor(state); return context.queryClient.ensureQueryData({ queryKey: candidateQueryKeys.list(params), queryFn: () => candidateService.searchCandidates(params) }); },
  head: () => ({ meta: [{ title: "Find Candidates | Archivum Talent Ledger" }, { name: "description", content: "Search candidate profiles by role, skills, experience, location, and education." }, { property: "og:title", content: "Find Candidates | Archivum" }, { property: "og:description", content: "Search and filter the recruiter candidate archive." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CandidateSearchPage,
});

function CandidateSearchPage() {
  const searchState = Route.useSearch();
  const current = parseSearch(searchState as Record<string, unknown>);
  const navigate = Route.useNavigate();
  const params = paramsFor(current);
  const { data: candidates } = useSuspenseQuery({ queryKey: candidateQueryKeys.list(params), queryFn: () => candidateService.searchCandidates(params) });
  const [draft, setDraft] = useState(current);
  const [resume, setResume] = useState<string | null>(null);
  useEffect(() => setDraft(current), [searchState]);
  const selectedSkills = draft.skills?.split(",").filter(Boolean) ?? [];
  const submit = (event: React.FormEvent) => { event.preventDefault(); void navigate({ search: { ...draft, page: "1" } }); };
  const clear = () => { const cleared: SearchState = { q: "", minExperience: "", maxExperience: "", skills: "", role: "", location: "", education: "any", freshness: "any", page: "1" }; setDraft(cleared); void navigate({ search: cleared }); };
  const addSkill = (skill: string, checked: boolean) => { const next = checked ? [...selectedSkills, skill] : selectedSkills.filter((selected) => selected !== skill); setDraft({ ...draft, skills: next.join(",") }); };
  const page = Math.max(1, Number(current.page) || 1);
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(candidates.length / pageSize));
  const visible = candidates.slice((page - 1) * pageSize, page * pageSize);
  return <div className="space-y-5">
    <div><p className="font-mono text-[9px] uppercase text-accent">Candidate discovery</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Find candidates</h1><p className="mt-1 text-sm text-muted-foreground">Search the sample archive by role, skills, or experience.</p></div>
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search candidates by role skills or experience" value={draft.q ?? ""} onChange={(event) => setDraft({ ...draft, q: event.target.value })} placeholder="Search candidates by role, skills, or experience…" className="h-11 pl-10" /></div><Button type="submit" className="h-11 px-6"><Search size={15} /> Search</Button></form>
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="font-medium text-foreground">Try:</span>{["Python developer", "Java Spring Boot", "Frontend React", "Python AWS"].map((example) => <button key={example} type="button" onClick={() => { setDraft({ ...draft, q: example }); void navigate({ search: { ...current, q: example, page: "1" } }); }} className="rounded border border-border px-2 py-1 hover:bg-secondary">{example}</button>)}</div>
    <div className="grid items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-surface/60 p-4">
        <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal size={15} /> Filters</div><button type="button" onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button></div>
        <label className="block text-xs font-medium">Minimum experience<input type="number" min="0" max="50" value={draft.minExperience ?? ""} onChange={(event) => setDraft({ ...draft, minExperience: event.target.value })} placeholder="Any" className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm" /></label>
        <label className="block text-xs font-medium">Maximum experience<input type="number" min="0" max="50" value={draft.maxExperience ?? ""} onChange={(event) => setDraft({ ...draft, maxExperience: event.target.value })} placeholder="Any" className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm" /></label>
        <label className="block text-xs font-medium">Job role<select value={draft.role ?? ""} onChange={(event) => setDraft({ ...draft, role: event.target.value })} className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Any role</option>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select></label>
        <label className="block text-xs font-medium">Location<input value={draft.location ?? ""} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="Any location" className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm" /></label>
        <label className="block text-xs font-medium">Education<select value={draft.education ?? "any"} onChange={(event) => setDraft({ ...draft, education: event.target.value })} className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="any">Any education</option><option value="Bachelor's">Bachelor's</option><option value="Master's">Master's</option><option value="PhD">PhD</option></select></label>
        <label className="block text-xs font-medium">Resume freshness<select value={draft.freshness ?? "any"} onChange={(event) => setDraft({ ...draft, freshness: event.target.value })} className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="any">Any time</option><option value="week">Last 7 days</option><option value="month">Last 30 days</option><option value="quarter">Last 3 months</option><option value="year">Last year</option></select></label>
        <fieldset><legend className="mb-2 text-xs font-medium">Skills</legend><div className="grid grid-cols-2 gap-y-2">{skillOptions.map((skill) => <label key={skill} className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={selectedSkills.includes(skill)} onChange={(event) => addSkill(skill, event.target.checked)} className="size-3.5 accent-accent" />{skill}</label>)}</div></fieldset>
        <Button type="submit" className="w-full">Apply filters</Button>
      </form>
      <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface/50" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h2 className="text-sm font-semibold">{candidates.length} candidates found</h2><p className="mt-1 text-[11px] text-muted-foreground">Sorted by recently added · match scores unavailable</p></div><span className="font-mono text-[9px] uppercase text-muted-foreground">Page {page} of {pageCount}</span></div>
        {visible.length ? visible.map((candidate) => <CandidateResult key={candidate.id} candidate={candidate} onResume={(selected) => setResume(selected.name)} />) : <div className="px-6 py-16 text-center"><div className="mx-auto grid size-11 place-items-center rounded-md bg-secondary"><Search size={19} /></div><h3 className="mt-4 font-semibold">No candidates found</h3><p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Try removing filters, reducing the minimum experience, or searching for a broader role.</p><Button variant="outline" className="mt-4" onClick={clear}>Clear filters</Button></div>}
        {candidates.length > pageSize && <div className="flex items-center justify-between border-t border-border px-4 py-3"><span className="text-xs text-muted-foreground">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, candidates.length)} of {candidates.length}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => void navigate({ search: { ...current, page: String(page - 1) } })}>Previous</Button><Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => void navigate({ search: { ...current, page: String(page + 1) } })}>Next</Button></div></div>}
      </section>
    </div>
    {resume && <div role="dialog" aria-modal="true" aria-labelledby="resume-dialog-title" className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setResume(null)}><div className="w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><div><h2 id="resume-dialog-title" className="text-base font-semibold">{resume} · Resume</h2><p className="mt-1 text-xs text-muted-foreground">Resume document unavailable in the demo archive.</p></div><Button variant="ghost" size="icon" aria-label="Close resume dialog" onClick={() => setResume(null)}><X size={16} /></Button></div><div className="mt-5 border-y border-border py-8 text-center"><p className="text-sm font-medium">No resume file is attached</p><p className="mt-2 text-xs text-muted-foreground">A connected service must provide the original PDF before it can be viewed or downloaded.</p></div><div className="mt-4 flex justify-end"><Button variant="outline" onClick={() => setResume(null)}>Close</Button></div></div></div>}
  </div>;
}
