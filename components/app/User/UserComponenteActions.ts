"use server";

import {
  handleEsimCompatibility,
  handleEsimOrderApi,
  handleEsimRefresh,
} from "@/utils/esim-api/EsimAndOrder";
import { isError } from "@/utils/isError";
import { getCompletedOrder, saveCompletedOrder } from "@/utils/orderCheck";

export async function refreshEsimAction(iccid: string) {
  try {
    const result = await handleEsimRefresh(iccid);
    return { success: true, result };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

/**
 * Validate a bundle for a specific eSIM (ICCID).
 */
export async function validateBundleAvailability(bundleName: string) {
  try {
    const result = await handleEsimOrderApi(bundleName, "validate", true);
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to validate bundle",
      };
    }
    // Bundle is available
    return {
      success: true,
      subTotal: result.subTotal, // if you want to store/inspect subTotal
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: isError(error)
        ? error.message
        : "Unknown error validating bundle",
    };
  }
}

/**
 * Purchase (transaction) a bundle for a specific eSIM (ICCID).
 */
export async function purchaseBundleForIccid(
  bundleName: string,
  iccid: string,
  transactionId: string
) {
  // 1. Check if order already completed
  const existing = getCompletedOrder(transactionId);
  if (existing) {
    return {
      success: true,
      iccid: existing.iccid,
      message: "Order already completed. No additional purchase made.",
    };
  }

  // 2. Actually attach the purchased bundle
  //    (assign = true, so that the bundle is assigned to the given ICCID)
  const res = await handleEsimOrderApi(bundleName, "transaction", true, iccid);

  // 3. If the API call fails, return an error message
  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to purchase eSIM bundle",
    };
  }

  // 4. Save the completed order in memory (so no double-purchase)
  saveCompletedOrder(transactionId, iccid);

  // 5. Return success plus any relevant data
  return {
    success: true,
    iccid,
    message: "Bundle purchased successfully.",
  };
}

export async function checkEsimCompatibility(iccid: string, bundle: string) {
  try {
    // Call your existing function
    const result = await handleEsimCompatibility(iccid, bundle);

    // Return the same structure or handle errors as needed
    return result;
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error while checking eSIM compatibility",
    };
  }
}
