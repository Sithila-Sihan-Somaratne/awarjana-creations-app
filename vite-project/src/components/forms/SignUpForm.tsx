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
  const [role, setRole] = useState<"customer" | "worker" | "admin">("customer");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);

      // Validate invite code if not customer
      if (role !== "customer") {
        const res = await fetch("/.netlify/functions/validateInviteCode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: inviteCode, role }),
        });

        const data = await res.json();
        if (!res.ok || !data.valid) throw new Error(data.error || "Invalid invite code");
      }

      // Signup user
      const { data, error } = await supabase.auth.signUp({
        email,
        password, // bcrypt will be applied automatically by Supabase
      });
      if (error) throw error;
      if (!data.user) throw new Error("User not created");

      // Insert user profile with role
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, role }]);
      if (profileError) throw profileError;

      toast({ title: "Signup successful ✅ Please confirm your email" });
      navigate("/signin");

    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white text-black rounded shadow-md max-w-md mx-auto space-y-3">
      <h2 className="text-xl font-bold">Sign Up</h2>

      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full border p-2 rounded">
        <option value="customer">Customer</option>
        <option value="worker">Worker</option>
        <option value="admin">Admin</option>
      </select>

      {role !== "customer" && (
        <Input placeholder="Invite Code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
      )}

      <Button onClick={handleSignUp} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Sign Up"}
      </Button>
    </div>
  );
};

export default SignUpForm;
