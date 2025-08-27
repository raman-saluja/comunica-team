import { APIResponse, api } from "@/api/api";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import ChatList from "@/app/chats/components/ChatList";
import ChannelInfo from "@/app/channels/view/components/channel_topbar";
import { toast } from "@/components/ui/use-toast";
import { AppState, store } from "@/redux/store";
import { socket } from "@/socket/socket";
import { useEffect } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ChatMessageInterface } from "../../chats/ChatModel";
import { newMessageReceived } from "../../chats/ChatSlice";
import { useSelector } from "react-redux";

export const loader: LoaderFunction = async ({ params }) => {
  return {};
};

export const Component: React.FC = () => {
  const channel = useSelector((state: AppState) => state.channel.activeChannel);

  useEffect(() => {
    if (!socket.connected) socket.connect();
  }, []);

  useEffect(() => {
    if (!channel) return;

    socket.on("connect", () => {
      console.log("channel join request sent", channel?.name);
    });
    socket.emit("join-channel", channel?.id);

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
      socket.emit("leave-channel", channel?.id);
    };
  }, [socket, channel]);

  return (
    <>
      <div className="relative grid grid-flow-row w-full h-full items-start overflow-x-hidden">
        {channel && <ChannelInfo channel={channel} />}
        {channel && <ChatList />}
      </div>
    </>
  );
};
