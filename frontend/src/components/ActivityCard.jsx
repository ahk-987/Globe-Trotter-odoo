import { Plus, Clock, Star, MapPin, Eye, Check } from 'lucide-react';

export const ActivityCard = ({ activity, onAdd, onPreview, isAdded = false }) => {
  const categoryColors = {
    'Culture': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Sightseeing': 'bg-teal-50 text-teal-700 border-teal-200',
    'Food & Dining': 'bg-amber-50 text-amber-700 border-amber-200',
    'Experience': 'bg-purple-50 text-purple-700 border-purple-200',
    'Nature': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Transportation': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const badgeClass = categoryColors[activity.category || activity.type] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/40 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Activity Image & Top Badges */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={activity.image || "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${badgeClass}`}>
            {activity.category || activity.type || "Activity"}
          </span>
        </div>

        {/* Rating */}
        {activity.rating && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{activity.rating}</span>
            </span>
          </div>
        )}

        {/* Bottom City Tag */}
        <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
          <p className="text-[10px] text-teal-300 font-medium truncate flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{activity.location || activity.cityName}</span>
          </p>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {activity.title}
          </h4>

          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 mb-2.5">
            {activity.description || "Exciting curated travel highlight and activity experience."}
          </p>

          {/* Duration & Cost */}
          <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activity.duration || "2.0h"}</span>
            </span>

            <span className="font-extrabold text-teal-700 text-xs">
              {Number(activity.cost) === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `€${activity.cost}`
              )}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onPreview && onPreview(activity)}
            className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          {isAdded ? (
            <button
              disabled
              className="py-1.5 px-2 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-default"
            >
              <Check className="w-3 h-3" />
              <span>Added</span>
            </button>
          ) : (
            <button
              onClick={() => onAdd && onAdd(activity)}
              className="py-1.5 px-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Add to Day</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
