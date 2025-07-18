import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [],
  selectedTrip: null,
  dateRange: {
    start: null,
    end: null,
  },
  filteredTrips: [],
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
  },
});

export const {
  addTrip,
  selectTrip,
  setDateRange,
  updateCoverageStats,
  clearTrips,
} = tripsSlice.actions;

export default tripsSlice.reducer;