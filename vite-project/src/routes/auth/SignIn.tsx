import { Link } from "react-router-dom";
import SignInForm from "../../components/forms/SignInForm";

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <SignInForm />

      <div className="mt-4 text-sm text-zinc-400 space-y-2 text-center">
        <Link to="/forgot-password" className="text-yellow-400 underline block">
          Forgot password?
        </Link>

        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-400 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
