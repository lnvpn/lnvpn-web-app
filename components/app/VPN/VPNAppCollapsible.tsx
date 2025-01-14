"use client";
import { ChevronDown } from "lucide-react";
import { FaWindows, FaAndroid, FaApple, FaLinux } from "react-icons/fa6";
import Link from "next/link";

import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface IAppProps {}

export default function VPNAppCollapsible() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
        <div className="flex w-full items-center  gap-2">
          <div className="rounded-base w-full  flex items-center justify-between space-x-4 border-2 border-border dark:border-darkBorder text-text bg-main px-4 py-2">
            <h4 className=" font-bold">1. Install the VPN app</h4>
            <CollapsibleTrigger asChild>
              <Button
                variant="noShadow"
                size="sm"
                className=" bg-white  text-text  "
              >
                <ChevronDown className="" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent
          className={`flex flex-col gap-2 my-2 text-text font-base bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <p>Download and install your secure WireGuard client:</p>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="https://apps.apple.com/us/app/wireguard/id1441195209"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
                <FaApple className="w-5 h-5" />
                <span>iPhone</span>
              </div>
            </Link>
            <Link
              href="https://apps.apple.com/us/app/wireguard/id1451685025"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
                <FaApple className="w-5 h-5" />
                <span>Mac</span>
              </div>
            </Link>

            <Link
              href="https://www.wireguard.com/install/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
                <FaLinux className="w-5 h-5" />
                <span>Linux</span>
              </div>
            </Link>

            <Link
              href="https://download.wireguard.com/windows-client/wireguard-installer.exe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
                <FaWindows className="w-5 h-5" />
                <span>Windows</span>
              </div>
            </Link>

            <Link
              href="https://play.google.com/store/apps/details?id=com.wireguard.android"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="rounded-base border-2 border-border dark:border-darkBorder bg-main px-4 py-3 font-mono text-sm flex items-center gap-3 hover:bg-hover cursor-pointer">
                <FaAndroid className="w-5 h-5" />
                <span>Android</span>
              </div>
            </Link>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
