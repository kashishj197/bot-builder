// src/features/studio/flowSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import debounce from "lodash.debounce";

const API = "http://localhost:8000";

export const saveFlow = createAsyncThunk(
  "flow/save",
  async ({ botId, nodes, edges }: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/bots/${botId}`,
        { nodes, edges },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

interface FlowState {
  nodes: any[];
  edges: any[];
  botId: string | null;
  saving: boolean;
}

const initialState: FlowState = {
  nodes: [],
  edges: [],
  botId: null,
  saving: false,
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setBotId(state, action: PayloadAction<string>) {
      state.botId = action.payload;
    },
    setFlow(state, action: PayloadAction<{ nodes: any[]; edges: any[] }>) {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
    },
    updateNodes(state, action: PayloadAction<any[]>) {
      state.nodes = action.payload;
    },
    updateEdges(state, action: PayloadAction<any[]>) {
      state.edges = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFlow.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveFlow.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveFlow.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const { setBotId, setFlow, updateNodes, updateEdges } =
  flowSlice.actions;
export default flowSlice.reducer;
