"use client";
import { Channel, Sidebar } from "@/app/dashboard/layout/sidebar";
import ChannelInfo from "@/components/channel/info";
import ChatItem from "@/components/chat/chat-item";
import SendMessage from "@/components/chat/send-message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

import { CreateChannel } from "@/components/channel/create";
import { socketIO } from "@/socket/socket";
import { toast, useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const socket = socketIO();

export default function Page() {
  const [chatItem, setChatItem] = useState<Channel | undefined>();
  useEffect(() => {
    socket.on("notification", (message) => {
      toast({
        title: message,
      });
    });
  }, []);

  return (
    <div className="grid grid-flow-row md:grid-cols-4 h-screen overflow-y-hidden">
      <Sidebar channel={chatItem} setChannel={setChatItem} />
      {chatItem ? (
        <div className="relative grid grid-flow-row col-span-3 h-screen items-start overflow-x-hidden">
          <ChannelInfo channel={chatItem} />
          <ScrollArea>
            <div className="flex flex-col justify-end w-full space-y-2 h-[70vh]">
              <ChatItem />
              <ChatItem />
              <ChatItem />
            </div>
          </ScrollArea>
          <SendMessage />
        </div>
      ) : (
        <div className="relative grid grid-flow-row col-span-3 h-screen items-start">
          <ChannelInfo channel={chatItem} />
          <div className="w-full text-center space-y-6 space-x-2">
            <div>
              <h3 className="text-muted-foreground opacity-75 pb-2">
                Communico Team Chat APP
              </h3>
              <p className="text-muted-foreground opacity-75">
                An open source application for your team.
              </p>
            </div>
            <CreateChannel />

            <Button type="button" variant={"secondary"}>
              Invite Team Memebers
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
