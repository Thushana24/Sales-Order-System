import { configureStore } from "@reduxjs/toolkit";
import salesOrderReducer from "../services/slices/salesOrderSlice";

export const store = configureStore({
  reducer: {
    salesOrders: salesOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["salesOrders/fetchAll/fulfilled"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
