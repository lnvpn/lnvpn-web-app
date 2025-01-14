"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button";

// A small button that copies the current URL to the clipboard.
export function CopyUrlButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Copies the current URL (the address bar) to the clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // Reset “Copied!” message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="neutral"
      size="sm"
      className="bg-white text-text"
    >
      {copied ? "Copied!" : "Copy URL"}
    </Button>
  );
}
