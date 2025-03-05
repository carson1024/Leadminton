import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';

export interface AuthContextType {
  session: Session | null;
  user: User | undefined;
  isLogin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: undefined,
  isLogin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | undefined>(undefined);
  const isLogin = useMemo<boolean>(() => !!(session?.user.email && session.user.confirmed_at), [session]);

  useEffect(() => {
    setLoading(true);
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
        setUser(data.session?.user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, _session: Session | null) => {
        setSession(_session);
        setUser(_session?.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  
  return (
    <AuthContext.Provider value={{session, isLogin, user}}>
      { children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);