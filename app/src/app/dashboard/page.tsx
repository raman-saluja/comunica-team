"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import workspaces from "@/data/workspaces.json";
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
import { Copy } from "lucide-react";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  workspace: string;
}

export function CreateWordSpaceCard() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = (workspace: Workspace) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/workspaces/${workspace.id}`);
    }, 3000);
  };

  return (
    <div className="grid grid-flow-row gap-4 w-full md:w-2/6">
      {workspaces.map((workspace: Workspace) => (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{workspace.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button
              className="w-full"
              variant={"secondary"}
              disabled={isLoading}
              onClick={() => handleSubmit(workspace)}
            >
              View
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Dialog>
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
          <form onSubmit={() => handleSubmit(workspaces[0])}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="name" placeholder="Name of your workspace" />
              </div>
            </div>
          </form>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              disabled={isLoading}
              variant="secondary"
              onClick={() => handleSubmit(workspaces[0])}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                ""
              )}
              Create
            </Button>
            <DialogClose asChild>
              <Button type="button" disabled={isLoading} variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CreateWordSpaceCard />
    </div>
  );
}
