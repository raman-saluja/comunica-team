"use client";
import { Sidebar } from "@/app/workspaces/layout/sidebar";

import { Workspace } from "@/app/dashboard/DashboardPage";
import { Toaster } from "@/components/ui/toaster";
import { LoaderFunction, Outlet, useLoaderData } from "react-router-dom";
import { workspace } from "../WorkspaceSlice";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id || !parseInt(params.id!)) {
    throw new Response("Invalid request", { status: 404 });
  }

  const workspaceData = (await workspace(params.id)) as Workspace;
  if (!workspaceData._id) {
    throw new Response("Invalid request", { status: 404 });
  }

  return { workspace: workspaceData };
};

export const Component: React.FC = () => {
  const { workspace } = useLoaderData() as { workspace: Workspace };

  return (
    <div className="grid grid-flow-row md:grid-cols-4 h-screen overflow-y-hidden">
      <Sidebar workspace={workspace} />

      <Outlet />

      <Toaster />
    </div>
  );
};

// export default Component;
