// src/pages/auth/SignIn.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/use-auth';
import { supabase } from '../../lib/supabaseClient';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      let redirectPath = '/';
      if (user.role === 'admin') redirectPath = '/admin';
      else if (user.role === 'worker') redirectPath = '/worker/jobs';
      else if (user.role === 'customer') redirectPath = '/customer/order/new';

      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center text-yellow-300 p-20">Loading session…</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-neutral-900 border-yellow-400">
        <CardHeader>
          <CardTitle className="text-3xl text-yellow-400">Sign In</CardTitle>
          <CardDescription className="text-yellow-200">
            Welcome back to Awarjana Creations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-6">
            <div className="grid gap-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black text-white border-yellow-400"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black text-white border-yellow-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-400 text-black font-bold hover:bg-yellow-300"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="text-center text-yellow-200 text-sm space-y-2">
              <p>
                Don’t have an account?{' '}
                <Link to="/signup" className="underline text-yellow-400">
                  Sign Up
                </Link>
              </p>

              <p>
                <Link to="/forgot-password" className="underline">
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
