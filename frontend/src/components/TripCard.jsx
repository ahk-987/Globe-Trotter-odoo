import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  MoreVertical, 
  Trash2, 
  Share2, 
  Edit3, 
  Clock, 
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const TripCard = ({ trip, variant = "grid", onShare }) => {
  const { setActiveTripId, deleteTrip, getTripStats } = useTrip();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const stats = getTripStats(trip);

  const handleOpenWorkspace = () => {
    setActiveTripId(trip.id);
    navigate(`/itinerary/${trip.id}`);
  };

  const routeString = trip.destinations?.map(d => d.name).join(' → ') || 'No destinations added yet';

  if (variant === "compact") {
    return (
      <div 
        onClick={handleOpenWorkspace}
        className="group flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-teal-500/40 hover:shadow-md transition-all cursor-pointer"
      >
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80"}
          alt={trip.title}
          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
            {trip.title}
          </h4>
          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{trip.startDate} - {trip.endDate}</span>
          </p>
          <p className="text-[11px] text-teal-700 font-medium truncate mt-1">
            {trip.destinations?.length || 0} destinations · {trip.currency || '€'}{trip.estimatedCost || 0}
          </p>
        </div>
        <button className="p-2 text-slate-400 hover:text-teal-600 rounded-lg group-hover:translate-x-0.5 transition-all">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between relative">
      {/* Top Cover Image with Editorial Badges */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80"}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            {trip.status || "Planning"}
          </span>
          {trip.isUpcoming && (
            <span className="px-2.5 py-1 rounded-full bg-teal-500/90 backdrop-blur-md text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
              Upcoming
            </span>
          )}
        </div>

        {/* Dropdown Options */}
        <div className="absolute top-3.5 right-3.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/90 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95"
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleOpenWorkspace();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                <span>Open Workspace</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  if (onShare) onShare(trip);
                  else navigate(`/trips/${trip.slug || trip.id}`);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Share Public Trip</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  deleteTrip(trip.id);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Trip</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Route in Cover overlay */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <p className="text-[11px] font-medium text-teal-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{routeString}</span>
          </p>
          <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-snug truncate">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Card Content & Stats */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Dates & Duration */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{trip.startDate} — {trip.endDate}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>{stats.totalDays} Days</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Cities</span>
              <span className="text-sm font-bold text-slate-800">{stats.citiesCount}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Activities</span>
              <span className="text-sm font-bold text-slate-800">{stats.activitiesCount}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated</span>
              <span className="text-sm font-bold text-teal-700">
                {trip.currency || '€'}{trip.estimatedCost?.toLocaleString() || stats.totalEstimatedCost.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Budget Meter */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Budget Planned: {trip.currency || '€'}{trip.plannedBudget?.toLocaleString()}</span>
              {stats.isOverBudget ? (
                <span className="text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-md">
                  +{trip.currency || '€'}{stats.budgetDifference} Over
                </span>
              ) : (
                <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                  On Track
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all ${stats.isOverBudget ? 'bg-amber-500' : 'bg-teal-500'}`}
                style={{ width: `${Math.min(100, ((trip.estimatedCost || stats.totalEstimatedCost) / (trip.plannedBudget || 2500)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            onClick={handleOpenWorkspace}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 group-hover:shadow-md"
          >
            <span>Continue Planning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
