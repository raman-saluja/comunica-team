import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AppState } from "@/redux/store";
import { socket } from "@/socket/socket";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import "./react-quill-customise.css";

export default function SendMessage() {
  const [value, setValue] = useState("");

  const { channel } = useLoaderData() as { channel: ChannelInterface };

  const auth = useSelector((state: AppState) => state.auth);

  const handleSendMessage = () => {
    socket.emit("sendMessage", {
      channel: channel.id,
      token: auth.user?.id.toString()!,
      message: value,
    });
    setValue("");
  };

  return (
    <div className="relative bg-primary-foreground w-full place-items-end h-[10vh] px-5 !overflow-visible">
      <ReactQuill
        theme="snow"
        className="w-full"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        }}
      />
      <Button
        className="absolute right-0 bottom-0"
        onClick={handleSendMessage}
        variant={"ghost"}
        size={"icon"}
      >
        <Send size={15} />
      </Button>
    </div>
  );
}
