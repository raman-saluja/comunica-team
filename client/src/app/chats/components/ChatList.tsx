import { AppDispatch, AppState } from "@/redux/store";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatMessageInterface } from "../ChatModel";
import { getChats } from "../ChatSlice";
import ChatItem from "./ChatItem";
import SendMessageSimple from "./send-message/SendMessageSimple";
function ChatList() {
  const channel = useSelector((state: AppState) => state.channel.activeChannel);

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector<AppState>((state) =>
    channel ? state.chats[channel?.id] ?? [] : []
  ) as ChatMessageInterface[];

  const chatListRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!channel) return;
    dispatch(getChats(channel?.id));
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [channel]);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      let div = chatListRef.current.querySelector("div");
      // console.log("scrolling to bottom", div?.innerHTML);
      if (!div) return;
      div.scrollTop = Number(div?.scrollHeight);
    }
  };

  return (
    <>
      <div>
        <div
          ref={chatListRef}
          className="h-[80vh] overflow-auto flex justify-end"
          id="chat-list"
        >
          <div className="space-y-5 w-full h-full items-end content-end auto-rows-min overflow-auto  [&::-webkit-scrollbar]:w-2 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800 pb-2">
            {messages.map((message, i) => {
              return <ChatItem key={`message_${i}`} message={message} />;
            })}
          </div>
        </div>
      </div>
      <SendMessageSimple callback={scrollToBottom} />
    </>
  );
}

export default ChatList;
