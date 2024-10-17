// components/Modal.tsx
"use client";

import { X } from "lucide-react";
import ReactDom from "react-dom";
import React, { useEffect, useState } from "react";

type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export default function PaymentModalTemplate({
  active,
  setActive,
  children,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActive(false);
    }, 300);
  };

  useEffect(() => {
    if (active) {
      setIsVisible(true);
    }
  }, [active]);

  if (!active) return null;

  return ReactDom.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      data-visible={isVisible ? "true" : "false"}
      onClick={closeModal}
      className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-overlay transition-all duration-300 data-[visible=true]:visible data-[visible=true]:opacity-100 data-[visible=false]:invisible data-[visible=false]:opacity-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex text-black flex-col items-center justify-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-base border-2 border-border bg-main p-10 pt-12 font-base shadow-light transition-all duration-300"
      >
        <button onClick={closeModal}>
          <X className="absolute right-3 top-3 h-6 w-6" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal") as HTMLElement
  );
}
