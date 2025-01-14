"use server";

import { EsimBundleResponse, EsimData } from "@/lib/types";
import {
  fetchEsimBundlesFromApi,
  fetchEsimDataFromApi,
} from "@/utils/esim-api/EsimAndOrder";

export async function fetchEsimData(iccid: string): Promise<EsimData> {
  return await fetchEsimDataFromApi(iccid);
}

export async function fetchEsimBundles(
  iccid: string
): Promise<EsimBundleResponse> {
  return await fetchEsimBundlesFromApi(iccid);
}
