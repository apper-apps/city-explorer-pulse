import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
  currentPosition: null,
  currentSpeed: 0,
  sessionRoute: [],
  lastMovement: null,
  pauseTimer: null,
};

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    startTracking: (state) => {
      state.isActive = true;
      state.sessionRoute = [];
      state.lastMovement = Date.now();
    },
    stopTracking: (state) => {
      state.isActive = false;
      state.currentPosition = null;
      state.currentSpeed = 0;
      state.sessionRoute = [];
      state.lastMovement = null;
    },
    updatePosition: (state, action) => {
      const { position, speed } = action.payload;
      state.currentPosition = position;
      state.currentSpeed = speed || 0;
      state.lastMovement = Date.now();
      
      if (state.isActive) {
        state.sessionRoute.push({
          lat: position.lat,
          lng: position.lng,
          timestamp: Date.now(),
          speed: speed || 0,
        });
      }
    },
    pauseTracking: (state) => {
      state.isActive = false;
    },
    resumeTracking: (state) => {
      state.isActive = true;
      state.lastMovement = Date.now();
    },
    clearSession: (state) => {
      state.sessionRoute = [];
    },
  },
});

export const {
  startTracking,
  stopTracking,
  updatePosition,
  pauseTracking,
  resumeTracking,
  clearSession,
} = trackingSlice.actions;

export default trackingSlice.reducer;