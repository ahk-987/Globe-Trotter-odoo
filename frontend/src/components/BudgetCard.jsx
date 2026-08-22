import { Link } from 'react-router-dom';
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Bed,
  Train,
  Ticket,
  UtensilsCrossed
} from 'lucide-react';

export const BudgetCard = ({ trip, onOptimizeClick }) => {
  if (!trip) return null;

  const planned = Number(trip.plannedBudget) || 2500;
  const estimated = Number(trip.estimatedCost) || 2575;
  const currency = trip.currency || '€';
  const diff = estimated - planned;
  const isOver = diff > 0;
  const percentage = Math.min(100, Math.round((estimated / planned) * 100));

  const breakdown = trip.budgetBreakdown || {
    stay: 1520,
    transport: 480,
    activities: 335,
    meals: 240,
  };

  const categories = [
    { label: 'Accommodation', key: 'stay', value: breakdown.stay || 0, icon: Bed, color: 'bg-indigo-500', barColor: 'bg-indigo-500' },
    { label: 'Transportation', key: 'transport', value: breakdown.transport || 0, icon: Train, color: 'bg-blue-500', barColor: 'bg-blue-500' },
    { label: 'Activities', key: 'activities', value: breakdown.activities || 0, icon: Ticket, color: 'bg-teal-500', barColor: 'bg-teal-500' },
    { label: 'Meals & Dining', key: 'meals', value: breakdown.meals || 0, icon: UtensilsCrossed, color: 'bg-amber-500', barColor: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Trip Budget Overview</h3>
            <p className="text-xs text-slate-500">Live estimates synced with itinerary</p>
          </div>
        </div>

        <Link
          to="/budget"
          className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
        >
          <span>Full Budget</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Budget Figures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Total</span>
          <span className="text-lg font-extrabold text-slate-900">{currency}{estimated.toLocaleString()}</span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Planned Budget</span>
          <span className="text-lg font-extrabold text-slate-700">{currency}{planned.toLocaleString()}</span>
        </div>

        <div className={`col-span-2 sm:col-span-1 rounded-2xl p-3 border ${
          isOver ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
        }`}>
          <span className="text-[10px] uppercase font-bold block opacity-80">Budget Status</span>
          <span className="text-base font-extrabold flex items-center gap-1.5">
            {isOver ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>+{currency}{diff} Over</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>On Target</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Multi-segmented Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Total Spending Allocation</span>
          <span>{percentage}% of target</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full flex overflow-hidden gap-0.5">
          {categories.map(cat => {
            const widthPct = estimated > 0 ? (cat.value / estimated) * 100 : 25;
            return (
              <div 
                key={cat.key} 
                className={`${cat.barColor} h-full transition-all duration-500`} 
                style={{ width: `${widthPct}%` }}
                title={`${cat.label}: ${currency}${cat.value}`}
              />
            );
          })}
        </div>
      </div>

      {/* Categories Breakdown List */}
      <div className="space-y-2 mb-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const pct = estimated > 0 ? Math.round((cat.value / estimated) * 100) : 0;
          return (
            <div key={cat.key} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 font-medium">{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">({pct}%)</span>
                <span className="font-bold text-slate-900">{currency}{cat.value.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action / Optimizer suggestion prompt */}
      {isOver && (
        <div className="mt-2 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[11px] font-medium text-amber-900">
              Trip is {currency}{diff} over budget. 3 AI optimizations found.
            </p>
          </div>
          {onOptimizeClick ? (
            <button
              onClick={onOptimizeClick}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors"
            >
              Optimize
            </button>
          ) : (
            <Link
              to="/budget"
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors"
            >
              Optimize
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
