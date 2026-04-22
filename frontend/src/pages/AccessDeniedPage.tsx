import { Link } from "react-router-dom";

export function AccessDeniedPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Access denied</p>
        <h1>Admin permission required</h1>
        <p className="muted-text">
          Your account is signed in, but this area is limited by role.
        </p>
        <Link className="button-link" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
