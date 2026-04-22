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
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Secure campus access</p>
        <h1>Smart Campus Operations Hub</h1>
        <p className="muted-text">
          Sign in with your Google account to access bookings, tickets, resources, and notifications.
        </p>
        {hasOAuthError && (
          <p className="panel-inline error-panel">
            Google sign-in failed. Please try again with a valid account.
          </p>
        )}
        <button className="google-login-button" onClick={login} disabled={loading}>
          Sign in with Google
        </button>
      </div>
    </section>
  );
}
