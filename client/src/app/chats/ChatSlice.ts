import { APIResponse, api } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChannelInterface } from "../channels/ChannelInterface";
import { ChatMessageInterface } from "./ChatModel";

export const AUTH_TOKEN = "token";

export const chats = async (channelId: ChannelInterface["id"]) => {
  return await api
    .get<APIResponse<ChatMessageInterface[]>>(`chats/${channelId}`)
    .then((res) => {
      if (!res.data.success) {
        return [];
      }

      return res.data.data;
    });
};

// First, create the thunk
export const getChats = createAsyncThunk<
  ChatMessageInterface[],
  ChannelInterface["id"]
>("chats/all", async (channelId) => {
  return chats(channelId);
});

interface ChatSliceStateInterface {
  [key: string]: ChatMessageInterface[];
}

const initialState: ChatSliceStateInterface = {};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    newMessageReceived: (state, { payload }) => {
      if (!state[payload.channel.id]) state[payload.channel.id] = [];

      state[payload.channel.id].push(payload);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state[action.payload[0].channel.id] = action.payload;
      }
      return state;
    });
    builder.addCase(getChats.rejected, (state, _action) => {
      return state;
    });
  },
});

export const { newMessageReceived } = chatSlice.actions;

export default chatSlice.reducer;
