import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: "https://voxis.top", ru: "https://voxis.top/ru" };
  return [
    {
      url: "https://voxis.top",
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: "https://voxis.top/ru",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
