import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Sparkles, 
  Filter, 
  CheckCircle2,
  CalendarDays,
  ListFilter
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Calendar = () => {
  const { activeTrip, trips, setActiveTripId } = useTrip();
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  const trip = activeTrip || trips[0];
  const days = trip?.days || [];
  const activeDayData = days.find(d => d.dayIndex === selectedDay) || days[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Visual Timeline</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Trip Calendar & Journey Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronized schedule for {trip?.title || 'Your Active Trip'} ({trip?.startDate} – {trip?.endDate})
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar Grid</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Journey Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calendar Grid or Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">June 2026</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">14 Days Scheduled</span>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {days.map((day) => {
                const isSelected = day.dayIndex === selectedDay;
                const actCount = day.activities?.length || 0;

                return (
                  <button
                    key={day.dayIndex}
                    onClick={() => setSelectedDay(day.dayIndex)}
                    className={`text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold text-teal-800">Day {day.dayIndex}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{day.date?.slice(5)}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 truncate">{day.cityName}</p>
                    <span className="text-[10px]">{day.countryFlag}</span>

                    <div className="mt-2 text-[10px] font-medium text-slate-500 bg-white/90 px-1.5 py-0.5 rounded-md border border-slate-100 truncate">
                      {actCount} {actCount === 1 ? 'activity' : 'activities'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {days.map((day) => (
                <div 
                  key={day.dayIndex}
                  onClick={() => setSelectedDay(day.dayIndex)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    day.dayIndex === selectedDay
                      ? 'border-teal-600 bg-teal-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {day.dayIndex}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{day.cityName}</span>
                        <span>{day.countryFlag}</span>
                        <span className="text-xs text-slate-400 font-normal">• {day.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {day.activities?.map(a => a.title).join(', ') || 'No activities'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {day.activities?.length || 0} stops
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Selected Day Schedule Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 block">Day Focus</span>
                <h3 className="text-lg font-bold text-slate-900">
                  Day {activeDayData?.dayIndex} · {activeDayData?.cityName} {activeDayData?.countryFlag}
                </h3>
                <span className="text-xs text-slate-500">{activeDayData?.date}</span>
              </div>
            </div>

            {/* Activities in this day */}
            <div className="space-y-3">
              {activeDayData?.activities?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No activities on this day.</p>
              ) : (
                activeDayData?.activities?.map((act, idx) => (
                  <div key={act.id || idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{act.title}</span>
                      <span className="font-extrabold text-teal-700">
                        {Number(act.cost) === 0 ? 'Free' : `€${act.cost}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {act.time} ({act.duration})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{act.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <p className="text-[11px] text-slate-400 text-center">
              All dates synced automatically across workspace & itinerary.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Calendar;
