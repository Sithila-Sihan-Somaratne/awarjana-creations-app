import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import bcrypt from "bcryptjs";

const SignUpForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "worker" | "admin">("customer");
  const [regCode, setRegCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    // For worker/admin, validate registration code
    if (role !== "customer") {
      const { data: codes } = await supabase
        .from("registration_codes")
        .select("*")
        .eq("role", role)
        .eq("used", false);

      if (!codes || codes.length === 0) {
        toast({ title: "Error", description: "No valid registration codes available", variant: "destructive" });
        setLoading(false);
        return;
      }

      const matched = codes.find(c => bcrypt.compareSync(regCode, c.code_hash));
      if (!matched) {
        toast({ title: "Error", description: "Invalid registration code", variant: "destructive" });
        setLoading(false);
        return;
      }

      // mark code as used
      await supabase.from("registration_codes").update({ used: true }).eq("id", matched.id);
    }

    // Sign up via Supabase Auth (password is hashed automatically)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Success", description: "Check your email to confirm account" });

      // insert role into profiles table
      await supabase.from("profiles").insert({ id: data.user?.id, role });
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-yellow-400 text-2xl mb-4">Sign Up</h2>
      <div className="flex flex-col gap-2">
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Select defaultValue="customer" onValueChange={(v) => setRole(v as any)}>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="worker">Worker</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {(role === "worker" || role === "admin") && (
          <Input placeholder="Registration Code" value={regCode} onChange={e => setRegCode(e.target.value)} />
        )}
        <Button onClick={handleSignUp} disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;
