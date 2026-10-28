import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/account');
    } else {
      setErrors({ general: result.error || 'Failed to authenticate.' });
    }
  };

  const fillDemoAccount = () => {
    setEmail('nagesh.demo@example.com');
    setPassword('DemoPass123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-teal-500 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-content-primary">Welcome Back</h1>
        <p className="text-xs sm:text-sm text-content-secondary">
          Sign in to access your saved recommendations and search history.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm space-y-6">
        {errors.general && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-brand-blue'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="text-[11px] font-medium text-brand-blue hover:underline"
              >
                Auto-fill Demo
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.password ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-brand-blue'
                }`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
          >
            <span>{isLoading ? 'Verifying…' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Don&apos;t have an account? </span>
          <Link to="/signup" className="text-brand-blue font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <span>
            Integrated Authentication: Authenticates securely via backend JWT or local demo fallback.
          </span>
        </div>
      </div>
    </div>
  );
};
