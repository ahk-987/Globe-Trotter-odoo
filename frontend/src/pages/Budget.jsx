import React from 'react';
import { 
  Wallet, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Bed, 
  Train, 
  Ticket, 
  UtensilsCrossed, 
  ArrowRight,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Budget = () => {
  const { activeTrip, trips, applyBudgetOptimization } = useTrip();

  const trip = activeTrip || trips[0];
  if (!trip) return null;

  const planned = Number(trip.plannedBudget) || 2500;
  const estimated = Number(trip.estimatedCost) || 2575;
  const currency = trip.currency || '€';
  const diff = estimated - planned;
  const isOver = diff > 0;

  const breakdown = trip.budgetBreakdown || {
    stay: 1520,
    transport: 480,
    activities: 335,
    meals: 240,
  };

  const categories = [
    { label: 'Accommodation / Stays', key: 'stay', value: breakdown.stay, icon: Bed, color: 'bg-indigo-500', barBg: 'bg-indigo-50 text-indigo-700' },
    { label: 'Transportation & Transit', key: 'transport', value: breakdown.transport, icon: Train, color: 'bg-blue-500', barBg: 'bg-blue-50 text-blue-700' },
    { label: 'Activities & Experiences', key: 'activities', value: breakdown.activities, icon: Ticket, color: 'bg-teal-500', barBg: 'bg-teal-50 text-teal-700' },
    { label: 'Meals & Dining', key: 'meals', value: breakdown.meals, icon: UtensilsCrossed, color: 'bg-amber-500', barBg: 'bg-amber-50 text-amber-700' },
  ];

  const optimizations = trip.optimizations || [];

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Financial Command</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Trip Budget & Cost Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time itinerary expenses, category breakdown, and AI budget optimization
          </p>
        </div>

        {/* Status Pill */}
        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 self-start sm:self-auto ${
          isOver 
            ? 'bg-amber-50 border-amber-300 text-amber-900' 
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          {isOver ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{currency}{diff} Over Target Planned Budget</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Budget On Track ({currency}{Math.abs(diff)} remaining)</span>
            </>
          )}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Estimated Total Cost</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-slate-900">
              {currency}{estimated.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Calculated from 14 days of stays, trains, and activities</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Planned Budget Ceiling</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-slate-700">
              {currency}{planned.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Target set during trip creation</p>
        </div>

        <div className={`rounded-3xl border p-6 shadow-sm ${
          isOver ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'
        }`}>
          <span className="text-xs font-bold uppercase block mb-1 opacity-80">Variance & Health</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-display ${isOver ? 'text-amber-900' : 'text-emerald-900'}`}>
              {isOver ? `+${currency}${diff}` : `-${currency}${Math.abs(diff)}`}
            </span>
          </div>
          <p className="text-[11px] font-medium mt-2 opacity-90">
            {isOver ? 'Suggestions available below to bring you under budget' : 'Excellent financial planning!'}
          </p>
        </div>
      </div>

      {/* Category Breakdowns & Allocation Visualizer */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Spending Category Allocation</h3>
            <p className="text-xs text-slate-500">Live breakdown across transport, stays, activities, and dining</p>
          </div>
        </div>

        {/* Stacked Horizontal Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden gap-1 mb-6">
          {categories.map(cat => {
            const pct = estimated > 0 ? (cat.value / estimated) * 100 : 25;
            return (
              <div 
                key={cat.key} 
                className={`${cat.color} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${cat.label}: ${currency}${cat.value}`}
              />
            );
          })}
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const pct = estimated > 0 ? Math.round((cat.value / estimated) * 100) : 0;
            return (
              <div key={cat.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cat.barBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{pct}%</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-600 block">{cat.label}</span>
                  <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
                    {currency}{cat.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spending Insights Matrix */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Average Daily Cost</span>
            <span className="text-base font-extrabold text-slate-900 mt-1 block">€184 / day</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Highest Category</span>
            <span className="text-base font-extrabold text-indigo-700 mt-1 block">Accommodation (59%)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Busiest / Peak Day</span>
            <span className="text-base font-extrabold text-teal-700 mt-1 block">Day 5 · Paris (€235)</span>
          </div>
        </div>
      </div>

      {/* AI BUDGET OPTIMIZATION CENTER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-teal-400 text-slate-950 text-xs font-extrabold uppercase flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              AI Budget Optimization Engine
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Smart Recommendations to Optimize Your Spending
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl mb-6">
            GlobeTrotter analyzed your route, hotel allocations, and activity choices. Apply recommendations below to dynamically adjust your trip total.
          </p>

          {/* Optimizations List */}
          <div className="space-y-4">
            {optimizations.length === 0 ? (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-center">
                <p className="text-xs text-slate-300">All current budget optimizations have been applied!</p>
              </div>
            ) : (
              optimizations.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    opt.applied
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-800/80 border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      opt.applied ? 'bg-emerald-500 text-slate-950' : 'bg-teal-500/20 text-teal-400'
                    }`}>
                      {opt.applied ? <Check className="w-5 h-5 stroke-[3]" /> : <Zap className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{opt.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                          Save {currency}{opt.saving}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{opt.details}</p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {opt.applied ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied (-{currency}{opt.saving})</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => applyBudgetOptimization(trip.id, opt.id)}
                        className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow transition-all hover:scale-102"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply Suggestion</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Budget;
