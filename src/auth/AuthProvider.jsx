import { useCallback, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authService';
import { clearStoredSession } from '../api/httpClient';
import { AuthContext } from './AuthContext';

function readStoredSession() {
  const accessToken = sessionStorage.getItem('accessToken');
  const expiresAt = Number(sessionStorage.getItem('expiresAt'));
  const storedUser = sessionStorage.getItem('usuarioSesion');

  if (!accessToken || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || !storedUser) {
    clearStoredSession();
    return null;
  }

  try {
    return { accessToken, expiresAt, user: JSON.parse(storedUser) };
  } catch {
    clearStoredSession();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const signIn = useCallback(async (credentials) => {
    const newSession = await loginRequest(credentials);
    sessionStorage.setItem('accessToken', newSession.accessToken);
    sessionStorage.setItem('tokenType', newSession.tokenType);
    sessionStorage.setItem('expiresAt', String(newSession.expiresAt));
    sessionStorage.setItem('usuarioSesion', JSON.stringify(newSession.user));
    setSession(newSession);
    return newSession.user;
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setSession(null);
    }

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    const timeout = window.setTimeout(logout, Math.max(0, session.expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [session, logout]);

  const value = useMemo(() => ({ user: session?.user || null, signIn, logout }), [session, signIn, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
