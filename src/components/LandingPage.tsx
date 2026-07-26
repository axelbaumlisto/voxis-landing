"use client";

import { MotionConfig } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Architecture from "./Architecture";
import Features from "./Features";
import Showcase from "./Showcase";
import GetStarted from "./GetStarted";
import DownloadCta from "./DownloadCta";
import Faq from "./Faq";
import Footer from "./Footer";
import { stepsEn, stepsRu } from "../data/architecture";

export default function LandingPage({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  
  const navLinks = isRu
    ? { architecture: "Архитектура", download: "Скачать", docs: "Документация", github: "GitHub" }
    : { architecture: "Architecture", download: "Download", docs: "Documentation", github: "GitHub" };

  const heroProps = isRu
    ? {
        badge: "Tauri v2 + Ядро на Rust",
        title: <>Диктуй код. <br /> Пиши со скоростью мысли.</>,
        description: "Приватная по дизайну десктопная диктовка: аудио идёт напрямую в ваш Whisper endpoint — без аккаунта Voxis, прокси и телеметрии.",
        downloadText: "Скачать бесплатно",
        docsText: "Документация",
        trustItems: ["MIT open source", "Свой Groq-ключ или self-host", "Windows / macOS / Linux"],
        titleClassName: "tracking-tight",
      }
    : {
        badge: "Tauri v2 + Rust Core",
        title: <>Speak your code. <br /> Write at lightspeed.</>,
        description: "Private-by-design desktop dictation: audio goes directly to your Whisper endpoint — no Voxis account, proxy, or telemetry.",
        downloadText: "Download free",
        docsText: "Read Docs",
        trustItems: ["MIT open source", "Bring your own Groq key or self-host", "Windows / macOS / Linux"],
      };

  const archIntl = isRu
    ? {
        title: "Архитектура системы",
        subtitle: "SOLID-архитектура на Rust",
        pipelineLabel: "Пайплайн",
        pathTitle: "Один чёткий путь",
        stagesLabel: (n: number) => `${n} этапов`,
      }
    : {
        title: "System Architecture",
        subtitle: "SOLID Rust Architecture",
        pipelineLabel: "Pipeline",
        pathTitle: "One clean path",
        stagesLabel: (n: number) => `${n} stages`,
      };

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen relative flex flex-col items-center bg-black w-full">
        <Navbar lang={lang} links={navLinks} />
        <Hero {...heroProps} lang={lang} />
        <HowItWorks lang={lang} />
        <Features lang={lang} />
        <Showcase lang={lang} />
        <GetStarted lang={lang} />
        <DownloadCta lang={lang} />
        <Faq lang={lang} />
        <Architecture steps={isRu ? stepsRu : stepsEn} intl={archIntl} />
        <Footer lang={lang} />
      </main>
    </MotionConfig>
  );
}
