import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  Briefcase, 
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import TripCard from '../components/TripCard';
import ShareModal from '../components/ShareModal';

export const MyTrips = () => {
  const { trips } = useTrip();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [shareTrip, setShareTrip] = useState(null);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinations?.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterTab === 'upcoming') return matchesSearch && trip.isUpcoming;
    if (filterTab === 'planning') return matchesSearch && trip.status?.toLowerCase().includes('plan');
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            My Trips & Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, organize, and continue planning your personalized journeys
          </p>
        </div>

        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Controls Bar: Search, Filters & Grid/List Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by trip name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Tabs & Grid Toggle */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'upcoming', 'planning'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Trips Display */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No trips found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-5">
            {searchTerm ? `No itineraries matched "${searchTerm}"` : "You haven't created any trips in this category yet."}
          </p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Trip</span>
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              variant={viewMode === 'list' ? 'compact' : 'grid'}
              onShare={(t) => setShareTrip(t)}
            />
          ))}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareTrip}
        onClose={() => setShareTrip(null)}
        trip={shareTrip}
      />

    </div>
  );
};

export default MyTrips;
