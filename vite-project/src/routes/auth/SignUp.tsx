import { Link } from "react-router-dom";
import SignUpForm from "../../components/forms/SignUpForm";

export default function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <SignUpForm />

      <p className="mt-4 text-sm text-zinc-400">
        Already have an account?{" "}
        <Link to="/signin" className="text-yellow-400 underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
