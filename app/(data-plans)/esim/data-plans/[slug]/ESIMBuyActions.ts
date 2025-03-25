"use server";
import { handleEsimOrderApi } from "@/utils/esim-api/EsimAndOrder";

import { isError } from "@/utils/isError";
import { getCompletedOrder, saveCompletedOrder } from "@/utils/orderCheck";
import { connectToDatabase } from "@/utils/mongodb";
import Order from "@/models/order";
import { getPrice } from "@/utils/lightning";

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

export async function purchaseBundle(
  bundleName: string,
  paymentHash: string,
  paidDollar?: number | null,
  refCode?: string | null
) {
  // Check if already completed to avoid duplicate purchases
  const existing = getCompletedOrder(paymentHash);
  if (existing) {
    return {
      success: true,
      iccid: existing.iccid,
      message: "Order already completed. No additional purchase made.",
    };
  }

  // Complete the main eSIM purchase
  const result = await handleEsimOrderApi(bundleName, "transaction", true);
  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to purchase bundle",
    };
  }

  // Record the completed purchase immediately to avoid duplicates
  saveCompletedOrder(paymentHash, result.iccid);

  // Prepare successful response - we'll return this regardless of affiliate processing
  const successResponse = {
    success: true,
    iccid: result.iccid,
    orderReference: result.orderReference,
  };

  // Handle affiliate commission tracking separately from the main purchase flow
  if (refCode) {
    // Use setTimeout to process asynchronously so it doesn't block the response
    // and doesn't affect the main purchase flow if it fails
    setTimeout(async () => {
      try {
        await connectToDatabase();

        const satsPerDollar = await getPrice();
        if (satsPerDollar === null) {
          console.error(
            "Failed to fetch the Bitcoin price for affiliate commission."
          );
          return; // Exit the async function
        }

        if (!paidDollar) {
          console.error("Missing payment amount for commission calculation");
          return; // Skip commission if we don't have a valid amount
        }

        const paidSatoshis = Math.round(paidDollar * satsPerDollar);

        const newOrder = new Order({
          partnerCode: refCode,
          amount: paidSatoshis,
          orderType: "esim",
        });

        await newOrder.save();
        console.log(
          `Successfully recorded eSIM affiliate commission for partner: ${refCode}`
        );
      } catch (error) {
        console.error("Error processing affiliate commission:", error);
        // Errors here won't affect the main purchase flow
      }
    }, 100); // Very short timeout to make it asynchronous
  }

  // Return success response immediately regardless of affiliate processing
  return successResponse;
}
