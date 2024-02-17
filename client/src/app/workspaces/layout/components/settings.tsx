import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import workspaces from "@/data/workspaces.json";

export function Settings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" type="button" variant={"outline"}>
          <Settings2 className="mr-2" /> Workspace Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col py-4 gap-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link">Workspace Name</Label>
            <Input id="link" defaultValue={workspaces[0].name} readOnly />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant={"default"}>
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
  );
}
