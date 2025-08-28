import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { avatarFallBackName, cn } from "@/lib/utils";

import { AuthInterface } from "@/app/auth/AuthSlice";
import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { setActiveChannel, setAllChannels } from "@/app/channels/ChannelSlice";
import CreateChannelDialog from "@/app/channels/create/CreateChannelDialog";
import {
  removeTeamMember,
  setAllTeamMembers,
} from "@/app/teams/TeamMembersSlice";
import WorkspaceSettings from "@/app/workspaces/settings/WorkspaceSettings";
import { Badge } from "@/components/ui/badge";
import { AppState, store } from "@/redux/store";
import { Hash, Plus, SettingsIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { InviteDialog } from "../../invite/InviteDialog";

export interface SidebarProps {}

export function Sidebar({ ...props }: SidebarProps) {
  const activeWorkspace = useSelector(
    (state: AppState) => state.workspace.activeWorkspace
  );

  const active_channel = useSelector(
    (state: AppState) => state.channel.activeChannel
  );

  // const [channels, setChannels] = useState<ChannelInterface[]>([]);
  // const [team, setTeam] = useState<WorkspaceUserInterface[]>([]);
  const channels =
    useSelector((state: AppState) => state.channel).channels || [];
  const team =
    useSelector((state: AppState) => state.teamMembers.members) || [];

  const navigate = useNavigate();
  const params = useParams();
  const channel_id = params.channelID ?? null;
  const auth = useSelector(({ auth }: { auth: AuthInterface }) => auth);

  const [showSettings, setShowSettings] = useState(false);

  const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  useEffect(() => {
    if (!activeWorkspace) return;
    store.dispatch(setAllChannels());
    store.dispatch(setAllTeamMembers());
  }, [activeWorkspace?.id]);

  useEffect(() => {
    if (channels.length > 0 && channel_id) {
      store.dispatch(setActiveChannel(channel_id));
    }
  }, [channels]);

  const changeChannel = (id: string) => {
    store.dispatch(setActiveChannel(id));
    navigate(`workspaces/${activeWorkspace?.id}/channel/${id}`, {
      replace: true,
    });
  };

  const handleRemoveTeamMember = (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    store.dispatch(removeTeamMember(memberId));
  };

  return (
    <ScrollArea className="w-[300px] md:w-[450px] max-w-full bg-black border-r">
      <div className="h-full">
        <CardHeader className="p-0">
          <div className="flex justify-between items-center">
            <CardTitle
              className="flex items-center border-b p-5 text-xl"
              onClick={() => {
                store.dispatch(setActiveChannel(null));
                navigate(`workspaces/${activeWorkspace?.id}`, {
                  replace: true,
                });
              }}
            >
              {activeWorkspace?.name}
            </CardTitle>
            {activeWorkspace?.created_by.id === auth?.user?.id ? (
              <Button
                variant={"ghost"}
                onClick={() => setShowSettings(true)}
                className=""
              >
                <SettingsIcon size={15} />
              </Button>
            ) : (
              ""
            )}
          </div>
          <CardDescription className="px-0 py-2">
            <div className="flex gap-2 items-center m-2 border p-3 rounded-xl">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>
                  {avatarFallBackName(auth?.user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p>{auth?.user?.name ?? "Unknown User"}</p>
                <Badge className="bg-transparent text-green-600 p-0">
                  online
                </Badge>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 px-2">
          <div className="group">
            <div className="px-4 my-4 mt-2 pt-2 flex justify-between items-center">
              <small className="text-sm font-bold leading-none">Channels</small>
              {activeWorkspace?.created_by.id === auth?.user?.id ? (
                <button
                  type="button"
                  onClick={() => setShowCreateChannelDialog(true)}
                >
                  <Plus size={16} />
                </button>
              ) : (
                ""
              )}
              {activeWorkspace ? (
                <CreateChannelDialog
                  workspace={activeWorkspace}
                  open={showCreateChannelDialog}
                  onOpenChange={setShowCreateChannelDialog}
                />
              ) : (
                ""
              )}
            </div>
            <div className="w-full grid grid-flow-row gap-1">
              {channels.map((channel: ChannelInterface, index) => (
                <button
                  onClick={() => changeChannel(channel.id)}
                  key={`channel_${index}`}
                  className={cn(
                    buttonVariants({
                      variant:
                        active_channel?.id == channel.id
                          ? "secondary"
                          : "ghost",
                    }),
                    "relative justify-start text-muted-foreground"
                  )}
                >
                  <Hash size={16} className="mr-2" />
                  <span>{channel.name}</span>
                </button>
              ))}
            </div>
            <div className="px-4 my-2 mt-5 pt-5 flex justify-between items-center">
              <small className="text-sm font-bold leading-none">
                Team Members
              </small>
              {activeWorkspace?.created_by.id === auth?.user?.id ? (
                <button type="button" onClick={() => setShowInviteDialog(true)}>
                  <Plus size={16} />
                </button>
              ) : (
                ""
              )}
              {activeWorkspace ? (
                <InviteDialog
                  workspace={activeWorkspace}
                  open={showInviteDialog}
                  onOpenChange={setShowInviteDialog}
                />
              ) : (
                ""
              )}
            </div>
            <div className="w-full grid grid-flow-row">
              {team.map((member) => {
                return (
                  <div className="relative group flex items-center p-4 space-x-4">
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
                    {activeWorkspace?.created_by.id === auth?.user?.id &&
                    auth?.user?.id != member.user.id ? (
                      <Button
                        type="button"
                        className="absolute opacity-0 group-hover:opacity-100 transition right-2 text-red-500 hover:text-red-700"
                        variant={"ghost"}
                        size={"xs"}
                        onClick={() => handleRemoveTeamMember(member.user.id)}
                      >
                        <X size={15} />
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col w-full left-0 absolute bottom-10 px-4 gap-4">
            <div className="flex justify-center">
              {activeWorkspace ? (
                <WorkspaceSettings
                  open={showSettings}
                  onOpenChange={setShowSettings}
                  workspace={activeWorkspace}
                />
              ) : (
                ""
              )}
            </div>
            {/* {activeWorkspace?.created_by.id === auth?.user?.id ? (
              <Button type="button" variant={"outline"}>
                Manage Team Members
              </Button>
            ) : (
              ""
            )} */}
            {/* <Button asChild type="button" variant={"outline"}>
              <Link to={"/"}>workspaces</Link>
            </Button> */}
          </div>
        </CardContent>
      </div>
    </ScrollArea>
  );
}
