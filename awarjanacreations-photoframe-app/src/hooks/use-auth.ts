// src/hooks/use-auth.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export type UserProfile = {
  id: string;
  full_name?: string;
  role?: "customer" | "worker" | "admin" | string;
  created_at?: string;
  // add other profile fields you use
};

export function useAuth() {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(
    async (userId?: string) => {
      if (!userId) {
        setProfile(null);
        return;
      }
      try {
        const { data, error: pErr } = await supabase
          .from<UserProfile>("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (pErr) {
          console.error("Failed to fetch profile:", pErr);
          setError(pErr.message);
          setProfile(null);
        } else {
          setProfile(data ?? null);
        }
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setProfile(null);
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Supabase v2: getSession returns a Promise
        const { data } = await supabase.auth.getSession();
        const currentSession = data?.session ?? null;

        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // If there's a logged in user, fetch their profile
        await fetchProfile(currentSession?.user?.id);
      } catch (e: any) {
        console.error("useAuth init error", e);
        setError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoading(false);
      }

      // Subscribe to auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession ?? null);
          setUser(newSession?.user ?? null);
          await fetchProfile(newSession?.user?.id);
        }
      );

      return () => {
        mounted = false;
        listener?.subscription?.unsubscribe?.();
      };
    })();
  }, [fetchProfile]);

  // helper actions
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  return {
    session,
    user,
    profile,
    loading,
    error,
    signOut,
  };
}
