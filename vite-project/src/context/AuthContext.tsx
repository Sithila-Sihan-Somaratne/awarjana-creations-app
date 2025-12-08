import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

type Role = "customer" | "worker" | "admin" | null;

interface AuthContextType {
  userId: string | null;
  userRole: Role;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setUserId(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    setUserId(session.user.id);

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    setUserRole(data?.role ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange(loadSession);
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userId, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
