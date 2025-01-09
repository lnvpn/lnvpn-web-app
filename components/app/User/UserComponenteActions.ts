"use server";

import {
  handleEsimCompatibility,
  handleEsimOrderApi,
  handleEsimRefresh,
} from "@/utils/esim-api/EsimAndOrder";
import { isError } from "@/utils/isError";

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
  iccid: string
) {
  // We set assign = true because we want to actually attach the purchased bundle
  return await handleEsimOrderApi(bundleName, "transaction", true, iccid);
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
