// GlobeTrotter - API Service Layer
// Clean service abstraction providing mock promises today and plug-and-play Express/PostgreSQL endpoints tomorrow

import { sampleTrips, destinationsCatalog, activitiesCatalog, initialUser, communityTripsCatalog, platformAnalytics } from '../data/mockData';

const STORAGE_KEY_TRIPS = 'globetrotter_trips_v1';
const STORAGE_KEY_USER = 'globetrotter_user_v1';

// Helpers to read/write persistent local storage for seamless client prototyping
const getStoredTrips = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TRIPS);
    return data ? JSON.parse(data) : sampleTrips;
  } catch (e) {
    return sampleTrips;
  }
};

const saveStoredTrips = (trips) => {
  try {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async ({ email, password }) => {
      await delay(250);
      if (!email || !password) {
        throw new Error("Please provide both email and password");
      }
      return {
        user: initialUser,
        token: "mock-jwt-token-globetrotter-2026",
      };
    },

    signup: async ({ name, email, password }) => {
      await delay(300);
      return {
        user: { ...initialUser, name, email },
        token: "mock-jwt-token-globetrotter-2026",
      };
    },

    logout: async () => {
      await delay(100);
      return { success: true };
    },

    getCurrentUser: async () => {
      await delay(100);
      return initialUser;
    }
  },

  trips: {
    getAll: async () => {
      await delay(150);
      return getStoredTrips();
    },

    getById: async (id) => {
      await delay(100);
      const trips = getStoredTrips();
      const trip = trips.find(t => t.id === id || t.slug === id);
      if (!trip) throw new Error("Trip not found");
      return trip;
    },

    create: async (tripData) => {
      await delay(200);
      const trips = getStoredTrips();
      const newTrip = {
        id: `trip-${Date.now()}`,
        slug: tripData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date().toISOString(),
        status: "Planning in Progress",
        isUpcoming: true,
        destinations: tripData.destinations || [],
        days: tripData.days || [],
        budgetBreakdown: tripData.budgetBreakdown || { transport: 0, stay: 0, activities: 0, meals: 0 },
        optimizations: [],
        author: {
          name: initialUser.name,
          avatar: initialUser.avatar,
        },
        ...tripData,
      };
      const updated = [newTrip, ...trips];
      saveStoredTrips(updated);
      return newTrip;
    },

    update: async (id, updates) => {
      await delay(150);
      const trips = getStoredTrips();
      const index = trips.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Trip not found");
      
      const updatedTrip = { ...trips[index], ...updates, updatedAt: new Date().toISOString() };
      trips[index] = updatedTrip;
      saveStoredTrips(trips);
      return updatedTrip;
    },

    delete: async (id) => {
      await delay(150);
      const trips = getStoredTrips();
      const filtered = trips.filter(t => t.id !== id);
      saveStoredTrips(filtered);
      return { success: true, id };
    }
  },

  destinations: {
    getAll: async () => {
      await delay(100);
      return destinationsCatalog;
    },

    search: async (query = "") => {
      await delay(100);
      const q = query.toLowerCase();
      return destinationsCatalog.filter(
        d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
      );
    }
  },

  activities: {
    getByCity: async (cityId) => {
      await delay(100);
      return activitiesCatalog.filter(a => a.cityId === cityId);
    },

    search: async (query = "", category = "all") => {
      await delay(100);
      const q = query.toLowerCase();
      return activitiesCatalog.filter(a => {
        const matchesQuery = a.title.toLowerCase().includes(q) || a.cityName.toLowerCase().includes(q);
        const matchesCat = category === "all" || a.category === category;
        return matchesQuery && matchesCat;
      });
    }
  },

  community: {
    getSharedTrips: async () => {
      await delay(150);
      return communityTripsCatalog;
    },

    copyTrip: async (communityTrip) => {
      await delay(200);
      const trips = getStoredTrips();
      const newTrip = {
        id: `trip-copy-${Date.now()}`,
        slug: `${communityTrip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy`,
        title: communityTrip.title,
        description: communityTrip.description,
        coverImage: communityTrip.coverImage,
        startDate: "2026-09-01",
        endDate: "2026-09-11",
        durationDays: 10,
        currency: "€",
        plannedBudget: 2200,
        estimatedCost: 2100,
        status: "Planning in Progress",
        isUpcoming: true,
        destinations: [
          {
            id: `dest_${Date.now()}_1`,
            cityId: "city_paris",
            name: "Paris",
            country: "France",
            flag: "🇫🇷",
            arrivalDate: "2026-09-01",
            departureDate: "2026-09-05",
            nights: 4,
            estimatedCost: 750,
            stayCost: 450,
            transitCost: 120,
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
          }
        ],
        budgetBreakdown: { transport: 420, stay: 980, activities: 450, meals: 250 },
        optimizations: [],
        days: [
          {
            dayIndex: 1,
            date: "2026-09-01",
            cityId: "city_paris",
            cityName: "Paris",
            countryFlag: "🇫🇷",
            notes: "Copied shared itinerary day 1.",
            activities: [
              {
                id: `act_${Date.now()}_1`,
                time: "10:00",
                title: "Welcome City Discovery Walk",
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
      const updated = [newTrip, ...trips];
      saveStoredTrips(updated);
      return newTrip;
    }
  },

  analytics: {
    getStats: async () => {
      await delay(100);
      return platformAnalytics;
    }
  }
};
