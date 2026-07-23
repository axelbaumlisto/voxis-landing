import { Apple, MonitorDown, Terminal, KeyRound } from "lucide-react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

import { DOWNLOADS, RELEASES_URL as REL } from "../lib/downloads";

export default function GetStarted({ lang }: { lang: "en" | "ru" }) {
  const isRu = lang === "ru";
  const t = isRu
    ? {
        heading: "Как начать",
        sub: "Установите, добавьте ключ, говорите — три шага.",
        steps: [
          "Скачайте сборку под вашу ОС.",
          "Вставьте бесплатный ключ Groq в Настройки → Провайдер (или укажите свой endpoint).",
          "Зажмите горячую клавишу и говорите — текст появится под курсором.",
        ],
        keyNote:
          "Свой ключ: по умолчанию бесплатный тариф Groq, либо любой OpenAI-совместимый / self-hosted endpoint. Ваше аудио не проходит через наши серверы.",
        req: "Требования: macOS 12+ (Apple Silicon), Windows 10+, современный Linux. Микрофон + интернет для облачной транскрипции.",
        win: "Windows",
        mac: "macOS (Apple Silicon)",
        linux: "Linux",
        winSub: "Портативный .exe",
        macSub: "Бинарь или Homebrew",
        linuxSub: "Бинарь · .deb · .rpm",
        allPackages: "Все пакеты и установщики →",
      }
    : {
        heading: "Get started",
        sub: "Install, add a key, and talk — three steps.",
        steps: [
          "Download the build for your OS.",
          "Paste a free Groq key into Settings → Provider (or point it at your own endpoint).",
          "Hold your hotkey and speak — text appears where your cursor is.",
        ],
        keyNote:
          "Bring your own key: the free Groq tier by default, or any OpenAI-compatible / self-hosted endpoint. Your audio never touches our servers.",
        req: "Requirements: macOS 12+ (Apple Silicon), Windows 10+, modern Linux. Microphone + internet for cloud transcription.",
        win: "Windows",
        mac: "macOS (Apple Silicon)",
        linux: "Linux",
        winSub: "Portable .exe",
        macSub: "Binary or Homebrew",
        linuxSub: "Binary · .deb · .rpm",
        allPackages: "All packages & installers →",
      };

  const platforms = [
    { icon: MonitorDown, name: t.win, sub: t.winSub, href: DOWNLOADS.windows.href, file: DOWNLOADS.windows.file },
    { icon: Apple, name: t.mac, sub: t.macSub, href: DOWNLOADS.macos.href, file: DOWNLOADS.macos.file },
    { icon: Terminal, name: t.linux, sub: t.linuxSub, href: DOWNLOADS.linux.href, file: DOWNLOADS.linux.file },
  ];

  return (
    <section className="section bg-black relative z-10 border-t border-white/5">
      <Container width="page">
        <SectionHeading title={t.heading} subtitle={t.sub} />

        {/* 3-step quickstart */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)] mb-[var(--space-2xl)]">
          {t.steps.map((step, i) => (
            <li key={i} className="flex gap-[var(--space-sm)] items-start">
              <span className="shrink-0 w-8 h-8 grid place-items-center rounded-full border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-bold text-sm">
                {i + 1}
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed pt-1">{step}</p>
            </li>
          ))}
        </ol>

        {/* Per-platform download cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-md)]">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.href}
                download={p.file}
                className="rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] flex flex-col items-center text-center gap-[var(--space-2xs)] hover:border-[var(--color-accent)]/40 transition-colors duration-300"
              >
                <Icon className="w-7 h-7 text-[var(--color-accent)] mb-[var(--space-2xs)]" />
                <span className="text-white font-bold">{p.name}</span>
                <span className="text-zinc-500 text-xs">{p.sub}</span>
              </a>
            );
          })}
        </div>

        {/* Homebrew one-liner */}
        <div className="mt-[var(--space-md)] text-center">
          <code className="inline-block rounded-lg border border-white/10 bg-black/50 px-[var(--space-md)] py-[var(--space-2xs)] text-[var(--color-accent)] text-sm font-mono">
            brew install axelbaumlisto/voxis/voxis
          </code>
        </div>

        <p className="mt-[var(--space-lg)] text-center">
          <a href={REL} className="text-[var(--color-accent)] text-sm hover:underline">
            {t.allPackages}
          </a>
        </p>

        {/* Key model + requirements */}
        <div className="mt-[var(--space-2xl)] max-w-[var(--container-content)] mx-auto flex flex-col gap-[var(--space-sm)]">
          <p className="flex gap-[var(--space-sm)] text-zinc-400 text-sm leading-relaxed">
            <KeyRound className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden />
            <span>{t.keyNote}</span>
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed pl-[calc(1.25rem+var(--space-sm))]">{t.req}</p>
        </div>
      </Container>
    </section>
  );
}
