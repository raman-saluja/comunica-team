import { APIResponse, api } from "@/api/api";
import { UserInterface } from "@/app/users/UserInterface";
import { store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const AUTH_TOKEN = "token";

export interface AuthInterface {
  status: boolean;
  user?: UserInterface;
}

export const isAuth = () => {
  return store.getState().auth.status;
};

export const user = async () => {
  return await api
    .get<APIResponse<UserInterface>>("auth/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
      },
    })
    .then((res) => {
      if (!res.data.success) {
        return { status: false };
      }

      const user: UserInterface = { ...res.data.data };
      user.token = localStorage.getItem(AUTH_TOKEN)!;
      return { status: true, user };
    });
};

// First, create the thunk
export const getUser = createAsyncThunk("auth/user", async () => {
  return user();
});

const initialState: AuthInterface = {
  status: typeof localStorage.getItem(AUTH_TOKEN) == "string",
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
      return state as AuthInterface;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.user = { ...state.user!, ...action.payload.user };
      return state;
    });
    builder.addCase(getUser.rejected, (state, _action) => {
      state.status = false;
      if (!state.status) {
        localStorage.removeItem(AUTH_TOKEN);
      }
      delete state.user;

      return state;
    });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
