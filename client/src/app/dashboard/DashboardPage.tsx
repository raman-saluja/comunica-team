"use client";
import React from "react";

import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import CreateWorkspaceDialog from "../workspaces/create/CreateWorkspaceDialog";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  workspace: string;
}

export const loader: LoaderFunction = async () => {
  const res = await api.get("workspaces");
  return { workspaces: res.data.data };
};

export const Component: React.FC = () => {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="grid grid-flow-row gap-4 w-full md:w-2/6">
        {workspaces.map((workspace, index) => (
          <Card key={"workspace_" + index} className="w-full">
            <CardHeader>
              <CardTitle>{workspace.name}</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button asChild className="w-full" variant={"secondary"}>
                <Link to={`/workspaces/${workspace.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <CreateWorkspaceDialog />
      </div>
    </div>
  );
};
