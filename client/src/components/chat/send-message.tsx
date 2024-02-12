"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React, { useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./react-quill-customise.css";

export default function SendMessage() {
  const [value, setValue] = useState("");
  const ReactQuill = useMemo(
    () => React.lazy(() => import("react-quill")),
    []
  );

  return (
    <div className="relative bg-primary-foreground w-full place-items-end h-[10vh] px-5 !overflow-visible">
      <ReactQuill
        theme="snow"
        className="w-full"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        }}
      />
      <Button
        className="absolute right-0 bottom-0"
        variant={"ghost"}
        size={"icon"}
      >
        <Send size={15} />
      </Button>
    </div>
  );
}
