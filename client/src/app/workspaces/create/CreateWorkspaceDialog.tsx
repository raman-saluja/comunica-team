import { Workspace } from "@/app/dashboard/DashboardPage";
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
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
interface CreateWorkspaceDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CreateWorkspaceSchema = z.object({
  name: z.string(),
});

type WorkspaceForm = z.infer<typeof CreateWorkspaceSchema>;

function CreateWorkspaceDialog(props: CreateWorkspaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(CreateWorkspaceSchema),
  });
  const onSubmit: SubmitHandler<WorkspaceForm> = async (data) => {
    setIsLoading(true);

    api
      .post<APIResponse<Workspace>>(
        `${import.meta.env.VITE_SERVER_URL}/workspaces`,
        data
      )
      .then((res) => {
        if (res.data.success) {
          navigate(`/workspaces/${res.data.data.id}`);
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
      <Dialog {...props}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-full">
            Create Workspace
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{"Set Up Your Team's Workspace"}</DialogTitle>
            <DialogDescription>
              {
                "Create a digital space for your team. Name your workspace for easy access."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
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
            <Button
              type="submit"
              disabled={isLoading}
              variant="secondary"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                ""
              )}
              Create
            </Button>
            <DialogClose asChild>
              <Button type="submit" disabled={isLoading} variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

export default CreateWorkspaceDialog;
