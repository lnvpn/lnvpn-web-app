"use client";
import { ChevronDown } from "lucide-react";

import * as React from "react";
import { useState } from "react";
import { IoIosRefresh } from "react-icons/io";

import { GenerateKeyButton } from "@/components/ui/GenerateKeyButton";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { KeyInput } from "@/components/ui/KeyInput";

export interface IAppProps {}

export default function KeySection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className=" w-full">
        <div className="flex items-center w-full">
          <div className="w-full my-4 flex  items-center justify-center space-x-4 border-2 rounded-base border-border dark:border-darkBorder text-text bg-main px-4 py-2">
            <h4 className=" font-bold">Show my keys</h4>
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
          className={`flex flex-col gap-2 text-text font-base bg-white rounded-base shadow-light dark:shadow-dark border-2 border-border dark:border-darkBorder p-4 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <p>Your private keys are only generated within the browser!</p>

          <div className="flex items-center w-full items-stretch">
            <div className="flex items-strech w-full  rounded border-border dark:border-darkBorder  border-2">
              <span className=" px-3 py-2 whitespace-nowrap bg-main text-sm">
                Private Key
              </span>
              <KeyInput
                className="flex h-full w-full rounded-l-none   text-text  font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white  px-3 py-2 text-sm ring-offset-white   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-r-none"
                type="text"
              />{" "}
              <GenerateKeyButton variant={"noShadow"} className="h-full">
                <IoIosRefresh color="black" title="Renew keys" className="" />
              </GenerateKeyButton>
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="flex flex-grow items-center border-border dark:border-darkBorder  rounded  border-2">
              <span className="h-full px-3 py-2 whitespace-nowrap bg-main text-sm">
                Public Key
              </span>
              <KeyInput
                className="flex h-full w-full rounded-l-none  text-text  font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white  px-3 py-2 text-sm ring-offset-white   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 "
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="flex flex-grow items-center border-border dark:border-darkBorder  rounded border-2">
              <span className=" px-3 py-2 whitespace-nowrap bg-main text-sm">
                Preshared Key
              </span>
              <KeyInput
                className="flex h-full w-full rounded-l-none   text-text  font-base selection:bg-main selection:text-black border-border dark:border-darkBorder bg-white  px-3 py-2 text-sm ring-offset-white   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 "
                type="text"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
