import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, FileText, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateTable } from "@/components/candidates/candidate-parts";
import { candidateQueryKeys, candidateService } from "@/lib/api/candidate-service";

export const Route = createFileRoute("/_workspace/")({
  loader: ({ context }) => context.queryClient.ensureQueryData({ queryKey: candidateQueryKeys.list(), queryFn: () => candidateService.getCandidates() }),
  head: () => ({ meta: [{ title: "Dashboard | Archivum Talent Ledger" }, { name: "description", content: "Recruiter overview of recent candidates, resume activity, and talent search." }, { property: "og:title", content: "Recruiter Dashboard | Archivum" }, { property: "og:description", content: "A clear overview of your candidate archive and resume activity." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: DashboardPage,
});

const stats = [
  { title: "Total candidates", value: "1,248", note: "+12 this week", icon: Users },
  { title: "Resumes uploaded", value: "1,103", note: "16 awaiting review", icon: FileText },
  { title: "Searches this month", value: "342", note: "Across 3 open roles", icon: Search },
  { title: "Candidates viewed", value: "186", note: "This month", icon: BriefcaseBusiness },
];

function DashboardPage() {
  const { data: candidates } = useSuspenseQuery({ queryKey: candidateQueryKeys.list(), queryFn: () => candidateService.getCandidates() });
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[9px] uppercase text-accent">Dashboard · demo workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Good morning, Dana</h1><p className="mt-1 text-sm text-muted-foreground">Find the right candidate faster.</p></div><Button asChild variant="outline"><Link to="/search"><Search size={15} /> Search candidates <ArrowRight size={14} /></Link></Button></div>
    <section aria-label="Workspace statistics" className="overflow-hidden rounded-lg border border-border bg-surface/40">
      <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">{stats.map(({ title, value, note, icon: Icon }, index) => <div key={title} className={`bg-surface/80 p-4 sm:p-5 ${index > 1 ? "hidden sm:block" : ""} ${index > 1 ? "lg:block" : ""}`}><div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{title}</span><Icon size={15} className="text-muted-foreground" /></div><div className="mt-3 text-2xl font-semibold tabular-nums">{value}</div><div className="mt-1 text-[11px] text-muted-foreground">{note}</div></div>)}</div>
      <div className="border-t border-border bg-secondary/50 px-4 py-2 font-mono text-[9px] uppercase text-muted-foreground">Example workspace statistics · connected service not enabled</div>
    </section>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <section className="min-w-0"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-base font-semibold">Recent candidates</h2><p className="mt-1 text-xs text-muted-foreground">Latest profiles added to your archive</p></div><Button asChild variant="ghost" size="sm"><Link to="/candidates">View all <ArrowRight size={14} /></Link></Button></div><div className="overflow-hidden rounded-lg border border-border bg-surface/60"><CandidateTable candidates={candidates.slice(0, 7)} /></div></section>
      <aside className="space-y-5"><section><h2 className="mb-3 text-base font-semibold">Recent searches</h2><div className="divide-y divide-border border-y border-border">{[{ query: "Python Developer", params: "3+ years · FastAPI", count: "8 profiles" }, { query: "Frontend React", params: "TypeScript · 2+ years", count: "5 profiles" }, { query: "Java Spring Boot", params: "Any experience", count: "4 profiles" }].map((search) => <Link key={search.query} to="/search" search={{ q: search.query }} className="flex items-center justify-between gap-3 py-3 hover:text-accent"><span><span className="block text-sm font-medium">{search.query}</span><span className="mt-1 block text-[11px] text-muted-foreground">{search.params}</span></span><span className="whitespace-nowrap text-[10px] text-muted-foreground">{search.count}</span></Link>)}</div></section><section className="border-t border-border pt-4"><div className="flex items-center gap-2"><BriefcaseBusiness size={15} /><h2 className="text-sm font-semibold">Open roles</h2></div><div className="mt-3 space-y-3 text-xs"><div className="flex items-center justify-between"><span>Backend Engineer</span><span className="text-muted-foreground">8 profiles</span></div><div className="flex items-center justify-between"><span>Frontend Engineer</span><span className="text-muted-foreground">5 profiles</span></div><div className="flex items-center justify-between"><span>Data Engineer</span><span className="text-muted-foreground">4 profiles</span></div></div></section></aside>
    </div>
  </div>;
}
