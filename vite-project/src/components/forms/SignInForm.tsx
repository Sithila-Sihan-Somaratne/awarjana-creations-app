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
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Success", description: "Signed in successfully!" });

    setLoading(false);
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-yellow-400 text-2xl mb-4">Sign In</h2>
      <div className="flex flex-col gap-2">
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleSignIn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
