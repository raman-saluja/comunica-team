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
import { Facebook, FacebookIcon, Plus } from "lucide-react";
import { DialogProps } from "@radix-ui/react-dialog";
interface CreateWorkspaceDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workspace: Workspace;
}

export const CreateChannelSchema = z.object({
  name: z.string(),
});

type ChannelForm = z.infer<typeof CreateChannelSchema>;

export function InviteDialog(props: DialogProps & CreateWorkspaceDialogProps) {
  const workspace = props.workspace;

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [copy, setCopy] = useState("copy");

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Invite your team</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to join this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="flex w-full flex-row gap-4 items-center justify-between bg-black pl-4 rounded">
            <p className="text-sm">{`${import.meta.env.VITE_PUBLIC_URL}${
              import.meta.env.BASE_URL
            }join/${workspace.id}`}</p>
            <Button
              type="button"
              onClick={() => {
                window.navigator.clipboard.writeText(
                  `${import.meta.env.VITE_PUBLIC_URL}${
                    import.meta.env.BASE_URL
                  }join/${workspace.id}`
                );
                setCopy("copied");
                setTimeout(() => setCopy("copy"), 2000);
              }}
              variant={"secondary"}
              size={"sm"}
            >
              {copy}
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <div></div>
          <DialogClose asChild>
            <Button disabled={isLoading} type="button" variant={"secondary"}>
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
