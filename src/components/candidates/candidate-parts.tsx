import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/types/candidate";

export const formatUploaded = (date: string) => {
  const days = Math.max(0, Math.floor((Date.now() - Date.parse(date)) / 86400000));
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
};

export function SkillList({ skills, limit = 4 }: { skills: string[]; limit?: number }) {
  return <div className="flex flex-wrap gap-1.5">{skills.slice(0, limit).map((skill) => <Badge key={skill} variant="secondary" className="rounded px-2 py-0.5 font-normal">{skill}</Badge>)}{skills.length > limit && <span className="px-1 py-0.5 text-xs text-muted-foreground">+{skills.length - limit}</span>}</div>;
}

export function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  if (!candidates.length) return <div className="border-y border-border px-6 py-16 text-center"><div className="mx-auto grid size-11 place-items-center rounded-md bg-secondary"><FileText size={20} /></div><h3 className="mt-4 font-semibold">No candidates found</h3><p className="mt-1 text-sm text-muted-foreground">Try a broader search or clear some filters.</p><Button asChild variant="outline" className="mt-4"><Link to="/candidates">View all candidates</Link></Button></div>;
  return <>
    <div className="hidden grid-cols-[minmax(180px,1.45fr)_minmax(150px,1fr)_96px_minmax(180px,1.2fr)_92px_70px] gap-3 border-b border-border px-4 py-2.5 font-mono text-[9px] uppercase text-muted-foreground lg:grid"><span>Candidate</span><span>Role</span><span>Experience</span><span>Top skills</span><span>Added</span><span /></div>
    <div className="divide-y divide-border">{candidates.map((candidate) => <div key={candidate.id} className="grid gap-3 px-4 py-3 transition-colors hover:bg-accent-soft/30 lg:grid-cols-[minmax(180px,1.45fr)_minmax(150px,1fr)_96px_minmax(180px,1.2fr)_92px_70px] lg:items-center">
      <div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-xs font-semibold text-foreground">{candidate.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0"><Link to="/candidates/$id" params={{ id: candidate.id }} className="block truncate text-sm font-medium hover:underline">{candidate.name}</Link><div className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground lg:hidden"><MapPin size={11} />{candidate.location}</div></div></div>
      <span className="truncate text-xs text-muted-foreground">{candidate.currentRole}</span><span className="text-xs text-muted-foreground">{candidate.experienceYears} yrs</span><div className="hidden lg:block"><SkillList skills={candidate.skills} limit={3} /></div><span className="text-[11px] text-muted-foreground">{formatUploaded(candidate.uploadedAt)}</span>
      <Button asChild size="sm" variant="outline" className="w-fit"><Link to="/candidates/$id" params={{ id: candidate.id }}>View <ArrowUpRight size={13} /></Link></Button>
    </div>)}</div>
  </>;
}

export function CandidateResult({ candidate, onResume }: { candidate: Candidate; onResume: (candidate: Candidate) => void }) {
  return <article className="border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-accent-soft/20 sm:px-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent-soft text-sm font-semibold">{candidate.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="min-w-0"><Link to="/candidates/$id" params={{ id: candidate.id }} className="text-sm font-semibold hover:underline">{candidate.name}</Link><p className="mt-0.5 text-xs text-muted-foreground">{candidate.currentRole}</p><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>{candidate.experienceYears} years experience</span><span className="inline-flex items-center gap-1"><MapPin size={12} />{candidate.location}</span><span>{candidate.availability}</span></div></div></div>
      <div className="flex shrink-0 gap-2"><Button asChild size="sm" variant="outline"><Link to="/candidates/$id" params={{ id: candidate.id }}>View profile</Link></Button><Button size="sm" variant="ghost" onClick={() => onResume(candidate)}><FileText size={14} />Resume</Button></div>
    </div>
    <div className="mt-3 sm:ml-[52px]"><SkillList skills={candidate.skills} limit={6} /></div>
    <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground sm:ml-[52px]">{candidate.summary}</p>
  </article>;
}
