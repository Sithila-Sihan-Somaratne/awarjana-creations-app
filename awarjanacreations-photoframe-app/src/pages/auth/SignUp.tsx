import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Card, CardHeader, CardContent, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import PublicLayout from "../../components/layout/PublicLayout";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    let role = "customer";

    // ✅ CHECK INVITE CODE
    if (inviteCode.trim()) {
      const { data, error: codeError } = await supabase
        .from("invite_codes")
        .select("role, used")
        .eq("code", inviteCode.trim())
        .single();

      if (codeError || !data || data.used) {
        setError("Invalid or already used invite code.");
        setLoading(false);
        return;
      }

      role = data.role;
    }

    // ✅ REGISTER USER
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = signUpData.user;

    // ✅ CREATE PROFILE
    if (user) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: "",
          role,
          created_at: new Date().toISOString(),
        },
      ]);

      // ✅ MARK INVITE CODE AS USED
      if (inviteCode.trim()) {
        await supabase
          .from("invite_codes")
          .update({ used: true })
          .eq("code", inviteCode.trim());
      }

      setSuccess(
        "Account created successfully. Please verify your email before logging in."
      );
    }

    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md bg-neutral-900 border border-yellow-500 p-6 rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-yellow-400 text-center">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label>Invite Code (Optional for Worker/Admin)</Label>
                <Input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && (
                <p className="text-green-400 text-center">{success}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default SignUp;
