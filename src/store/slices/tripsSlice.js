import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [],
  selectedTrip: null,
  dateRange: {
    start: null,
    end: null,
  },
  filteredTrips: [],
  settings: {
    mapProvider: 'osm', // 'osm' or 'google'
    units: 'metric', // 'metric' or 'imperial'
    theme: 'light', // 'light' or 'dark'
    autoTracking: false,
    gpsAccuracy: 'high', // 'high', 'medium', 'low'
    dataRetention: 30, // days
    exportFormat: 'json', // 'json', 'csv', 'gpx'
    notifications: {
      trackingReminders: true,
      weeklyReports: false,
      achievements: true,
    },
    privacy: {
      shareLocation: false,
      anonymizeData: true,
    },
  },
  stats: {
    totalDistance: 0,
    totalTrips: 0,
    exploredGridCells: 0,
    totalGridCells: 10000, // 100x100 grid for coverage calculation
    lastUpdated: null,
  },
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    addTrip: (state, action) => {
      const trip = action.payload;
      state.trips.push(trip);
      state.stats.totalTrips = state.trips.length;
      state.stats.totalDistance += trip.distance;
      state.stats.lastUpdated = Date.now();
      
      // Update filtered trips if date range is set
      if (state.dateRange.start && state.dateRange.end) {
        const tripDate = new Date(trip.startTime);
        if (tripDate >= state.dateRange.start && tripDate <= state.dateRange.end) {
          state.filteredTrips.push(trip);
        }
      } else {
        state.filteredTrips = [...state.trips];
      }
    },
    selectTrip: (state, action) => {
      state.selectedTrip = action.payload;
    },
    setDateRange: (state, action) => {
      const { start, end } = action.payload;
      state.dateRange.start = start;
      state.dateRange.end = end;
      
      if (start && end) {
        state.filteredTrips = state.trips.filter(trip => {
          const tripDate = new Date(trip.startTime);
          return tripDate >= start && tripDate <= end;
        });
      } else {
        state.filteredTrips = [...state.trips];
      }
    },
    updateCoverageStats: (state, action) => {
      const { exploredGridCells } = action.payload;
      state.stats.exploredGridCells = exploredGridCells;
      state.stats.lastUpdated = Date.now();
    },
    clearTrips: (state) => {
      state.trips = [];
      state.filteredTrips = [];
      state.selectedTrip = null;
      state.stats.totalTrips = 0;
      state.stats.totalDistance = 0;
      state.stats.exploredGridCells = 0;
state.stats.lastUpdated = Date.now();
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateMapProvider: (state, action) => {
      state.settings.mapProvider = action.payload;
    },
    updateUnits: (state, action) => {
      state.settings.units = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload };
    },
    updatePrivacySettings: (state, action) => {
      state.settings.privacy = { ...state.settings.privacy, ...action.payload };
    },
  },
});

export const {
  addTrip,
  selectTrip,
  setDateRange,
  updateCoverageStats,
  clearTrips,
  updateSettings,
  updateMapProvider,
  updateUnits,
  updateNotificationSettings,
  updatePrivacySettings,
} = tripsSlice.actions;

export default tripsSlice.reducer;