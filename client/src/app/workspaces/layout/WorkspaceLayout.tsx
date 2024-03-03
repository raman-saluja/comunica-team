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
  if (!workspaceData.id) {
    throw new Response("Invalid request", { status: 404 });
  }

  return { workspace: workspaceData };
};

export const Component: React.FC = () => {
  const { workspace } = useLoaderData() as { workspace: Workspace };

  return (
    <div className="flex flex-grow h-screen max-h-screen md:overflow-y-hidden">
      <Sidebar workspace={workspace} />

      <Outlet />
    </div>
  );
};

// export default Component;
