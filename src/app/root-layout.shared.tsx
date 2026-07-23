import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export function buildMetadata(lang: "en" | "ru"): Metadata {
  const isRu = lang === "ru";
  const title = isRu ? "Voxis — Диктуй код. Пиши со скоростью мысли." : "Voxis — Speak your code. Write at lightspeed.";
  const description = isRu
    ? "Абсолютно приватный, молниеносный десктопный движок для диктовки на Tauri v2, Rust и Whisper AI."
    : "A completely private, blazing fast desktop voice dictation engine built with Tauri v2, Rust, and Whisper AI.";
  const canonical = isRu ? "https://voxis.top/ru" : "https://voxis.top";
  return {
    title,
    description,
    keywords: ["voice dictation", "speech to text", "Tauri", "Rust", "Whisper", "Groq", "desktop app"],
    alternates: {
      canonical,
      languages: { en: "https://voxis.top", ru: "https://voxis.top/ru" },
    },
    metadataBase: new URL("https://voxis.top"),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Voxis",
      type: "website",
      locale: isRu ? "ru_RU" : "en_US",
      alternateLocale: isRu ? "en_US" : "ru_RU",
      // Absolute URL so scrapers that don't resolve relative paths still fetch
      // it. Served by the generated route src/app/opengraph-image.tsx (1200x630).
      images: [{ url: "https://voxis.top/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: isRu ? "Voxis — Диктуй код" : "Voxis — Speak your code",
      description: isRu
        ? "Абсолютно приватный, молниеносный десктопный движок для диктовки."
        : "A completely private, blazing fast desktop voice dictation engine.",
      images: ["https://voxis.top/opengraph-image"],
    },
  };
}

export const metadata: Metadata = buildMetadata("en");

interface RootDocumentProps {
  lang: "en" | "ru";
  children: ReactNode;
}

// SoftwareApplication structured data (free OSS desktop app). Lets Google render
// rich results (category, OS, price=0, license) and reinforces the OSS signal.
const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Voxis",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Windows, macOS, Linux",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
  url: "https://voxis.top",
  image: "https://voxis.top/opengraph-image",
  sameAs: ["https://github.com/axelbaumlisto/voxis"],
};

export function RootDocument({ lang, children }: RootDocumentProps) {
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
