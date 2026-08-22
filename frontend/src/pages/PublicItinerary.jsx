import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  Bed,
  Train,
  Ticket
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const PublicItinerary = () => {
  const { slug } = useParams();
  const { trips, copyCommunityTrip, showToast } = useTrip();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const trip = trips.find(t => t.slug === slug || t.id === slug) || trips[0];
  const destinations = trip?.destinations || [];
  const days = trip?.days || [];

  const handleCopyThisTrip = async () => {
    setCopied(true);
    try {
      const cloned = await copyCommunityTrip({
        title: `${trip.title} (Copy)`,
        description: trip.description,
        coverImage: trip.coverImage,
      });
      setTimeout(() => {
        navigate(`/itinerary/${cloned.id}`);
      }, 500);
    } catch (e) {
      setCopied(false);
    }
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-display">Itinerary Not Found</h2>
          <p className="text-sm text-slate-400 mt-2 mb-6">This trip link may have expired or been moved.</p>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
            Return to GlobeTrotter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-teal-500 selection:text-white">
      
      {/* Top Floating Sticky Header for Public View */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight">
            Globe<span className="text-teal-400">Trotter</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyThisTrip}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Workspace!' : 'Copy This Trip'}</span>
          </button>
        </div>
      </header>

      {/* Hero Editorial Cover */}
      <div className="relative h-96 sm:h-[480px] overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold shadow">
              Verified Traveler Guide
            </span>
            <span className="text-xs text-slate-300 font-medium">{trip.startDate} – {trip.endDate}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            {trip.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
            {trip.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-200">
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{destinations.map(d => d.name).join(' → ')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>{trip.durationDays || 14} Days Duration</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 font-bold text-teal-300">
              <span>Est. {trip.currency || '€'}{trip.estimatedCost} Total</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Body: Multi-City Stops & Day-by-Day Story */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        
        {/* Route Overview */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-display text-white">Route Stops & Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((dest, idx) => (
              <div key={dest.id || idx} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
                <img src={dest.image} alt={dest.name} className="w-full h-32 rounded-xl object-cover mb-3" />
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">{dest.name} {dest.flag}</h4>
                  <span className="text-xs text-teal-400 font-bold">{dest.nights} Nights</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{dest.country}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Day-by-Day Curated Schedule */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold font-display text-white">Day-by-Day Travel Guide</h2>
            <span className="text-xs text-slate-400">{days.length} Days Detailed</span>
          </div>

          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.dayIndex} className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                      {day.dayIndex}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {day.cityName} {day.countryFlag}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">{day.date}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {day.activities?.map((act, idx) => (
                    <div key={act.id || idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-teal-400 font-bold block">{act.time} · {act.type}</span>
                      <h4 className="text-xs font-bold text-slate-200 mt-0.5 truncate">{act.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{act.duration} · {Number(act.cost) === 0 ? 'Free' : `€${act.cost}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Bottom Sticky Bar */}
        <div className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-40 bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-white">Love this itinerary?</p>
            <p className="text-[11px] text-slate-400">Clone it to make it your own.</p>
          </div>
          <button
            onClick={handleCopyThisTrip}
            className="px-5 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow transition-all hover:scale-102"
          >
            <Copy className="w-4 h-4" />
            <span>Copy to My Workspace</span>
          </button>
        </div>

      </main>

    </div>
  );
};

export default PublicItinerary;
