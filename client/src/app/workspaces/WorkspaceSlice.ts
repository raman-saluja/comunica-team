import { APIResponse, api } from "@/axios/api";
import { store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Workspace } from "../dashboard/DashboardPage";

interface WorkspaceState {
  activeWorkspace: Workspace | null;
}

const initialState: WorkspaceState = {
  activeWorkspace: null,
};

export const workspace = async (id: Workspace["_id"]) => {
  return await api
    .get<APIResponse<Workspace>>(`workspaces/${id}`, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.user?.token}`,
      },
    })
    .then((res) => {
      const workspace: Workspace = { ...res.data.data };
      return workspace;
    });
};

// First, create the thunk
export const setActiveWorkspace = createAsyncThunk(
  "workspace/setActive",
  async (id: Workspace["_id"]) => {
    return workspace(id);
  }
);

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setActiveWorkspace.fulfilled, (state, action) => {
      state.activeWorkspace = { ...action.payload };
      return state;
    });
  },
});

export default workspaceSlice.reducer;
