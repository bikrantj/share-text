"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on component mount
  useEffect(() => {
    // Create AudioContext lazily to avoid issues with browser autoplay policies
    return () => {
      // Clean up AudioContext on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copied) return; // Prevent multiple clicks while already copied
    console.log("Handle copy");
    try {
      copy(text);
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, [text, copied]);

  return (
    <Button
      className="absolute right-2 top-2"
      size="icon"
      variant="outline"
      onClick={handleCopy}
      disabled={copied}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <CheckIcon size={14} className="text-green-500" />
      ) : (
        <CopyIcon size={14} />
      )}
    </Button>
  );
};
