import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded w-96 space-y-4">
        <h1 className="text-xl font-bold text-yellow-400 text-center">
          Awarjana Login
        </h1>

        <input
          className="w-full p-2 rounded bg-black border"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-black border"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
