import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { saveAuth, clearAuth, getAuth } from "../utils/authHelpers";

type User = { id?: number; name?: string; email?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(getAuth().user);
  const [token, setToken] = useState<string | null>(getAuth().token);

  // Keep auth state synced with localStorage
  useEffect(() => {
    const stored = getAuth();
    if (stored.token) {
      setToken(stored.token);
      setUser(stored.user);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: tkn, user: usr } = res.data;
    saveAuth(tkn, usr);
    setToken(tkn);
    setUser(usr);
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token: tkn, user: usr } = res.data;
    saveAuth(tkn, usr);
    setToken(tkn);
    setUser(usr);
  };

  // Logout
  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
