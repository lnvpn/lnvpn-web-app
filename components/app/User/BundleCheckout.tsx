"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { Country, Region, ProcessedBundle } from "@/lib/types";

import { v4 as uuidv4 } from "uuid";

// Payment Modal
import PaymentModal from "@/components/app/PaymentModal";

// Our step subcomponents
import { getAvailableBundles } from "./BundleCheckout/BundleCheckoutActions";
import RegionSelector from "./BundleCheckout/RegionSelector";
import BundleSelector from "./BundleCheckout/BundleSelector";

// AlertDialog for final success only
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Server actions
import {
  checkEsimCompatibility,
  purchaseBundleForIccid,
  validateBundleAvailability,
} from "./UserComponenteActions";

// UI components
import { Checkbox } from "@/components/ui/checkbox";
import { isError } from "@/utils/isError";

// Import your toast utilities
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FaSpinner } from "react-icons/fa6";

export interface BundlePurchaseProps {
  iccid: string;
  countries: Country[];
  regions: Region[];
}

type PurchaseStatus = "processing" | "success" | "error" | null;

export default function BundleCheckout({
  iccid,
  countries,
  regions,
}: BundlePurchaseProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>(null);
  // `open` is for the multi-step dialog
  const [open, setOpen] = useState(false);

  // Steps: 1 = region selection, 2 = bundle selection
  const [step, setStep] = useState<1 | 2>(1);

  // Bundles for the selected region/country
  const [bundles, setBundles] = useState<ProcessedBundle[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    null
  );

  // Payment modal
  const [isPaymentModalActive, setIsPaymentModalActive] = useState(false);

  // **Success** alert dialog
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // For transitions / spinners
  const [isPending, startTransition] = useTransition();

  // For user checking "I have eSIM ready" box
  const [isChecked, setIsChecked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // -------------------------
  // Step 1: Region selection
  // -------------------------
  const handleRegionSelected = async (slug: string) => {
    // Fetch available bundles for that slug
    const data = await getAvailableBundles(slug);
    setBundles(data || []);

    // Auto-select the first one if available
    if (data && data.length > 0) {
      setSelectedPlan(data[0]);
    } else {
      setSelectedPlan(null);
    }

    // Advance to step 2
    setStep(2);
  };

  // -------------------------
  // Step 2: Bundle selection
  // -------------------------
  const handleSelectPlan = (planName: string) => {
    const found = bundles.find((b) => b.name === planName) ?? null;
    setSelectedPlan(found);
  };

  // -------------------------
  // Step 2: "Buy now" click
  // -------------------------
  const handleConfirmBundle = () => {
    if (!selectedPlan) {
      // Move this error into a toast
      toast({
        title: "No bundle selected",
        description: "Please select a bundle before buying.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
      return;
    }

    startTransition(async () => {
      try {
        // 1) Check eSIM compatibility
        const compat = await checkEsimCompatibility(iccid, selectedPlan.name);
        if (!compat.success || !compat.compatible) {
          toast({
            title: "Compatibility Error",
            description:
              compat.message ||
              "This bundle is not compatible with this eSIM. You need a seperate eSIM.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          return;
        }

        // 2) Validate bundle availability
        const validateResult = await validateBundleAvailability(
          selectedPlan.name
        );
        if (!validateResult.success) {
          toast({
            title: "Bundle Validation Error",
            description: validateResult.message || "Bundle validation failed.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          return;
        }

        // Close the multi-step dialog
        setOpen(false);
        // Open Payment Modal
        setIsPaymentModalActive(true);
      } catch (error: unknown) {
        toast({
          title: "Validation Error",
          description: isError(error)
            ? error.message
            : "Something went wrong during validation.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    });
  };

  // -------------------------
  // PaymentModal: onPaymentSuccess
  // -------------------------
  const [transactionId] = useState(() => uuidv4());
  const handlePaymentSuccess = () => {
    if (purchaseStatus === "processing" || purchaseStatus === "success") {
      return; // Skip if we’re already in flow or done
    }

    startTransition(async () => {
      try {
        if (!selectedPlan) {
          throw new Error("No selected plan found!");
        }

        // 1) Finalize purchase
        const purchaseResult = await purchaseBundleForIccid(
          selectedPlan.name,
          iccid,
          transactionId
        );
        if (!purchaseResult.success) {
          setPurchaseStatus("error");
          toast({
            title: "Purchase Error",
            description:
              purchaseResult.message || "Failed to complete purchase.",
            action: <ToastAction altText="Close">Close</ToastAction>,
          });
          return;
        }

        // 2) Let user know we're processing
        setPurchaseStatus("processing");
        toast({
          title: "Purchase Successful",
          description: "Creating your eSIM, please wait...",
        });

        // 3) Delay 2s
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 4) Mark success & show final success alert
        setPurchaseStatus("success");
        setSuccessMessage("Your eSIM is ready. Tap OK to refresh.");
        setSuccessDialogOpen(true);
      } catch (error: unknown) {
        setPurchaseStatus("error");
        toast({
          title: "Purchase Error",
          description: isError(error)
            ? error.message
            : "Something went wrong during purchase.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    });
  };

  // "Back" button to go from step 2 to step 1
  const handleBackToStep1 = () => {
    setStep(1);
    setBundles([]);
    setSelectedPlan(null);
  };

  return (
    <>
      {/* The main trigger for the multi-step checkout dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" variant="neutral" className="text-black">
            Add Bundle
          </Button>
        </DialogTrigger>

        <DialogContent className="overflow-hidden rounded-none border-0 p-0">
          <DialogHeader className="hidden">
            <DialogTitle className="text-xl font-bold">
              {step === 1 ? "Select Region or Country" : "Select a Bundle"}
            </DialogTitle>
          </DialogHeader>

          {/* Step 1: Region Selector */}
          {step === 1 && (
            <RegionSelector
              countries={countries}
              regions={regions}
              onRegionSelected={handleRegionSelected}
            />
          )}

          {/* Step 2: Bundle Selection */}
          {step === 2 && (
            <div className="space-y-4 p-4 mt-8">
              {bundles.length === 0 ? (
                <p>No bundles available.</p>
              ) : (
                <>
                  <BundleSelector
                    plans={bundles}
                    selectedPlanName={selectedPlan?.name ?? ""}
                    onSelect={handleSelectPlan}
                  />
                  <div className="flex items-center justify-center gap-2 my-4">
                    <Checkbox
                      id="esim-ready-checkbox"
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        setIsChecked(checked === true)
                      }
                    />
                    <label
                      htmlFor="esim-ready-checkbox"
                      className="text-black dark:text-white"
                    >
                      I have checked if my phone is eSIM ready.
                    </label>
                  </div>

                  <div className="flex justify-center flex-row-reverse items-center gap-2 my-3">
                    <Button
                      className="text-black"
                      variant="default"
                      onClick={handleConfirmBundle}
                      size="lg"
                      disabled={!isChecked || isPending}
                    >
                      {isPending ? "Processing..." : "Buy Now"}
                    </Button>
                    <Button
                      size="lg"
                      variant="neutral"
                      className="text-black"
                      onClick={handleBackToStep1}
                      disabled={isPending}
                    >
                      Back
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal (only appears after bundle checks pass) */}
      {selectedPlan && (
        <PaymentModal
          active={isPaymentModalActive}
          setActive={setIsPaymentModalActive}
          amount={selectedPlan.price}
          memo={`Buying eSIM: ${selectedPlan.name} for ${iccid}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* AlertDialog for final success ONLY */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Purchase Successful</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {purchaseStatus === "processing" ? (
              <Button disabled>Processing...</Button>
            ) : purchaseStatus === "success" ? (
              <Button
                onClick={async () => {
                  // 1. Turn on spinner + disable the button
                  setIsRefreshing(true);

                  try {
                    // 2. Await refresh, so we know when it finishes
                    await router.refresh();
                  } catch (error) {
                    console.error("Refresh error:", error);
                  } finally {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setIsRefreshing(false);
                    setSuccessDialogOpen(false);
                    setOpen(false);
                  }
                }}
                disabled={isRefreshing}
              >
                {/* 4. Conditionally render spinner or “OK” text */}
                {isRefreshing ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  "OK"
                )}
              </Button>
            ) : (
              <AlertDialogCancel onClick={() => setSuccessDialogOpen(false)}>
                OK
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
