import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Map, 
  CalendarDays, 
  Wallet, 
  Users, 
  UserCircle, 
  BarChart3, 
  CheckCircle2, 
  CircleDot, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { activeTrip, getTripStats } = useTrip();
  const location = useLocation();
  const stats = getTripStats(activeTrip);

  const navItems = [
    { to: '/dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { to: '/my-trips', label: 'My Trips', icon: Briefcase },
    { to: '/create-trip', label: 'Plan New Trip', icon: PlusCircle, badge: 'New' },
    { to: activeTrip ? `/itinerary/${activeTrip.id}` : '/my-trips', label: 'Trip Workspace', icon: Map, highlight: true },
    { to: '/calendar', label: 'Calendar & Timeline', icon: CalendarDays },
    { to: '/budget', label: 'Trip Budget', icon: Wallet, alert: stats.isOverBudget },
    { to: '/community', label: 'Community & Shared', icon: Users },
    { to: '/profile', label: 'Profile & Settings', icon: UserCircle },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      {/* Top Nav Items */}
      <div className="space-y-6">
        
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItineraryActive = item.label === 'Trip Workspace' && location.pathname.startsWith('/itinerary');
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) => {
                  const active = isActive || isItineraryActive;
                  return `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`;
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-teal-100 text-teal-700">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Budget Notice"></span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

      </div>

      {/* Active Trip Quick Progress Widget in Sidebar */}
      {activeTrip && (
        <div className="mt-4 pt-4 border-t border-slate-200/80">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
            {/* Ambient decorative glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-500/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Planning Progress
              </span>
              <span className="text-xs font-extrabold text-teal-300">{stats.progress}%</span>
            </div>

            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>

            <p className="text-xs font-bold text-white truncate mb-1">{activeTrip.title}</p>
            <p className="text-[11px] text-slate-300 mb-3">
              {stats.totalDays} Days · {stats.citiesCount} Cities · {stats.activitiesCount} Activities
            </p>

            <Link
              to={`/itinerary/${activeTrip.id}`}
              onClick={onCloseMobile}
              className="w-full py-1.5 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Continue Planning</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 font-display text-lg">Menu</span>
              <button 
                onClick={onCloseMobile}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
