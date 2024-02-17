"use client";
import { Button } from "@/components/ui/button";

import { Workspace } from "@/app/dashboard/DashboardPage";
import { CreateChannelDialog } from "@/app/channels/create/CreateChannelDialog";
import {
  LoaderFunction,
  useLoaderData,
  useRouteLoaderData,
} from "react-router-dom";
import { useEffect } from "react";

export const loader: LoaderFunction = async ({ params }) => {
  return {};
};

export const Component: React.FC = () => {
  const { workspace } = useRouteLoaderData("workspaces") as {
    workspace: Workspace;
  };

  return (
    <>
      {/* chatItem ? (
        <div className="relative grid grid-flow-row col-span-3 h-screen items-start overflow-x-hidden">
          <ChannelInfo channel={chatItem} />
          <ScrollArea>
            <div className="flex flex-col justify-end w-full space-y-2 h-[70vh]">
              <ChatItem />
              <ChatItem />
              <ChatItem />
            </div>
          </ScrollArea>
          <SendMessage />
        </div>
      ) : ( */}
      {/** )} */}
      <div className="relative grid grid-flow-row col-span-3 h-screen items-center">
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
