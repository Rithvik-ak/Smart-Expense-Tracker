'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

import { GoogleOAuthProvider } from '@react-oauth/google';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      router.push('/dashboard');
    }
    return data;
  };

  const googleLogin = async (credential) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      router.push('/dashboard');
    }
    return data;
  };

  const signup = async (email, password, name, age) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, age }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      router.push('/dashboard');
    }
    return data;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-id';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={{ user, loading, login, googleLogin, signup, logout, updateUser }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
