import { handleEsimOrderApi } from "@/utils/esim-api/EsimAndOrder";

import { isError } from "@/utils/isError";
import { getCompletedOrder, saveCompletedOrder } from "@/utils/orderCheck";

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
    if (isError(error)) {
      console.error(error.message);
    } else {
      console.error("Unknown error validating bundle availability");
    }
  }
}

export async function purchaseBundle(
  bundleName: string,
  transactionId: string
) {
  const existing = getCompletedOrder(transactionId);
  if (existing) {
    return {
      success: true,
      iccid: existing.iccid,
      message: "Order already completed. No additional purchase made.",
    };
  }

  const result = await handleEsimOrderApi(bundleName, "transaction", true);
  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to purchase bundle",
    };
  }

  saveCompletedOrder(transactionId, result.iccid);

  return {
    success: true,
    iccid: result.iccid,
    orderReference: result.orderReference,
  };
}
