import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bookmark, 
  Globe, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  MapPin, 
  Plus, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { destinationsCatalog } from '../data/mockData';

export const Profile = () => {
  const { user, setUser, showToast, toggleBookmark } = useTrip();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@globetrotter.io',
    bio: user?.bio || 'Passionate photographer, food lover, and avid multi-city traveler. 24 countries and counting!',
    travelStyle: user?.travelStyle || 'Cultural Explorer',
    currency: user?.currency || '€',
    language: user?.language || 'English (US)',
    homeCity: user?.homeCity || 'London, UK',
  });

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences' | 'saved' | 'account'

  const savedCityObjects = destinationsCatalog.filter(d => user?.savedDestinations?.includes(d.id));

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...formData }));
    showToast('Profile & Preferences updated! ✨', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
          Account & Travel Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Customize your travel preferences, saved bookmarks, and workspace defaults
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto scrollbar-none pb-px">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'preferences', label: 'Travel Preferences', icon: Globe },
          { id: 'saved', label: `Saved Destinations (${savedCityObjects.length})`, icon: Bookmark },
          { id: 'account', label: 'Security & Account', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-teal-500/20"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold">
                {user?.travelStyle}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Home Departure City</label>
              <input
                type="text"
                value={formData.homeCity}
                onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Traveler Bio</label>
              <textarea
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Preferences */}
      {activeTab === 'preferences' && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="€">EUR (€) - Euro</option>
                <option value="$">USD ($) - US Dollar</option>
                <option value="¥">JPY (¥) - Japanese Yen</option>
                <option value="£">GBP (£) - British Pound</option>
                <option value="₹">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Travel Style</label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Cultural Explorer">Cultural Explorer (Museums, heritage, landmarks)</option>
                <option value="Slow & Relaxed">Slow & Relaxed (Cafes, parks, boutique spots)</option>
                <option value="Food & Wine Discovery">Food & Wine Discovery (Markets, tastings, local eats)</option>
                <option value="Adventure & Active">Adventure & Active (Hiking, cycling, outdoor experiences)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">App Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="English (US)">English (US)</option>
                <option value="Français">Français</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Español">Español</option>
                <option value="日本語">日本語</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Saved Destinations */}
      {activeTab === 'saved' && (
        <div className="space-y-4 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCityObjects.map((city) => (
              <div key={city.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={city.image} alt={city.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{city.name} {city.flag}</h4>
                    <span className="text-xs text-slate-500">{city.country} · €{city.dailyCost}/day</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(city.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Account & Security */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">Update your account password</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <button className="text-xs font-bold text-rose-600 hover:underline">
              Delete Account
            </button>
            <button
              type="button"
              onClick={() => showToast("Password updated successfully!", "success")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
