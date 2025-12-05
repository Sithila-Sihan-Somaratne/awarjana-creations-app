import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const InviteCodeRegister: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let role = "customer";

    if (inviteCode.trim()) {
      const { data, error } = await supabase
        .from("invite_codes")
        .select("role, used")
        .eq("code", inviteCode)
        .single();

      if (error || !data || data.used) {
        setError("Invalid invite code.");
        setLoading(false);
        return;
      }

      role = data.role;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      setError(error?.message || "Signup failed.");
      setLoading(false);
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      role,
      created_at: new Date(),
    });

    if (inviteCode) {
      await supabase.from("invite_codes").update({ used: true }).eq("code", inviteCode);
    }

    setSuccess("Registration successful!");
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default InviteCodeRegister;
