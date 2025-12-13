import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignInForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (!data.user.email_confirmed_at) {
        toast({ title: "Please confirm your email before signing in" });
        return;
      }

      await refreshSession(); // ensure AuthContext has latest session & role

      toast({ title: "Signed in ✅" });
      navigate("/"); // go to dashboard

    } catch (err: any) {
      console.error("Sign in failed:", err);
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white text-black rounded shadow-md max-w-md mx-auto space-y-3">
      <h2 className="text-xl font-bold">Sign In</h2>

      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={handleSignIn} disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </div>
  );
};

export default SignInForm;
