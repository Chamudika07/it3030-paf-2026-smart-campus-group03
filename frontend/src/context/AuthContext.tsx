import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextValue, UserRole } from "../types/auth";
import {
  fetchAuthSession,
  logoutCurrentUser,
  redirectToGoogleLogin
} from "../api/authApi";

const defaultValue: AuthContextValue = {
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  isTechnician: false,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
  hasRole: () => false
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  const syncSession = useCallback(async () => {
    const session = await fetchAuthSession();
    if (session.authenticated && session.user) {
      localStorage.setItem("smart-campus-user", JSON.stringify(session.user));
      setUser(session.user);
      return session.user;
    }

    localStorage.removeItem("smart-campus-user");
    setUser(null);
    return null;
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await syncSession();
    if (currentUser) {
      setLoading(false);
      return;
    }

    setLoading(false);
    throw new Error("Unable to refresh authenticated user");
  }, [syncSession]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    let cancelled = false;

    async function initializeAuth() {
      try {
        if (cancelled) {
          return;
        }

        await syncSession();
      } catch {
        if (!cancelled) {
          localStorage.removeItem("smart-campus-user");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [syncSession]);

  const login = () => {
    redirectToGoogleLogin();
  };

  const logout = async () => {
    try {
      await logoutCurrentUser();
    } finally {
      localStorage.removeItem("smart-campus-user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const hasRole = useCallback((roles?: UserRole[]) => {
    if (!roles || roles.length === 0) {
      return Boolean(user);
    }
    return Boolean(user && roles.includes(user.role));
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
    isTechnician: user?.role === "TECHNICIAN",
    login,
    logout,
    refreshUser,
    hasRole
  }), [hasRole, loading, user, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
