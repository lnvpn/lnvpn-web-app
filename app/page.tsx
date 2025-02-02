import VPNCheckout from "@/components/app/VPN/VPNCheckout";

import { FaInfoCircle } from "react-icons/fa";
import type { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://lnvpn.net",
  },
};

export default async function Home() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="my-10 text-shadow-neo scroll-m-20 font-Space_Grotesk text-5xl font-extrabold tracking-wide text-main lg:text-6xl">
        LN VPN
      </h1>

      <VPNCheckout />
      <Alert
        variant={"destructive"}
        className="w-full mx-auto mt-10 max-w-screen-md"
      >
        <FaInfoCircle className="h-5 w-5 mr-2" aria-hidden="true" />
        <AlertTitle>How does it work:</AlertTitle>
        <AlertDescription>
          <ul className="list-disc ml-4 mt-2">
            <li>
              <strong>Step 1:</strong> Download and install the VPN app.
            </li>
            <li>
              <strong>Step 2:</strong> Select your VPN exit country.
            </li>
            <li>
              <strong>Step 3:</strong> Choose the duration of your subscription.
            </li>
          </ul>
          <p className="mt-4">
            This is a privacy-focused VPN service—no logging, ever! We are not a
            reseller; we operate our own servers in each country. Keys are
            generated exclusively within your browser, and all communication
            happens directly with the endpoint.
          </p>
          <p className="mt-2">
            Have questions?{" "}
            <Link className="text-main underline" href={"/faq"}>
              Visit our FAQ
            </Link>{" "}
            for more details.
          </p>
        </AlertDescription>
      </Alert>
    </main>
  );
}
