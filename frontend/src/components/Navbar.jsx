import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Plus, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { user, trips, activeTrip, setActiveTripId, setIsAuthenticated } = useTrip();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-1.5">
                Globe<span className="text-teal-600">Trotter</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Active Trip Quick Selector (Desktop) */}
        {activeTrip && (
          <div className="hidden md:flex items-center relative">
            <button 
              onClick={() => setShowTripDropdown(!showTripDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="text-slate-500 font-normal">Active Trip:</span>
              <span className="max-w-[180px] truncate text-slate-900 font-medium">{activeTrip.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showTripDropdown && (
              <div className="absolute top-10 left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Workspace
                </div>
                {trips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setActiveTripId(trip.id);
                      setShowTripDropdown(false);
                      navigate(`/itinerary/${trip.id}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${trip.id === activeTrip.id ? 'bg-teal-50/70 text-teal-700 font-semibold' : 'text-slate-700'}`}
                  >
                    <span className="truncate">{trip.title}</span>
                    <span className="text-[10px] text-slate-400">{trip.destinations?.length || 0} stops</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <Link
                    to="/create-trip"
                    onClick={() => setShowTripDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-600 hover:bg-teal-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Trip</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Plan New Trip button */}
          <Link
            to="/create-trip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-teal-600 font-medium">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs py-1">
                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">Budget Tip Available</p>
                      <p className="text-slate-500 text-[11px]">Save €65 on Paris activities in your summer escape.</p>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">Itinerary Updated</p>
                      <p className="text-slate-500 text-[11px]">London stops assigned to Day 1 & 2.</p>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/20"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-800">{user?.name || "Alex"}</span>
              <ChevronDown className="hidden xl:inline w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-semibold">
                    {user?.travelStyle || "Cultural Explorer"}
                  </span>
                </div>
                <div className="py-1 text-xs">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile & Preferences</span>
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-teal-600"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Analytics & Platform</span>
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
