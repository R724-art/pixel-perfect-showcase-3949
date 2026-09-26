import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { authService, type Recruiter } from "@/lib/api/auth-service";

export const Route = createFileRoute("/_workspace/settings")({
  head: () => ({ meta: [{ title: "Settings | Archivum" }, { name: "description", content: "Manage recruiter details and workspace display preferences." }, { property: "og:title", content: "Settings | Archivum" }, { property: "og:description", content: "Manage recruiter details and workspace display preferences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [profile, setProfile] = useState<Recruiter>({ name: "Dana Okafor", company: "Meridian Studio", email: "dana@meridian.example" });
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void authService.getCurrentUser().then(setProfile);
    setDarkMode(window.localStorage.getItem("archivum-theme") === "dark");
  }, []);

  const changeTheme = (enabled: boolean) => {
    setDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    window.localStorage.setItem("archivum-theme", enabled ? "dark" : "light");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    void authService.updateProfile(profile).then(setProfile).then(() => setSaved(true));
  };

  return <div className="mx-auto max-w-3xl space-y-7">
    <div><p className="font-mono text-[9px] uppercase text-accent">Workspace preferences</p><h1 className="mt-1 text-2xl font-semibold">Settings</h1><p className="mt-1 text-sm text-muted-foreground">Your recruiter profile and display preferences.</p></div>
    <section className="border-y border-border py-5">
      <div className="flex items-center gap-2"><UserRound size={16} /><h2 className="text-base font-semibold">Recruiter profile</h2></div>
      <form onSubmit={saveProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium">Full name<Input required value={profile.name} onChange={(event) => { setProfile({ ...profile, name: event.target.value }); setSaved(false); }} autoComplete="name" /></label>
        <label className="space-y-1.5 text-xs font-medium">Company name<Input required value={profile.company} onChange={(event) => { setProfile({ ...profile, company: event.target.value }); setSaved(false); }} autoComplete="organization" /></label>
        <label className="space-y-1.5 text-xs font-medium sm:col-span-2">Work email<Input required type="email" value={profile.email} onChange={(event) => { setProfile({ ...profile, email: event.target.value }); setSaved(false); }} autoComplete="email" /></label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><Button type="submit">Save profile</Button>{saved && <p role="status" className="text-xs text-muted-foreground">Updated for this demo session only.</p>}</div>
      </form>
    </section>
    <section className="border-b border-border pb-5">
      <h2 className="text-base font-semibold">Appearance</h2>
      <div className="mt-4 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-md bg-secondary">{darkMode ? <Moon size={16} /> : <Sun size={16} />}</span><span><span className="block text-sm font-medium">Dark mode</span><span className="mt-1 block text-xs text-muted-foreground">Use a darker workspace appearance.</span></span></div><Switch checked={darkMode} onCheckedChange={changeTheme} aria-label="Dark mode" /></div>
    </section>
    <p className="text-xs text-muted-foreground">Account details are simulated for this demo and are not saved to a connected account.</p>
  </div>;
}