import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <Link to="/dashboard">Go back to dashboard</Link>
      </div>
    </section>
  );
}

