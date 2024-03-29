import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { avatarFallBackName, cn } from "@/lib/utils";
import { ArrowLeftRightIcon, ChevronLeft, Plus, X } from "lucide-react";

import { APIResponse, api } from "@/api/api";
import {
  Workspace,
  WorkspaceUserInterface,
} from "@/app/dashboard/DashboardPage";
import { Settings } from "@/app/workspaces/layout/components/settings";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { CreateChannelDialog } from "@/app/channels/create/CreateChannelDialog";
import { InviteDialog } from "../invite/InviteDialog";

export interface SidebarProps {
  workspace: Workspace;
}

export function Sidebar({ ...props }: SidebarProps) {
  const workspace = props.workspace;

  const [channels, setChannels] = useState<ChannelInterface[]>([]);
  const [team, setTeam] = useState<WorkspaceUserInterface[]>([]);

  const getChannels = async () =>
    await api.get<APIResponse<ChannelInterface[]>>(
      `channels?workspace=${workspace.id}`
    );

  const getTeamMembers = async () =>
    await api.get<APIResponse<WorkspaceUserInterface[]>>(
      `workspaces/${workspace.id}/users`
    );

  const location = useLocation();

  useEffect(() => {
    getChannels().then(({ data }) => {
      setChannels(data.data);
    });
    getTeamMembers().then(({ data }) => {
      setTeam(data.data);
    });
  }, [location]);

  const navigate = useNavigate();
  const params = useParams();
  const channel_id = params.channelID ?? null;

  return (
    <ScrollArea className="w-full md:w-[30%] bg-black">
      <div className="h-full ">
        <CardHeader>
          <CardTitle
            className="flex items-center"
            onClick={() => navigate(`workspaces/${workspace.id}`)}
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
              <CreateChannelDialog workspace={workspace} />
            </div>
            <div className="w-full grid grid-flow-row gap-2">
              {channels.map((channel: ChannelInterface, index) => (
                <Link
                  to={`/workspaces/${workspace.id}/channel/${channel.id}`}
                  key={`channel_${index}`}
                  className={cn(
                    buttonVariants({
                      variant: channel_id == channel.id ? "secondary" : "ghost",
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
              <InviteDialog workspace={workspace} />
            </div>
            <div className="w-full grid grid-flow-row">
              {team.map((member) => {
                return (
                  <div className="relative group cursor-pointer flex items-center p-4 space-x-4">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src="/avatars/01.png" />
                      <AvatarFallback>
                        {avatarFallBackName(member.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium leading-none">
                        {member.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                    {/* <div className="block absolute right-0 top-5">
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="text-destructive"
                        size={"xs"}
                      >
                        <X size={12} />
                      </Button>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col w-full left-0 absolute bottom-10 px-4 gap-4">
            <div className="flex justify-center">
              <Settings />
            </div>
            <Button type="button" variant={"outline"}>
              Manage Team Members
            </Button>
            {/* <Button asChild type="button" variant={"outline"}>
              <Link to={"/"}>workspaces</Link>
            </Button> */}
          </div>
        </CardContent>
      </div>
    </ScrollArea>
  );
}
