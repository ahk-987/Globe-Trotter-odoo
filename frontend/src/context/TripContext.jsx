import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { initialUser, destinationsCatalog, activitiesCatalog } from '../data/mockData';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState("trip-1");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Load initial trips
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTrips = await api.trips.getAll();
        setTrips(storedTrips);
        if (storedTrips.length > 0 && !storedTrips.find(t => t.id === activeTripId)) {
          setActiveTripId(storedTrips[0].id);
        }
      } catch (err) {
        console.error("Failed to load trips", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const hideToast = () => setToast(null);

  // Active Trip resolution
  const activeTrip = trips.find(t => t.id === activeTripId || t.slug === activeTripId) || trips[0] || null;

  // Derived calculation for active trip stats
  const getTripStats = (trip) => {
    if (!trip) return { totalDays: 0, citiesCount: 0, activitiesCount: 0, totalEstimatedCost: 0, budgetDifference: 0, isOverBudget: false, progress: 0 };
    
    const citiesCount = trip.destinations ? trip.destinations.length : 0;
    
    let totalActivities = 0;
    let activityCostSum = 0;
    if (trip.days && Array.isArray(trip.days)) {
      trip.days.forEach(day => {
        if (day.activities) {
          totalActivities += day.activities.length;
          day.activities.forEach(act => {
            activityCostSum += Number(act.cost) || 0;
          });
        }
      });
    }

    // Dynamic cost summing: stays + transit + activities + meals
    let stayCostSum = 0;
    let transitCostSum = 0;
    if (trip.destinations) {
      trip.destinations.forEach(d => {
        stayCostSum += Number(d.stayCost) || 0;
        transitCostSum += Number(d.transitCost) || 0;
      });
    }

    const mealsCost = trip.budgetBreakdown?.meals || 240;
    const computedTotalCost = (stayCostSum || trip.budgetBreakdown?.stay || 0) + 
                              (transitCostSum || trip.budgetBreakdown?.transport || 0) + 
                              (activityCostSum || trip.budgetBreakdown?.activities || 0) + 
                              mealsCost;

    const plannedBudget = Number(trip.plannedBudget) || 2500;
    const finalEstimatedCost = trip.estimatedCost || computedTotalCost;
    const budgetDifference = finalEstimatedCost - plannedBudget;
    const isOverBudget = budgetDifference > 0;

    // Progress calculation
    let progressPoints = 0;
    if (trip.title && trip.startDate && trip.endDate) progressPoints += 25; // Details
    if (citiesCount > 0) progressPoints += 25; // Destinations
    if (totalActivities >= 4) progressPoints += 25; else if (totalActivities > 0) progressPoints += 15; // Activities
    if (trip.plannedBudget > 0) progressPoints += 25; // Budget
    const progress = Math.min(100, progressPoints);

    return {
      totalDays: trip.durationDays || (trip.days ? trip.days.length : 14),
      citiesCount,
      activitiesCount: totalActivities || 18,
      totalEstimatedCost: finalEstimatedCost,
      budgetDifference,
      isOverBudget,
      progress,
    };
  };

  // Actions
  const createTrip = async (tripData) => {
    try {
      const created = await api.trips.create(tripData);
      setTrips(prev => [created, ...prev]);
      setActiveTripId(created.id);
      showToast(`Trip "${created.title}" created successfully!`, 'success');
      return created;
    } catch (err) {
      showToast("Error creating trip", 'error');
      throw err;
    }
  };

  const updateTrip = async (tripId, updates) => {
    try {
      const updated = await api.trips.update(tripId, updates);
      setTrips(prev => prev.map(t => t.id === tripId ? updated : t));
      showToast("Trip updated successfully", 'success');
      return updated;
    } catch (err) {
      showToast("Error updating trip", 'error');
      throw err;
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.trips.delete(tripId);
      const remaining = trips.filter(t => t.id !== tripId);
      setTrips(remaining);
      if (activeTripId === tripId && remaining.length > 0) {
        setActiveTripId(remaining[0].id);
      }
      showToast("Trip removed", 'info');
    } catch (err) {
      showToast("Error deleting trip", 'error');
      throw err;
    }
  };

  const addCityToTrip = async (tripId, cityData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newDest = {
      id: `dest_${Date.now()}`,
      cityId: cityData.id || `city_${Date.now()}`,
      name: cityData.name,
      country: cityData.country,
      flag: cityData.flag || "📍",
      arrivalDate: cityData.arrivalDate || trip.startDate,
      departureDate: cityData.departureDate || trip.endDate,
      nights: cityData.nights || 3,
      estimatedCost: (cityData.dailyCost || 150) * (cityData.nights || 3),
      stayCost: (cityData.dailyCost ? cityData.dailyCost * 0.6 : 100) * (cityData.nights || 3),
      transitCost: 120,
      image: cityData.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    };

    const updatedDestinations = [...(trip.destinations || []), newDest];
    const updatedTrip = {
      ...trip,
      destinations: updatedDestinations,
      estimatedCost: (trip.estimatedCost || 2500) + newDest.estimatedCost,
    };

    await updateTrip(tripId, updatedTrip);
    showToast(`Added ${cityData.name} to route!`, 'success');
  };

  const removeCityFromTrip = async (tripId, destinationId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const destToRemove = trip.destinations.find(d => d.id === destinationId);
    const updatedDestinations = trip.destinations.filter(d => d.id !== destinationId);
    const costDeduction = destToRemove ? destToRemove.estimatedCost : 0;

    const updatedTrip = {
      ...trip,
      destinations: updatedDestinations,
      estimatedCost: Math.max(0, (trip.estimatedCost || 2500) - costDeduction),
    };

    await updateTrip(tripId, updatedTrip);
    showToast(`Removed city from route`, 'info');
  };

  const reorderCities = async (tripId, sourceIdx, destIdx) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.destinations) return;

    const newDestinations = Array.from(trip.destinations);
    const [moved] = newDestinations.splice(sourceIdx, 1);
    newDestinations.splice(destIdx, 0, moved);

    await updateTrip(tripId, { ...trip, destinations: newDestinations });
    showToast("Route updated!", 'success');
  };

  const addActivityToDay = async (tripId, dayIndex, activityData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newActivity = {
      id: `act-${Date.now()}`,
      time: activityData.recommendedTime || "11:00",
      title: activityData.title,
      type: activityData.category || activityData.type || "Sightseeing",
      duration: activityData.duration || "2h 00m",
      durationHours: activityData.durationHours || 2.0,
      cost: Number(activityData.cost) || 0,
      location: activityData.location || "City Center",
    };

    let updatedDays = Array.isArray(trip.days) ? [...trip.days] : [];
    let day = updatedDays.find(d => d.dayIndex === dayIndex);
    
    if (day) {
      day.activities = [...(day.activities || []), newActivity];
    } else {
      updatedDays.push({
        dayIndex,
        date: `2026-06-${dayIndex < 10 ? '0' + dayIndex : dayIndex}`,
        cityName: activityData.cityName || "London",
        activities: [newActivity],
      });
    }

    const updatedTrip = {
      ...trip,
      days: updatedDays,
      estimatedCost: (trip.estimatedCost || 2500) + newActivity.cost,
    };

    await updateTrip(tripId, updatedTrip);
    showToast(`Added "${activityData.title}" to Day ${dayIndex}!`, 'success');
  };

  const removeActivityFromDay = async (tripId, dayIndex, activityId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.days) return;

    let removedCost = 0;
    const updatedDays = trip.days.map(day => {
      if (day.dayIndex === dayIndex) {
        const act = day.activities?.find(a => a.id === activityId);
        if (act) removedCost = act.cost || 0;
        return {
          ...day,
          activities: day.activities?.filter(a => a.id !== activityId) || []
        };
      }
      return day;
    });

    const updatedTrip = {
      ...trip,
      days: updatedDays,
      estimatedCost: Math.max(0, (trip.estimatedCost || 2500) - removedCost),
    };

    await updateTrip(tripId, updatedTrip);
    showToast("Activity removed", 'info');
  };

  const applyBudgetOptimization = async (tripId, optId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const opt = trip.optimizations?.find(o => o.id === optId);
    if (!opt || opt.applied) return;

    const saving = opt.saving;
    const updatedOptimizations = trip.optimizations.map(o => 
      o.id === optId ? { ...o, applied: true } : o
    );

    const categoryTarget = opt.categoryTarget || 'stay';
    const currentBreakdown = { ...trip.budgetBreakdown };
    if (currentBreakdown[categoryTarget]) {
      currentBreakdown[categoryTarget] = Math.max(0, currentBreakdown[categoryTarget] - saving);
    }

    const updatedTrip = {
      ...trip,
      estimatedCost: Math.max(0, (trip.estimatedCost || 2575) - saving),
      budgetBreakdown: currentBreakdown,
      optimizations: updatedOptimizations,
    };

    await updateTrip(tripId, updatedTrip);
    showToast(`Budget improved by €${saving}! 🎉`, 'success');
  };

  const copyCommunityTrip = async (communityTrip) => {
    try {
      const cloned = await api.community.copyTrip(communityTrip);
      setTrips(prev => [cloned, ...prev]);
      setActiveTripId(cloned.id);
      showToast(`"${communityTrip.title}" has been copied to your workspace! 🚀`, 'success');
      return cloned;
    } catch (err) {
      showToast("Could not copy trip", 'error');
      throw err;
    }
  };

  const toggleBookmark = (cityId) => {
    setUser(prev => {
      const current = prev.savedDestinations || [];
      const updated = current.includes(cityId)
        ? current.filter(id => id !== cityId)
        : [...current, cityId];
      return { ...prev, savedDestinations: updated };
    });
    showToast("Saved destinations updated", 'info');
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    trips,
    activeTripId,
    setActiveTripId,
    activeTrip,
    getTripStats,
    loading,
    toast,
    showToast,
    hideToast,
    createTrip,
    updateTrip,
    deleteTrip,
    addCityToTrip,
    removeCityFromTrip,
    reorderCities,
    addActivityToDay,
    removeActivityFromDay,
    applyBudgetOptimization,
    copyCommunityTrip,
    toggleBookmark,
    destinationsCatalog,
    activitiesCatalog,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
