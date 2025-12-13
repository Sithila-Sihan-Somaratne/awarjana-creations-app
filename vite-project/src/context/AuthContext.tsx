import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

type Role = "customer" | "worker" | "admin" | null;

interface AuthContextType {
  userId: string | null;
  userRole: Role;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUserId(null);
        setUserRole(null);
        return;
      }

      setUserId(session.user.id);

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      setUserRole(data?.role ?? "customer");

    } catch (err) {
      console.error(err);
      setUserId(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => { await loadSession(); };

  useEffect(() => {
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserId(null);
        setUserRole(null);
      } else {
        loadSession();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserRole(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ userId, userRole, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
