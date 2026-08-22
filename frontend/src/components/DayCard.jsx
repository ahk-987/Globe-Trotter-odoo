import { useState } from 'react';
import { 
  Plus, 
  Clock, 
  Trash2, 
  AlertTriangle, 
  MapPin, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const DayCard = ({ day, tripId, onAddActivityClick, currency = '€' }) => {
  const { removeActivityFromDay } = useTrip();
  const [collapsed, setCollapsed] = useState(false);

  const activities = day.activities || [];
  
  // Calculate total time & cost for this day
  let totalHours = 0;
  let totalCost = 0;
  activities.forEach(act => {
    totalHours += Number(act.durationHours) || 1.5;
    totalCost += Number(act.cost) || 0;
  });

  const hoursDisplay = Math.floor(totalHours);
  const minutesDisplay = Math.round((totalHours - hoursDisplay) * 60);
  const timeFormatted = `${hoursDisplay}h ${minutesDisplay > 0 ? minutesDisplay + 'm' : ''}`;

  // Smart Warnings
  const isBusy = totalHours >= 6.5 || activities.length >= 5;
  const isOverDailyBudget = totalCost > 175;

  const categoryPills = {
    'Culture': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sightseeing': 'bg-teal-50 text-teal-700 border-teal-200',
    'Food & Dining': 'bg-amber-50 text-amber-700 border-amber-200',
    'Experience': 'bg-purple-50 text-purple-700 border-purple-200',
    'Transportation': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-teal-500/30 transition-all">
      {/* Day Header */}
      <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold shrink-0">
            <span className="text-[9px] uppercase tracking-wider text-teal-400">Day</span>
            <span className="text-sm leading-none">{day.dayIndex}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {day.date || `Day ${day.dayIndex}`} · {day.cityName}
              </h3>
              <span className="text-sm">{day.countryFlag}</span>
            </div>
            {day.notes && (
              <p className="text-xs text-slate-500 mt-0.5">{day.notes}</p>
            )}
          </div>
        </div>

        {/* Day at a Glance Metrics */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <span>{activities.length} Activities</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {timeFormatted}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-teal-700">{currency}{totalCost}</span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            aria-label="Toggle day collapse"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Smart Warning Alerts if applicable */}
      {!collapsed && (isBusy || isOverDailyBudget) && (
        <div className="px-5 pt-3 flex flex-wrap gap-2">
          {isBusy && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>⚠ This day looks busy ({timeFormatted} planned) — consider adding downtime</span>
            </div>
          )}
          {isOverDailyBudget && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>⚠ Over daily budget recommendation ({currency}{totalCost})</span>
            </div>
          )}
        </div>
      )}

      {/* Timeline of Activities */}
      {!collapsed && (
        <div className="p-4 sm:p-5">
          {activities.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium mb-3">No activities scheduled for this day yet.</p>
              <button
                onClick={() => onAddActivityClick(day.dayIndex, day.cityName)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add First Activity</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-[47px] sm:before:left-[55px] before:w-0.5 before:bg-slate-200">
              {activities.map((act, actIdx) => (
                <div key={act.id || actIdx} className="relative flex items-start gap-3 sm:gap-4 group">
                  {/* Time slot tag */}
                  <div className="w-12 sm:w-14 text-right shrink-0 pt-2">
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-1 relative z-10">
                      {act.time || '10:00'}
                    </span>
                  </div>

                  {/* Bullet node */}
                  <div className="w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white border border-teal-600 shrink-0 mt-2.5 z-10"></div>

                  {/* Activity Content Box */}
                  <div className="flex-1 bg-slate-50/80 hover:bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-teal-500/30 hover:shadow-md transition-all flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${categoryPills[act.type] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {act.type || 'Sightseeing'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {act.title}
                        </h4>
                      </div>

                      {act.location && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {act.duration || '2h'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-extrabold text-teal-700">
                          {Number(act.cost) === 0 ? 'Free' : `${currency}${act.cost}`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeActivityFromDay(tripId, day.dayIndex, act.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom Quick Add button for this day */}
              <div className="pt-2 pl-14 sm:pl-16">
                <button
                  onClick={() => onAddActivityClick(day.dayIndex, day.cityName)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 text-slate-600 hover:text-teal-700 text-xs font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-600" />
                  <span>Add Activity to Day {day.dayIndex}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCard;
