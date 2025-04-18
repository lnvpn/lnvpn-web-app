import * as React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import PartnerForm from "@/components/app/Partners/PartnerForm";

export default function Partners() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        PARTNERS
      </h1>

      <h2 className="text-xl text-center">
        Join the LNVPN Affiliate Program and earn Bitcoin commissions: <br />
        15% on VPN referrals and 5% on eSIM referrals.
      </h2>

      <PartnerForm />
      <Alert
        variant={"destructive"}
        className="w-full mx-auto mb-10  max-w-screen-md"
      >
        <FaInfoCircle className="h-5 w-5 " />
        <AlertDescription>
          Generate your own affiliate link above. Promote and start earning
          Bitcoin rewards! Check out our{" "}
          <Link className="text-main" href={"/faq"}>
            FAQ
          </Link>{" "}
          if you have any questions.
        </AlertDescription>
      </Alert>
    </main>
  );
}
