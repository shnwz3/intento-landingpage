import type { AuthError, Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AuthResult = {
  error: AuthError | Pick<AuthError, 'message' | 'name' | 'status'> | null;
  needsEmailVerification?: boolean;
};

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  signInWithGoogle: (nextPath?: string) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signUpWithPassword: (email: string, password: string, fullName: string, nextPath?: string) => Promise<AuthResult>;
  user: User | null;
};

const missingConfigError: Pick<AuthError, 'message' | 'name' | 'status'> = {
  message: 'Supabase is not configured yet. Add your project URL and anon key to the website env file.',
  name: 'AuthApiError',
  status: 500,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
      return { error: missingConfigError };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signUpWithPassword(email: string, password: string, fullName: string, nextPath?: string): Promise<AuthResult> {
    if (!supabase) {
      return { error: missingConfigError };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''}`,
      },
    });

    return {
      error,
      needsEmailVerification: !data.session,
    };
  }

  async function signInWithGoogle(nextPath?: string): Promise<AuthResult> {
    if (!supabase) {
      return { error: missingConfigError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth${nextPath && nextPath !== '/dashboard' ? `?next=${encodeURIComponent(nextPath)}` : ''}`,
      },
    });

    return { error };
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        configured: isSupabaseConfigured,
        loading,
        session,
        signInWithGoogle,
        signInWithPassword,
        signOut,
        signUpWithPassword,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
