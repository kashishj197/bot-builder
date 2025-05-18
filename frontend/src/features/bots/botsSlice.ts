// src/features/bots/botsSlice.ts
import { BotListItem } from "@/types/models";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface BotsState {
  bots: BotListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: BotsState = {
  bots: [],
  loading: false,
  error: null,
};

export const fetchBots = createAsyncThunk(
  "bots/fetchBots",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/bots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.bots;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to load bots");
    }
  }
);

const botsSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBots.fulfilled, (state, action) => {
        state.bots = action.payload;
        state.loading = false;
      })
      .addCase(fetchBots.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default botsSlice.reducer;
