"use client";
import { Channel } from "@/app/dashboard/layout/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export interface ChannelInfoProps {
  channel: Channel | undefined;
}

function ChannelInfo({ ...props }: ChannelInfoProps) {
  return (
    <div className="w-full px-4 py-4 h-[10vh]">
      <div className="flex items-center justify-between">
        {props.channel ? (
          <h4 className="font-bold tracking-tight"># {props.channel.name}</h4>
        ) : (
          <h4 />
        )}
        <div className="place-items-end mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback className="text-blue-200">RS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 mr-5">
              <DropdownMenuLabel>
                <span>My Account</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

export default ChannelInfo;
