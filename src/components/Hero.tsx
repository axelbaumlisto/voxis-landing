"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Download, BookOpen } from "lucide-react";
import Container from "./ui/Container";
import LavaLampBg from "./LavaLampBg";
import DownloadDialog from "./DownloadDialog";
import { DUR, EASE_OUT_EXPO } from "../lib/motion";

interface HeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  downloadText: string;
  docsText: string;
  titleClassName?: string;
  lang: "en" | "ru";
}

export default function Hero({ badge, title, description, downloadText, docsText, titleClassName = "tracking-tighter", lang }: HeroProps) {
  const reduce = useReducedMotion();
  const [dlOpen, setDlOpen] = useState(false);
  // Progressive enhancement: text is always painted (opacity:1). Only translate for the slide-up.
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { y: 24, opacity: 0.001 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: DUR.slow, delay, ease: EASE_OUT_EXPO },
        };

  return (
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-[68vh]">
      <LavaLampBg />
      {/* readability scrim: гасит центр blob'а под текстом, края лавы остаются видны */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.32) 55%, transparent 100%)",
        }}
      />

      <Container width="prose" className="relative z-[1] flex flex-col items-center">
        <motion.div {...rise(0)} className="badge mb-[var(--space-lg)]">
          <motion.span
            className="badge-dot"
            animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
            transition={reduce ? {} : { duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
          />
          {badge}
        </motion.div>

        {/* SectionHeading exception: hero keeps separate motion.h1/motion.p for gradient text + staggered rise. */}
        <motion.h1
          {...rise(0.05)}
          className={`text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)] font-extrabold ${titleClassName} mb-[var(--space-md)] text-gradient`}
        >
          {title}
        </motion.h1>

        <motion.p
          {...rise(0.1)}
          className="text-[length:var(--text-lead)] leading-[var(--text-lead--line-height)] text-white/90 mb-[var(--space-xl)] font-normal"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          {description}
        </motion.p>

        <motion.div {...rise(0.15)} className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <button type="button" onClick={() => setDlOpen(true)} className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {downloadText}
          </button>
          <a href="https://docs.voxis.top" className="btn-base btn-secondary">
            <BookOpen className="w-5 h-5" /> {docsText}
          </a>
        </motion.div>
      </Container>

      <DownloadDialog open={dlOpen} onClose={() => setDlOpen(false)} lang={lang} />
    </section>
  );
}
