"use client";

import { APIResponse, api } from "@/axios/api";
import ChatItem from "@/components/chat/chat-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LoaderFunction,
  useLoaderData
} from "react-router-dom";
import ChannelInfo from "./layout/components/channel_topbar";
import { Channel } from "./layout/sidebar";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.channelID || !parseInt(params.channelID!)) {
    throw new Response("Invalid request", { status: 404 });
  }

  const channelData = (
    await api.get<APIResponse<Channel>>(`channels/${params.channelID}`)
  ).data.data;
  if (!channelData._id) {
    throw new Response("Invalid request", { status: 404 });
  }

  return { channel: channelData };
};

export const Component: React.FC = () => {

  const { channel } = useLoaderData() as { channel: Channel };

  return (
    <>
      <div className="relative grid grid-flow-row col-span-3 h-screen items-start overflow-x-hidden">
        <ChannelInfo title={channel.name} />
        <ScrollArea>
          <div className="flex flex-col justify-end w-full space-y-2 h-[70vh]">
            <ChatItem />
            <ChatItem />
            <ChatItem />
          </div>
        </ScrollArea>
        {/* <SendMessage /> */}
      </div>
    </>
  );
};
