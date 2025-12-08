import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);

      console.log("SIGNING UP WITH:", email, password);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("SIGNUP RESPONSE:", data, error);

      if (error) throw error;
      if (!data.user) throw new Error("User not created");

      toast({ title: "Signup successful ✅" });
      navigate("/signin");

    } catch (err: any) {
      console.error("SIGNUP FAILED:", err);
      toast({
        title: "Signup failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white text-black rounded shadow-md max-w-md mx-auto space-y-3">
      <h2 className="text-xl font-bold">Sign Up</h2>

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

      <Button onClick={handleSignUp} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Sign Up"}
      </Button>
    </div>
  );
};

export default SignUpForm;
