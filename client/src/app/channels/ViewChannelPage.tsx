import { APIResponse, api } from "@/api/api";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import ChatList from "@/app/chats/components/ChatList";
import ChannelInfo from "@/app/workspaces/layout/components/channel_topbar";
import { toast } from "@/components/ui/use-toast";
import { store } from "@/redux/store";
import { socket } from "@/socket/socket";
import { useEffect } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ChatMessageInterface } from "../chats/ChatModel";
import { newMessageReceived } from "../chats/ChatSlice";

export const loader: LoaderFunction = async ({ params }) => {
  // const { workspace } = useLoaderData() as { workspace: Workspace };

  if (!params.channelID || !parseInt(params.channelID!)) {
    throw new Response("Invalid request", { status: 404 });
  }

  const channelData = (
    await api.get<APIResponse<ChannelInterface>>(
      `channels/${params.channelID}`,
      {
        params: {
          workspace: params.id,
        },
      }
    )
  ).data.data;
  if (!channelData.id) {
    throw new Response("Invalid request", { status: 404 });
  }

  return { channel: channelData };
};

export const Component: React.FC = () => {
  const { channel } = useLoaderData() as { channel: ChannelInterface };
  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("channel join request sent", channel.name);
    });
    socket.emit("join-channel", channel.id);

    socket.on("connect_error", (error) => {
      toast({
        variant: "destructive",
        title: "Server unreachable at the moment !",
      });
      console.error(error);
    });

    socket.on("joined-channel", (payload) => {
      console.log("channel joined", payload);
    });

    socket.on("message-received", (chat: ChatMessageInterface) => {
      store.dispatch(newMessageReceived(chat));
    });

    return () => {
      socket.off("message-received");
      socket.off("joined-channel");
      socket.emit("leave-channel", channel.id);
    };
  }, [socket, channel]);



  return (
    <>
      <div className="relative grid grid-flow-row w-full h-full items-start overflow-x-hidden">
        <ChannelInfo title={channel.name} />
        <ChatList />
      </div>
    </>
  );
};
