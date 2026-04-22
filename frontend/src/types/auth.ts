export type UserRole = "USER" | "ADMIN" | "TECHNICIAN";

export type AuthUser = {
  name: string;
  role: UserRole;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (name: string, role?: UserRole) => void;
  logout: () => void;
};

