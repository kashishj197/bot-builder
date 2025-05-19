// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"; // <-- import your auth reducer
import botsReducer from "../features/bots/botsSlice"; // <-- import your bots reducer
import flowReducer from "../features/studio/flowSlice"; // <-- import your bots reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // <-- add auth reducer here
    bots: botsReducer,
    flow: flowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
