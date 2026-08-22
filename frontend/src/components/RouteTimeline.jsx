import React from 'react';
import { 
  Plus, 
  MapPin, 
  ArrowRight, 
  Moon, 
  Trash2, 
  MoveLeft, 
  MoveRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const RouteTimeline = ({ trip, onAddStopClick }) => {
  const { removeCityFromTrip, reorderCities } = useTrip();

  if (!trip || !trip.destinations) return null;

  const destinations = trip.destinations;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Multi-City Route</span>
          </h3>
          <p className="text-xs text-slate-500">
            {destinations.length} Stops · {destinations.map(d => d.name).join(' → ')}
          </p>
        </div>

        <button
          onClick={onAddStopClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Desktop Horizontal Route Strip */}
      <div className="hidden lg:flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {destinations.map((dest, idx) => (
          <React.Fragment key={dest.id || idx}>
            {/* City Card Node */}
            <div className="shrink-0 w-64 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:shadow-md hover:border-teal-500/40 transition-all relative group">
              {/* Order index pill & actions */}
              <div className="flex items-center justify-between mb-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx > 0 && (
                    <button 
                      onClick={() => reorderCities(trip.id, idx, idx - 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      title="Move Left"
                    >
                      <MoveLeft className="w-3 h-3" />
                    </button>
                  )}
                  {idx < destinations.length - 1 && (
                    <button 
                      onClick={() => reorderCities(trip.id, idx, idx + 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      title="Move Right"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  )}
                  <button 
                    onClick={() => removeCityFromTrip(trip.id, dest.id)}
                    className="p-1 hover:bg-rose-100 rounded text-rose-600 ml-1"
                    title="Remove Stop"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* City Photo & Info */}
              <div className="flex items-center gap-3">
                <img
                  src={dest.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=200&q=80"}
                  alt={dest.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900 truncate">{dest.name}</span>
                    <span className="text-xs">{dest.flag}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{dest.country}</p>
                </div>
              </div>

              {/* Dates & Cost */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Moon className="w-3 h-3 text-slate-400" />
                  <span>{dest.nights} nights</span>
                </div>
                <span className="font-bold text-teal-700">
                  {trip.currency || '€'}{dest.estimatedCost || 500}
                </span>
              </div>
            </div>

            {/* Connector Arrow */}
            {idx < destinations.length - 1 && (
              <div className="shrink-0 flex items-center text-slate-300">
                <div className="w-4 h-0.5 bg-slate-200"></div>
                <ArrowRight className="w-4 h-4 text-teal-500 -ml-1" />
                <div className="w-4 h-0.5 bg-slate-200 -ml-1"></div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Add Destination Button Node */}
        <button
          onClick={onAddStopClick}
          className="shrink-0 w-44 h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-teal-700 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-600">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">+ Add Next Stop</span>
        </button>
      </div>

      {/* Mobile / Tablet Vertical Route Timeline */}
      <div className="lg:hidden space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-6 before:w-0.5 before:bg-teal-200">
        {destinations.map((dest, idx) => (
          <div key={dest.id || idx} className="relative flex items-start gap-4 pl-3">
            {/* Step dot */}
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0 z-10 ring-4 ring-white shadow">
              {idx + 1}
            </div>

            {/* Stop content */}
            <div className="flex-1 bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 truncate">{dest.name}</span>
                    <span className="text-xs">{dest.flag}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {dest.nights} nights · {trip.currency || '€'}{dest.estimatedCost}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => removeCityFromTrip(trip.id, dest.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteTimeline;
