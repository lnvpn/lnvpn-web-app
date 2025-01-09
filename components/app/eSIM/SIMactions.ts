"use server";

import { NetworksResponse } from "@/lib/types";
import { getNetworksFromAPI } from "@/utils/esim-api/Networks";

export async function getNetworks(): Promise<NetworksResponse | null> {
  return await getNetworksFromAPI();
}
