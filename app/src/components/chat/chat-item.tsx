import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ChatItem() {
  return (
    <div className="flex items-start px-4 space-x-4 py-2">
      <Avatar>
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="space-x-2">
          <span className="text-sm font-medium leading-none pb-2">
            Sofia Davis
          </span>
          <span className="text-muted-foreground"> &#9679;</span>
          <span className="text-sm font-medium leading-none pb-2 text-muted-foreground">
            5:18 PM
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum
          commodi non alias fugiat.
        </p>
      </div>
    </div>
  );
}

export default ChatItem;
