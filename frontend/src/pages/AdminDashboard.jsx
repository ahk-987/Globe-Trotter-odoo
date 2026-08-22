import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Compass, 
  Sparkles, 
  Activity,
  Globe
} from 'lucide-react';
import { platformAnalytics } from '../data/mockData';

export const AdminDashboard = () => {
  const stats = platformAnalytics;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      
      {/* Top Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Platform Intelligence</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
          GlobeTrotter Analytics & Trends
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time metrics, popular destination rankings, and traveler activity
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Total Trips Created</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1 block">
            {stats.totalTripsCreated.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28% this month
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Active Travelers</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1 block">
            {stats.activeUsers.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% active planning
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Destinations Covered</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1 block">
            {stats.destinationsCovered}
          </span>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Across 42 Countries</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block">Avg. Trip Duration</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1 block">
            {stats.averageTripDuration} Days
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">3.4 Cities on average</span>
        </div>
      </div>

      {/* Grid: Popular Destinations Table & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Popular Cities (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Most Planned Destinations</h3>
              <p className="text-xs text-slate-500">Top destinations added to traveler itineraries</p>
            </div>
            <Globe className="w-5 h-5 text-teal-600" />
          </div>

          <div className="space-y-3">
            {stats.popularDestinations.map((dest, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{dest.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold">{dest.count} trips</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{dest.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Activity Preferences</h3>
                <p className="text-xs text-slate-500">Breakdown of planned highlights</p>
              </div>
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="space-y-4">
              {stats.popularCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{cat.name}</span>
                    <span className="text-teal-700">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Synced with GlobeTrotter Core Database</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
