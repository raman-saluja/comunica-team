import { APIResponse, api } from "@/api/api";
import { store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Workspace } from "../dashboard/DashboardPage";

interface WorkspaceState {
  workspaces: Workspace[] | null;
  activeWorkspace: Workspace | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  activeWorkspace: null,
};

// First, create the thunk
export const setAllWorkspaces = createAsyncThunk("workspace/all", async () => {
  return await api.get<APIResponse<Workspace[]>>("workspaces");
});

// First, create the thunk
export const deleteWorkspace = createAsyncThunk(
  "workspace/delete",
  async (id: Workspace["id"]) => {
    return await api.delete<APIResponse<{ id: string }>>(`workspaces/${id}`);
  }
);

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // setActiveWorkspace: (state, action) => {
    //   state.activeWorkspace = action.payload;
    // },
    updateActiveWorkspace: (state, action) => {
      if (!state.activeWorkspace) return;
      if (state.workspaces && state.activeWorkspace.id)
        state.workspaces = state.workspaces?.map((workspace) => {
          if (workspace.id === state.activeWorkspace?.id) {
            return { ...workspace, ...action.payload };
          }
          return workspace;
        });
      state.activeWorkspace = { ...state.activeWorkspace, ...action.payload };
    },
    setActiveWorkspace: (state, { payload }) => {
      const activeWorkspace = state.workspaces?.find(
        (workspace) => workspace.id === payload
      );
      if (activeWorkspace) {
        state.activeWorkspace = activeWorkspace;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAllWorkspaces.fulfilled, (state, action) => {
      state.workspaces = [...action.payload.data.data];
      return state;
    });
    builder.addCase(deleteWorkspace.fulfilled, (state, action) => {
      if (state.workspaces)
        state.workspaces = state.workspaces?.filter(
          (workspace) => workspace.id !== action.payload.data.data.id
        );
      return state;
    });
  },
});

export const { setActiveWorkspace, updateActiveWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
