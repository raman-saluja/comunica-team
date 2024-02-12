import { api } from "@/axios/api";
import { AuthInterface } from "@/lib/auth";
import { UserInterface } from "@/types/User";
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export const user = async () => {
  return await api
    .get<UserInterface>("user")
    .then((res: AxiosResponse<UserInterface>) => {
      return res.data;
    });
};

// First, create the thunk
export const getUser = createAsyncThunk("auth/user", async () => {
  return user();
});

const initialState: AuthInterface = {
  status: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }: { payload: { token: string } }) => {
      state = {
        status: true,
        user: payload as UserInterface,
      };
      localStorage.setItem("auth_token", payload.token);
      return state;
    },
    logout: (state) => {
      localStorage.removeItem("auth_token");
      state = {
        status: false,
      };
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
      return state;
    });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
