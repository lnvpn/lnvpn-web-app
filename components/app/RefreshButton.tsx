"use client";

import React from "react";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const RefreshButton: React.FC = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <Button
      variant="default"
      size="default"
      onClick={handleRefresh}
      aria-label="Refresh Page"
    >
      <RefreshCw className="shrink-0" />
      Refresh
    </Button>
  );
};

export default RefreshButton;
