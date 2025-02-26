"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "./button";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = useCallback(async () => {
    if (copied) return; // Prevent multiple clicks while already copied

    copy(text);
    setCopied(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [text, copied, copy]);

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
