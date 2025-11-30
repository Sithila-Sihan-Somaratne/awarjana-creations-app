import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const InviteCodeRegister = () => {
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
    setSuccess(null);

    // Check invite code against Supabase table
    let role = "customer";
    if (inviteCode.trim()) {
      const { data, error: codeError } = await supabase
        .from("invite_codes")
        .select("role,used")
        .eq("code", inviteCode.trim())
        .single();

      if (codeError || !data || data.used) {
        setError("Invalid or already used invite code.");
        setLoading(false);
        return;
      }
      role = data.role;
    }

    // Register user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Update profiles table with role
    const user = signUpData.user;
    if (user) {
      await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name: "",
            role: role,
            created_at: new Date().toISOString(),
          },
        ]);

      // Mark code as used if present
      if (inviteCode.trim()) {
        await supabase
          .from("invite_codes")
          .update({ used: true })
          .eq("code", inviteCode.trim());
      }
      setSuccess("Registration successful! Check your email to verify your account.");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <Card className="w-full max-w-md bg-background border border-brand-500 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-500 mb-6 text-center">
          Register (Worker/Admin via Invite Code)
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-semibold mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="inviteCode" className="block font-semibold mb-1">
              Invite Code (for Worker/Admin)
            </label>
            <Input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default InviteCodeRegister;