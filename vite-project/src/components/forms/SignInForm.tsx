import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";

const SignInForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);

      console.log("SIGN IN WITH:", email, password);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("SIGN IN RESPONSE:", data, error);

      if (error) throw error;

      toast({ title: "Signed in ✅" });

    } catch (err: any) {
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

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

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
