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
      subTotal: result.subTotal,
    };
  } catch (error: unknown) {
    if (isError(error)) {
      console.error(error.message);
    } else {
      console.error("Unknown error validating bundle availability");
    }
  }
}

export async function purchaseBundle(bundleName: string, paymentHash: string) {
  console.log("purchaseBundle invoked with transactionId:", paymentHash);
  const existing = getCompletedOrder(paymentHash);
  if (existing) {
    console.log("Transaction already completed for:", paymentHash);
    return {
      success: true,
      iccid: existing.iccid,
      message: "Order already completed. No additional purchase made.",
    };
  }
  console.log("Creating new eSIM for transactionId:", paymentHash);
  const result = await handleEsimOrderApi(bundleName, "transaction", true);
  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to purchase bundle",
    };
  }

  saveCompletedOrder(paymentHash, result.iccid);

  return {
    success: true,
    iccid: result.iccid,
    orderReference: result.orderReference,
  };
}
