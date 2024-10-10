import VPNCheckout from "@/components/app/VPN/VPNCheckout";

import { FaInfoCircle } from "react-icons/fa";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col gap-4 items-center bg-bg dark:bg-darkBg px-5 flex-grow font-bold">
      <h1 className="text-6xl font-bold text-text dark:text-darkText my-10">
        LN VPN
      </h1>

      <VPNCheckout />
      <Alert
        variant={"destructive"}
        className="w-full mx-auto mt-10 max-w-screen-md"
      >
        <FaInfoCircle className="h-5 w-5 " />

        <AlertDescription>
          This is a privacy focused VPN service. Select the country and
          duration, pay with Bitcoin. You communicate directly with the
          endpoint. Keys are generated only within the browser. Check out our{" "}
          <Link className="text-main" href={"/faq"}>
            FAQ
          </Link>{" "}
          if you have any questions.
        </AlertDescription>
      </Alert>
    </main>
  );
}
