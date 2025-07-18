import { configureStore } from "@reduxjs/toolkit";
import trackingReducer from "@/store/slices/trackingSlice";
import tripsReducer from "@/store/slices/tripsSlice";

export const store = configureStore({
  reducer: {
    tracking: trackingReducer,
    trips: tripsReducer,
  },
});

export default store;