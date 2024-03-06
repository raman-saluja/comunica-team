"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { APIResponse } from "@/api/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { UserInterface } from "@/app/users/UserInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "@/app/auth/AuthSlice";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { toast } = useToast();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLoading(true);

    axios
      .post<APIResponse<UserInterface>>(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        data
      )
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.data.token);
          dispatch(login(res.data.data));
          if (searchParams.has("action")) {
            navigate(searchParams.get("action") as string);
          } else {
            navigate("/dashboard");
          }
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
                        placeholder="name@example.com"
                        autoComplete="email"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                        autoComplete="password"
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
              Sign In
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
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
