import { useState } from 'react';
import { Search, X, Plus, Clock, Star, Check } from 'lucide-react';
import { activitiesCatalog } from '../data/mockData';
import { useTrip } from '../context/TripContext';

export const ActivitySearchModal = ({ isOpen, onClose, dayIndex, cityName, tripId }) => {
  const { addActivityToDay } = useTrip();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedActivityIds, setAddedActivityIds] = useState([]);

  if (!isOpen) return null;

  const categories = ['All', 'Sightseeing', 'Culture', 'Food & Dining', 'Experience'];

  // Filter activities by search & category, prioritizing those in current city
  const filteredActivities = activitiesCatalog.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.cityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAdd = (activity) => {
    addActivityToDay(tripId, dayIndex, activity);
    setAddedActivityIds(prev => [...prev, activity.id]);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
                  Day {dayIndex}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Discover Activities {cityName ? `for ${cityName}` : ''}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Select curated highlights, museum tours, and cultural experiences
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="py-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search activities, museums, landmarks, culinary tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Cards List */}
          <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-500">No activities found matching your criteria</p>
              </div>
            ) : (
              filteredActivities.map(act => {
                const isAdded = addedActivityIds.includes(act.id);
                return (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-teal-500/40 hover:bg-slate-50/50 transition-all gap-3 group"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <img
                        src={act.image}
                        alt={act.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold">
                            {act.category || 'Sightseeing'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">• {act.cityName}</span>
                          {act.rating && (
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {act.rating}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                          {act.title}
                        </h4>

                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {act.description}
                        </p>

                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {act.duration}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-extrabold text-teal-700">
                            {Number(act.cost) === 0 ? 'Free' : `€${act.cost}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(act)}
                      disabled={isAdded}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Day {dayIndex}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Day {dayIndex}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivitySearchModal;
