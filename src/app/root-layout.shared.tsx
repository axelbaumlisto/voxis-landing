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
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Voxis",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isRu ? "Voxis — Диктуй код" : "Voxis — Speak your code",
      description: isRu
        ? "Абсолютно приватный, молниеносный десктопный движок для диктовки."
        : "A completely private, blazing fast desktop voice dictation engine.",
    },
  };
}

export const metadata: Metadata = buildMetadata("en");

interface RootDocumentProps {
  lang: "en" | "ru";
  children: ReactNode;
}

export function RootDocument({ lang, children }: RootDocumentProps) {
  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
