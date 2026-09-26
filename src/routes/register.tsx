import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Archive, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/auth-service";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account | Archivum" }, { name: "description", content: "Create a recruiter workspace demo account for Archivum." }, { property: "og:title", content: "Create Account | Archivum" }, { property: "og:description", content: "Create a recruiter workspace demo account for Archivum." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const validPassword = password.length >= 8;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validPassword) { setError("Use at least 8 characters for your password."); return; }
    if (password !== confirmation) { setError("Passwords do not match."); return; }
    setError("");
    void authService.register(name, company, email, password).then(() => navigate({ to: "/" }));
  };

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
    <div className="w-full max-w-md">
      <Link to="/" className="mb-8 inline-flex items-center gap-3" aria-label="Archivum home"><span className="grid size-10 place-items-center rounded-md bg-foreground text-background"><Archive size={19} /></span><span><span className="block text-sm font-semibold">Archivum</span><span className="mt-1 block font-mono text-[9px] uppercase text-muted-foreground">Talent ledger</span></span></Link>
      <div className="border-y border-border py-7"><p className="font-mono text-[9px] uppercase text-accent">Recruiter workspace</p><h1 className="mt-2 text-2xl font-semibold">Create your account</h1><p className="mt-1 text-sm text-muted-foreground">Set up your demo recruiter profile.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-xs font-medium">Full name<Input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="block space-y-1.5 text-xs font-medium">Company name<Input autoComplete="organization" required value={company} onChange={(event) => setCompany(event.target.value)} /></label>
          <label className="block space-y-1.5 text-xs font-medium">Work email<Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="block space-y-1.5 text-xs font-medium">Password<Input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <p className={`flex items-center gap-2 text-xs ${validPassword ? "text-accent" : "text-muted-foreground"}`}><Check size={13} aria-hidden="true" />At least 8 characters</p>
          <label className="block space-y-1.5 text-xs font-medium">Confirm password<Input type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
          {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Create account <ArrowRight size={15} /></Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link></p>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Demo account flow · details are not saved.</p>
    </div>
  </main>;
}