import { Plus, Bookmark, Compass } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const CityCard = ({ city, onAdd, onExplore, isSelected = false }) => {
  const { user, toggleBookmark } = useTrip();
  const isBookmarked = user?.savedDestinations?.includes(city.id);

  return (
    <div className={`group bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
      isSelected 
        ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-lg' 
        : 'border-slate-200/80 hover:border-teal-500/40 hover:shadow-xl'
    }`}>
      {/* Cover Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={city.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 flex items-center gap-1">
            <span className="text-sm">{city.flag || "📍"}</span>
            <span>{city.country}</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(city.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isBookmarked 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
            }`}
            aria-label="Bookmark destination"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom City Name & Cost info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
                {city.region || "Destination"}
              </span>
              <h4 className="text-lg font-bold font-display text-white leading-tight">
                {city.name}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-300 block">Est. Daily</span>
              <span className="text-xs font-extrabold text-teal-300">
                €{city.dailyCost || 150}<span className="text-[10px] font-normal text-slate-300">/day</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Tags */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">
            {city.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {city.tags?.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Cost: {city.costIndex || "$$"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {onAdd ? (
            <button
              onClick={() => onAdd(city)}
              className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Trip</span>
            </button>
          ) : (
            <button
              onClick={() => onExplore && onExplore(city)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore City</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityCard;
