import { Link } from "react-router-dom";
import { buttonStyles } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-10">
      <Card className="w-full max-w-xl space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94A3B8]">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Page not found</h1>
        <p className="text-sm leading-6 text-[#334155]">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex justify-center">
          <Link to="/dashboard" className={buttonStyles("primary")}>
            Go back to dashboard
          </Link>
        </div>
      </Card>
    </section>
  );
}
