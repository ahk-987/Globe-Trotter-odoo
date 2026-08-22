import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Sparkles, 
  Copy, 
  Heart, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search, 
  Compass, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { communityTripsCatalog } from '../data/mockData';

export const Community = () => {
  const { copyCommunityTrip } = useTrip();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copyingId, setCopyingId] = useState(null);
  const navigate = useNavigate();

  const tags = ['All', 'Nature', 'Aurora', 'Food & Wine', 'Architecture', 'Tapas', 'Budget Friendly'];

  const filteredTrips = communityTripsCatalog.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trip.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || trip.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCopy = async (communityTrip) => {
    setCopyingId(communityTrip.id);
    try {
      const cloned = await copyCommunityTrip(communityTrip);
      setTimeout(() => {
        setCopyingId(null);
        navigate(`/itinerary/${cloned.id}`);
      }, 500);
    } catch (e) {
      setCopyingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/10 via-emerald-900/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold inline-flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Community Curated Itineraries</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Explore Shared Journeys
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Discover verified itineraries built by fellow travelers. Copy any trip to your workspace to customize dates, cities, and activities.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search community itineraries, regions, or routes (e.g. Nordic, Italy, Spain)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedTag === tag
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Community Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((ctrip) => (
          <div 
            key={ctrip.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Top Cover */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
              <img
                src={ctrip.coverImage}
                alt={ctrip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Author pill */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold border border-white/10">
                <img src={ctrip.authorAvatar} alt={ctrip.author} className="w-5 h-5 rounded-full object-cover" />
                <span>{ctrip.author}</span>
              </div>

              {/* Likes and Copies */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>{ctrip.likes}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-teal-300 text-[10px] font-bold flex items-center gap-1">
                  <Copy className="w-3 h-3 text-teal-400" />
                  <span>{ctrip.copiesCount}</span>
                </span>
              </div>

              {/* Route */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <p className="text-[11px] font-medium text-teal-300 flex items-center gap-1 mb-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{ctrip.route}</span>
                </p>
                <h3 className="text-lg font-bold font-display text-white truncate">{ctrip.title}</h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {ctrip.description}
                </p>

                {/* Duration & Budget */}
                <div className="flex items-center justify-between text-xs py-2.5 border-t border-slate-100 mb-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ctrip.duration}</span>
                  </span>
                  <span className="font-extrabold text-teal-700">
                    Est. {ctrip.estimatedCost}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ctrip.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => handleCopy(ctrip)}
                  disabled={copyingId === ctrip.id}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                >
                  {copyingId === ctrip.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copying to Workspace...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy This Trip to My Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Community;
