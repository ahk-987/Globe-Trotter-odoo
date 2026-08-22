import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { destinationsCatalog } from '../data/mockData';

export const CreateTrip = () => {
  const { createTrip, showToast } = useTrip();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: 'European Summer Escape',
    startDate: '2026-06-12',
    endDate: '2026-06-26',
    description: 'Two weeks exploring historic cities, architecture, food and local culture.',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
    currency: '€',
    plannedBudget: 2500,
    travelPace: 'Balanced Exploration',
    initialCity: destinationsCatalog[0], // London
  });

  const coverPresets = [
    { label: 'Europe (Paris)', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Japan (Kyoto)', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
    { label: 'London (UK)', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Bali Tropical', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const initialDest = {
        id: `dest_${Date.now()}_1`,
        cityId: formData.initialCity.id,
        name: formData.initialCity.name,
        country: formData.initialCity.country,
        flag: formData.initialCity.flag,
        arrivalDate: formData.startDate,
        departureDate: formData.endDate,
        nights: 4,
        estimatedCost: formData.initialCity.dailyCost * 4,
        stayCost: 380,
        transitCost: 110,
        image: formData.initialCity.image,
      };

      const newTripPayload = {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        durationDays: 14,
        currency: formData.currency,
        plannedBudget: Number(formData.plannedBudget) || 2500,
        estimatedCost: 2575,
        destinations: [initialDest],
        budgetBreakdown: {
          transport: 480,
          stay: 1520,
          activities: 335,
          meals: 240,
        },
        optimizations: [
          {
            id: "opt-1",
            title: "Choose lower-cost boutique stay in Berlin",
            category: "Accommodation",
            saving: 120,
            applied: false,
            details: "Switch from Grand Plaza Berlin to Mitte Designer Loft without sacrificing location.",
            categoryTarget: "stay"
          },
          {
            id: "opt-2",
            title: "Replace Seine River Cruise with twilight promenade",
            category: "Activities",
            saving: 65,
            applied: false,
            details: "Experience Paris with an evening self-guided riverside walk along Pont Alexandre III.",
            categoryTarget: "activities"
          }
        ],
        days: [
          {
            dayIndex: 1,
            date: formData.startDate,
            cityId: formData.initialCity.id,
            cityName: formData.initialCity.name,
            countryFlag: formData.initialCity.flag,
            notes: "Welcome day. Check into hotel and unpack.",
            activities: [
              {
                id: `act_${Date.now()}_1`,
                time: "10:30",
                title: `${formData.initialCity.name} Highlights Walk`,
                type: "Sightseeing",
                duration: "2h 00m",
                durationHours: 2.0,
                cost: 0,
                location: "City Center",
              }
            ]
          }
        ]
      };

      const created = await createTrip(newTripPayload);
      navigate(`/itinerary/${created.id}`);
    } catch (err) {
      console.error("Error submitting trip", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/80 inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>New Itinerary Studio</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
          Plan Your Next Adventure
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Follow 3 simple steps to design your dream multi-city journey.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {[
          { step: 1, title: 'Trip Details' },
          { step: 2, title: 'Budget & Style' },
          { step: 3, title: 'First Destination' },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === item.step
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-4 ring-teal-100'
                : currentStep > item.step
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {currentStep > item.step ? <Check className="w-4 h-4" /> : item.step}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${
              currentStep === item.step ? 'text-slate-900' : 'text-slate-400'
            }`}>
              {item.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
        
        {/* STEP 1: Trip Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">Step 1 — Trip Overview</h2>
              <p className="text-xs text-slate-500">Name your itinerary, select your travel dates, and pick a cover image.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Trip Name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. European Summer Escape, Japan Autumn Journey..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Trip Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is the vision for this trip?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm text-slate-900 font-medium"
                ></textarea>
              </div>

              {/* Cover Photo Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Cover Photo</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {coverPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                      className={`relative rounded-2xl overflow-hidden h-24 border-2 transition-all group ${
                        formData.coverImage === preset.url
                          ? 'border-teal-600 ring-2 ring-teal-500/30 scale-102'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-end p-2">
                        <span className="text-[10px] font-bold text-white leading-tight">{preset.label}</span>
                      </div>
                      {formData.coverImage === preset.url && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Budget & Travel Style */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">Step 2 — Financial Budget & Pace</h2>
              <p className="text-xs text-slate-500">Set your spending ceiling and preferred daily exploration tempo.</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-900 font-bold"
                  >
                    <option value="€">EUR (€) - Euro</option>
                    <option value="$">USD ($) - US Dollar</option>
                    <option value="¥">JPY (¥) - Japanese Yen</option>
                    <option value="£">GBP (£) - British Pound</option>
                    <option value="₹">INR (₹) - Indian Rupee</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Planned Budget Total</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
                      {formData.currency}
                    </span>
                    <input
                      type="number"
                      value={formData.plannedBudget}
                      onChange={(e) => setFormData({ ...formData, plannedBudget: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Pace Radio Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Desired Travel Pace</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: 'Relaxed & Slow', desc: '1–2 activities daily. Plenty of cafe time & wandering.' },
                    { title: 'Balanced Exploration', desc: '3–4 activities daily. Perfect blend of highlights & leisure.' },
                    { title: 'Action Packed', desc: '5+ activities daily. Maximize sights and experiences.' },
                  ].map((pace, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelPace: pace.title })}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        formData.travelPace === pace.title
                          ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 block">{pace.title}</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">{pace.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Initial Destination */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">Step 3 — First Destination Stop</h2>
              <p className="text-xs text-slate-500">Pick where your journey begins. You can add more stops later in the workspace!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
              {destinationsCatalog.slice(0, 6).map((city) => (
                <div
                  key={city.id}
                  onClick={() => setFormData({ ...formData, initialCity: city })}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                    formData.initialCity.id === city.id
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-teal-400 bg-white'
                  }`}
                >
                  <img src={city.image} alt={city.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 truncate">{city.name}</span>
                      <span>{city.flag}</span>
                    </div>
                    <p className="text-xs text-slate-500">{city.country}</p>
                    <p className="text-[11px] font-semibold text-teal-700 mt-0.5">Est. €{city.dailyCost}/day</p>
                  </div>
                  {formData.initialCity.id === city.id && (
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Trip & Open Workspace</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default CreateTrip;
