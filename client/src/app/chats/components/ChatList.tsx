import { ScrollArea } from "@/components/ui/scroll-area";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";
import { ChatMessageInterface } from "../ChatModel";

function ChatList() {
  const [messages, setMessages] = useState<ChatMessageInterface[]>([]);

  useEffect(() => {
    socket.on("load-messages-fulfilled", (loaded_messages) => {
      console.log('====================================');
      console.log(loaded_messages);
      console.log('====================================');
      setMessages(loaded_messages);
    });

    return () => {
      socket.off("load-messages-fulfilled");
    };
  }, [socket]);

  return (
    <>
      <ScrollArea>
        <div className="flex flex-col justify-end w-full space-y-2 h-[70vh]">
          {messages.map((message, i) => {
            return <ChatItem key={`message_${i}`} message={message} />;
          })}
          {/* <ChatItem />
          <ChatItem />
          <ChatItem />
          <ChatItem />
          <ChatItem /> */}
        </div>
      </ScrollArea>
    </>
  );
}

export default ChatList;
