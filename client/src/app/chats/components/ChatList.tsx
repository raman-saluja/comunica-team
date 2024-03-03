import { ScrollArea } from "@/components/ui/scroll-area";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";
import { ChatMessageInterface } from "../ChatModel";
import { APIResponse, api } from "@/api/api";
import { toast } from "@/components/ui/use-toast";
import { useLoaderData } from "react-router-dom";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { useDispatch, useSelector } from "react-redux";
import { getChats, newMessageReceived } from "../ChatSlice";
import { AppDispatch, AppState } from "@/redux/store";

function ChatList() {
  const { channel } = useLoaderData() as { channel: ChannelInterface };
  // const [messages, setMessages] = useState<ChatMessageInterface[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector<AppState>(
    (state) => state.chats[channel.id] ?? []
  ) as ChatMessageInterface[];

  useEffect(() => {
    dispatch(getChats(channel.id));
  }, [channel]);

  return (
    <div>
      <ScrollArea className="h-[80vh]">
        <div className="flex flex-col justify-end w-full space-y-2">
          {messages.map((message, i) => {
            return <ChatItem key={`message_${i}`} message={message} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ChatList;
