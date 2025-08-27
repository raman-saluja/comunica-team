"use client";
import { Sidebar } from "@/app/workspaces/layout/components/sidebar";

import { AppState, store } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { LoaderFunction, Outlet, useParams } from "react-router-dom";
import { setActiveWorkspace, setAllWorkspaces } from "../WorkspaceSlice";
import { WorkspacesSideBar } from "./components/WorkSpacesSideBar";

export const loader: LoaderFunction = async ({ params }) => {
  return {};
};

export const Component: React.FC = () => {
  const { id } = useParams();

  const workspaces =
    useSelector((state: AppState) => state.workspace.workspaces) ?? [];

  useEffect(() => {
    store.dispatch(setAllWorkspaces());
  }, []);

  useEffect(() => {
    if (workspaces.length > 0 && id) store.dispatch(setActiveWorkspace(id));
  }, [workspaces, id]);

  return (
    <div className="flex flex-grow h-screen max-h-screen md:overflow-y-hidden">
      <WorkspacesSideBar />
      <Sidebar />

      <Outlet />
    </div>
  );
};

// export default Component;
