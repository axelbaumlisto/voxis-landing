"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, Zap, Brain, Keyboard, Terminal, Cpu } from "lucide-react";
import type { Step, IconKey } from "../data/architecture";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DUR, EASE_OUT_EXPO } from "../lib/motion";

export interface ArchIntl {
  title: string;
  subtitle: string;
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
};

const SPREAD = 620;
const FOCUS_POP = 80;
const EPSILON = 0.4;

function BoardLayer({
  step,
  index,
  scrollYProgress,
  active,
  stepCount,
}: {
  step: Step;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  active: number;
  stepCount: number;
}) {
  const i = index;
  const Icon = IconMap[step.iconName];
  const isActive = i === active;

  const currentZ = useTransform(scrollYProgress, (p) => {
    // Peek from frame one: all 5 layers already spread. Scroll moves focus (fly),
    // not "explode from compacted chip". No global camera offset — the stack is
    // pre-arranged for hero-peek visibility.
    const fly = p * (stepCount - 0.01);
    const distance = i - fly;
    const baseDepth = distance * -SPREAD;
    const pop = Math.abs(distance) < EPSILON ? FOCUS_POP * (1 - Math.abs(distance) / EPSILON) : 0;
    return baseDepth + pop;
  });

  const opacity = useTransform(
    currentZ,
    [-3200, -1600, -700, 0, 180, 420],
    [0.08,   0.28,  0.65, 1, 0.18, 0.06],
    { clamp: true }
  );

  const blurValue = useTransform(
    currentZ,
    [-2000, -500, 0, 200, 500],
    ["blur(12px)", "blur(4px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  return (
    <motion.div
      style={{
        translateZ: currentZ,
        opacity,
        filter: blurValue,
        transformStyle: "preserve-3d",
      }}
      className={`absolute inset-0 rounded-[var(--glass-radius-lg)] border flex items-center justify-center transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]
        ${isActive ? step.glow + " bg-black/95 shadow-[0_30px_60px_rgba(0,0,0,0.8)]" : 'border-white/5 bg-zinc-950/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}
      `}
    >
      <div className="absolute inset-0 pcb-grid opacity-20 rounded-[var(--glass-radius-lg)]"></div>

      <motion.svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60" 
        viewBox="0 0 500 500"
      >
        <defs>
          <marker id={`arrow-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={step.hex} />
          </marker>
        </defs>
        <path d="M 250 100 L 250 170" stroke={step.hex} strokeWidth="3" strokeDasharray="6 6" markerEnd={`url(#arrow-${i})`} />
        <path d="M 250 330 L 250 400" stroke={step.hex} strokeWidth="3" strokeDasharray="6 6" markerEnd={`url(#arrow-${i})`} />
        <path d="M 100 250 L 140 250" stroke={step.hex} strokeWidth="2" opacity="0.5" />
        <path d="M 360 250 L 400 250" stroke={step.hex} strokeWidth="2" opacity="0.5" />
        <circle cx="250" cy="100" r="4" fill={step.hex} />
        <circle cx="250" cy="400" r="4" fill={step.hex} />
      </motion.svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div className="w-32 h-8 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-[10px] font-mono text-zinc-500 mb-8 shadow-inner">
          Input I/O
        </motion.div>

        <div className="flex items-center gap-8 relative z-10">
          <motion.div className="w-12 h-32 bg-white/5 border border-white/10 rounded-md shadow-inner"></motion.div>

          <div className={`w-56 h-56 border-2 ${isActive ? step.glow : 'border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]'} bg-[var(--color-surface-2)] rounded-[var(--glass-radius)] flex flex-col items-center justify-center relative transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]`}>
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-zinc-800"></div>
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-zinc-800"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-zinc-800"></div>
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-zinc-800"></div>
            
            <div className={`p-4 rounded-2xl bg-black border border-white/10 mb-4 shadow-inner ${step.iconColor}`}>
              {Icon && <Icon className="w-12 h-12" />}
            </div>
            <motion.div className="text-xs font-mono text-white tracking-widest text-center px-4">
              {step.className}
            </motion.div>
          </div>

          <motion.div className="w-12 h-32 bg-white/5 border border-white/10 rounded-md shadow-inner"></motion.div>
        </div>

        <motion.div className="w-32 h-8 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-[10px] font-mono text-zinc-500 mt-8 shadow-inner">
          Output I/O
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Architecture({ steps, intl }: ArchitectureProps) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const f = latest * (steps.length - 0.01);
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });

  return (
    <section id="architecture" ref={containerRef} className={`relative w-full bg-black ${reduce ? "" : "md:h-[240vh]"}`}>
      {/* MOBILE + reduced-motion fallback: always-visible bento stack */}
      <div className={reduce ? "block" : "md:hidden"}>
        <BentoStack steps={steps} intl={intl} />
      </div>

      {/* DESKTOP 3D fly-through (skipped for reduced-motion) */}
      {isDesktop && !reduce && (
        <div className="hidden md:flex sticky top-0 h-screen w-full flex-col overflow-hidden px-10 lg:px-20 bg-gradient-to-b from-[var(--color-surface-2)] to-[var(--color-surface)]">
          {/* Section heading — in-flow at top so the 3D content starts directly beneath it */}
          <div className="pt-[var(--space-4xl)] pb-[var(--space-md)] text-center z-40 pointer-events-none shrink-0">
            <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">
              {intl.title}
            </h2>
            <p className="text-sm md:text-base uppercase tracking-widest text-[var(--color-muted-3)] mt-2 font-mono">
              {intl.subtitle}
            </p>
          </div>

          {/* 3D row fills the space right under the heading */}
          <div className="flex-1 flex flex-row items-center justify-center w-full min-h-0">
          {/* Left Side: Info Glass */}
          <div className="w-1/2 flex flex-col items-center justify-center z-30 h-full relative">
            <div className="w-full max-w-lg relative">
              
              <AnimatePresence mode="popLayout" initial={false}>
                {steps.map((step, i) => (
                  i === active && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                      transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
                      className={`absolute top-1/2 -translate-y-1/2 w-full bg-black/40 backdrop-blur-3xl rounded-[var(--glass-radius-lg)] border border-white/10 ${step.glow.replace('shadow-', 'shadow-2xl shadow-')} overflow-hidden`}
                    >
                      <div className="p-10 relative">
                         <div className="absolute inset-0 pcb-grid opacity-5"></div>
                         <div className="relative z-10">
                           <div className="flex items-center gap-4 mb-6">
                              <div className={`p-4 rounded-2xl bg-black/80 border border-white/10 shadow-inner ${step.iconColor}`}>
                                {IconMap[step.iconName] && (() => { const I = IconMap[step.iconName]; return <I className="w-8 h-8" /> })()}
                              </div>
                              <div>
                                <div className="text-xs font-mono font-bold tracking-widest uppercase mb-2" style={{ color: step.hex }}>
                                  {step.subtitle}
                                </div>
                                <h3 className="text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-extrabold text-white">
                                  {step.title}
                                </h3>
                              </div>
                           </div>
                           
                           <p className="text-zinc-300 text-lg leading-relaxed font-light mb-[var(--space-md)]">
                             {step.desc}
                           </p>
                           
                           <div className={`pill-code w-full ${step.iconColor}`}>
                             <span className="pill-code__type" title={step.className}>{step.className}</span>
                             <span className="pill-code__path" title={step.filePath}>
                               {step.filePath.split("/").pop()}
                             </span>
                           </div>
                         </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: The Exploding 3D Chip Stack */}
          <div className="w-1/2 h-full flex items-center justify-center perspective-[2500px] z-10">
            <motion.div
              className="relative w-[500px] h-[500px]"
              style={{
                transform: "rotateX(60deg) rotateZ(-45deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {steps.map((step, i) => (
                <BoardLayer
                  key={i}
                  step={step}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  active={active}
                  stepCount={steps.length}
                />
              ))}
            </motion.div>
          </div>
          </div>

          {/* Progress stepper — active step out of total, pinned bottom */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40" aria-hidden>
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === active ? "w-10 bg-white" : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function BentoStack({ steps, intl }: { steps: Step[]; intl: ArchIntl }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-[var(--space-3xl)] gap-8">
      <div className="text-center mb-8">
        <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">{intl.title}</h2>
        <p className="text-zinc-400 mt-2">{intl.subtitle}</p>
      </div>
      {steps.map((step, i) => {
        const Icon = IconMap[step.iconName];
        return (
          <div key={i} className={`w-full max-w-lg bg-black/60 backdrop-blur-xl rounded-[var(--glass-radius)] border border-white/10 shadow-2xl relative overflow-hidden ${step.glow}`}>
            <div className="absolute inset-0 pcb-grid opacity-10"></div>
            <div className="relative z-10 p-6 flex flex-col items-start text-left border-white/5">
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
