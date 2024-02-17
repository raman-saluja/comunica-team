import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

import { Settings } from "@/app/workspaces/layout/components/settings";
import channels_list from "@/data/channels.json";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Workspace } from "@/app/dashboard/DashboardPage";
import { APIResponse, api } from "@/axios/api";

export interface Channel {
  _id: string;
  id: string;
  name: string;
  description: string;
  workspace: string;
}

export interface SidebarProps {
  workspace: Workspace;
}

export function Sidebar({ ...props }: SidebarProps) {
  const workspace = props.workspace;

  const [channels, setChannels] = useState<Channel[]>([]);

  const getChannels = async () =>
    await api.get<APIResponse<Channel[]>>("channels");

  useEffect(() => {
    getChannels().then(({ data }) => {
      setChannels(data.data);
    });
  }, []);

  const navigate = useNavigate();
  const params = useParams();
  const channel_id = params.channelID ?? null;

  return (
    <ScrollArea>
      <Card className="h-screen">
        <CardHeader>
          <CardTitle
            className="flex items-center"
            onClick={() => navigate(`workspaces/${workspace._id}`)}
          >
            {workspace.name}
          </CardTitle>
          <CardDescription>
            Invite your team members to collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="group">
            <div className="px-4 my-2 mt-5 pt-5 flex justify-between items-center">
              <small className="text-sm font-bold leading-none">Channels</small>
            </div>
            <div className="w-full grid grid-flow-row gap-2">
              {channels.map((channel: Channel, index) => (
                <Link
                  to={`/workspaces/${workspace._id}/channel/${channel._id}`}
                  key={`channel_${index}`}
                  className={cn(
                    buttonVariants({
                      variant: channel_id==channel._id ? "secondary" : "ghost",
                    }),
                    "relative justify-start text-muted-foreground"
                  )}
                >
                  <span># {channel.name}</span>
                </Link>
              ))}
            </div>
            <div className="px-4 my-2 mt-5 pt-5 flex justify-between items-center">
              <small className="text-sm font-bold leading-none">
                Team Members
              </small>
              <Button type="button" size={"sm"} variant={"secondary"}>
                <Plus size={10} className="mr-2" /> invite
              </Button>
            </div>
            <div className="w-full grid grid-flow-row">
              <div className="cursor-pointer flex items-center p-4 space-x-4">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-xs text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <div className="cursor-pointer flex items-center p-4 space-x-4">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-xs text-muted-foreground">m@example.com</p>
                </div>
              </div>
              <div className="cursor-pointer flex items-center p-4 space-x-4">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-xs text-muted-foreground">m@example.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full left-0 px-4 absolute bottom-10 justify-center">
            <Settings />
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
