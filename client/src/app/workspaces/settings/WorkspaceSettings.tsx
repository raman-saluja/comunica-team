import { api } from "@/api/api";
import { Workspace } from "@/app/dashboard/DashboardPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/redux/store";
import { DialogProps } from "@radix-ui/react-dialog";
import React from "react";
import { deleteWorkspace, updateActiveWorkspace } from "../WorkspaceSlice";
import { useNavigate } from "react-router-dom";

// Require open and onOpenChange as mandatory props
export default function WorkspaceSettings(
  props: DialogProps & {
    workspace?: Workspace;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
) {
  const [workspaceName, setWorkspaceName] = React.useState<string>("");

  const handleSaveWorkspace = () => {
    api
      .put(`workspaces/${props.workspace?.id}`, {
        name: workspaceName,
      })
      .then(() => {
        store.dispatch(updateActiveWorkspace({ name: workspaceName }));
        props.onOpenChange(false); // Close dialog after save
      });
  };

  const navigate = useNavigate();

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col py-4 gap-4">
          <div className="grid flex-1 gap-2 mb-4">
            <Button
              className="w-full"
              variant={"outline-destructive"}
              onClick={() => {
                if (
                  !window.confirm(
                    "are you sure you want to delete this workspace ?"
                  )
                )
                  return false;

                if (props?.workspace?.id)
                  store
                    .dispatch(deleteWorkspace(props?.workspace?.id))
                    .then(() => {
                      const workspaces = store.getState().workspace.workspaces;
                      navigate(`/workspaces/${workspaces?.[0]?.id || ""}`);
                      props.onOpenChange(false);
                    });
              }}
            >
              Delete Workspace
            </Button>
          </div>
          <div className="grid flex-1 gap-2 mb-4">
            <Label htmlFor="link">Workspace Name</Label>
            <Input
              id="link"
              onChange={(e) => setWorkspaceName(e.target.value)}
              defaultValue={props?.workspace?.name}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant={"default"}
            onClick={handleSaveWorkspace}
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => props.onOpenChange(false)}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
