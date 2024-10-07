"use server";

interface PriceData {
  USD: {
    buy: number;
    [key: string]: number;
  };
  [key: string]: { buy: number };
}

// Define the interface for the response from the create invoice API
interface CreateInvoiceResponse {
  payment_hash: string;
  payment_request: string;
  value: number;
  // Include other fields if needed
}

// Function to create an invoice
export async function getInvoice(
  amount: number,
  memo: string
): Promise<{
  payment_hash: string;
  payment_request: string;
  payment_amount_msat: number;
}> {
  // Get the satoshis per USD from the getPrice function
  const satoshisPerUsd = await getPrice();
  if (satoshisPerUsd === null) {
    throw new Error("Could not get satoshis per USD from getPrice()");
  }

  // Calculate the amount in satoshis
  const amountInSatoshis = Math.round(satoshisPerUsd * amount);

  // Ensure the API access token is available
  const accessToken = process.env.API_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Environment variable API_ACCESS_TOKEN is not defined.");
  }

  try {
    // Make the POST request to create an invoice
    const response = await fetch("https://api.getalby.com/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: amountInSatoshis,
        description: memo,
      }),
    });

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating invoice:", errorData);
      throw new Error(
        `Error creating invoice: ${response.status} ${response.statusText}`
      );
    }

    // Parse the JSON response
    const data: CreateInvoiceResponse = await response.json();

    // Return the payment hash and payment request
    return {
      payment_hash: data.payment_hash,
      payment_request: data.payment_request,
      payment_amount_msat: data.value,
    };
  } catch (error) {
    console.error("Error in getInvoice:", error);
    throw error;
  }
}

interface InvoiceData {
  settled: boolean;
}

export async function checkInvoice(hash: string): Promise<InvoiceData | false> {
  const accessToken = process.env.API_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Environment variable API_ACCESS_TOKEN is not defined.");
  }

  try {
    const response = await fetch(`https://api.getalby.com/invoices/${hash}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error("Error fetching invoice:", errorData);
      throw new Error(
        `Error fetching invoice: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.settled === true) {
      // Return the data you need
      return { settled: data.settled };
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Could not checkInvoice: ${error}`);
    return false;
  }
}

export async function getPrice(): Promise<number | null> {
  try {
    const apiUrl = process.env.URL_PRICE_API;
    if (!apiUrl) {
      throw new Error("Environment variable URL_PRICE_API is not defined.");
    }

    const response = await fetch(apiUrl);
    const data: PriceData = await response.json();

    if (!data.USD || typeof data.USD.buy !== "number") {
      throw new Error("Invalid data format received from API.");
    }

    return 100_000_000 / data.USD.buy;
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
}
