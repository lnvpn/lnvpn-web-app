// app/utils/vpnUtils.ts

import dayjs from "dayjs";

export const parseDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MMM-DD hh:mm:ss A");
};

export interface ServerInfo {
  ip: string;
  location: string;
}

export const mapCountryToServerUrl = (countryCode: string): string | null => {
  const countryServerMap: { [key: string]: string } = {
    "4": process.env.IP_UK!, // United Kingdom
    "5": process.env.IP_CANADA!, // Canada
    "6": process.env.IP_IND!, // India
    "7": process.env.IP_NLD!, // Netherlands
    "8": process.env.IP_RUS!, // Russia
    "9": process.env.IP_UKR!, // Ukraine
    "11": process.env.IP_ISR!, // Israel
    "12": process.env.IP_KAZ!, // Kazakhstan
    "13": process.env.IP_USA2!, // United States
    "16": process.env.IP_PRT!, // Portugal
    "18": process.env.IP_ISL!, // Iceland
    "19": process.env.IP_AUS!, // Australia
    "20": process.env.IP_CRI!, // Costa Rica
  };

  const serverUrl = countryServerMap[countryCode];
  if (!serverUrl) {
    console.error(`Error with country code: ${countryCode}`);
    return null;
  }
  return serverUrl;
};

interface DurationMapping {
  selectedValue: number;
  amount: number;
  unit: dayjs.ManipulateType;
}

const durationMappings: DurationMapping[] = [
  {
    selectedValue: Number(process.env.NEXT_PUBLIC_price_hour),
    amount: 1,
    unit: "hour",
  },
  {
    selectedValue: Number(process.env.NEXT_PUBLIC_price_day),
    amount: 1,
    unit: "day",
  },
  {
    selectedValue: Number(process.env.NEXT_PUBLIC_price_week),
    amount: 1,
    unit: "week",
  },
  {
    selectedValue: Number(process.env.NEXT_PUBLIC_price_month),
    amount: 1,
    unit: "month",
  },
  {
    selectedValue: Number(process.env.NEXT_PUBLIC_price_quarter),
    amount: 3,
    unit: "month",
  },
];

export const getExpiryDate = (selectedDuration: number): Date => {
  const now = dayjs();

  const mapping = durationMappings.find(
    (m) => m.selectedValue === selectedDuration
  );

  let expiryDate: dayjs.Dayjs;

  if (mapping) {
    expiryDate = now.add(mapping.amount, mapping.unit);
  } else {
    // Default to adding selectedDuration as hours
    expiryDate = now.add(selectedDuration, "hour");
  }

  return expiryDate.toDate();
};
