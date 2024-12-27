"use client";

import React, { useState, useTransition } from "react";

import PaymentModal from "@/components/app/PaymentModal";
import { ProcessedBundle } from "@/components/app/eSIM/[slug]/SIMDetailPageActions";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

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
import { validateBundleAvailability } from "./ESIMBuyActions";

interface ESIMPageClientProps {
  plans: ProcessedBundle[];
}

const ESIMPageClient: React.FC<ESIMPageClientProps> = ({ plans }) => {
  const router = useRouter();

  // 1. Default to the *first* plan if available
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    plans.length ? plans[0] : null
  );

  const [orderId, setOrderId] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isModalActive, setIsModalActive] = useState(false);

  // 2. For your loading spinner/indicator while validating
  const [isPending, startTransition] = useTransition();

  // Called by the child whenever the user selects a different plan
  const handleSelectPlan = (planName: string) => {
    const found = plans.find((p) => p.name === planName) ?? null;
    setSelectedPlan(found);
  };

  // 3. The Buy/Pay button in the parent
  const handleBuyNow = () => {
    if (!selectedPlan) return; // just to be safe

    startTransition(async () => {
      try {
        // Validate plan availability
        const result = await validateBundleAvailability(selectedPlan.name);
        if (!result.success) {
          setAlertMessage(result.message ?? "Bundle is not available.");
          setAlertOpen(true);
          return;
        }

        // If the plan is available
        const newOrderId = uuidv4();
        setOrderId(newOrderId);
        setIsModalActive(true);
      } catch (error: any) {
        setAlertMessage(error?.message || "Something went wrong.");
        setAlertOpen(true);
      }
    });
  };

  // Called by PaymentModal after a successful payment
  const handlePaymentSuccess = () => {
    router.push(`/esim-order/${orderId}`);
  };

  return (
    <>
      <ESIMRadioGroup
        plans={plans}
        // Pass the parent's selected plan name so the child remains in sync
        selectedPlanName={selectedPlan?.name || ""}
        onSelect={handleSelectPlan}
      />

      <div className="mt-4 text-center w-full">
        <Button
          variant="neutral"
          size="lg"
          className="text-black w-full p-8 text-lg"
          onClick={handleBuyNow}
          disabled={!selectedPlan}
        >
          {isPending ? (
            <>
              <FaSpinner className="animate-spin h-6 w-6 mr-2" />
            </>
          ) : (
            "Buy Now"
          )}
        </Button>
      </div>

      {selectedPlan && (
        <PaymentModal
          active={isModalActive}
          setActive={setIsModalActive}
          amount={selectedPlan.price}
          memo={`lnvpn.net/esim-order/${orderId}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bundle Unavailable</AlertDialogTitle>
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
