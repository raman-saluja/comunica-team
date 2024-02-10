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

export function CreateWordSpaceCard() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="grid grid-flow-row gap-4 w-full md:w-2/6">
      {workspaces.map((workspace) => (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{workspace.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button
              className="w-full"
              variant={"secondary"}
              disabled={isLoading}
              onClick={handleSubmit}
            >
              View
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{"Set Up Your Team's Workspace"}</CardTitle>
          <CardDescription>
            {
              "Create a digital space for your team. Name your workspace for easy access."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                {/* <Label htmlFor="name">Name</Label> */}
                <Input id="name" placeholder="Name of your workspace" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              ""
            )}
            Create
          </Button>
        </CardFooter>
      </Card>
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
