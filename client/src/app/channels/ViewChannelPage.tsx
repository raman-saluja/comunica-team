import { APIResponse, api } from "@/api/api";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import ChatList from "@/app/chats/components/ChatList";
import SendMessage from "@/app/chats/components/send-message/SendMessage";
import ChannelInfo from "@/app/workspaces/layout/components/channel_topbar";
import { toast } from "@/components/ui/use-toast";
import { socket } from "@/socket/socket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { newMessageReceived } from "../chats/ChatSlice";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.channelID || !parseInt(params.channelID!)) {
    throw new Response("Invalid request", { status: 404 });
  }

  const channelData = (
    await api.get<APIResponse<ChannelInterface>>(`channels/${params.channelID}`)
  ).data.data;
  if (!channelData.id) {
    throw new Response("Invalid request", { status: 404 });
  }

  return { channel: channelData };
};

export const Component: React.FC = () => {
  // const socket = useSelector((state: AppState) => state.socket);

  const { channel } = useLoaderData() as { channel: ChannelInterface };

  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();
    // () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-channel", channel.id);
    });

    socket.on("connect_error", (error) => {
      toast({
        variant: "destructive",
        title: "Server unreachable at the moment !",
      });
      console.error(error);
    });

    return () => {
      socket.emit("leave-channel", channel.id);
    };
  }, [socket, channel]);

  useEffect(() => {
    socket.on("joined-channel", (payload) => {
      console.log("new user joined", payload);
    });

    return () => {
      socket.off("joined-channel");
    };
  }, [socket.connected]);

  useEffect(() => {
    socket.on("message-received", (chat) => {
      dispatch(newMessageReceived(chat));
    });

    return () => {
      socket.off("message-received");
    };
  }, [socket, channel]);

  return (
    <>
      <div className="relative grid grid-flow-row w-full h-full items-start overflow-x-hidden">
        <ChannelInfo title={channel.name} />
        <ChatList />
        <SendMessage />
      </div>
    </>
  );
};
