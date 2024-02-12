"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { APIResponse } from "@/axios/api";
import { useNavigate } from "react-router-dom";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const RegisterFormSchema = z.object({
  email: z.string().email(),
});

type RegisterForm = z.infer<typeof RegisterFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setIsLoading(true);

    axios
      .post<APIResponse>(
        `${import.meta.env.VITE_SERVER_URL}/auth/register`,
        data
      )
      .then((res) => {
        if (res.data.success) {
          navigate("/email/confirm");
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
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="shadcn"
                          autoComplete="email"
                          autoCorrect="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign up with Email
              </Button>
            </div>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading}>
          <Icons.gitHub className="mr-2 h-4 w-4" /> Google
        </Button>
      </div>
    </>
  );
}
