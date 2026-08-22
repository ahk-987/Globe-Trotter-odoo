import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const ShareModal = ({ isOpen, onClose, trip }) => {
  const { showToast } = useTrip();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen || !trip) return null;

  const shareUrl = `https://globetrotter.app/trips/${trip.slug || trip.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    showToast("Shareable link copied to clipboard! 📋", "success");
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePreviewPublic = () => {
    onClose();
    navigate(`/trips/${trip.slug || trip.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Share Your Itinerary</h3>
                <p className="text-xs text-slate-500">Anyone with this link can view and copy your trip</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Trip Snapshot */}
          <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <img
              src={trip.coverImage}
              alt={trip.title}
              className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-teal-700 block">Public Trip Guide</span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{trip.title}</h4>
              <p className="text-xs text-slate-500 truncate">
                {trip.destinations?.map(d => d.name).join(' → ') || 'Multi-city travel route'}
              </p>
            </div>
          </div>

          {/* Link Box */}
          <div className="space-y-2 mb-5">
            <label className="text-xs font-bold text-slate-700">Trip URL</label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-slate-800 font-medium px-2 flex-1 focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-900 hover:bg-teal-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Public Preview Button */}
          <div className="space-y-3">
            <button
              onClick={handlePreviewPublic}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-teal-200/80"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Preview Public Travel Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Friends can view full route, day-wise timeline, cost breakdowns, and duplicate it with 1 click.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;
