export type UserRole = "USER" | "ADMIN" | "TECHNICIAN";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTechnician: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles?: UserRole[]) => boolean;
};
