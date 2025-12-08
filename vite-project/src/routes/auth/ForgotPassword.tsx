import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const resetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) setMessage(error.message);
    else setMessage("Password reset email sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded w-96 space-y-4">
        <h2 className="text-yellow-400 text-xl">Reset Password</h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={resetPassword}>Send Reset Link</Button>

        {message && <p className="text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
