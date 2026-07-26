"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Apple, MonitorDown, Terminal, X } from "lucide-react";
import { DOWNLOADS, GROQ_KEYS_URL, LATEST_VERSION, RELEASES_URL, REPO_URL, SELF_HOSTED_DOCS_URL } from "../lib/downloads";

interface Props {
  open: boolean;
  onClose: () => void;
  lang: "en" | "ru";
}

export default function DownloadDialog({ open, onClose, lang }: Props) {
  const isRu = lang === "ru";
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const t = isRu
    ? {
        title: "Скачать Voxis",
        sub: "Скачайте Voxis, затем добавьте Groq API key или self-hosted Whisper endpoint в настройках.",
        win: "Windows",
        mac: "macOS",
        linux: "Linux",
        winSub: "Портативный .exe · Windows 10+",
        macSub: "Бинарь · Apple Silicon",
        linuxSub: "Бинарь · x64",
        trust: `${LATEST_VERSION} · MIT open source · GitHub Releases`,
        beta: "Ранние сборки могут показывать предупреждения ОС, пока подпись и notarization финализируются.",
        groq: "Получить Groq key",
        selfhost: "Self-host инструкция",
        source: "Исходный код",
        more: "Все пакеты и установщики (.deb, .rpm, setup.exe) на GitHub →",
        close: "Закрыть",
      }
    : {
        title: "Download Voxis",
        sub: "Install Voxis, then add a Groq API key or self-hosted Whisper endpoint in Settings.",
        win: "Windows",
        mac: "macOS",
        linux: "Linux",
        winSub: "Portable .exe · Windows 10+",
        macSub: "Binary · Apple Silicon",
        linuxSub: "Binary · x64",
        trust: `${LATEST_VERSION} · MIT open source · GitHub Releases`,
        beta: "Early builds may show OS security warnings while signing and notarization are finalized.",
        groq: "Get a Groq key",
        selfhost: "Self-host setup",
        source: "Source",
        more: "All packages & installers (.deb, .rpm, setup.exe) on GitHub →",
        close: "Close",
      };

  const rows = [
    { icon: MonitorDown, name: t.win, sub: t.winSub, d: DOWNLOADS.windows },
    { icon: Apple, name: t.mac, sub: t.macSub, d: DOWNLOADS.macos },
    { icon: Terminal, name: t.linux, sub: t.linuxSub, d: DOWNLOADS.linux },
  ];

  // Esc to close + lock body scroll + focus the close button when opened.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const dialog = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-[var(--space-md)]"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />

      {/* panel: fixed chrome + internal scroll body, so close never scrolls away. */}
      <div
        className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-hidden rounded-[var(--glass-radius)] border border-white/10 bg-[#0a0a0c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-2 top-2 z-20 grid h-11 w-11 place-items-center rounded-full text-zinc-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-[var(--space-lg)] pr-14 sm:p-[var(--space-xl)] sm:pr-16">
          <h2 className="text-xl font-extrabold text-white mb-[var(--space-2xs)]">{t.title}</h2>
          <p className="text-zinc-400 text-sm mb-[var(--space-sm)]">{t.sub}</p>
          <div className="mb-[var(--space-sm)] rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-[var(--space-sm)] py-2 text-xs text-zinc-300">
            {t.trust}
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed mb-[var(--space-md)]">{t.beta}</p>
          <div className="mb-[var(--space-lg)] flex flex-wrap gap-2 text-xs">
            <a href={GROQ_KEYS_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{t.groq}</a>
            <span className="text-zinc-700" aria-hidden>·</span>
            <a href={SELF_HOSTED_DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{t.selfhost}</a>
            <span className="text-zinc-700" aria-hidden>·</span>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{t.source}</a>
          </div>

          <div className="flex flex-col gap-[var(--space-sm)]">
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <a
                  key={r.d.key}
                  href={r.d.href}
                  download={r.d.file}
                  onClick={onClose}
                  className="flex items-center gap-[var(--space-md)] rounded-xl border border-white/10 bg-white/[0.02] p-[var(--space-md)] hover:border-[var(--color-accent)]/50 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-[var(--color-accent)]">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-white font-bold leading-tight">{r.name}</span>
                    <span className="text-zinc-500 text-xs">{r.sub}</span>
                  </span>
                </a>
              );
            })}
          </div>

          <a
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[var(--space-lg)] block text-center text-[var(--color-accent)] text-sm hover:underline"
          >
            {t.more}
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
