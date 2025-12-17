
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockAuth } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  toggleFavorite: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = mockAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await mockAuth.login(email, pass);
    if (res.success && res.data) {
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    const res = await mockAuth.register(name, email, phone, pass);
    if (res.success && res.data) {
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = () => {
    mockAuth.logout();
    setUser(null);
  };

  const updateUser = (u: User) => setUser(u);

  const toggleFavorite = (productId: string) => {
    if (!user) return;
    const isFav = user.favorites.includes(productId);
    const newFavs = isFav 
      ? user.favorites.filter(id => id !== productId)
      : [...user.favorites, productId];
    
    const updatedUser = { ...user, favorites: newFavs };
    setUser(updatedUser);
    mockAuth.updateUser(updatedUser); // Persist to mock DB
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
