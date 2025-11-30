import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    setSession(currentSession);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sessionVal) => {
      setSession(sessionVal);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, user: session?.user };
}