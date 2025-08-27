import { ChannelInterface } from "@/app/channels/ChannelInterface";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppState } from "@/redux/store";
import { socket } from "@/socket/socket";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Loader,
  Send,
  SendHorizonal,
  SendHorizontal,
  SendIcon,
  Smile,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { HistoryEditor, withHistory } from "slate-history"; // << important
import "./react-quill-customise.css";

// Import the Slate editor factory.
import { createEditor, Editor, Range, Transforms } from "slate";
// Import the Slate components and React plugin.
import {
  DefaultElement,
  Editable,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";

// TypeScript users only add this code
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import useImageUploader from "./ImageUploader";
import { toast } from "@/components/ui/use-toast";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

/**
 * Safely get a small range of `distance` characters BEFORE or AFTER a point.
 * Returns a Range or null if it cannot be computed.
 */
function safeAdjacentRange(
  editor: any,
  point: any,
  distance = 2,
  before = true
) {
  try {
    const adjPoint = before
      ? Editor.before(editor, point, { distance, unit: "character" })
      : Editor.after(editor, point, { distance, unit: "character" });

    if (!adjPoint) return null;

    // Build a range in document order
    return before
      ? { anchor: adjPoint, focus: point }
      : { anchor: point, focus: adjPoint };
  } catch (err) {
    // Editor.before/after may throw when given a DOM point or an unusual location.
    return null;
  }
}

function safeHasTextNode(editor: any, point: any) {
  try {
    const node = Editor.node(editor, point.path) as any;
    return typeof node[0].text === "string";
  } catch {
    return false;
  }
}

/**
 * Toggle literal wrappers around the selection or caret safely.
 */
export const toggleShortcodeSafe = (
  editor: any,
  type: "bold" | "underline" | "italic" | "code"
) => {
  if (!editor) return;
  let wrapper = "";

  switch (type) {
    case "bold":
      wrapper = "**"; // Bold
      break;
    case "underline":
      wrapper = "__"; // Underline
      break;
    case "italic":
      wrapper = "*";
      break;
    case "code":
      wrapper = "```"; // code block
  }

  const { selection } = editor;
  if (!selection) return;

  if (
    !safeHasTextNode(editor, selection.anchor) ||
    !safeHasTextNode(editor, selection.focus)
  ) {
    return; // no valid text node to operate on
  }

  // COLLAPSED: caret
  if (Range.isCollapsed(selection)) {
    const anchor = selection.anchor;

    const beforeRange = safeAdjacentRange(editor, anchor, wrapper.length, true);
    const afterRange = safeAdjacentRange(editor, anchor, wrapper.length, false);

    const beforeText = beforeRange ? Editor.string(editor, beforeRange) : "";
    const afterText = afterRange ? Editor.string(editor, afterRange) : "";

    // If wrappers exist immediately before and after caret -> remove them
    if (beforeText === wrapper && afterText === wrapper) {
      Editor.withoutNormalizing(editor, () => {
        // delete afterRange first (later in doc) then beforeRange
        if (afterRange) Transforms.delete(editor, { at: afterRange });
        if (beforeRange) Transforms.delete(editor, { at: beforeRange });
      });
      return;
    }

    // Otherwise insert wrapper pair and attempt to place caret between them.
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertText(editor, wrapper + wrapper);
      // try to move caret back between wrappers
      try {
        Transforms.move(editor, { distance: wrapper.length, reverse: true });
      } catch (e) {
        // If move fails for some reason, do nothing — caret will be after inserted text.
      }
    });
    return;
  }

  // NON-COLLAPSED selection
  const selectedText = Editor.string(editor, selection);

  // Case 1: selection includes wrappers itself -> unwrap them
  if (
    selectedText.length >= wrapper.length * 2 &&
    selectedText.startsWith(wrapper) &&
    selectedText.endsWith(wrapper)
  ) {
    const inner = selectedText.slice(
      wrapper.length,
      selectedText.length - wrapper.length
    );
    // Replace selection with inner (unwrap)
    Transforms.insertText(editor, inner, { at: selection });
    return;
  }

  // Case 2: wrappers are immediately outside the selection: check small slices
  const startPoint = Editor.start(editor, selection);
  const endPoint = Editor.end(editor, selection);

  const beforeRange = safeAdjacentRange(
    editor,
    startPoint,
    wrapper.length,
    true
  );
  const afterRange = safeAdjacentRange(editor, endPoint, wrapper.length, false);

  const beforeText = beforeRange ? Editor.string(editor, beforeRange) : "";
  const afterText = afterRange ? Editor.string(editor, afterRange) : "";

  if (beforeText === wrapper && afterText === wrapper) {
    // delete afterRange then beforeRange (do inside withoutNormalizing)
    Editor.withoutNormalizing(editor, () => {
      if (afterRange) Transforms.delete(editor, { at: afterRange });
      if (beforeRange) Transforms.delete(editor, { at: beforeRange });
    });
    return;
  }

  // Default: wrap selection with wrappers
  // Use withoutNormalizing to avoid transient states that might confuse Slate
  Editor.withoutNormalizing(editor, () => {
    Transforms.insertText(editor, wrapper + selectedText + wrapper, {
      at: selection,
    });
  });
};

const processContent = (text: string) => {
  // Escape HTML entities first
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  // Optionally wrap in code blocks if it looks like code
  const codePatterns = [
    /<[^>]+>/,
    /function\s*\(/,
    /const\s+\w+\s*=/,
    /import\s+/,
    /export\s+/,
  ];
  const isCode = codePatterns.some((pattern) => pattern.test(text));

  return isCode ? `\`\`\`\n${escaped}\n\`\`\`` : escaped;
};

export default function SendMessageSimple({
  callback,
}: {
  callback: () => void;
}) {
  const [editor] = useState(() => {
    const e = withHistory(withReact(createEditor()));

    // const { insertData } = e;
    e.insertData = (data) => {
      const text = data.getData("text/plain"); // plain text only
      e.insertText(text);
    };

    return e;
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const inputBoxRef = useRef<HTMLDivElement>(null);

  const channel = useSelector((state: AppState) => state.channel.activeChannel);

  const auth = useSelector((state: AppState) => state.auth);

  const handleSendMessage = (message: string) => {
    if (!channel) return false;

    message = message.trim().replace("<p><br></p>", "");
    const regex = /(<([^>]+)>)/gi;
    const result = message.replace(regex, "");
    if (!result || result == "") {
      return false;
    }
    socket.emit("sendMessage", {
      channel: channel.id,
      token: auth.user?.id.toString()!,
      message,
    });
    setTimeout(callback, 500);
    // setValue("");
  };

  const getCursorPosition = (element: any) => {
    const selection = window.getSelection() as any;
    if (selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    return preCaretRange.toString().length;
  };

  function setCursorPosition(element: any, position: any) {
    const range = document.createRange();
    const selection = window.getSelection() as any;

    // Find the text node and position
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentPos = 0;
    let textNode = walker.nextNode() as any;

    while (textNode) {
      const nodeLength = textNode.textContent.length;
      if (currentPos + nodeLength >= position) {
        range.setStart(textNode, position - currentPos);
        range.collapse(true);
        break;
      }
      currentPos += nodeLength;
      textNode = walker.nextNode();
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function insertTextAtPosition(element: any, text: string, position: any) {
    const textContent = element.textContent || "";

    // Split text at position
    const beforeText = textContent.slice(0, position);
    const afterText = textContent.slice(position);

    // Insert new text
    const newText = beforeText + text + afterText;
    element.textContent = newText;

    // Set cursor after inserted text
    setCursorPosition(element, position + text.length);
  }

  // Define a React component to render leaves with bold text.
  const Leaf = (props: any) => {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
      >
        {props.children}
      </span>
    );
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    return <DefaultElement {...props} />;
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  const {
    selectedFile,
    previewUrl,
    isUploading,
    uploadStatus,
    selectFile,
    handleFileSelect,
    confirmUpload,
    cancelSelection,
    fileInputRef,
  } = useImageUploader({
    endpoint: "/chats/upload",
    onSuccess: (response) => {
      if (response.data) {
        // Handle successful upload
        handleSendMessage(`![Alt text](${response.data.url})`);
      }
    },
    onError: (error) => toast({ variant: "destructive", title: error.message }),
    autoReset: true,
    resetDelay: 100,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"] as const;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUploadClick = async () => {
    try {
      await confirmUpload();
    } catch (error) {
      // Error is already handled by the hook and onError callback
    }
  };

  return (
    <div className="relative bg-transparent w-full place-items-end h-[10vh] !overflow-visible flex justify-center items-center">
      <div
        className={cn(
          "absolute h-[450px] right-[80px] bottom-[80px]",
          !showEmojiPicker && "hidden"
        )}
      >
        <EmojiPicker
          onEmojiClick={(emoji) => {
            editor.insertText(`${emoji.emoji}`);
          }}
          open={true}
          theme={Theme.DARK}
        />
      </div>

      {previewUrl ? (
        <div className="absolute bottom-[80%] z-10 mx-7 bg-neutral-900 left-0 w-[600px] max-w-full border rounded-t-lg h-[350px] text-center flex items-center justify-center p-5 shadow-lg">
          {isUploading ? (
            <div className="wrapper absolute right-0 top-0 w-full h-full bg-gray-900/40 z-30"></div>
          ) : (
            ""
          )}

          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-[90%] max-h-[90%]"
          />

          <Button
            onClick={cancelSelection}
            variant={"ghost"}
            className="absolute text-gray-500 top-2 right-2 "
          >
            <X />
          </Button>
          <div className="flex absolute bottom-0 right-0 m-2 gap-2">
            <Button
              onClick={handleUploadClick}
              className="rounded-lg p-0 w-10 h-10"
            >
              <SendHorizontal size={15} />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="h-[full] max-h-[full] border rounded-lg w-full bg-black mx-7 px-2 flex justify-between items-center overflow-hidden">
        <Slate
          editor={editor}
          initialValue={[
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ]}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="w-full h-full max-h-full overflow-hidden outline-none focus:border-0 px-2 py-4"
            onKeyDown={(event) => {
              const message = processContent(event.currentTarget.textContent);
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage(message);
                Transforms.removeNodes(editor, {
                  at: [0], // Remove the first node
                });
                Transforms.insertNodes(editor, {
                  type: "paragraph",
                  children: [{ text: "" }],
                });
                return false;
              }

              if (!event.ctrlKey) {
                return;
              }

              const key = event.key.toLowerCase();
              const mod = event.ctrlKey || event.metaKey;

              // undo
              if (mod && key === "z" && !event.shiftKey) {
                event.preventDefault();
                HistoryEditor.undo(editor);
                return;
              }

              // redo: Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y
              if (mod && ((event.shiftKey && key === "z") || key === "y")) {
                event.preventDefault();
                HistoryEditor.redo(editor);
                return;
              }

              if (key === "b") {
                event.preventDefault();
                toggleShortcodeSafe(editor, "bold");
              } else if (key === "u") {
                event.preventDefault();
                toggleShortcodeSafe(editor, "underline");
              } else if (key === "i") {
                event.preventDefault();
                toggleShortcodeSafe(editor, "italic");
              } else if (key === "`") {
                event.preventDefault();
                toggleShortcodeSafe(editor, "code");
              }
            }}
          />
        </Slate>
        <div className="flex">
          <Button
            onClick={selectFile}
            disabled={isUploading}
            className="w-8 h-8 text-xs"
            variant={"ghost"}
            size={"icon"}
          >
            {isUploading ? (
              <Loader className="animate-spin" size={15} />
            ) : (
              <Upload size={15} />
            )}
          </Button>

          <Button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-8 h-8 text-xs"
            variant={"ghost"}
            size={"icon"}
          >
            <Smile size={15} />{" "}
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
