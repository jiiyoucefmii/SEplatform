import { useState, useEffect, useCallback } from 'react';

interface User {
  id?: number;
  user_id?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'PARENT' | 'TEACHER' | 'ADMIN' | 'STUDENT';
  email?: string;
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

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  // Sync auth state across tabs via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
      if (e.key === 'auth_token') {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  }, []);

  const isAuthenticated = !!(token && user);

  // Get the appropriate dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    if (!user?.role) return '/student-dashboard';
    const dashboardMap: Record<string, string> = {
      ADMIN: '/admin',
      TEACHER: '/teacher-dashboard',
      PARENT: '/student-dashboard',
      STUDENT: '/student-dashboard',
    };
    return dashboardMap[user.role] || '/student-dashboard';
  }, [user?.role]);

  return {
    user,
    token,
    logout,
    isAuthenticated,
    getDashboardPath
  };
};