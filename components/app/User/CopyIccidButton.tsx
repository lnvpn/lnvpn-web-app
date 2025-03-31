"use client";

import { Button } from "@/components/ui/button";
import { FaCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";

interface CopyIccidButtonProps {
  iccid: string;
}

export function CopyIccidButton({ iccid }: CopyIccidButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(iccid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="neutral"
      size="icon"
      onClick={copyToClipboard}
      className="h-8 w-8"
    >
      {copied ? (
        <FaCheck className="h-4 w-4" />
      ) : (
        <FaCopy className="h-4 w-4" />
      )}
    </Button>
  );
}
