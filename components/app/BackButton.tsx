"use client";
import React from "react";

import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
const BackButton = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        variant={"neutral"}
        className=" bg-white dark:text-white dark:bg-secondaryBlack"
        size="lg"
        onClick={() => router.back()}
      >
        <FaAngleLeft />
        Back
      </Button>
    </div>
  );
};

export default BackButton;
