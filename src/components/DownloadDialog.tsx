"use client";

import { useEffect, useRef } from "react";
import { Apple, MonitorDown, Terminal, X } from "lucide-react";
import { DOWNLOADS, RELEASES_URL } from "../lib/downloads";

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
        sub: "Последний билд под вашу ОС — начнётся сразу.",
        win: "Windows",
        mac: "macOS",
        linux: "Linux",
        winSub: "Портативный .exe · Windows 10+",
        macSub: "Бинарь · Apple Silicon",
        linuxSub: "Бинарь · x64",
        more: "Все пакеты и установщики (.deb, .rpm, setup.exe) на GitHub →",
        close: "Закрыть",
      }
    : {
        title: "Download Voxis",
        sub: "The latest build for your OS — starts right away.",
        win: "Windows",
        mac: "macOS",
        linux: "Linux",
        winSub: "Portable .exe · Windows 10+",
        macSub: "Binary · Apple Silicon",
        linuxSub: "Binary · x64",
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[var(--space-md)]"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      {/* panel */}
      <div
        className="relative w-full max-w-md rounded-[var(--glass-radius)] border border-white/10 bg-[#0a0a0c] p-[var(--space-xl)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label={t.close}
          className="absolute right-[var(--space-md)] top-[var(--space-md)] text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold text-white mb-[var(--space-2xs)]">{t.title}</h2>
        <p className="text-zinc-400 text-sm mb-[var(--space-lg)]">{t.sub}</p>

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
  );
}
