"use client";
import { Button } from "@/components/ui/button";

import CreateChannelDialog from "@/app/channels/create/CreateChannelDialog";
import { Workspace } from "@/app/dashboard/DashboardPage";
import { LoaderFunction, useRouteLoaderData } from "react-router-dom";
import ChannelInfo from "../../channels/view/components/channel_topbar";

export const loader: LoaderFunction = async () => {
  return {};
};

export const Component: React.FC = () => {
  const { workspace } = useRouteLoaderData("workspaces") as {
    workspace: Workspace;
  };

  return (
    <>
      <div className="relative grid grid-flow-row w-full h-screen items-start">
        <ChannelInfo />
        <div className="w-full text-center space-y-6 space-x-2">
          <div>
            <h3 className="text-muted-foreground opacity-75 pb-2">
              Communico Team Chat APP
            </h3>
            <p className="text-muted-foreground opacity-75">
              An open source application for your team.
            </p>
          </div>
          <CreateChannelDialog workspace={workspace} />

          <Button type="button" variant={"secondary"}>
            Invite Team Memebers
          </Button>
        </div>
      </div>
    </>
  );
};
