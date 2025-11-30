import { useState, useEffect } from 'react';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  role: 'PARENT' | 'TEACHER' | 'ADMIN';
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, logout, isAuthenticated: !!user };
};