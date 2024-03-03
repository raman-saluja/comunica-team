import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessageInterface } from "../ChatModel";
import moment from "moment";

interface ChatItemProps {
  message: ChatMessageInterface;
}

function ChatItem({ message }: ChatItemProps) {
  return (
    <div className="flex items-start px-4 space-x-4 py-2">
      <Avatar>
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>
          {message.sender.name.split(" ").map((v, i) => (i <= 1 ? v[0] : ""))}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="space-x-2">
          <span className="text-sm font-medium leading-none pb-2">
            {message.sender.name}
          </span>
          <span className="text-muted-foreground"> &#9679;</span>
          <span className="text-sm font-medium leading-none pb-2 text-muted-foreground uppercase">
            {moment(message.created_at).format("h:mm a")}
            {/* 5:18 PM */}
          </span>
        </div>
        <div
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: message.message }}
        ></div>
      </div>
    </div>
  );
}

export default ChatItem;
