// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // <-- import your auth reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // <-- add auth reducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
