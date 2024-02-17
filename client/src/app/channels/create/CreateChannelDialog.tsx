import { Workspace } from "@/app/dashboard/DashboardPage";
import { Channel } from "@/app/workspaces/layout/sidebar";
import { APIResponse, api } from "@/api/api";
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
interface CreateWorkspaceDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  workspace: Workspace;
}

export const CreateChannelSchema = z.object({
  name: z.string(),
});

type ChannelForm = z.infer<typeof CreateChannelSchema>;

export function CreateChannelDialog({ workspace }: CreateWorkspaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<ChannelForm>({
    resolver: zodResolver(CreateChannelSchema),
  });
  const onSubmit: SubmitHandler<ChannelForm> = async (data) => {
    setIsLoading(true);

    api
      .post<APIResponse<Channel>>(`channels`, {
        ...data,
        workspace_id: workspace._id,
      })
      .then((res) => {
        if (res.data.success) {
          navigate(`/workspaces/${workspace._id}/channel/${res.data.data._id}`);
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
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant={"secondary"}>
            Create Channel
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
