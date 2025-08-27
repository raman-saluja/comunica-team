import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { store } from "@/redux/store";
import { DialogProps } from "@radix-ui/react-dialog";
import { z } from "zod";
import { ChannelInterface } from "../ChannelInterface";
import { deleteChannel, updateChannel } from "../ChannelSlice";
import { Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
export const EditChannelSchema = z.object({
  name: z.string(),
});

type ChannelForm = z.infer<typeof EditChannelSchema>;

export function EditChannelDialog(
  props: DialogProps & { channel: ChannelInterface }
) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ChannelForm>({
    resolver: zodResolver(EditChannelSchema),
  });

  const onSubmit: SubmitHandler<ChannelForm> = async (data) => {
    setIsLoading(true);

    store
      .dispatch(
        updateChannel({
          id: props.channel.id,
          name: data.name,
        })
      )
      .finally(() => {
        setIsLoading(false);
        form.reset();
        if (props.onOpenChange) props.onOpenChange(false);
      });
  };

  return (
    <Form {...form}>
      <Dialog {...props}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Button
                disabled={isLoading}
                type="button"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this channel?")
                  ) {
                    setIsLoading(true);
                    store
                      .dispatch(deleteChannel(props.channel.id))
                      .finally(() => {
                        if (props.onOpenChange) props.onOpenChange(false);
                        toast({
                          variant: "destructive",
                          title: "Channel deleted",
                        });
                        setIsLoading(false);
                      });
                  }
                }}
                variant={"destructive"}
              >
                <Trash size={15} className="mr-2" /> Delete Channel
              </Button>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="channel name"
                        autoComplete="name"
                        autoCorrect="off"
                        {...field}
                        defaultValue={props.channel.name}
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
