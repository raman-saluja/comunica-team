import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch, AppState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { ChatMessageInterface } from "../ChatModel";
import { getChats } from "../ChatSlice";
import ChatItem from "./ChatItem";
import SendMessage from "./send-message/SendMessage";
function ChatList() {
  const { channel } = useLoaderData() as { channel: ChannelInterface };

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector<AppState>(
    (state) => state.chats[channel.id] ?? []
  ) as ChatMessageInterface[];

  const chatListRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getChats(channel.id));
  }, [channel]);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      let div = chatListRef.current.querySelector("div");
      if (!div) return;
      div.scrollTop = Number(div?.scrollHeight);
    }
  };
  return (
    <>
      <div>
        <ScrollArea ref={chatListRef} className="h-[80vh]" id="chat-list">
          <div className="flex flex-col justify-end w-full space-y-2">
            {messages.map((message, i) => {
              return <ChatItem key={`message_${i}`} message={message} />;
            })}
          </div>
        </ScrollArea>
      </div>
      <SendMessage callback={scrollToBottom} />
    </>
  );
}

export default ChatList;
