import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../../hooks/use-toast";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "worker" | "admin">("customer");
  const [regCode, setRegCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);

      // ✅ 1. Validate registration code for worker/admin
      if (role !== "customer") {
        const { data: codes, error: codeErr } = await supabase
          .from("registration_codes")
          .select("*")
          .eq("role", role)
          .eq("used", false);

        if (codeErr || !codes || codes.length === 0) {
          toast({
            title: "Invalid Code",
            description: "No valid registration code available",
            variant: "destructive",
          });
          return;
        }

        const matched = codes.find((c) =>
          bcrypt.compareSync(regCode, c.code_hash)
        );

        if (!matched) {
          toast({
            title: "Invalid Code",
            description: "Registration code is wrong",
            variant: "destructive",
          });
          return;
        }

        await supabase
          .from("registration_codes")
          .update({ used: true })
          .eq("id", matched.id);
      }

      // ✅ 2. Create Auth User
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !data.user) {
        toast({
          title: "Signup Failed",
          description: error?.message,
          variant: "destructive",
        });
        return;
      }

      // ✅ 3. Insert into USERS table
      const { error: dbError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        role,
      });

      if (dbError) {
        toast({
          title: "Database Error",
          description: dbError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Created",
        description: "You can now sign in",
      });

      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-yellow-400 text-2xl mb-4">Sign Up</h2>

      <div className="flex flex-col gap-2">
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        <Select value={role} onValueChange={(v) => setRole(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="worker">Worker</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        {(role === "worker" || role === "admin") && (
          <Input
            placeholder="Registration Code"
            value={regCode}
            onChange={(e) => setRegCode(e.target.value)}
          />
        )}

        <Button onClick={handleSignUp} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;
