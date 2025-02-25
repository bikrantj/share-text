"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { PlusCircle, Share2, Search, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addAbortListener } from "events";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Home() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement | null>>(
    new Map()
  );
  const lastAddedIdRef = useRef<string | null>(null);

  const [textAreas, setTextAreas] = useState<Map<string, string>>(
    new Map([[uuidv4(), ""]])
  );

  const addTextArea = () => {
    setTextAreas((prev) => new Map(prev).set(uuidv4(), ""));
  };

  // Update a specific textarea
  const updateText = (id: string, value: string) => {
    setTextAreas((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, value);
      return newMap;
    });
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
  };
  return (
    <div className="min-h-[100dvh] flex bg-indigo-100/30 flex-col gap-4 p-8 md:p-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-indigo-700">Text Share</h1>
        <p>Share your text with one-click</p>
      </div>
      <div className="flex items-center w-fit mx-auto gap-2 justify-center">
        <Input placeholder="Paste 4-digit code" />
        <Button>Search</Button>
      </div>
      <section className="bg-white mt-8 p-4 rounded-lg border">
        <div></div>
        <div className="flex justify-end">
          <Button onClick={handleShare}>Share</Button>
        </div>
        <ScrollArea
          className={cn(
            "my-4",
            textAreas.size === 1 ? "h-[250px]" : "h-[450px]"
          )}
          ref={scrollAreaRef}
        >
          <div className="space-y-4">
            {[...textAreas.entries()].map(([id, text]) => (
              <div key={id} className="relative flex gap-1 pr-4 group">
                {/* Hide this button is only one textarea */}
                <Textarea
                  ref={(el) => setTextareaRef(id, el)}
                  value={text}
                  onChange={(e) => updateText(id, e.target.value)}
                  placeholder="Paste your text here..."
                />
                {textAreas.size > 1 && (
                  <div className="ml-auto">
                    <Button
                      onClick={() => deleteTextArea(id)}
                      size="icon"
                      variant="outline"
                      className="ml-auto text-destructive hover:text-destructive/80"
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={addTextArea} variant="outline">
          <PlusCircle className="h-4 w-4" />
          Add Another Text
        </Button>
      </section>
    </div>
  );
}
