"use client";
import { createText } from "@/actions/create-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn, generateRandomId } from "@/lib/utils";
import { PlusCircle, Trash2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
export default function Home() {
  const { execute, isExecuting, result } = useAction(createText);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement | null>>(
    new Map()
  );
  const lastAddedIdRef = useRef<string | null>(null);

  const [textAreas, setTextAreas] = useState<Map<string, string>>(
    new Map([[generateRandomId(), ""]])
  );

  const addTextArea = () => {
    const newId = generateRandomId();
    lastAddedIdRef.current = newId;
    setTextAreas((prev) => new Map(prev).set(newId, ""));
  };

  // Update a specific textarea
  const updateText = (id: string, value: string) => {
    setTextAreas((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, value);
      return newMap;
    });
    lastAddedIdRef.current = null;
  };

  const deleteTextArea = (id: string) => {
    // Prevent deleting only-one remaining text-area
    if (textAreas.size === 1) return;
    setTextAreas((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollContainer) {
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 0);
        }
      }
    };

    scrollToBottom();
  }, [textAreas.size]);
  // Focus the last added textarea when it changes
  useEffect(() => {
    console.log("Changing focus!!");
    if (lastAddedIdRef.current) {
      const textarea = textareaRefs.current.get(lastAddedIdRef.current);
      if (textarea) {
        textarea.focus();
      }
    }
  }, [textAreas.size]); // Run when the number of textareas changes
  // Function to set the ref for a textarea
  const setTextareaRef = (id: string, element: HTMLTextAreaElement | null) => {
    if (element) {
      textareaRefs.current.set(id, element);
      // If this is the last added textarea, focus it
      if (id === lastAddedIdRef.current) {
        element.focus();
      }
    }
  };

  const handleShare = () => {
    console.log(textAreas);
    const texts = Array.from(textAreas.values()).filter(Boolean);
    if (!texts.length) return;
    execute(texts);
  };
  return (
    <section className="bg-white mt-8 p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        {result.data?.code && (
          <div className="flex-1">
            <Callout
              variant="success"
              heading={
                <span>
                  Text Shared! Share Code:{" "}
                  <code className="text-sm border rounded bg-background p-1">
                    {result.data.code}
                  </code>
                </span>
              }
            ></Callout>
          </div>
        )}
        <div className="flex-1 justify-end flex">
          <Button onClick={handleShare} disabled={isExecuting}>
            {isExecuting ? "Sharing..." : "Share"}
          </Button>
        </div>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className={cn(
          "mt-4 pr-4",
          textAreas.size === 1 ? "h-[35vh]" : "h-[60vh]"
        )}
        data-slot="scroll-area"
      >
        <div className="flex flex-col gap-4">
          {Array.from(textAreas.entries()).map(([id, text]) => (
            <div key={id} className="flex gap-2">
              <Textarea
                ref={(el) => setTextareaRef(id, el)}
                value={text}
                onChange={(e) => updateText(id, e.target.value)}
                placeholder="Type something..."
                className="flex-1"
              />
              {textAreas.size > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteTextArea(id)}
                  disabled={textAreas.size === 1}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={addTextArea} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Another Text
        </Button>
      </div>
    </section>
  );
}
