"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, BookOpen } from "lucide-react";
import Container from "./ui/Container";
import LavaLampBg from "./LavaLampBg";

interface HeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  downloadText: string;
  docsText: string;
  titleClassName?: string;
}

export default function Hero({ badge, title, description, downloadText, docsText, titleClassName = "tracking-tighter" }: HeroProps) {
  const reduce = useReducedMotion();
  // Progressive enhancement: text is always painted (opacity:1). Only translate for the slide-up.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: 24, opacity: 0.001 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.8, delay, ease: "easeOut" as const },
        };

  return (
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-[68vh] pt-24 pb-16">
      <LavaLampBg />
      {/* readability scrim: гасит центр blob'а под текстом, края лавы остаются видны */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
        }}
      />

      <Container width="prose" className="relative z-[1] flex flex-col items-center">
        <motion.div {...rise(0)} className="badge mb-[var(--space-lg)]">
          <span className="badge-dot animate-pulse" />
          {badge}
        </motion.div>

        {/* SectionHeading exception: hero keeps separate motion.h1/motion.p for gradient text + staggered rise. */}
        <motion.h1
          {...rise(0.05)}
          className={`text-5xl md:text-8xl font-extrabold ${titleClassName} mb-[var(--space-md)] text-gradient`}
        >
          {title}
        </motion.h1>

        <motion.p
          {...rise(0.1)}
          className="text-lg md:text-2xl text-white/90 mb-[var(--space-xl)] font-normal"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
        >
          {description}
        </motion.p>

        <motion.div {...rise(0.15)} className="flex flex-col sm:flex-row gap-[var(--space-sm)]">
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {downloadText}
          </a>
          <a href="https://docs.voxis.top" className="btn-base btn-secondary">
            <BookOpen className="w-5 h-5" /> {docsText}
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
