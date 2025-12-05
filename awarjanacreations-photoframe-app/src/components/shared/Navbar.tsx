// src/components/shared/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-neutral-900 border-b border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-yellow-400">
              Awarjana Creations
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link className="text-sm text-neutral-200 hover:text-white" to="/pricing">
              Pricing
            </Link>
            <Link className="text-sm text-neutral-200 hover:text-white" to="/signin">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm px-3 py-1 rounded-md bg-yellow-400 text-black font-semibold hover:opacity-90"
            >
              Sign Up
            </Link>
          </div>

          {/* mobile menu button (kept minimal) */}
          <div className="md:hidden">
            <details className="relative">
              <summary className="cursor-pointer px-3 py-2 rounded-md text-neutral-200 bg-neutral-800">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded shadow-lg z-20">
                <Link className="block px-4 py-2 text-sm" to="/pricing">Pricing</Link>
                <Link className="block px-4 py-2 text-sm" to="/signin">Sign In</Link>
                <Link className="block px-4 py-2 text-sm" to="/signup">Sign Up</Link>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
