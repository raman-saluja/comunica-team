import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/app/auth/AuthSlice";
import workspaceReducer from "@/app/workspaces/WorkspaceSlice";
// import SettingReducer from "app/settings/SettingReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;
