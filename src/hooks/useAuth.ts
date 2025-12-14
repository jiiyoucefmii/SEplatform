import { useState } from 'react';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  role: 'PARENT' | 'TEACHER' | 'ADMIN';
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, logout, isAuthenticated: !!user };
};