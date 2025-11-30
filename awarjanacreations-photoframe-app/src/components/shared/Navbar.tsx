// src/components/shared/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-neutral-800 text-yellow-400">
      <div className="font-bold text-xl">
        <Link to="/">Awarjana Creations</Link>
      </div>
      <div>
        <Link className="mr-4" to="/pricing">Pricing</Link>
        <Link className="mr-4" to="/signin">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
}