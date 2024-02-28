import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessageInterface } from "../ChatModel";

interface ChatItemProps {
  message: ChatMessageInterface;
}

function ChatItem({ message }: ChatItemProps) {
  return (
    <div className="flex items-start px-4 space-x-4 py-2">
      <Avatar>
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="space-x-2">
          <span className="text-sm font-medium leading-none pb-2">
            user-{message.sender.id}
          </span>
          <span className="text-muted-foreground"> &#9679;</span>
          <span className="text-sm font-medium leading-none pb-2 text-muted-foreground">
            {message.created_at}
            5:18 PM
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
