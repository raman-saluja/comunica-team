import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, AppState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { ChatMessageInterface } from "../ChatModel";
import { getChats } from "../ChatSlice";
import ChatItem from "./ChatItem";

function ChatList() {
  const { channel } = useLoaderData() as { channel: ChannelInterface };

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
