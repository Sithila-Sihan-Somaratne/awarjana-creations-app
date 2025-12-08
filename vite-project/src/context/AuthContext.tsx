// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

type Role = "customer" | "worker" | "admin" | null;

interface AuthContextType {
  userId: string | null;
  userRole: Role;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userRole: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setUserId(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      setUserId(session.user.id);

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      setUserRole(userData?.role ?? null);
      setLoading(false);
    };

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
