import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
