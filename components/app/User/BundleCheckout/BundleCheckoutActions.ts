// components/app/User/BundleCheckout/fetchActions.ts

import { ProcessedBundle } from "@/lib/types";
import { getEntityDataFromAPI } from "@/utils/esim-api/Networks";

export async function getAvailableBundles(
  slug: string
): Promise<ProcessedBundle[] | null> {
  return await getEntityDataFromAPI(slug);
}
