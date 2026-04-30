import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 300;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, refreshUser } = useAuth();
  const [message, setMessage] = useState("Completing Google sign-in...");
  const [failed, setFailed] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    let cancelled = false;

    async function completeSignIn() {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          await refreshUser();
          if (!cancelled) {
            navigate("/dashboard", { replace: true });
          }
          return;
        } catch {
          if (attempt < MAX_ATTEMPTS) {
            if (!cancelled) {
              setMessage("Finishing your session...");
            }
            await sleep(RETRY_DELAY_MS);
          }
        }
      }

      if (!cancelled) {
        setFailed(true);
        setMessage("Could not verify your login session. Please try signing in again.");
      }
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading, navigate, refreshUser]);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Authentication</p>
        <h1>Signing you in</h1>
        <p className="muted-text">{message}</p>
        {failed ? (
          <button
            type="button"
            className="button-link google-login-button"
            onClick={() => navigate("/login?error=oauth", { replace: true })}
          >
            Back to login
          </button>
        ) : null}
      </div>
    </section>
  );
}
