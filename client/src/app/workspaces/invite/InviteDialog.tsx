import { APIResponse, api } from "@/api/api";
import { Workspace } from "@/app/dashboard/DashboardPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { Plus } from "lucide-react";
interface CreateWorkspaceDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workspace: Workspace;
}

export const CreateChannelSchema = z.object({
  name: z.string(),
});

type ChannelForm = z.infer<typeof CreateChannelSchema>;

export function InviteDialog({ workspace }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={"sm"} variant={"default"}>
          <Plus size={15} className="mr-2" /> invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite your team</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to join this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <pre>
              <code>{`${import.meta.env.VITE_PUBLIC_URL}${
                import.meta.env.BASE_URL
              }join/${workspace.id}`}</code>
            </pre>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button disabled={isLoading} type="button" variant={"default"}>
              Done
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
