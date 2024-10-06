import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import PartnerForm from "@/components/app/Partners/PartnerForm";

export default function Partners() {
  return (
    <main className="relative flex min-h-[100svh] gap-4 flex-col items-center  bg-bg dark:bg-darkBg px-5 py-[150px]  font-bold">
      <h1 className="text-6xl font-bold text-text dark:text-darkText">
        Affiliates
      </h1>

      <h2 className="text-xl my-4">
        Join the LNVPN Affiliate Program and earn 15% from subscription
        referrals.
      </h2>

      <PartnerForm />
      <Alert
        variant={"destructive"}
        className="w-full mx-auto  max-w-screen-md"
      >
        <FaInfoCircle className="h-5 w-5 " />
        <AlertDescription>
          Check out our{" "}
          <Link className="text-main" href={"/faq"}>
            FAQ
          </Link>{" "}
          if you have any questions. Generate your own affiliate link above.
          Promote and start earning Bitcoin rewards!
        </AlertDescription>
      </Alert>
    </main>
  );
}
