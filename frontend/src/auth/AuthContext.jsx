import { createContext, useContext, useState, useEffect } from "react";
import { api, getToken, setToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : si un token existe, récupérer l'utilisateur
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.me();
        if (active) setUser(user);
      } catch {
        setToken(null); // token invalide/expiré
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  // Connexion : appelle le vrai backend
  const login = async ({ email, password }) => {
    const { token, user } = await api.login(email, password);
    setToken(token);
    setUser(user);
    return user;
  };

  // Inscription (nouveau compte client) : connecte automatiquement l'utilisateur
  const register = async ({ email, password, fullName }) => {
    const { token, user } = await api.register(email, password, fullName);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
