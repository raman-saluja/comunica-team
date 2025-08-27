import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { avatarFallBackName, cn } from "@/lib/utils";
import { Plus } from "lucide-react";

import { APIResponse, api } from "@/api/api";
import {
  Workspace,
  WorkspaceUserInterface,
} from "@/app/dashboard/DashboardPage";
import { AppState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CreateWorkspaceDialog from "../../create/CreateWorkspaceDialog";

export interface SidebarProps {
  workspace: Workspace;
}

export function WorkspacesSideBar() {
  const activeWorkspace = useSelector(
    (state: AppState) => state.workspace.activeWorkspace
  );

  // get workspaces from store
  const workspaces =
    useSelector((state: AppState) => state.workspace.workspaces) ?? [];

  // const [workspaces, setWorkspaces] = useState<WorkspaceUserInterface[]>([]);

  const [showCreateWorkspaceDialog, setShowCreateWorkspaceDialog] =
    useState(false);

  return (
    <ScrollArea className="w-[100px] md:w-[100px] bg-black border-r">
      <div className="h-full mt-10">
        <div className="flex flex-col justify-center w-full items-center gap-5">
          {workspaces.map((workspace, index) => (
            <Button
              asChild
              key={"workspace_" + index}
              className={cn(
                "leading-[2.5rem] bg-gray-800 rounded-full text-center w-10 h-10 p-0 uppercase",
                activeWorkspace && activeWorkspace.id === workspace.id
                  ? "bg-primary"
                  : ""
              )}
            >
              <Link to={`/workspaces/${workspace.id}`}>
                {avatarFallBackName(workspace.name)}
              </Link>
            </Button>
          ))}
          <Button
            className="leading-[2.5rem] flex items-center justify-center bg-gray-800 rounded-full text-center w-10 h-10 p-0"
            onClick={() => setShowCreateWorkspaceDialog(true)}
          >
            <Plus size={20} />
          </Button>
          <CreateWorkspaceDialog
            open={showCreateWorkspaceDialog}
            onOpenChange={setShowCreateWorkspaceDialog}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
