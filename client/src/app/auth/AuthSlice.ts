import { api } from "@/axios/api";
import { AuthInterface, decodeJWT } from "@/lib/auth";
import { store } from "@/redux/store";
import { UserInterface } from "@/types/User";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export const AUTH_TOKEN = "token";

export const isAuth = () => {
  return store.getState().auth.status;
};

export const user = async () => {
  return await api
    .get<UserInterface>("auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
      },
    })
    .then((res: AxiosResponse<UserInterface>) => {
      let user: UserInterface = { ...res.data };
      user.token = localStorage.getItem(AUTH_TOKEN)!;
      return user;
    });
};

// First, create the thunk
export const getUser = createAsyncThunk("auth/user", async () => {
  return user();
});

// First, create the thunk
// export const isAuthenticated = createAsyncThunk("auth/user", async () => {
//   return user();
// });

const initialState: AuthInterface = {
  status: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }: { payload: UserInterface }) => {
      state = {
        status: true,
        user: payload,
      };
      localStorage.setItem(AUTH_TOKEN, payload.token);
      return state;
    },
    logout: (state) => {
      localStorage.removeItem(AUTH_TOKEN);
      state = {
        status: false,
      };
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      console.log("working...");
      state.user = { ...state.user!, ...action.payload };
      return state;
    });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
