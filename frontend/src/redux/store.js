import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // Import your RTK Query slice
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Add RTK Query API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});

export default store;
