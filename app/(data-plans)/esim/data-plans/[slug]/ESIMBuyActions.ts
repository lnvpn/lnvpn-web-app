import { handleEsimOrderApi } from "@/utils/esim-api/EsimAndOrder";

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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error validating bundle",
    };
  }
}

export async function purchaseBundle(bundleName: string) {
  try {
    const result = await handleEsimOrderApi(bundleName, "transaction", true);
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to purchase bundle",
      };
    }
    // Transaction completed
    return {
      success: true,
      iccid: result.iccid, // iccid from the response
      orderReference: result.orderReference,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error purchasing bundle",
    };
  }
}
