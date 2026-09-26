import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/auth-service";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In | Archivum" }, { name: "description", content: "Sign in to the Archivum recruiter workspace demo." }, { property: "og:title", content: "Sign In | Archivum" }, { property: "og:description", content: "Sign in to the Archivum recruiter workspace demo." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    void authService.login(email, password).then(() => navigate({ to: "/" }));
  };

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
    <div className="w-full max-w-md">
      <Link to="/" className="mb-8 inline-flex items-center gap-3" aria-label="Archivum home"><span className="grid size-10 place-items-center rounded-md bg-foreground text-background"><Archive size={19} /></span><span><span className="block text-sm font-semibold">Archivum</span><span className="mt-1 block font-mono text-[9px] uppercase text-muted-foreground">Talent ledger</span></span></Link>
      <div className="border-y border-border py-7"><p className="font-mono text-[9px] uppercase text-accent">Recruiter workspace</p><h1 className="mt-2 text-2xl font-semibold">Welcome back</h1><p className="mt-1 text-sm text-muted-foreground">Sign in to your candidate archive.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-xs font-medium">Email<Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></label>
          <label className="block space-y-1.5 text-xs font-medium">Password<Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <div className="flex items-center justify-between gap-3 text-xs"><label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-3.5 accent-accent" />Remember me</label><button type="button" className="text-accent hover:underline" onClick={() => setMessage("Password recovery is not available in this demo.")}>Forgot password?</button></div>
          {message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}
          <Button type="submit" className="w-full">Sign in <ArrowRight size={15} /></Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">New to Archivum? <Link to="/register" className="font-medium text-accent hover:underline">Create an account</Link></p>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Demo account flow · no real sign-in occurs.</p>
    </div>
  </main>;
}