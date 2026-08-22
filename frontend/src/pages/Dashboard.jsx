import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  TrendingUp, 
  Share2, 
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import TripCard from '../components/TripCard';
import CityCard from '../components/CityCard';
import BudgetCard from '../components/BudgetCard';
import CitySearchModal from '../components/CitySearchModal';
import ShareModal from '../components/ShareModal';

export const Dashboard = () => {
  const { user, trips, activeTrip, setActiveTripId, getTripStats, destinationsCatalog } = useTrip();
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [shareModalTrip, setShareModalTrip] = useState(null);
  const navigate = useNavigate();

  const heroTrip = activeTrip || trips[0];
  const heroStats = getTripStats(heroTrip);
  const otherTrips = trips.filter(t => t.id !== heroTrip?.id);

  const handleContinuePlanning = () => {
    if (heroTrip) {
      setActiveTripId(heroTrip.id);
      navigate(`/itinerary/${heroTrip.id}`);
    }
  };

  const handleExploreCity = (city) => {
    setShowAddCityModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Header & Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900/10 via-emerald-900/5 to-transparent p-6 sm:p-8 rounded-3xl border border-teal-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Travel Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Ready to plan your next adventure? Let's turn your travel ideas into reality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/create-trip"
            className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>+ Plan New Trip</span>
          </Link>
        </div>
      </div>

      {/* UX Next Action Banner: WHERE AM I / WHAT'S NEXT */}
      {heroTrip && (
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-extrabold tracking-wider text-teal-400">
                  Active Planning Flow: {heroTrip.title}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-300 font-semibold">{heroStats.progress}% Completed</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                <strong className="text-white">What's Next?</strong> Review Day 5 activities in Paris or apply 3 AI budget optimization tips to save up to €265.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <Link
              to="/budget"
              className="flex-1 md:flex-initial text-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-colors"
            >
              Optimize Budget
            </Link>
            <button
              onClick={handleContinuePlanning}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow"
            >
              <span>Continue Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid: Upcoming Hero Trip (Left 7 cols) & Budget Highlight (Right 5 cols) */}
      {heroTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Large Hero Trip Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            {/* Top Hero Photo */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={heroTrip.coverImage}
                alt={heroTrip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold shadow-md">
                  Upcoming Adventure
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                  Starts in 22 Days
                </span>
              </div>

              {/* Quick Share Trigger */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShareModalTrip(heroTrip)}
                  className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/90 transition-colors"
                  title="Share Trip"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Route inside Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{heroTrip.destinations?.map(d => d.name).join(' → ') || 'Multi-City Itinerary'}</span>
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  {heroTrip.title}
                </h2>
              </div>
            </div>

            {/* Hero Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Dates & Quick Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold text-slate-900">{heroTrip.startDate} – {heroTrip.endDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700">{heroStats.totalDays} Days</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-700">{heroStats.citiesCount} Cities</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-700">{heroStats.activitiesCount} Planned Activities</span>
                  </div>
                </div>

                {/* Progress Bar with Steps */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700">Trip Planning Milestones</span>
                    <span className="font-extrabold text-teal-600">{heroStats.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${heroStats.progress}%` }}
                    ></div>
                  </div>

                  {/* Stage Checklist Badges */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Details
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Destinations ({heroStats.citiesCount})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" /> Activities (70%)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Budget Review
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Row */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleContinuePlanning}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all group"
                >
                  <span>Continue Planning Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Budget Breakdown Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <BudgetCard 
              trip={heroTrip} 
              onOptimizeClick={() => navigate('/budget')}
            />

            {/* Quick Destination Stops Preview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Route Destinations
                </h4>
                <button
                  onClick={() => setShowAddCityModal(true)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {heroTrip.destinations?.map((dest, idx) => (
                  <div 
                    key={dest.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900">{dest.name}</span>
                          <span className="text-xs">{dest.flag}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">{dest.nights} nights · {heroTrip.currency || '€'}{dest.estimatedCost}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md">
                      Stop #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Recent Trips Section */}
      {otherTrips.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900">Your Other Trips</h2>
              <p className="text-xs text-slate-500">Pick up right where you left off</p>
            </div>
            <Link to="/my-trips" className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
              <span>View all ({trips.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {otherTrips.map(trip => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onShare={(t) => setShareModalTrip(t)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Destinations Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Explore & Discover</span>
            <h2 className="text-xl font-bold font-display text-slate-900">Recommended Destinations</h2>
            <p className="text-xs text-slate-500">Curated world-class destinations ready to add to your next itinerary</p>
          </div>
          <button
            onClick={() => setShowAddCityModal(true)}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Browse All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinationsCatalog.slice(0, 4).map(city => (
            <CityCard
              key={city.id}
              city={city}
              onAdd={() => {
                if (heroTrip) {
                  setShowAddCityModal(true);
                }
              }}
              onExplore={handleExploreCity}
            />
          ))}
        </div>
      </div>

      {/* City Search Modal */}
      <CitySearchModal
        isOpen={showAddCityModal}
        onClose={() => setShowAddCityModal(false)}
        tripId={heroTrip?.id}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareModalTrip}
        onClose={() => setShareModalTrip(null)}
        trip={shareModalTrip}
      />

    </div>
  );
};

export default Dashboard;
