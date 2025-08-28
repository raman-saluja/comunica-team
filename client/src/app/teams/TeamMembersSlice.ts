import { APIResponse, api } from "@/api/api";
import { AppState, store } from "@/redux/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WorkspaceUserInterface as TeamMember } from "@/app/dashboard/DashboardPage";

interface TeamMembersState {
  members: TeamMember[] | null;
}

const initialState: TeamMembersState = {
  members: [],
};

export const setAllTeamMembers = createAsyncThunk(
  "teamMembers/all",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as AppState;
    const activeWorkspace = state.workspace.activeWorkspace;
    console.log("reloading team members list");

    return await api.get<APIResponse<TeamMember[]>>(
      `workspaces/${activeWorkspace?.id}/users`
    );
  }
);

export const removeTeamMember = createAsyncThunk(
  "teamMembers/remove",
  async (memberId: TeamMember["id"]) => {
    const state = store.getState() as AppState;
    const activeWorkspace = state.workspace.activeWorkspace;
    const res = await api.get<APIResponse<{ id: string }>>(
      `workspaces/${activeWorkspace?.id}/users/${memberId}/remove`
    );

    return res.data.data;
  }
);

export const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAllTeamMembers.fulfilled, (state, action) => {
      state.members = [...action.payload.data.data];
      return state;
    });
    builder.addCase(removeTeamMember.fulfilled, (state, action) => {
      if (state.members) {
        state.members = state.members?.filter(
          (member) => member.user.id !== action.payload.id
        );
      }
      return state;
    });
  },
});

export const {} = teamMembersSlice.actions;

export default teamMembersSlice.reducer;
