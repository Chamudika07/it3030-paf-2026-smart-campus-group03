import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const [searchParams] = useSearchParams();
  const hasOAuthError = searchParams.get("error") === "oauth";

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 bg-[#0F172A] px-8 py-10 text-white lg:px-10 lg:py-12">
          <div className="inline-flex w-fit rounded-full bg-[#F59E0B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#10212F]">
            Secure campus access
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Smart Campus Operations Hub</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Sign in with your Google account to access bookings, tickets, resources, notifications,
              and role-based campus workflows.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Use your authorized Google account to enter the operations workspace.
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              Admin and technician permissions are applied automatically after sign-in.
            </div>
          </div>
        </div>

        <div className="space-y-6 px-8 py-10 lg:px-10 lg:py-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">
              Authentication
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Sign in</h2>
            <p className="text-sm leading-6 text-[#334155]">
              Continue with Google OAuth to open your dashboard session.
            </p>
          </div>

          {hasOAuthError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <p className="text-sm font-semibold text-rose-700">Google sign-in failed</p>
              <p className="mt-1 text-sm leading-6 text-rose-800">
                Please verify your Google account access or OAuth redirect settings and try again.
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl bg-[#DBEAFE] p-5">
            <p className="text-sm font-semibold text-[#1D4ED8]">OAuth login</p>
            <p className="mt-1 text-sm leading-6 text-[#1E3A8A]">
              This project uses backend-managed Google authentication and redirects back into the app.
            </p>
          </div>

          <button onClick={login} disabled={loading} className="button-link google-login-button">
            {loading ? "Checking session..." : "Continue with Google"}
          </button>
        </div>
      </div>
    </section>
  );
}
