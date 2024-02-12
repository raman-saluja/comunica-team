import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/app/(auth)/redux/AuthSlice";
// import SettingReducer from "app/settings/SettingReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // settings: SettingReducer,
  },
});
