/* eslint-disable @typescript-eslint/no-explicit-any */
// serverActions.ts
"use server";

import { z } from "zod";
import { validate as validateBitcoinAddress } from "bitcoin-address-validation";
import Partner from "@/models/partner";
import Order from "@/models/order";
import Decimal from "decimal.js";
import { connectToDatabase } from "@/utils/mongodb";

// Zod schemas
const registrationSchema = z.object({
  custom_code: z.string().min(2, {
    message: "Referral code must be at least 2 characters.",
  }),
  payoutAddress: z
    .string()
    .refine((address) => validateBitcoinAddress(address), {
      message: "Invalid Bitcoin Address.",
    }),
});

const checkEarningsSchema = z.object({
  payoutAddress: z
    .string()
    .refine((address) => validateBitcoinAddress(address), {
      message: "Invalid Bitcoin Address.",
    }),
});

export async function registerPartner(formData: FormData) {
  const custom_code = formData.get("custom_code") as string;
  const payoutAddress = formData.get("payoutAddress") as string;

  // Validate data
  const parseResult = registrationSchema.safeParse({
    custom_code,
    payoutAddress,
  });

  if (!parseResult.success) {
    const error = parseResult.error.errors[0].message;
    return { success: false, error };
  }

  await connectToDatabase();

  // Check for existing partner code
  const existingPartner = await Partner.findOne({ custom_code });

  if (existingPartner) {
    return { success: false, error: "Referral code already exists." };
  }

  // Save new partner
  await Partner.create({
    custom_code,
    payoutAddress,
  });

  return { success: true };
}

export async function fetchEarningsFromDB(
  btcAddress: string
): Promise<{ earnings: number; partnerNotFound: boolean }> {
  try {
    await connectToDatabase();

    // Find partner
    const partnerData = await Partner.findOne({ payoutAddress: btcAddress });
    if (!partnerData) {
      return { earnings: 0, partnerNotFound: true };
    }

    // Calculate earnings using aggregation
    const result = await Order.aggregate([
      { $match: { partnerCode: partnerData.custom_code } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$amount" },
        },
      },
    ]);

    const totalSatoshisPaid = result.length ? result[0].totalEarnings : 0;
    const totalEarnings = new Decimal(totalSatoshisPaid)
      .times(0.15)
      .floor()
      .toNumber();

    return { earnings: totalEarnings, partnerNotFound: false };
  } catch (error: any) {
    console.error("Error fetching earnings:", error);
    throw new Error("An error occurred while fetching earnings.");
  }
}

export async function checkEarnings(formData: FormData) {
  const payoutAddress = formData.get("payoutAddress") as string;

  // Validate address
  const parseResult = checkEarningsSchema.safeParse({ payoutAddress });

  if (!parseResult.success) {
    const error = parseResult.error.errors[0].message;
    return { success: false, error };
  }

  const result = await fetchEarningsFromDB(payoutAddress);

  if (result.partnerNotFound) {
    return {
      success: false,
      error: "No partner found with this Bitcoin address.",
    };
  }

  return { success: true, earnings: result.earnings };
}
