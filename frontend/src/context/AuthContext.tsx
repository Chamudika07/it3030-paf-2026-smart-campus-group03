import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextValue, UserRole } from "../types/auth";

const defaultValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smart-campus-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (name: string, role: UserRole = "USER") => {
    const nextUser = { name, role };
    localStorage.setItem("smart-campus-user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("smart-campus-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

