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

// Import your server actions (these are your existing functions)
import { validateBundleAvailability, purchaseBundle } from "./ESIMBuyActions";
import { ProcessedBundle } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";

interface ESIMPageClientProps {
  plans: ProcessedBundle[];
}

const ESIMPageClient: React.FC<ESIMPageClientProps> = ({ plans }) => {
  const router = useRouter();

  // 1. Default to the *first* plan if available
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    plans.length ? plans[0] : null
  );

  // 2. States for showing alerts, modals, spinners
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isModalActive, setIsModalActive] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(false);

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
        const result = await validateBundleAvailability(selectedPlan.name);
        if (!result.success) {
          setAlertMessage(result.message ?? "Bundle is not available.");
          setAlertOpen(true);
          return;
        }

        // If the plan is available, open PaymentModal
        setIsModalActive(true);
      } catch (error: any) {
        setAlertMessage(error?.message || "Something went wrong.");
        setAlertOpen(true);
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

        // Now that user paid, call the final purchase step
        const purchaseResult = await purchaseBundle(selectedPlan.name);
        if (!purchaseResult.success) {
          setAlertMessage(purchaseResult.message ?? "Failed to purchase eSIM.");
          setAlertOpen(true);
          return;
        }

        // If success, we get the iccid from the server action
        const iccid = purchaseResult.iccid;
        if (!iccid) {
          setAlertMessage(purchaseResult.message ?? "Failed to purchase eSIM.");
          throw new Error("No ICCID returned from purchase API.");
        }

        // Redirect the user to /user/[iccid] for installation instructions
        router.push(`/user/${iccid}`);
      } catch (error: any) {
        setAlertMessage(
          error?.message || "Something went wrong during purchase."
        );
        setAlertOpen(true);
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
            className="text-sm text-gray-700"
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
          // The memo can be whatever you want for LN invoice
          memo={`Buying eSIM: ${selectedPlan.name}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

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
};

export default ESIMPageClient;
