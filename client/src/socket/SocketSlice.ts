import { APIResponse, api } from "@/api/api";
import { store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { socket } from "./socket";
import { Socket } from "socket.io-client";

export const socketSlice = createSlice({
  name: "socket",
  initialState: socket,
  reducers: {
    connectSocket: (state, { payload }: { payload: Socket }) => {
      payload.connect();
      return payload;
    },
  },
});

export default socketSlice.reducer;
