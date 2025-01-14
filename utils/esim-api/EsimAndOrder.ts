"use server";

import { EsimBundleResponse, EsimData } from "@/lib/types";

export async function handleEsimOrderApi(
  bundleName: string,
  requestType: "validate" | "transaction",
  assign: boolean,
  iccid?: string
) {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  const url = `${baseUrl}/orders`;

  // Build the "Order" item. If we have an ICCID, we include it:
  const orderItem: any = {
    type: "bundle",
    quantity: 1,
    item: bundleName,
  };

  if (iccid) {
    // Assign this bundle to an existing eSIM
    orderItem.iccids = [iccid];
    // Usually you'd set allowReassign to false if you don't want a new eSIM
    orderItem.allowReassign = true;
  }

  // Build the full payload
  const payload = {
    type: requestType, // "validate" or "transaction"
    assign, // must be true if we want to attach to eSIM
    Order: [orderItem],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to complete eSIM request");
    }

    const data = await response.json();
    console.log("data", data);
    if (!data?.order || !Array.isArray(data.order) || data.order.length === 0) {
      throw new Error(data?.message || "No order info returned from server");
    }

    // ----------- Validate -----------
    if (requestType === "validate") {
      if (typeof data.order[0].subTotal !== "number") {
        throw new Error(`Bundle not available: ${bundleName}`);
      }
      return {
        success: true,
        subTotal: data.order[0].subTotal,
      };
    }

    // ----------- Transaction -----------
    if (requestType === "transaction") {
      if (data?.status !== "completed") {
        throw new Error(
          data?.statusMessage || "Transaction did not complete successfully"
        );
      }
      // e.g. return the assigned ICCID:
      const iccidResult = data.order[0].iccids?.[0];
      return {
        success: true,
        iccid: iccidResult,
        status: data.status,
        orderReference: data.orderReference,
      };
    }

    // Fallback
    return {
      success: false,
      message: "Invalid requestType",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error while calling eSIM API",
    };
  }
}

export async function handleEsimRefresh(iccid: string) {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  // Construct the refresh URL
  const url = `${baseUrl}/esims/${iccid}/refresh`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Extract the error (if present)
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to refresh eSIM");
    }

    // Return JSON response
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Unknown error while refreshing eSIM");
  }
}

export async function handleEsimCompatibility(iccid: string, bundle: string) {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  // Construct the compatibility URL
  const url = `${baseUrl}/esims/${iccid}/compatible/${bundle}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Attempt to parse error details
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = {};
      }
      throw new Error(
        errorBody.message || "Failed to check eSIM compatibility"
      );
    }

    // Parse the JSON response, which should look like { "compatible": true }
    const data = await response.json();

    // Return a structured object, e.g. success + the compatibility
    return {
      success: true,
      compatible: data.compatible,
    };
  } catch (error: any) {
    // Return a structured error response
    return {
      success: false,
      message:
        error.message || "Unknown error while checking eSIM compatibility",
    };
  }
}

/**
 * Fetch eSIM data from your provider’s API
 * @param iccid - ICCID string
 * @returns EsimData | throws Error
 */

export async function fetchEsimDataFromApi(iccid: string): Promise<EsimData> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  const url = `${baseUrl}/esims/${iccid}?additionalFields=appleInstallUrl`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // could be 403, 404, etc.
      const errBody = await res.json();
      throw new Error(errBody.message || "Failed to fetch eSIM data");
    }

    const data = (await res.json()) as EsimData;
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Unknown error fetching eSIM data");
  }
}

/**
 * Fetch all bundles for a given ICCID, including used bundles
 * @param iccid - The ICCID for the eSIM
 * @returns EsimBundleResponse
 * @throws Error if the request fails
 */
export async function fetchEsimBundlesFromApi(
  iccid: string
): Promise<EsimBundleResponse> {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  const url = `${baseUrl}/esims/${iccid}/bundles?includeUsed=true&limit=200`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      // e.g., 403 => "Access denied"
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || "Failed to fetch eSIM bundles");
    }

    const data = (await res.json()) as EsimBundleResponse;
    return data;
  } catch (error: any) {
    throw new Error(error.message ?? "Unknown error fetching eSIM bundles");
  }
}
