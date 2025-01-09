export interface NetworkInfo {
  brandName: string;
  name: string;
  mcc?: string;
  mnc?: string;
  speed: string[];
  tagid?: string;
}

export interface CountryNetworks {
  name: string;
  networks: NetworkInfo[];
}

export interface NetworksResponse {
  countryNetworks: CountryNetworks[];
}

export interface Network {
  brandName: string;
  name: string;
  mcc: string;
  mnc: string;
  tagid: string;
  speed: string[];
}

export interface ProcessedBundle {
  name: string;
  speed: string[];
  description: string;
  dataInGB: number;
  durationInDays: number;
  countryName: string;
  price: number;
  roamingEnabled: RawCountry[];
  unlimited: boolean;
}

export interface CatalogueResponse {
  bundles: RawBundle[];
  pageCount: number;
  rows: number;
  pageSize: number;
}

export interface RawCountry {
  name: string;
  region: string;
  iso: string;
}

export interface RawBundle {
  name: string;
  description: string;
  groups: string[];
  countries: RawCountry[];
  dataAmount: number;
  duration: number;
  speed: string[];
  autostart: boolean;
  unlimited: boolean;
  roamingEnabled: RawCountry[];
  price: number;
  imageUrl?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  slug: string;
}

export interface Region {
  name: string;
  slug: string;
}

export interface EsimData {
  iccid?: string;
  pin?: string;
  puk?: string;
  matchingId?: string;
  smdpAddress?: string;
  profileStatus?: "Released" | "Downloaded" | "Installed" | "Unavailable";
  firstInstalledDateTime?: number;
  customerRef?: string;
  appleInstallUrl?: string;
  message?: string;
}

export interface EsimBundleAssignment {
  id: string;
  callTypeGroup: string;
  initialQuantity: number;
  remainingQuantity: number;
  startTime: string;
  endTime: string;
  assignmentDateTime: string;
  assignmentReference: string;
  bundleState: "active" | "inactive" | string;
  unlimited: boolean;
}

export interface EsimBundle {
  name: string;
  description: string;
  assignments: EsimBundleAssignment[];
}

export interface EsimBundleResponse {
  bundles?: EsimBundle[];
  message?: string; // in case of errors or "Access denied"
}
