import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PublicLayout from "../../components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/signin",
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent to your email.");
    }

    setLoading(false);
  };

  return (
    <PublicLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md bg-neutral-900 border border-yellow-500 p-6 rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-yellow-400 text-center">
              Reset Password
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleReset} className="space-y-5">
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

              {error && <p className="text-red-500 text-center">{error}</p>}
              {message && (
                <p className="text-green-400 text-center">{message}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;