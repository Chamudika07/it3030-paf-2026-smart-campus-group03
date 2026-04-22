import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    login("Team Leader", "ADMIN");
    navigate("/dashboard");
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <Card className="grid w-full max-w-5xl gap-8 overflow-hidden lg:grid-cols-[1.2fr_0.8fr] lg:p-0">
        <div className="space-y-6 bg-[#0F172A] px-8 py-10 text-white lg:px-10 lg:py-12">
          <Badge tone="orange" className="w-fit">
            Campus operations
          </Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Smart Campus Operations Hub</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              A clean, modern SaaS-style workspace for campus resource management, maintenance
              tickets, technician actions, and notification-driven workflows.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Blue drives primary actions and navigation.
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Orange highlights important alerts and high-attention states.
            </div>
          </div>
        </div>

        <div className="space-y-6 px-8 py-10 lg:px-10 lg:py-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
              Demo access
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Sign in</h2>
            <p className="text-sm leading-6 text-[#334155]">
              Use the demo login for now, then replace it with Google OAuth 2.0 when the
              backend auth flow is ready.
            </p>
          </div>

          <div className="rounded-2xl bg-[#DBEAFE] p-5">
            <p className="text-sm font-semibold text-[#1D4ED8]">Current experience</p>
            <p className="mt-1 text-sm leading-6 text-[#1E3A8A]">
              One-click access is kept for development so the team can test the full dashboard quickly.
            </p>
          </div>

          <Button onClick={handleDemoLogin} className="w-full justify-center">
            Continue with Demo Login
          </Button>
        </div>
      </Card>
    </section>
  );
}
