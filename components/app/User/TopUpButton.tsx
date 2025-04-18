"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ProcessedBundle, EsimBundle } from "@/lib/types";
import { getAvailableBundles } from "./BundleCheckout/BundleCheckoutActions";
import BundleSelector from "./BundleCheckout/BundleSelector";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FaSpinner } from "react-icons/fa6";
import PaymentModal from "@/components/app/PaymentModal";
import {
  checkEsimCompatibility,
  purchaseBundleForIccid,
  validateBundleAvailability,
} from "./UserComponenteActions";
import { isError } from "@/utils/isError";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { countryNameMap } from "@/data/countryNames";

interface TopUpButtonProps {
  bundle: EsimBundle;
  iccid: string;
}

type PurchaseStatus = "processing" | "success" | "error" | null;

/**
 * Get ISO code from country name
 * Example: "Spain" -> "ES"
 */
function getIsoCodeFromCountryName(countryName: string): string | null {
  // Find ISO code by country name
  for (const [isoCode, name] of Object.entries(countryNameMap)) {
    if (name.toLowerCase() === countryName.toLowerCase()) {
      return isoCode;
    }
  }

  // If direct match fails, try to find closest match
  for (const [isoCode, name] of Object.entries(countryNameMap)) {
    if (
      name.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(name.toLowerCase())
    ) {
      return isoCode;
    }
  }

  return null;
}

/**
 * Create a slug from a name (country, region, etc.)
 */
function slugify(name: string): string {
  // Convert to lowercase
  let slug = name.toLowerCase();

  // Normalize and remove diacritics (accents, umlauts, etc.)
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replace any character that is not a letter, number, or space with a space
  slug = slug.replace(/[^a-z0-9\s]/g, "");

  // Replace one or more spaces with a single dash
  slug = slug.trim().replace(/\s+/g, "-");

  return slug;
}

/**
 * Get the slugified country name from an ISO 3166-1 alpha-2 code.
 */
function getSlugFromIsoCode(isoCode: string): string | null {
  const upperCode = isoCode.toUpperCase();
  if (upperCode in countryNameMap) {
    const countryName = countryNameMap[upperCode];
    return slugify(countryName);
  }
  return null;
}

/**
 * Extract region or country from bundle description
 * Description format example: "eSIM, 1GB, 7 Days, Spain, V2"
 */
function extractRegionOrCountry(description: string): {
  name: string;
  isoCode: string | null;
  isRegion: boolean;
} {
  const parts = description.split(", ");
  if (parts.length < 4) {
    return { name: "Unknown", isoCode: null, isRegion: false };
  }

  // The region/country is usually in the fourth position (index 3)
  const regionOrCountry = parts[3].trim();

  // Check if this is a known region
  const knownRegions = [
    "europe",
    "global",
    "asia",
    "africa",
    "middle east",
    "balkans",
    "caribbean",
    "north america",
    "oceania",
    "latam",
  ];

  // Perform case-insensitive check for regions (including with "+" suffix)
  const regionCheck = regionOrCountry.toLowerCase().replace(/\+$/, "");
  const isRegion = knownRegions.includes(regionCheck);

  // Try to get ISO code for country (only if not a region)
  const isoCode = isRegion ? null : getIsoCodeFromCountryName(regionOrCountry);

  return {
    name: regionOrCountry,
    isoCode,
    isRegion,
  };
}

export default function TopUpButton({ bundle, iccid }: TopUpButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [bundles, setBundles] = useState<ProcessedBundle[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedBundle | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Payment and success handling states
  const [isPaymentModalActive, setIsPaymentModalActive] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract region/country information
  const {
    name: regionOrCountry,
    isoCode,
    isRegion,
  } = extractRegionOrCountry(bundle.description);

  const handleOpenDialog = async () => {
    setIsLoading(true);

    try {
      // If this is a region, use the region slug
      if (isRegion) {
        // Clean the region name (remove +, convert to lowercase, replace spaces with dashes)
        const regionSlug = regionOrCountry
          .toLowerCase()
          .replace(/\+$/, "") // Remove trailing +
          .replace(/\s+/g, "-"); // Replace spaces with dashes

        const data = await getAvailableBundles(regionSlug);

        if (data && data.length > 0) {
          setBundles(data);
          setSelectedPlan(data[0]);
          setOpen(true);
          setIsLoading(false);
          return;
        }
      }
      // Handle country (not a region) using ISO code
      else if (isoCode) {
        // ISO code is available, convert it to a slug
        const countrySlug = getSlugFromIsoCode(isoCode);

        if (countrySlug) {
          console.log(
            "Calling getAvailableBundles with country slug derived from ISO code:",
            countrySlug
          ); // Log country slug
          const data = await getAvailableBundles(countrySlug);

          if (data && data.length > 0) {
            setBundles(data);
            setSelectedPlan(data[0]);
            setOpen(true);
            setIsLoading(false);
            return;
          }
        } else {
          // Handle case where ISO code couldn't be converted (should be rare)
          // console.warn(`Could not convert ISO code ${isoCode} to slug.`); // Removed this log
          // Continue to fallback...
        }
      }

      // Fallback: try using country/region name as slug
      const slug = slugify(regionOrCountry);
      const data = await getAvailableBundles(slug);

      if (!data || data.length === 0) {
        toast({
          title: "No bundles available",
          description: `No bundles available for ${regionOrCountry}`,
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        setIsLoading(false);
        return;
      }

      setBundles(data);

      // Auto-select the first bundle
      if (data.length > 0) {
        setSelectedPlan(data[0]);
      }

      setOpen(true);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: isError(error)
          ? (error as Error).message
          : "Failed to load available bundles",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (planName: string) => {
    const found = bundles.find((b) => b.name === planName) ?? null;
    setSelectedPlan(found);
  };

  const handleConfirmBundle = () => {
    if (!selectedPlan) {
      toast({
        title: "No bundle selected",
        description: "Please select a bundle before buying",
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
              "This bundle is not compatible with this eSIM. You need a separate eSIM.",
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

        // Close the dialog
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

  // Handle payment success
  const handlePaymentSuccess = (paymentHash: string) => {
    if (purchaseStatus === "processing" || purchaseStatus === "success") {
      return; // Skip if we're already in flow or done
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
          paymentHash
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
          description: "Adding your bundle, please wait...",
        });

        // 3) Delay 2s
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 4) Mark success & show final success alert
        setPurchaseStatus("success");
        setSuccessMessage(
          "Your new bundle is ready. It can take up to 5 minutes until it is activated. Tap OK to refresh."
        );
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

  return (
    <>
      <Button
        size="sm"
        variant="neutral"
        className="mt-2"
        onClick={handleOpenDialog}
        disabled={isLoading}
      >
        {isLoading ? <FaSpinner className="animate-spin h-4 w-4 mr-2" /> : null}
        Top Up
      </Button>

      {/* Top Up Bundle Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-0 p-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {regionOrCountry}
            </DialogTitle>
            <DialogDescription className="text-center font-bold">
              Bundle Top Up
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {bundles.length === 0 ? (
              <p>No bundles available.</p>
            ) : (
              <>
                <BundleSelector
                  plans={bundles}
                  selectedPlanName={selectedPlan?.name ?? ""}
                  onSelect={handleSelectPlan}
                />

                <div className="flex justify-center flex-row-reverse items-center gap-2">
                  <Button
                    className="text-black"
                    variant="default"
                    onClick={handleConfirmBundle}
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Buy Now"}
                  </Button>
                  <Button
                    size="lg"
                    variant="neutral"
                    className="text-black"
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal (only appears after bundle checks pass) */}
      {selectedPlan && (
        <PaymentModal
          active={isPaymentModalActive}
          setActive={setIsPaymentModalActive}
          amount={selectedPlan.price}
          memo={`Adding ${selectedPlan.name} to eSIM ${iccid}`}
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
                {/* 4. Conditionally render spinner or "OK" text */}
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
