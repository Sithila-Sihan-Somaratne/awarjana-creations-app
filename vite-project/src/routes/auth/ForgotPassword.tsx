import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password"
    });

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Success", description: "Password reset email sent!" });

    setLoading(false);
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white max-w-md mx-auto">
      <h2 className="text-yellow-400 text-2xl mb-4">Forgot Password</h2>
      <div className="flex flex-col gap-2">
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={handleReset} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
