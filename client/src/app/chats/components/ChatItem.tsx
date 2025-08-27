import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessageInterface } from "../ChatModel";
import moment from "moment";
import { avatarFallBackName } from "@/lib/utils";
import Markdown from "react-markdown";
import { useState } from "react";

interface ChatItemProps {
  message: ChatMessageInterface;
}

function ChatItem({ message }: ChatItemProps) {
  return (
    <div className="flex items-start px-4 space-x-4">
      <Avatar>
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>
          {avatarFallBackName(message.sender.name)}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="space-x-2">
          <span className="text-sm text-[#bfcbd4] font-normal leading-none pb-2">
            {message.sender.name}
          </span>
          <span className="text-xs text-[0.65rem] font-light leading-none pb-2 text-muted-foreground uppercase">
            {moment(message.created_at).format("h:mm a")}
            {/* 5:18 PM */}
          </span>
        </div>
        {/* <div
          className="text-sm text-[#bfcbd4]"
          dangerouslySetInnerHTML={{ __html: renderMessage(message.message) }}
        ></div> */}
        <div className="prose prose-base text-sm text-[#bfcbd4]">
          <Markdown
            components={{
              img: ({ node, ...props }) => {
                const [toggler, setToggler] = useState(true);

                return (
                  <a href={props.src} target="_blank">
                    <img
                      {...props}
                      onClick={() => setToggler(!toggler)}
                      className="cursor-pointer"
                    />
                  </a>
                );
              },
            }}
          >
            {message.message}
          </Markdown>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
