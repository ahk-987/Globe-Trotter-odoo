import { useState } from 'react';
import { Search, X, MapPin, Plus, Check } from 'lucide-react';
import { destinationsCatalog } from '../data/mockData';
import { useTrip } from '../context/TripContext';

export const CitySearchModal = ({ isOpen, onClose, onSelectCity, tripId }) => {
  const { addCityToTrip } = useTrip();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [addedCityIds, setAddedCityIds] = useState([]);

  if (!isOpen) return null;

  const regions = ['All', 'Western Europe', 'Central Europe', 'Southern Europe', 'East Asia', 'Southeast Asia'];

  const filteredCities = destinationsCatalog.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleAdd = (city) => {
    if (onSelectCity) {
      onSelectCity(city);
    } else if (tripId) {
      addCityToTrip(tripId, city);
    }
    setAddedCityIds(prev => [...prev, city.id]);
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
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Destination Stop</h3>
                <p className="text-xs text-slate-500">Discover cities and add them to your multi-city route</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input & Filters */}
          <div className="py-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search city or country (e.g. Paris, London, Kyoto)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                autoFocus
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {regions.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                    selectedRegion === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* City Grid Results */}
          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
            {filteredCities.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-500">No destinations found matching "{searchTerm}"</p>
              </div>
            ) : (
              filteredCities.map(city => {
                const isAdded = addedCityIds.includes(city.id);
                return (
                  <div
                    key={city.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-teal-500/40 hover:bg-teal-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 truncate">{city.name}</span>
                          <span>{city.flag}</span>
                          <span className="text-xs text-slate-400 font-normal truncate">• {city.country}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{city.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
                          <span className="text-teal-700">€{city.dailyCost}/day</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{city.region}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700">{city.costIndex}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdd(city)}
                      disabled={isAdded}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-slate-900 hover:bg-teal-600 text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Route</span>
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

export default CitySearchModal;
