import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Plus, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ListFilter, 
  CalendarDays, 
  Route, 
  Wallet, 
  FileText, 
  ChevronRight,
  Filter,
  ArrowRight,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import RouteTimeline from '../components/RouteTimeline';
import DayCard from '../components/DayCard';
import CitySearchModal from '../components/CitySearchModal';
import ActivitySearchModal from '../components/ActivitySearchModal';
import ShareModal from '../components/ShareModal';
import BudgetCard from '../components/BudgetCard';

export const Itinerary = () => {
  const { id } = useParams();
  const { trips, activeTrip, setActiveTripId, getTripStats } = useTrip();
  const navigate = useNavigate();

  // If ID in URL doesn't match active, sync it
  const currentTrip = (id ? trips.find(t => t.id === id || t.slug === id) : activeTrip) || activeTrip || trips[0];
  const stats = getTripStats(currentTrip);

  const [activeView, setActiveView] = useState('list'); // 'list' | 'timeline' | 'calendar' | 'budget'
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [activityModalState, setActivityModalState] = useState({ isOpen: false, dayIndex: 1, cityName: 'London' });
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');

  if (!currentTrip) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-900">No active itinerary selected</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">Choose a trip to open the workspace or create a new one.</p>
        <Link to="/create-trip" className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold">
          + Create New Trip
        </Link>
      </div>
    );
  }

  const days = currentTrip.days || [];
  const destinations = currentTrip.destinations || [];

  const filteredDays = selectedCityFilter === 'All' 
    ? days 
    : days.filter(d => d.cityName === selectedCityFilter);

  const handleOpenActivityModal = (dayIndex, cityName) => {
    setActivityModalState({ isOpen: true, dayIndex, cityName: cityName || 'London' });
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-extrabold border border-teal-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                Planning Workspace
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentTrip.startDate} – {currentTrip.endDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              {currentTrip.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
              {currentTrip.description}
            </p>
          </div>

          {/* Quick Metrics & Share Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
              <div className="text-center pr-2 border-r border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">DAYS</span>
                <span className="font-extrabold text-slate-800">{stats.totalDays}</span>
              </div>
              <div className="text-center px-2 border-r border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">CITIES</span>
                <span className="font-extrabold text-slate-800">{stats.citiesCount}</span>
              </div>
              <div className="text-center px-2 border-r border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">ACTIVITIES</span>
                <span className="font-extrabold text-slate-800">{stats.activitiesCount}</span>
              </div>
              <div className="text-center pl-2">
                <span className="text-[10px] text-slate-400 block font-bold">ESTIMATED</span>
                <span className="font-extrabold text-teal-700">
                  {currentTrip.currency || '€'}{stats.totalEstimatedCost.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* 2. PLANNING PROGRESS TRACKER */}
        <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 shrink-0">Planning Progress:</span>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Details
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Destinations
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Dates
              </span>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Activities 70%
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Budget 50%
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-medium">
                Review ○
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-medium">
                Share ○
              </span>
            </div>
          </div>

          <Link
            to="/summary"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 shrink-0"
          >
            <span>View Smart Trip Briefing</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. MULTI-CITY ROUTE COMPONENT */}
      <RouteTimeline
        trip={currentTrip}
        onAddStopClick={() => setShowAddCityModal(true)}
      />

      {/* 4. WORKSPACE CONTROLS & VIEWS (List | Timeline | Calendar | Budget) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'list', label: 'Day-by-Day List', icon: ListFilter },
            { id: 'timeline', label: 'Route Timeline', icon: Route },
            { id: 'calendar', label: 'Calendar View', icon: CalendarDays },
            { id: 'budget', label: 'Budget Breakdown', icon: Wallet },
          ].map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === view.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter by City */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Filter City:</span>
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Cities ({destinations.length})</option>
            {destinations.map(dest => (
              <option key={dest.id} value={dest.name}>{dest.name} {dest.flag}</option>
            ))}
          </select>
        </div>

      </div>

      {/* 5. VIEW CONTENT CONTAINER */}
      {activeView === 'list' && (
        <div className="space-y-5">
          {filteredDays.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
              <p className="text-xs text-slate-500">No days found matching the selected city filter.</p>
            </div>
          ) : (
            filteredDays.map(day => (
              <DayCard
                key={day.dayIndex}
                day={day}
                tripId={currentTrip.id}
                currency={currentTrip.currency || '€'}
                onAddActivityClick={handleOpenActivityModal}
              />
            ))
          )}
        </div>
      )}

      {activeView === 'timeline' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Visual Journey Progression</h3>
            <p className="text-xs text-slate-500">Chronological travel milestone flow</p>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-teal-300">
            {destinations.map((dest, idx) => (
              <div key={dest.id || idx} className="relative flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center -left-3 relative ring-4 ring-white shadow">
                  {idx + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{dest.name}</span>
                      <span>{dest.flag}</span>
                      <span className="text-xs text-slate-400">• {dest.country}</span>
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                      {dest.nights} Nights Stay
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Estimated Stop Budget: {currentTrip.currency || '€'}{dest.estimatedCost} (Stay: {currentTrip.currency || '€'}{dest.stayCost} · Transit: {currentTrip.currency || '€'}{dest.transitCost})
                  </p>
                </div>
              </div>
            ))}
            <div className="relative flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center -left-3 relative ring-4 ring-white shadow">
                ✓
              </div>
              <span className="text-xs font-bold text-slate-700">Trip Complete & Return</span>
            </div>
          </div>
        </div>
      )}

      {activeView === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Trip Calendar Schedule</h3>
              <p className="text-xs text-slate-500">June 2026 Daily Planner Grid</p>
            </div>
            <Link to="/calendar" className="text-xs font-bold text-teal-600 hover:underline">
              Open Full Interactive Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center">
            {days.map(day => (
              <div key={day.dayIndex} className="bg-slate-50 hover:bg-teal-50/50 p-3 rounded-2xl border border-slate-200/80 transition-all text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-teal-700">Day {day.dayIndex}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{day.date?.slice(5)}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{day.cityName}</p>
                <div className="mt-2 text-[10px] text-slate-500 bg-white p-1 rounded-lg border border-slate-100 font-medium">
                  {day.activities?.length || 0} activities
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'budget' && (
        <div className="space-y-6">
          <BudgetCard 
            trip={currentTrip} 
            onOptimizeClick={() => navigate('/budget')} 
          />
          <div className="text-center pt-2">
            <Link
              to="/budget"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow"
            >
              <Wallet className="w-4 h-4" />
              <span>Open Dedicated Budget Optimizer & Category Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CitySearchModal
        isOpen={showAddCityModal}
        onClose={() => setShowAddCityModal(false)}
        tripId={currentTrip.id}
      />

      <ActivitySearchModal
        isOpen={activityModalState.isOpen}
        onClose={() => setActivityModalState(prev => ({ ...prev, isOpen: false }))}
        dayIndex={activityModalState.dayIndex}
        cityName={activityModalState.cityName}
        tripId={currentTrip.id}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        trip={currentTrip}
      />

    </div>
  );
};

export default Itinerary;
