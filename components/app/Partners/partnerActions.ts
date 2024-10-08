/* eslint-disable @typescript-eslint/no-explicit-any */
// serverActions.ts
"use server";

import { z } from "zod";
import { validate as validateBitcoinAddress } from "bitcoin-address-validation";
import Partner from "@/models/partner";
import Order from "@/models/order";
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

export async function fetchEarningsFromDB(btcAddress: string) {
  try {
    await connectToDatabase();

    // Find partner
    const partnerData = await Partner.findOne({ payoutAddress: btcAddress });
    if (!partnerData) {
      return { earnings: 0, partnerNotFound: true };
    }

    // Fetch orders
    const orders = await Order.find({ partnerCode: partnerData.custom_code });

    // Calculate earnings
    const totalEarnings = orders.reduce((acc, order) => {
      return acc + order.paidSatoshis * 0.15;
    }, 0);

    return { earnings: totalEarnings, partnerNotFound: false };
  } catch (error: any) {
    throw new Error(error.message);
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
