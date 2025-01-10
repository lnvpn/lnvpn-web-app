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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

// Payment Modal
import PaymentModal from "@/components/app/PaymentModal";

// Our step subcomponents
import { getAvailableBundles } from "./BundleCheckout/BundleCheckoutActions";
import RegionSelector from "./BundleCheckout/RegionSelector";
import BundleSelector from "./BundleCheckout/BundleSelector";

// For showing an alert
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  checkEsimCompatibility,
  purchaseBundleForIccid,
  validateBundleAvailability,
} from "./UserComponenteActions";
import { Checkbox } from "@/components/ui/checkbox";
import { isError } from "@/utils/isError";

export interface BundlePurchaseProps {
  iccid: string;
  countries: Country[];
  regions: Region[];
}

export default function BundleCheckout({
  iccid,
  countries,
  regions,
}: BundlePurchaseProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Steps: 1 = region selection, 2 = bundle selection
  const [step, setStep] = useState<1 | 2>(1);

  // For region/country selection
  // const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Bundles for the selected slug
  const [bundles, setBundles] = useState<ProcessedBundle[]>([]);

  // The currently selected plan (object). Default to the first plan when user goes to step 2.
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    null
  );

  // Payment-related states
  const [isPaymentModalActive, setIsPaymentModalActive] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(false);

  // -------------------------
  // Step 1: Region selection
  // -------------------------
  const handleRegionSelected = async (slug: string) => {
    // setSelectedSlug(slug);

    // 1) Fetch the available bundles for that slug
    const data = await getAvailableBundles(slug);

    // 2) Save them in state
    setBundles(data || []);

    // 3) If we have bundles, auto-select the first one
    if (data && data.length > 0) {
      setSelectedPlan(data[0]);
    } else {
      setSelectedPlan(null);
    }

    // 4) Move to step 2
    setStep(2);
  };

  // -------------------------
  // Step 2: Bundle Selection
  // -------------------------
  const handleSelectPlan = (planName: string) => {
    // find the plan object
    const found = bundles.find((b) => b.name === planName) ?? null;
    setSelectedPlan(found);
  };

  // -------------------------
  // Step 2: "Buy now" click
  // -------------------------
  const handleConfirmBundle = () => {
    if (!selectedPlan) {
      setAlertMessage("No bundle selected!");
      setAlertOpen(true);
      return;
    }

    startTransition(async () => {
      try {
        // 1) Check eSIM compatibility
        const compat = await checkEsimCompatibility(iccid, selectedPlan.name);
        if (!compat.success || !compat.compatible) {
          setAlertMessage(
            compat.message || "This bundle is not compatible with this eSIM."
          );
          setAlertOpen(true);
          return;
        }

        // 2) Validate bundle availability
        const validateResult = await validateBundleAvailability(
          selectedPlan.name
        );
        if (!validateResult.success) {
          setAlertMessage(
            validateResult.message || "Bundle validation failed."
          );
          setAlertOpen(true);
          return;
        }

        setOpen(false);

        // ---- Then open the Payment Modal ----
        setIsPaymentModalActive(true);
      } catch (error: unknown) {
        setAlertMessage(
          isError(error)
            ? error.message
            : "Something went wrong during bundle validation and compatibility checks."
        );
        setAlertOpen(true);
      }
    });
  };

  // Called by PaymentModal after successful LN payment
  const handlePaymentSuccess = () => {
    startTransition(async () => {
      try {
        if (!selectedPlan) {
          throw new Error("No selected plan found!");
        }

        // 3) Finalize purchase
        const purchaseResult = await purchaseBundleForIccid(
          selectedPlan.name,
          iccid
        );
        if (!purchaseResult.success) {
          setAlertMessage(
            purchaseResult.message || "Failed to complete purchase."
          );
          setAlertOpen(true);
          return;
        }

        // // If success, we might have an ICCID from the server
        // const purchasedIccid = purchaseResult.iccid;
        // if (!purchasedIccid) {
        //   throw new Error("No ICCID returned from purchase API.");
        // }

        // For example, close the entire checkout modal
        setOpen(false);

        // Then redirect or show success
        // e.g., push user to /user/[iccid]
        toast({
          title: "Purchase successful",
          description: "Your bundle has been purchased.",
          action: <ToastAction altText="Goto schedule to undo">Ok</ToastAction>,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        router.refresh();
      } catch (error: unknown) {
        const alertMessage = isError(error)
          ? error.message
          : "Something went wrong during purchase.";

        setAlertMessage(alertMessage);
        setAlertOpen(true);
      }
    });
  };

  // "Back" button to go from step 2 to step 1
  const handleBackToStep1 = () => {
    setStep(1);
    // setSelectedSlug(null);
    setBundles([]);
    setSelectedPlan(null);
  };

  return (
    <>
      {/* The main trigger for the multi-step checkout */}
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
                      className="text-sm text-gray-700"
                    >
                      I have checked if my phone is eSIM ready.
                    </label>
                  </div>

                  <div className="flex justify-center flex-row-reverse items-center gap-2 my-3">
                    <Button
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

      {/* Alert for any errors or messages */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notice</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              OK
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
