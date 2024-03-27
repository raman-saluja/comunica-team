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

import { Plus } from "lucide-react";
import { z } from "zod";
import { ChannelInterface } from "../ChannelInterface";
interface CreateWorkspaceDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workspace: Workspace;
}

export const CreateChannelSchema = z.object({
  name: z.string(),
});

type ChannelForm = z.infer<typeof CreateChannelSchema>;

export function CreateChannelDialog({ workspace }: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<ChannelForm>({
    resolver: zodResolver(CreateChannelSchema),
  });
  const onSubmit: SubmitHandler<ChannelForm> = async (data) => {
    setIsLoading(true);

    api
      .post<APIResponse<ChannelInterface>>(
        `channels`,
        {
          ...data,
          workspace_id: workspace.id,
        },
        {
          params: {
            workspace: workspace.id,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setOpen(false);
          navigate(`/workspaces/${workspace.id}/channel/${res.data.data.id}`, {
            replace: true,
          });
        } else {
          toast({
            variant: "destructive",
            title: res.data.message,
          });
        }
      })
      .catch((res: AxiosError<APIResponse>) => {
        toast({
          variant: "destructive",
          title: res.response?.data.message,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" size={"sm"} variant={"default"}>
            <Plus size={15} className="mr-2" /> create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Channel</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="workspace name"
                        autoComplete="name"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button
                disabled={isLoading}
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                variant={"default"}
              >
                Save
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
    </Form>
  );
}
