import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export const Toast = () => {
  const { toast, hideToast } = useTrip();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-slate-900/95 text-white border-emerald-500/30 shadow-emerald-950/20',
    error: 'bg-slate-900/95 text-white border-rose-500/30 shadow-rose-950/20',
    info: 'bg-slate-900/95 text-white border-teal-500/30 shadow-teal-950/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium tracking-wide pr-2">{toast.message}</span>
        <button 
          onClick={hideToast}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
