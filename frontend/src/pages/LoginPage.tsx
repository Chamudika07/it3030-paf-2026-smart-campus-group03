import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    login("Team Leader", "ADMIN");
    navigate("/dashboard");
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Starter login page</p>
        <h1>Smart Campus Operations Hub</h1>
        <p>
          Use the demo login for now, then replace it with Google OAuth 2.0 when the
          backend auth flow is ready.
        </p>
        <button onClick={handleDemoLogin}>Continue with Demo Login</button>
      </div>
    </section>
  );
}

