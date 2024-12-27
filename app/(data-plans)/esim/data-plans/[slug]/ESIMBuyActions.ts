"use server";

export async function validateBundleAvailability(bundleName: string) {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  // NOTE: For demonstration, I’m concatenating `/orders` as you mentioned.
  // If your real endpoint is something else, adjust accordingly.
  const url = `${baseUrl}/orders`;

  // This is the body you described
  const payload = {
    type: "validate",
    assign: true,
    Order: [
      {
        type: "bundle",
        quantity: 1,
        item: bundleName,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // Typically you don't need `next: { revalidate }` here,
      // because this is a direct user action, not a page load.
    });

    if (!response.ok) {
      // This will catch non-2xx statuses, e.g. 400, 500, etc.
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to validate bundle");
    }

    // If the response is successful, parse it
    const data = await response.json();

    // If the bundle is not available, the server typically returns
    // { "message": "Bundle not available: ..." }
    // or does not return a `subTotal`.
    if (!data?.order || !Array.isArray(data.order) || data.order.length === 0) {
      throw new Error(data?.message || "No order info returned from server");
    }

    // The presence of subTotal means the bundle is available
    if (typeof data.order[0].subTotal !== "number") {
      throw new Error(`Bundle not available: ${bundleName}`);
    }
    console.log("Bundle is available");
    // If everything is good, return the relevant fields you need
    return {
      success: true,
    };
  } catch (error: any) {
    // Return something meaningful or re-throw
    return {
      success: false,
      message: error.message || "Unknown error validating bundle",
    };
  }
}

export async function purchaseBundle(bundleName: string, orderId: string) {
  const baseUrl = process.env.ESIM_API_URL;
  const apiKey = process.env.ESIM_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing ESIM_API_URL or ESIM_API_KEY environment variables."
    );
  }

  // NOTE: For demonstration, I’m concatenating `/orders` as you mentioned.
  // If your real endpoint is something else, adjust accordingly.
  const url = `${baseUrl}/orders`;

  // This is the body you described
  const payload = {
    type: "transaction",
    assign: true,
    Order: [
      {
        type: "bundle",
        quantity: 1,
        item: bundleName,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // Typically you don't need `next: { revalidate }` here,
      // because this is a direct user action, not a page load.
    });

    if (!response.ok) {
      // This will catch non-2xx statuses, e.g. 400, 500, etc.
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to validate bundle");
    }
  } catch (error: any) {
    // Return something meaningful or re-throw
    return {
      success: false,
      message: error.message || "Unknown error validating bundle",
    };
  }
}
