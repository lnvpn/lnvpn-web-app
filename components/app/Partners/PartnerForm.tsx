/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PartnerForm.tsx
"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validate as validateBitcoinAddress } from "bitcoin-address-validation";
import { registerPartner, checkEarnings } from "./partnerActions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa6";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IoCopyOutline } from "react-icons/io5"; // Import the correct icon
import { set } from "mongoose";

// Zod schemas
const registrationSchema = z.object({
  custom_code: z.string().min(2, {
    message: "Referral code must be at least 2 characters.",
  }),
  payoutAddress: z
    .string()
    .refine((address) => validateBitcoinAddress(address), {
      message: "Invalid Bitcoin Address.",
    }),
});

const checkEarningsSchema = z.object({
  payoutAddress: z
    .string()
    .refine((address) => validateBitcoinAddress(address), {
      message: "Invalid Bitcoin Address.",
    }),
});

export default function PartnerForm() {
  const [isCheckingEarnings, setIsCheckingEarnings] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [earnings, setEarnings] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [copiedAffiliateLink, setCopiedAffiliateLink] = useState(false);

  // Forms
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      custom_code: "",
      payoutAddress: "",
    },
  });

  const earningsForm = useForm<z.infer<typeof checkEarningsSchema>>({
    resolver: zodResolver(checkEarningsSchema),
    defaultValues: {
      payoutAddress: "",
    },
  });

  // Registration submission
  function onRegister(values: z.infer<typeof registrationSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("custom_code", values.custom_code);
        formData.append("payoutAddress", values.payoutAddress);

        await registerPartner(formData);

        // Success: Set the success message and affiliate link
        setSuccessMessage("Successfully registered as a partner!");
        setAffiliateLink(`https://lnvpn.net?ref=${values.custom_code}`);

        registrationForm.reset();
        setServerError("");
      } catch (error: any) {
        console.error("Error submitting form:", error);
        setServerError(error.message || "An unexpected error occurred.");
        setSuccessMessage(""); // Clear success message on error
        setAffiliateLink(""); // Clear affiliate link on error
      }
    });
  }

  // Earnings check submission
  function onCheckEarnings(values: z.infer<typeof checkEarningsSchema>) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("payoutAddress", values.payoutAddress);

        const result = await checkEarnings(formData);
        setEarnings(result.earnings);
        setServerError("");
      } catch (error: any) {
        console.error("Error checking earnings:", error);
        setServerError(error.message || "An unexpected error occurred.");
        setEarnings(null);
      }
    });
  }

  // Switch forms
  function switchToRegistration() {
    setIsCheckingEarnings(false);
    earningsForm.reset();
    setEarnings(null);
    setSuccessMessage("");
    setServerError("");
    setAffiliateLink(""); // Clear affiliate link
    setCopiedAffiliateLink(false); // Reset copied state
  }

  function switchToEarnings() {
    setIsCheckingEarnings(true);
    registrationForm.reset();
    setSuccessMessage("");
    setServerError("");
    setAffiliateLink(""); // Clear affiliate link
    setCopiedAffiliateLink(false); // Reset copied state
  }

  async function handleCopyAffiliateLink() {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setCopiedAffiliateLink(true);
      setTimeout(() => setCopiedAffiliateLink(false), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error("Could not copy text: ", err);
      // Optionally, you can provide user feedback here
    }
  }

  return (
    <div className="w-full mx-auto mt-10 max-w-screen-md px-4 bg-main text-lg text-black rounded-base shadow-light font-bold border-2 border-border p-4">
      {isCheckingEarnings ? (
        <>
          <h2 className="text-xl font-bold mb-4">Check Your Earnings</h2>
          <Form {...earningsForm}>
            <form
              onSubmit={earningsForm.handleSubmit(onCheckEarnings)}
              className="space-y-6"
            >
              <FormField
                control={earningsForm.control}
                name="payoutAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your BTC address:</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Bitcoin Address" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the Bitcoin address associated with your account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && <p className="text-red-500">{serverError}</p>}
              {earnings !== null && (
                <p className="text-green-500">
                  Your current earnings: {earnings} Sats
                </p>
              )}
              <div className="flex items-center flex-row-reverse gap-2">
                <Button
                  type="submit"
                  variant="neutral"
                  size={"lg"}
                  disabled={isPending}
                >
                  {isPending ? "Checking..." : "Check Earnings"}
                </Button>
                <Button
                  variant="default"
                  size={"lg"}
                  onClick={switchToRegistration}
                >
                  Go Back
                </Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Partner Registration</h2>
          <div
            className={`p-4 m-2 rounded-base font-bold border-2 border-border ${
              successMessage ? "block" : "hidden"
            }`}
          >
            {/* Display the success message */}
            {successMessage && (
              <p className="text-green-500 text-lg mb-4">{successMessage}</p>
            )}

            {/* Display the affiliate link and copy button */}
            {affiliateLink && (
              <div className="mb-4">
                <p>Your affiliate link:</p>
                <div className="flex items-center">
                  <Input readOnly value={affiliateLink} className="mr-2" />
                  <TooltipProvider>
                    <Tooltip open={copiedAffiliateLink}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"noShadow"}
                          className="h-full flex justify-center items-center"
                          onClick={handleCopyAffiliateLink}
                        >
                          <IoCopyOutline
                            title="Copy Affiliate Link"
                            className="h-full w-6"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Copied</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>

          <Form {...registrationForm}>
            <form
              onSubmit={registrationForm.handleSubmit(onRegister)}
              className="space-y-6"
            >
              <FormField
                control={registrationForm.control}
                name="custom_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Type your preferred referral code:</FormLabel>
                    <FormControl>
                      <Input placeholder="your-code" {...field} />
                    </FormControl>
                    <FormDescription>
                      We recommend you use your brand name or a nickname, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registrationForm.control}
                name="payoutAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your BTC address:</FormLabel>
                    <FormControl>
                      <Input placeholder="Receiver Address" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is where we will send your earnings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && <p className="text-red-500">{serverError}</p>}
              <div className="flex items-center flex-row-reverse gap-2">
                <Button
                  type="submit"
                  variant="neutral"
                  size={"lg"}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      Submitting...
                      <FaSpinner className="animate-spin h-6 w-6" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  variant="default"
                  size={"lg"}
                  onClick={switchToEarnings}
                >
                  I am already a partner
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
