import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Register = () => {
  const { setUser, setIsAuthenticated, showToast } = useTrip();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, name: name || 'New Traveler', email }));
      setIsAuthenticated(true);
      setLoading(false);
      showToast('Account created! Welcome to GlobeTrotter 🌍', 'success');
      navigate('/dashboard');
    }, 600);
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

        {/* Register Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="mb-6">
            <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold border border-teal-500/20 inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join GlobeTrotter Free</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Start designing personalized multi-city trips and smart itineraries.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Start Planning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="text-xs text-slate-500">
          <span>© 2026 GlobeTrotter Inc.</span>
        </div>

      </div>

      {/* Right Column: Editorial Travel Photo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=80"
          alt="Kyoto Bamboo Grove"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <div className="max-w-lg bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase mb-2 inline-block">
              Philosophy
            </span>
            <h3 className="text-xl font-bold font-display text-white">
              Discover → Plan → Organize → Visualize → Budget → Optimize → Share
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Transform your travel ideas into beautifully organized day-by-day itineraries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
