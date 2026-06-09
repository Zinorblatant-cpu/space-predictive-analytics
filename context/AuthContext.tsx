import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import {
  clearSession,
  getSession,
  getUser,
  saveSession,
  saveUser,
} from '../services/storage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Omit<User, 'id' | 'createdAt' | 'passwordHash' | 'rm'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const email = await getSession();
      if (email) {
        const saved = await getUser(email);
        if (saved) setUser(saved);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const saved = await getUser(email.toLowerCase());
      if (!saved) return { success: false, error: 'Usuário não encontrado.' };
      if (saved.passwordHash !== btoa(password)) return { success: false, error: 'Senha incorreta.' };
      await saveSession(saved.email);
      setUser(saved);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }: Omit<User, 'id' | 'createdAt' | 'passwordHash' | 'rm'> & { password: string }) => {
    setIsLoading(true);
    try {
      const existing = await getUser(email.toLowerCase());
      if (existing) return { success: false, error: 'E-mail já cadastrado.' };
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: btoa(password),
        createdAt: new Date().toISOString(),
      };
      await saveUser(newUser);
      await saveSession(newUser.email);
      setUser(newUser);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
