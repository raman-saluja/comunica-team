import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { Button } from "@/components/ui/button";
import { AppState } from "@/redux/store";
import { socket } from "@/socket/socket";
import { Send } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import "./react-quill-customise.css";

export default function SendMessage({ callback }: { callback: () => void }) {
  const [value, setValue] = useState("");

  const { channel } = useLoaderData() as { channel: ChannelInterface };

  const auth = useSelector((state: AppState) => state.auth);

  const handleSendMessage = () => {
    const message = value.trim();
    const regex = /(<([^>]+)>)/gi;
    const result = message.replace(regex, "");
    if (!result || result == "") {
      return false;
    }
    socket.emit("sendMessage", {
      channel: channel.id,
      token: auth.user?.id.toString()!,
      message: message,
    });
    setTimeout(callback, 500);
    setValue("");
  };

  return (
    <div className="relative bg-primary w-full place-items-end h-[10vh] !overflow-visible">
      <ReactQuill
        theme="snow"
        className="w-full"
        value={value}
        onChange={setValue}
        onKeyUp={(e) => {
          if (e.key == "Enter" && !e.shiftKey) {
            handleSendMessage();
            return false;
          }
        }}
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
