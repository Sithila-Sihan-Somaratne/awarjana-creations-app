// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  userId: string | null;
  userRole: "customer" | "worker" | "admin" | null;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userRole: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"customer" | "worker" | "admin" | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        setUserId(session.user.id);

        // fetch role from users table
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && userData) setUserRole(userData.role);
      }
    };

    fetchSession();

    // optional: listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setUserId(session.user.id);
      else setUserId(null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
