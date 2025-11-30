// src/pages/auth/SignIn.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../components/hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to handle redirection after successful login/auth load
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // Determine the correct dashboard based on the user's role
      let redirectPath = '/';
      if (user.role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (user.role === 'worker') {
        redirectPath = '/worker/jobs';
      } else if (user.role === 'customer') {
        redirectPath = '/order/new';
      }
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } 
    // If sign-in is successful, the useAuth hook automatically updates 
    // the state and triggers the useEffect for redirection.
    // If sign-in fails, we stop loading and show the error.
  };

  if (authLoading || (isAuthenticated && user)) {
    // If the hook is loading the session OR if the user is already authenticated, show a loading message 
    // while the useEffect handles the redirection.
    return (
      <div className="text-center text-white p-20">
        <h2 className="text-xl">Loading session...</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className={cn("w-full max-w-md bg-slate-800 border-brand-500 h-[450px]")}>
        <CardHeader>
          <CardTitle className="text-3xl text-brand-500">Sign In</CardTitle>
          <CardDescription className="text-slate-400">Welcome back to the PhotoFrame system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-6">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white focus:border-brand-500"
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white focus:border-brand-500"
              />
            </div>

            {/* Feedback Message */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-500 text-slate-900 hover:bg-brand-500/90 font-bold"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Sign Up and Forgot Password Links */}
            <div className="mt-4 text-center text-sm text-slate-400 space-y-2">
              <p>
                Don't have an account?{' '}
                <Link to="/auth/signup" className="underline text-brand-500 hover:text-brand-400">
                  Sign Up
                </Link>
              </p>
              <p>
                <Link to="/auth/forgot-password" className="text-slate-400 hover:underline">
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