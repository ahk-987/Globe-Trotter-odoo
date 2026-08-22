import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Share2, 
  Printer, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Compass,
  Download
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const SmartSummary = () => {
  const { activeTrip, trips, getTripStats, showToast } = useTrip();

  const trip = activeTrip || trips[0];
  if (!trip) return null;

  const stats = getTripStats(trip);
  const destinations = trip.destinations || [];

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    showToast("Exporting Trip PDF Briefing... 📄", "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12 print:space-y-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Travel Briefing</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Your Trip at a Glance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Executive summary and route intelligence for {trip.title}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Itinerary</span>
          </button>
        </div>
      </div>

      {/* Hero Editorial Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-80">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold shadow">
              Official Itinerary Briefing
            </span>
            <span className="text-xs text-slate-300">{trip.startDate} — {trip.endDate}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            {trip.title}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-2xl">
            {destinations.map(d => d.name).join(' → ')}
          </p>
        </div>
      </div>

      {/* 4 Big Visual Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 text-center shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Total Duration</span>
          <span className="text-3xl font-extrabold font-display text-slate-900 mt-1 block">{stats.totalDays} Days</span>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Full Journey</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 text-center shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Destinations</span>
          <span className="text-3xl font-extrabold font-display text-slate-900 mt-1 block">{stats.citiesCount} Cities</span>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Multi-City Route</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 text-center shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Planned Activities</span>
          <span className="text-3xl font-extrabold font-display text-slate-900 mt-1 block">{stats.activitiesCount}</span>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Curated Stops</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 text-center shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Estimated Cost</span>
          <span className="text-3xl font-extrabold font-display text-teal-700 mt-1 block">
            {trip.currency || '€'}{stats.totalEstimatedCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Target: {trip.currency || '€'}{trip.plannedBudget?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Story & Intelligence Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Average Daily Cost</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block">€184 / day</span>
          <p className="text-[11px] text-slate-500 mt-1">Based on accommodations, transit & activities</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Highest Category</span>
          <span className="text-lg font-bold text-indigo-700 mt-1 block">Accommodation</span>
          <p className="text-[11px] text-slate-500 mt-1">59% of overall estimated expenditure</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Busiest Day</span>
          <span className="text-lg font-bold text-amber-700 mt-1 block">Day 5 · Paris</span>
          <p className="text-[11px] text-slate-500 mt-1">4 activities scheduled (6h 45m)</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Budget Status</span>
          <span className="text-lg font-bold text-emerald-700 mt-1 block">
            {stats.isOverBudget ? `+€${stats.budgetDifference} (Optimizing)` : 'On Target'}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">AI suggestions enabled</p>
        </div>
      </div>

      {/* Detailed Destination Route Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Complete Multi-City Route Breakdown</h3>

        <div className="space-y-4">
          {destinations.map((dest, idx) => (
            <div key={dest.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <img src={dest.image} alt={dest.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-bold text-slate-900">{dest.name}</h4>
                    <span>{dest.flag}</span>
                    <span className="text-xs text-slate-500">• {dest.country}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dest.nights} Nights · Arrival: {dest.arrivalDate} · Departure: {dest.departureDate}
                  </p>
                </div>
              </div>

              <div className="text-right self-end sm:self-auto">
                <span className="text-xs text-slate-400 block">Estimated City Spend</span>
                <span className="text-base font-extrabold text-teal-700">{trip.currency || '€'}{dest.estimatedCost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return to Workspace CTA */}
      <div className="text-center pt-4 print:hidden">
        <Link
          to={`/itinerary/${trip.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-600/20 transition-all"
        >
          <span>Return to Trip Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default SmartSummary;
