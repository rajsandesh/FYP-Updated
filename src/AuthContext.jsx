import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: { password: "admin123", role: "admin", name: "System Admin" },
  red: { password: "red123", role: "red", name: "Red Team" },
  blue: { password: "blue123", role: "blue", name: "Blue Team" },
};

const STORAGE_KEY = "cybersim_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const login = useCallback((username, password) => {
    const key = username.trim().toLowerCase();
    const account = DEMO_USERS[key];
    if (!account || account.password !== password) {
      return { ok: false, error: "Invalid username or password." };
    }
    const session = { username: key, role: account.role, name: account.name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const canAccess = useCallback(
    (section) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      if (section === "adminDash") return false;
      if (section === "redTeam") return user.role === "red";
      if (section === "blueTeam") return user.role === "blue";
      return true;
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, canAccess, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
