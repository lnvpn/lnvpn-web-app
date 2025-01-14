"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import PaymentModal from "@/components/app/PaymentModal";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ESIMRadioGroup from "@/components/app/eSIM/[slug]/ESIMRadioGroup";
import { FaSpinner } from "react-icons/fa6";

// Import your server actions
import { validateBundleAvailability, purchaseBundle } from "./ESIMBuyActions";
import { ProcessedBundle } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { isError } from "@/utils/isError";

// --- Toast
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ESIMPageClientProps {
  plans: ProcessedBundle[];
}

const ESIMPageClient: React.FC<ESIMPageClientProps> = ({ plans }) => {
  const router = useRouter();
  const { toast } = useToast();

  // 1. Default to the *first* plan if available
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    plans.length ? plans[0] : null
  );

  // 2. Local states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // For success
  const [isModalActive, setIsModalActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(false);
  const [iccid, setIccid] = useState<string | null>(null);

  type PurchaseStatus = "idle" | "processing" | "error" | "success";
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("idle");

  // 3. Called by the child RadioGroup when user selects a different plan
  const handleSelectPlan = (planName: string) => {
    const found = plans.find((p) => p.name === planName) ?? null;
    setSelectedPlan(found);
  };

  // 4. The Buy/Pay button
  const handleBuyNow = () => {
    if (!selectedPlan) return;

    startTransition(async () => {
      try {
        // Validate plan availability
        const result = (await validateBundleAvailability(
          selectedPlan.name
        )) ?? {
          success: false,
          message: "Failed to validate bundle.",
        };

        if (!result.success) {
          toast({
            title: "Validation Error",
            description: result.message ?? "Bundle is not available.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          return;
        }

        // If the plan is available, open PaymentModal
        setIsModalActive(true);
      } catch (error: unknown) {
        if (isError(error)) {
          toast({
            title: "Validation Error",
            description: error.message,
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
        } else {
          toast({
            title: "Validation Error",
            description: "Something went wrong.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
        }
      }
    });
  };

  // 5. Called by PaymentModal after invoice is confirmed paid
  const handlePaymentSuccess = () => {
    startTransition(async () => {
      try {
        if (!selectedPlan) {
          throw new Error("No selected plan found.");
        }

        // After user pays, purchase the eSIM
        const purchaseResult = (await purchaseBundle(selectedPlan.name)) ?? {
          success: false,
          message: "Failed to purchase eSIM.",
        };

        if (!purchaseResult.success) {
          toast({
            title: "Purchase Error",
            description: purchaseResult.message ?? "Failed to purchase eSIM.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          return;
        }

        const purchaseIccid = purchaseResult.iccid;
        if (!purchaseIccid) {
          toast({
            title: "Purchase Error",
            description: purchaseResult.message ?? "No ICCID returned.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          throw new Error("No ICCID returned from purchase API.");
        }

        // 1. We got a successful purchase, so let’s show "processing"
        setPurchaseStatus("processing");

        // Give the user a short toast that the eSIM is being created
        toast({
          title: "Purchase Successful",
          description: "Creating your eSIM, please wait...",
        });

        // 2. Wait 2s to ensure eSIM is fully created
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 3. Mark success and store the iccid in state
        setIccid(purchaseIccid);
        setPurchaseStatus("success");

        // Show success in alert
        setAlertMessage(
          `Your eSIM is ready! ICCID: ${purchaseIccid}. Tap OK to continue.`
        );
        setAlertOpen(true);
      } catch (error: unknown) {
        // If anything failed, set purchaseStatus to "error"
        setPurchaseStatus("error");

        if (isError(error)) {
          toast({
            title: "Purchase Error",
            description: error.message,
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
        } else {
          toast({
            title: "Purchase Error",
            description: "Something went wrong during purchase.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
        }
      }
    });
  };

  return (
    <>
      <ESIMRadioGroup
        plans={plans}
        selectedPlanName={selectedPlan?.name || ""}
        onSelect={handleSelectPlan}
      />

      <div className="mt-4 text-center w-full">
        {/* Button */}
        <Button
          variant="neutral"
          size="lg"
          className="text-black w-full p-8 text-lg font-bold my-5"
          onClick={handleBuyNow}
          disabled={!isChecked || isPending}
        >
          {isPending ? (
            <FaSpinner className="animate-spin h-6 w-6 mr-2" />
          ) : (
            "Buy Now"
          )}
        </Button>

        {/* Checkbox */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Checkbox
            id="esim-ready-checkbox"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
          />
          <label
            htmlFor="esim-ready-checkbox"
            className="text-black dark:text-white"
          >
            I have checked if my phone is eSIM ready.
          </label>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          active={isModalActive}
          setActive={setIsModalActive}
          amount={selectedPlan.price}
          memo={`Buying eSIM: ${selectedPlan.name}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Alert Dialog used ONLY for the success & user redirection */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase Successful!</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            {purchaseStatus === "processing" ? (
              <Button disabled>
                <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                Processing...
              </Button>
            ) : purchaseStatus === "success" ? (
              <Button
                onClick={() => {
                  setPurchaseStatus("idle");
                  setAlertOpen(false);

                  if (iccid) {
                    router.push(`/user/${iccid}`);
                  }
                }}
              >
                OK
              </Button>
            ) : (
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                OK
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ESIMPageClient;
