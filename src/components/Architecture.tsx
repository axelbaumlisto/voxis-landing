"use client";

import { motion } from "framer-motion";
import { Mic, Zap, Brain, Keyboard, Terminal, Cpu, Sparkles } from "lucide-react";
import type { Step, IconKey } from "../data/architecture";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DUR, EASE_OUT_EXPO } from "../lib/motion";

export interface ArchIntl {
  title: string;
  subtitle: string;
  pipelineLabel: string;
  pathTitle: string;
  /** Formats the stage-count badge, e.g. (6) => "6 stages" / "6 этапов". */
  stagesLabel: (n: number) => string;
}

interface ArchitectureProps {
  steps: Step[];
  intl: ArchIntl;
}

const IconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  cpu: Cpu,
  mic: Mic,
  zap: Zap,
  brain: Brain,
  keyboard: Keyboard,
  sparkles: Sparkles,
};

export default function Architecture({ steps, intl }: ArchitectureProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // SSR-safe reduced-motion guard: desktop gets the composed dashboard, while
  // reduced-motion keeps the simpler always-visible stack.
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section id="architecture" className="relative w-full scroll-mt-24 md:scroll-mt-28 bg-black py-[var(--space-2xl)] md:py-[var(--space-5xl)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(180deg,rgba(9,9,11,0.45),#000_70%)]" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

      <div className={reduce ? "relative z-10 block" : "relative z-10 block md:hidden"}>
        <BentoStack steps={steps} intl={intl} />
      </div>

      {isDesktop && !reduce && (
        <ArchitectureDashboard steps={steps} intl={intl} />
      )}
    </section>
  );
}

function ArchitectureDashboard({ steps, intl }: { steps: Step[]; intl: ArchIntl }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1180px] px-6 lg:px-10">
      <div className="text-center mb-[var(--space-2xl)]">
        <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-[var(--color-muted-3)] font-mono mb-3">
          {intl.subtitle}
        </p>
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">
          {intl.title}
        </h2>
      </div>

      <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-6 lg:gap-8 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
          className="relative min-h-[620px] rounded-[var(--glass-radius-lg)] border border-[var(--color-accent)]/35 bg-black/55 shadow-[0_0_90px_rgba(34,211,238,0.14)] overflow-hidden"
        >
          <div className="absolute inset-0 pcb-grid opacity-[0.07]" aria-hidden />
          <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-accent)]/18 blur-3xl" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.045] via-transparent to-black/40" aria-hidden />

          <div className="relative z-10 h-full p-7 lg:p-8 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--color-accent)] font-bold mb-2">{intl.pipelineLabel}</div>
                <div className="text-2xl font-extrabold text-white tracking-tight">{intl.pathTitle}</div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-mono text-zinc-400">
                {intl.stagesLabel(steps.length)}
              </div>
            </div>

            <div className="relative flex-1 rounded-[var(--glass-radius)] border border-white/10 bg-black/35 p-5 overflow-hidden">
              <div className="absolute left-[29px] top-12 bottom-12 w-px bg-gradient-to-b from-[var(--color-accent)]/0 via-[var(--color-accent)]/50 to-[var(--color-accent)]/0" aria-hidden />
              <div className="relative z-10 grid h-full grid-rows-6 gap-3">
                {steps.map((step, i) => {
                  const Icon = IconMap[step.iconName];
                  return (
                    <motion.div
                      key={step.className}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: DUR.fast, delay: i * 0.035, ease: EASE_OUT_EXPO }}
                      className="grid grid-cols-[48px_1fr] gap-3 items-center min-h-0"
                    >
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-[0_0_24px_rgba(34,211,238,0.16)]">
                        {Icon && <Icon className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[var(--color-accent)]/85 font-bold mb-0.5 truncate">
                          {step.subtitle}
                        </div>
                        <div className="text-sm font-extrabold text-white truncate">{step.title}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <StageCard key={step.className} step={step} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StageCard({ step, index }: { step: Step; index: number }) {
  const Icon = IconMap[step.iconName];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.base, delay: index * 0.035, ease: EASE_OUT_EXPO }}
      className="group relative min-h-[198px] rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.025] overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.38)]"
    >
      <div className="absolute inset-0 pcb-grid opacity-[0.055]" aria-hidden />
      <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-[var(--color-accent)]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-70" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent" aria-hidden />

      <div className="relative z-10 p-5 lg:p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-3 text-[var(--color-accent)] shadow-[0_0_26px_rgba(34,211,238,0.14)]">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-accent)]/85 font-bold mb-1">
              {step.subtitle}
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight">{step.title}</h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-zinc-300 font-light mb-5 line-clamp-3">
          {step.desc}
        </p>

        <div className={`pill-code w-full mt-auto ${step.iconColor}`}>
          <span className="pill-code__type" title={step.className}>{step.className}</span>
          <span className="pill-code__path" title={step.filePath}>{step.filePath.split("/").pop()}</span>
        </div>
      </div>
    </motion.article>
  );
}

function BentoStack({ steps, intl }: { steps: Step[]; intl: ArchIntl }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-0 md:py-[var(--space-3xl)] gap-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{intl.title}</h2>
        <p className="text-zinc-400 mt-2">{intl.subtitle}</p>
      </div>
      {steps.map((step, i) => {
        const Icon = IconMap[step.iconName];
        return (
          <div key={i} className={`w-full max-w-lg bg-black/60 backdrop-blur-xl rounded-[var(--glass-radius)] border border-white/10 shadow-2xl relative overflow-hidden ${step.glow}`}>
            <div className="absolute inset-0 pcb-grid opacity-10"></div>
            <div className="relative z-10 p-6 flex flex-col items-start text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-black/50 border border-white/10 ${step.iconColor}`}>
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: step.hex }}>
                    {step.subtitle}
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed font-light mb-4">{step.desc}</p>
              <div className={`pill-code w-full mt-auto ${step.iconColor}`}>
                <span className="pill-code__type" title={step.className}>{step.className}</span>
                <span className="pill-code__path" title={step.filePath}>
                  {step.filePath.split("/").pop()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
