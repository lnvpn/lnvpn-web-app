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
import { User } from "lucide-react"; // Profile icon

export default function SIMProfilButton() {
  const [iccid, setIccid] = useState(""); // Input state
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const router = useRouter(); // Next.js router

  // Open the modal
  const handleOpenModal = () => setIsOpen(true);

  // Close the modal
  const handleCloseModal = () => setIsOpen(false);

  // Handle form submission
  const handleSubmit = () => {
    if (iccid.trim()) {
      router.push(`/user/${iccid}`);
      setIsOpen(false); // Close the modal after redirect
    }
  };

  return (
    <div className="flex justify-start">
      <Button
        size="sm"
        variant="noShadow"
        onClick={handleOpenModal}
        className="relative z-30"
      >
        <span className="hidden sm:inline 0">My eSIM profile</span>{" "}
        <User className="sm:hidden h-5 w-5" />
      </Button>

      {isOpen && (
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
                <Button type="submit" size="sm">
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
