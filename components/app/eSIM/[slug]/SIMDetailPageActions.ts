// app/eSIM/[slug]/SIMDetailPageActions.ts
"use server";

import { NetworkInfo, ProcessedBundle } from "@/lib/types";
import {
  getEntityDataFromAPI,
  getCountryNetworkDataFromAPI,
} from "@/utils/esim-api/Networks";

export async function getEntityData(
  slug: string
): Promise<ProcessedBundle[] | null> {
  return await getEntityDataFromAPI(slug);
}

export async function getCountryNetworkData(
  isoCode: string | null
): Promise<NetworkInfo[] | null> {
  return await getCountryNetworkDataFromAPI(isoCode);
}
