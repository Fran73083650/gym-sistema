import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("gym_token") !== null,
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("gym_user") ?? "",
  );

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const data = await authService.login(user, pass);
      localStorage.setItem("gym_token", data.access);
      localStorage.setItem("gym_refresh", data.refresh);
      localStorage.setItem("gym_user", data.username);
      setIsAuthenticated(true);
      setUsername(data.username);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
