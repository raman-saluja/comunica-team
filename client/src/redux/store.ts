import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/app/auth/AuthSlice";
import chatsReducer from "@/app/chats/ChatSlice";
import workspaceReducer from "@/app/workspaces/WorkspaceSlice";
import channelReducer from "@/app/channels/ChannelSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    channel: channelReducer,
    chats: chatsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
