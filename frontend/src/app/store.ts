// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // <-- import your auth reducer
import botsReducer from "../features/bots/botsSlice"; // <-- import your bots reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // <-- add auth reducer here
    bots: botsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
