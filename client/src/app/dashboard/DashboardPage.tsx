"use client";
import React from "react";

import { APIResponse, api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import CreateWorkspaceDialog from "../workspaces/create/CreateWorkspaceDialog";
import { UserInterface } from "../users/UserInterface";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  workspace: string;
}

export interface WorkspaceUserInterface {
  id: string;
  role: "owner" | "member";
  user: UserInterface;
  workspace: Workspace;
}

export const loader: LoaderFunction = async () => {
  const res = await api.get<APIResponse<WorkspaceUserInterface>>(
    "users/workspaces"
  );
  return { workspaces: res.data.data };
};

export const Component: React.FC = () => {
  const { workspaces } = useLoaderData() as {
    workspaces: WorkspaceUserInterface[];
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="grid grid-flow-row gap-4 w-full md:w-2/6">
        {workspaces.map((workspace, index) => (
          <Card key={"workspace_" + index} className="w-full">
            <CardHeader>
              <CardTitle>{workspace.workspace.name}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button asChild className="w-full" variant={"secondary"}>
                <Link to={`/workspaces/${workspace.workspace.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <CreateWorkspaceDialog />
      </div>
    </div>
  );
};
