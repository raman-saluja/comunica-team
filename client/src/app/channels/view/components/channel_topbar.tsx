import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { AuthInterface, logout } from "@/app/auth/AuthSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, LogOut, Pencil, PencilLine, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditChannelDialog } from "../../create/EditChannelDialog";
import { ChannelInterface } from "../../ChannelInterface";
import { useEffect, useState } from "react";
import { AppState } from "@/redux/store";

export interface ChannelInfoProps {
  title: string;
}

function ChannelInfo({ channel }: { channel?: ChannelInterface }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(({ auth }: { auth: AuthInterface }) => auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const activeWorkspace = useSelector(
    (state: AppState) => state.workspace.activeWorkspace
  );

  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="w-full px-4 py-4 h-[10vh]">
      {channel ? (
        <EditChannelDialog
          open={showEdit}
          onOpenChange={setShowEdit}
          channel={channel}
        />
      ) : (
        ""
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {channel ? (
            <>
              <h4 className="font-bold tracking-tight">{channel?.name}</h4>
              {activeWorkspace?.created_by.id === auth?.user?.id ? (
                <a
                  href="#"
                  onClick={() => setShowEdit(true)}
                  className="ml-3 text-muted-foreground"
                >
                  <PencilLine size={16} />
                </a>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
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
                <span>{auth?.user?.name}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
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
