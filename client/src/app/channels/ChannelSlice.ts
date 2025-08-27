import { APIResponse, api } from "@/api/api";
import { AppState, store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChannelInterface as Channel } from "./ChannelInterface";

interface ChannelState {
  channels: Channel[] | null;
  activeChannel: Channel | null;
}

const initialState: ChannelState = {
  channels: [],
  activeChannel: null,
};

export const channel = async (id: Channel["id"]) => {};

export const setAllChannels = createAsyncThunk(
  "channel/all",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as AppState;
    const activeWorkspace = state.workspace.activeWorkspace;

    console.log("reloading channels list");

    return await api.get<APIResponse<Channel[]>>(
      `channels?workspace=${activeWorkspace?.id}`
    );
  }
);

export const deleteChannel = createAsyncThunk(
  "channel/delete",
  async (id: Channel["id"]) => {
    const state = store.getState() as AppState;
    const workspace = state.workspace.activeWorkspace;
    return await api.delete<APIResponse<{ id: string }>>(
      `channels/${id}?workspace=${workspace?.id}`
    );
  }
);

export const createChannel = createAsyncThunk(
  "channel/create",
  async ({ name }: { name: Channel["name"] }) => {
    const state = store.getState() as AppState;
    const workspace = state.workspace.activeWorkspace;

    const response = await api.post<APIResponse<Channel>>(
      `channels?workspace=${workspace?.id}`,
      {
        name,
      }
    );

    console.log("channel created", response.data.data);

    return response.data.data;
  }
);

export const updateChannel = createAsyncThunk(
  "channel/update",
  async ({ id, name }: { id: Channel["id"]; name: Channel["name"] }) => {
    const state = store.getState() as AppState;
    const workspace = state.workspace.activeWorkspace;

    const response = await api.put<APIResponse<{ id: string; name: string }>>(
      `channels/${id}?workspace=${workspace?.id}`,
      {
        name,
      }
    );

    return {
      data: response.data.data,
      headers: { ...response.headers },
    };
  }
);

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      const channels = state.channels;
      const activeChannel = channels?.find(
        (channel) => channel.id === action.payload
      );
      state.activeChannel = activeChannel ?? null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAllChannels.fulfilled, (state, action) => {
      state.channels = [...action.payload.data.data];
      return state;
    });
    builder.addCase(deleteChannel.fulfilled, (state, action) => {
      if (state.channels) {
        state.channels = state.channels?.filter(
          (channel) => channel.id !== action.payload.data.data.id
        );
        if (state.activeChannel?.id === action.payload.data.data.id) {
          state.activeChannel = state.channels[0] || null;
        }
      }
      return state;
    });
    builder.addCase(updateChannel.fulfilled, (state, action) => {
      if (state.channels) {
        const index = state.channels.findIndex(
          (channel) => channel.id === action.payload.data.id
        );
        if (index !== -1) {
          state.channels[index].name = action.payload.data.name;
        }
        if (state.activeChannel?.id === action.payload.data.id) {
          state.activeChannel.name = action.payload.data.name;
        }
      }
      return state;
    });
    builder.addCase(createChannel.fulfilled, (state, action) => {
      console.log("channel created", action.payload);
      if (state.channels) {
        state.channels.push(action.payload);
        //  NOTE: redundant as overwritten by useEffect for channels list
        // state.activeChannel = action.payload;
      }
      return state;
    });
  },
});

export const { setActiveChannel } = channelSlice.actions;

export default channelSlice.reducer;
