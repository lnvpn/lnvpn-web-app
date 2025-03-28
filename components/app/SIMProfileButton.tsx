"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaSpinner, FaUser } from "react-icons/fa6";

export default function SIMProfileButton() {
  const [iccid, setIccid] = useState(""); // Input state
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter(); // Next.js router

  // Open the modal
  const handleOpenModal = () => {
    setIsOpen(true);
    router.prefetch(`/user/${iccid}`);
  };

  // Close the modal
  const handleCloseModal = () => setIsOpen(false);

  // Handle form submission
  const handleSubmit = async () => {
    if (iccid.trim()) {
      setIsLoading(true);
      await router.push(`/user/${iccid}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="flex items-center justify-center bg-main rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none dark:hover:shadow-none"
      >
        <FaUser className="h-6 w-6 m500:h-4 m500:w-4 fill-text dark:fill-darkText" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          onEscapeKeyDown={handleCloseModal}
          onPointerDownOutside={handleCloseModal}
        >
          <DialogHeader>
            <DialogTitle>Find your eSIM profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <Input
              type="text"
              placeholder="Enter your eSIM number"
              value={iccid}
              onChange={(e) => setIccid(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end w-full">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="text-black"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
