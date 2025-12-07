import { Button } from "../ui/button";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { userRole } = useAuth();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="h-16 bg-neutral-950 border-b border-yellow-500 flex items-center justify-between px-6">
      <div className="text-yellow-400 font-bold text-xl">
        Awarjana Creations
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{userRole}</span>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
