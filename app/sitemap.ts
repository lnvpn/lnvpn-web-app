import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: "https://lnvpn.net",
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://lnvpn.net/esim",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lnvpn.net/phone-numbers",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lnvpn.net/faq",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lnvpn.net/partners",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://lnvpn.net/api/documentation",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
