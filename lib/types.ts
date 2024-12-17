// lib/types.ts
export interface NetworkInfo {
  name: string;
  mcc?: string;
  mnc?: string;
  // Add other fields if needed
}

export interface CountryNetworks {
  name: string; // The country code or identifier (e.g. "US", "DE", "US-HI")
  networks: NetworkInfo[];
}

export interface NetworksResponse {
  countryNetworks: CountryNetworks[];
}
