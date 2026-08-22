import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Login = () => {
  const { setIsAuthenticated, showToast } = useTrip();
  const [email, setEmail] = useState('alex.morgan@globetrotter.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
      showToast('Welcome back, Alex! 👋', 'success');
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('alex.morgan@globetrotter.io');
    setPassword('password123');
    setIsAuthenticated(true);
    showToast('Signed in with Demo Account! ✨', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10 bg-slate-900">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-white">
            Globe<span className="text-teal-400">Trotter</span>
          </span>
        </div>

        {/* Login Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="mb-8">
            <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold border border-teal-500/20 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Travel Workspace</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Sign in to manage your multi-city itineraries, routes & budgets.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-teal-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-3">Exploring the hackathon prototype?</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>1-Click Demo Login (Alex Morgan)</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 font-bold hover:underline">
              Create free account
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 GlobeTrotter Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Hackathon Prototype v1.0</span>
          </span>
        </div>

      </div>

      {/* Right Column: Editorial Travel Collage Banner */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80"
          alt="European Travel Panorama"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/40 to-transparent"></div>

        {/* Floating Editorial Quote & Highlights */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="max-w-lg bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase">
                Featured Journey
              </span>
              <span className="text-xs text-slate-300">London → Paris → Amsterdam → Berlin</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              "Discover, design, budget, and organize multi-city travels with effortless clarity."
            </h3>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-700/60">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Alex"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-400"
              />
              <div>
                <p className="text-xs font-bold text-white">Alex Morgan</p>
                <p className="text-[10px] text-slate-400">14-Day European Escape Itinerary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
