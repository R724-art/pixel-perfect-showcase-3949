import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CircleHelp, FileUp, LayoutDashboard, LogOut, Menu, Search, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { authService } from "@/lib/api/auth-service";
import { useNavigate } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/search", label: "Find candidates", icon: Search },
  { to: "/upload", label: "Upload resumes", icon: FileUp },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return <Link to="/" className="flex items-center gap-3 rounded-md px-2 py-3" aria-label="Archivum dashboard">
    <span className="grid size-9 place-items-center rounded-md bg-foreground font-mono text-xs font-medium text-background">AV</span>
    <span className="leading-tight"><span className="block text-sm font-semibold">Archivum</span><span className="mt-1 block font-mono text-[9px] uppercase text-muted-foreground">Talent ledger</span></span>
  </Link>;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return <nav aria-label="Workspace" className="space-y-1">
    {links.map(({ to, label, icon: Icon }) => {
      const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
      return <Link key={to} to={to} onClick={onNavigate} className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors ${active ? "bg-accent-soft font-medium text-foreground ring-1 ring-accent/20" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"}`}>
        <Icon size={16} strokeWidth={1.8} aria-hidden="true" />{label}
      </Link>;
    })}
  </nav>;
}

function SidebarContents({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  onNavigate ??= () => {};
  return <div className="flex h-full flex-col px-3 py-4">
    <Brand />
    <div className="mb-2 mt-7 px-3 font-mono text-[9px] uppercase text-muted-foreground">Workspace</div>
    <SidebarNav onNavigate={onNavigate} />
    <div className="mt-auto space-y-3 pt-6">
      <div className="rounded-md border border-border bg-surface/70 p-3">
        <div className="font-mono text-[9px] uppercase text-muted-foreground">Workspace</div>
        <div className="mt-1 text-sm font-medium">Meridian Studio</div>
        <div className="mt-1 text-xs text-muted-foreground">3 open roles</div>
      </div>
      <div className="flex items-center gap-3 border-t border-border px-2 pt-3">
        <span className="grid size-9 place-items-center rounded-md bg-secondary text-xs font-semibold">DO</span>
        <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">Dana Okafor</span><span className="mt-0.5 block truncate text-[11px] text-muted-foreground">Senior recruiter</span></span>
        <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={() => { void authService.logout().then(() => navigate({ to: "/login" })); }}><LogOut size={15} /></Button>
      </div>
    </div>
  </div>;
}

export function WorkspaceLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const current = links.find((item) => item.to === pathname || (item.to !== "/" && pathname.startsWith(item.to)));
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-border bg-surface/60 backdrop-blur-xl md:block"><SidebarContents /></aside>
    <div className="min-w-0 md:pl-56">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="flex min-h-14 items-center gap-3 px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation"><Menu size={18} /></Button></SheetTrigger>
            <SheetContent side="left" className="w-64 p-0"><SheetTitle className="sr-only">Workspace navigation</SheetTitle><SidebarContents onNavigate={() => setOpen(false)} /></SheetContent>
          </Sheet>
          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input aria-label="Search candidates" onKeyDown={(event) => { if (event.key === "Enter") window.location.assign(`/search?q=${encodeURIComponent(event.currentTarget.value)}`); }} placeholder="Search candidates, roles, skills…" className="h-9 w-full rounded-md border border-border bg-surface/70 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="ml-auto hidden items-center gap-2 lg:flex"><span className="rounded bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground">20 candidates</span><span className="rounded bg-secondary px-2 py-1 font-mono text-[10px] text-muted-foreground">Demo workspace</span></div>
          <Button asChild size="sm" className="shrink-0"><Link to="/upload"><FileUp size={15} /> <span className="hidden sm:inline">New upload</span><span className="sm:hidden">Upload</span></Link></Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications"><Bell size={16} /></Button>
          <Button variant="ghost" size="icon" aria-label="Help" title="Help"><CircleHelp size={16} /></Button>
          <span className="hidden size-8 place-items-center rounded-md bg-secondary text-xs font-semibold sm:grid">DO</span>
        </div>
        <div className="border-t border-border px-4 py-2 font-mono text-[9px] uppercase text-muted-foreground md:hidden">{current?.label ?? "Workspace"}</div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6"><Outlet /></main>
    </div>
  </div>;
}
