import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TripProvider } from './context/TripContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import Itinerary from './pages/Itinerary';
import Calendar from './pages/Calendar';
import Budget from './pages/Budget';
import SmartSummary from './pages/SmartSummary';
import Community from './pages/Community';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import PublicItinerary from './pages/PublicItinerary';

const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine if this is a standalone public page or auth page
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isPublicTripPage = location.pathname.startsWith('/trips/');

  if (isAuthPage || isPublicTripPage) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global Notifications Toast */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <TripProvider>
      <AppLayout>
        <Routes>
          {/* Public & Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/trips/:slug" element={<PublicItinerary />} />

          {/* Authenticated Workspace Pages */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/itinerary/:id" element={<Itinerary />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/summary" element={<SmartSummary />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </TripProvider>
  );
}

export default App;
