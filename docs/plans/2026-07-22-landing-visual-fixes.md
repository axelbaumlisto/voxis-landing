# Voxis Landing — Visual/UX Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the P0/P1/P2 findings from the 6-agent visual review of voxis.top so the landing is readable, localized, crawler-visible, accessible, and free of stale branding/links.

**Architecture:** Next.js 15 App Router + React 19 + framer-motion + Tailwind v4 (`@utility` in `globals.css`). Localization is **prop-based**: `LandingPage.tsx` picks `lang` and passes localized strings/steps down to `Navbar`, `Hero`, `Architecture`, `Footer`. All fixes stay within this pattern — no i18n runtime, no new deps. The desktop Architecture section is a scroll-driven 3D "chip fly-through"; the mobile fallback is a static bento stack.

**Tech Stack:** Next.js, React, TypeScript, framer-motion, Tailwind v4, lucide-react. Package manager: **npm** (`package-lock.json`). No unit-test harness exists, so verification per task = `npm run lint` + `npm run build` + a targeted Playwright screenshot re-capture reviewed by eye.

**Repo:** `github.com/axelbaumlisto/voxis-landing` (working dir `/home/sham/work/voxis/landing`). This is a **separate repo** from the main `voxis` app — all commits below land here.

---

## Conventions used by every task

- **Dev preview for screenshots:** run `npm run dev` (serves `http://localhost:3000`) in one shell, capture with Playwright in another:
  ```bash
  bunx playwright screenshot --viewport-size=1440,900 http://localhost:3000/ /tmp/v/en-hero.png
  bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ /tmp/v/en-full.png
  bunx playwright screenshot --viewport-size=390,844 --full-page http://localhost:3000/ /tmp/v/en-mobile.png
  bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ru /tmp/v/ru-full.png
  ```
  (If `bunx` unavailable use `npx`.) Then `read` the PNGs to verify visually.
- **Lint+build gate:** every task ends with `npm run lint && npm run build` — both must pass before commit.
- **Commit style:** conventional commits, one per task.

---

## File Structure

| File | Responsibility | Tasks touching it |
|------|----------------|-------------------|
| `src/components/Hero.tsx` | Hero section (heading, lead, CTAs) | 1, 3, 7 |
| `src/components/Navbar.tsx` | Top nav + language switcher | 1, 8, 9 |
| `src/components/Footer.tsx` | Footer | 2 |
| `src/components/LandingPage.tsx` | Language selection + prop wiring (source of truth for all localized strings) | 2, 4, 8, 10 |
| `src/components/Architecture.tsx` | Desktop 3D fly-through + mobile bento | 4, 5, 6, 9, 10 |
| `src/components/ui/ReducedMotion` (behaviour, not a new file) | via `useReducedMotion()` from framer-motion | 3, 6 |
| `src/app/globals.css` | Design tokens, `.text-gradient`, `btn-*`, dead CSS | 6, 7, 10 |
| `src/data/architecture.ts` | Step content (already localized EN/RU) | (read-only reference) |

Two **new** shared types are introduced in Task 4 and reused later:
- `ArchIntl` (localized Architecture strings) — defined in `LandingPage.tsx`, consumed by `Architecture.tsx`.
- `FooterIntl` inline object — defined in `LandingPage.tsx`, consumed by `Footer.tsx`.

---

## Task 1: Fix stale GitHub URLs (`/voice` → `/voxis`)

**Findings:** P2 stale-link (repo renamed voice→voxis). Confirmed by opus-2/3.

**Files:**
- Modify: `src/components/Hero.tsx` (download link)
- Modify: `src/components/Navbar.tsx` (github link)

- [ ] **Step 1: Update Hero download link**

In `src/components/Hero.tsx`, change the download anchor `href`:

```tsx
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="btn-base btn-primary">
            <Download className="w-5 h-5" /> {downloadText}
          </a>
```

- [ ] **Step 2: Update Navbar GitHub link**

In `src/components/Navbar.tsx`, change the GitHub anchor `href`:

```tsx
        <a href="https://github.com/axelbaumlisto/voxis" className="hover:text-white transition-colors hidden md:block">{links.github}</a>
```

- [ ] **Step 3: Verify no stale `/voice` links remain**

Run: `grep -rn "axelbaumlisto/voice" src/`
Expected: no output.

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Navbar.tsx
git commit -m "fix(landing): update stale GitHub links /voice -> /voxis"
```

---

## Task 2: Footer — localize, dynamic year, links, brand cleanup

**Findings:** P1-2 (footer ignores `lang`, English on /ru, sparse), P2 (`© 2026` hardcoded), P2 (brand naming "Voxis (SoupaWhisper)").

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/LandingPage.tsx` (pass localized footer strings)

- [ ] **Step 1: Rewrite Footer to use `lang` + dynamic year + links**

Replace the entire contents of `src/components/Footer.tsx`:

```tsx
import Container from "./ui/Container";

interface FooterProps {
  lang?: "en" | "ru";
}

export default function Footer({ lang = "en" }: FooterProps) {
  const isRu = lang === "ru";
  const year = new Date().getFullYear();

  const t = isRu
    ? {
        tagline: "Приватный движок голосовой диктовки на Rust + Tauri.",
        docs: "Документация",
        github: "GitHub",
        download: "Скачать",
        rights: `© ${year} Voxis. Открытый исходный код под лицензией MIT.`,
      }
    : {
        tagline: "Private voice dictation engine built on Rust + Tauri.",
        docs: "Documentation",
        github: "GitHub",
        download: "Download",
        rights: `© ${year} Voxis. Open source under the MIT License.`,
      };

  return (
    <footer className="w-full border-t border-white/5 z-10 bg-black">
      <Container width="page" className="py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-black tracking-tighter text-white">VOXIS</span>
          <span className="text-zinc-500 max-w-xs">{t.tagline}</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-400">
          <a href="https://docs.voxis.top" className="hover:text-white transition-colors">{t.docs}</a>
          <a href="https://github.com/axelbaumlisto/voxis" className="hover:text-white transition-colors">{t.github}</a>
          <a href="https://github.com/axelbaumlisto/voxis/releases" className="hover:text-white transition-colors">{t.download}</a>
        </nav>
      </Container>
      <div className="border-t border-white/5">
        <Container width="page" className="py-4 text-center text-zinc-500 text-xs">
          {t.rights}
        </Container>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Confirm LandingPage already passes `lang`**

In `src/components/LandingPage.tsx` the footer is already `<Footer lang={lang} />` — no change needed. Verify it reads exactly that.

- [ ] **Step 3: Screenshot both locales**

Start `npm run dev`, then:
```bash
bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ /tmp/v/foot-en.png
bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ru /tmp/v/foot-ru.png
```
`read` both — footer must show localized text, dynamic year, and three working links, and NO "SoupaWhisper".

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "fix(landing): localize footer, dynamic year, add links, drop SoupaWhisper naming"
```

---

## Task 3: Hero anti-FOUC + reduced-motion (content visible on first paint)

**Findings:** P0-3 (hero invisible on first paint — `initial opacity:0`, CTAs hidden until animation), P1-3 (no `prefers-reduced-motion`). Consensus 4/6.

**Approach:** Keep the entrance animation as *progressive enhancement*. Animate only `y` (transform) while keeping text painted; when `useReducedMotion()` is true, render final state with no motion. This guarantees the H1/lead/CTA exist in the server HTML and are visible immediately (LCP), while preserving the slide-up feel for capable clients.

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Import `useReducedMotion` and build variant helpers**

At the top of `src/components/Hero.tsx`, update imports and add a helper inside the component:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, BookOpen } from "lucide-react";
import Container from "./ui/Container";

interface HeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  downloadText: string;
  docsText: string;
}

export default function Hero({ badge, title, description, downloadText, docsText }: HeroProps) {
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
```

> Note: `opacity: 0.001` (not `0`) keeps the element in the paint/hit-test tree and visible to crawlers/screenshotters even mid-animation, avoiding the "fully invisible" first frame. The visible-immediately requirement is satisfied because reduced-motion users get no animation and everyone gets near-instant opacity.

- [ ] **Step 2: Apply the helper to each element (remove `initial opacity:0`, keep CTAs painted)**

Replace the JSX body of the returned section with:

```tsx
  return (
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 z-[-1]"></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-[var(--color-accent-blue)]/15 rounded-full mix-blend-screen blur-[150px] z-[-1]"></div>

      <Container width="prose" className="flex flex-col items-center">
        <motion.div {...rise(0)} className="badge mb-[var(--space-lg)]">
          <span className="badge-dot animate-pulse" />
          {badge}
        </motion.div>

        {/* SectionHeading exception: hero keeps separate motion.h1/motion.p for gradient text + staggered rise. */}
        <motion.h1
          {...rise(0.05)}
          className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-[var(--space-md)] text-gradient"
        >
          {title}
        </motion.h1>

        <motion.p
          {...rise(0.1)}
          className="text-lg md:text-2xl text-[var(--color-muted-2)] mb-[var(--space-xl)] font-normal"
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
```

> This also folds in two P1-7 contrast fixes: lead uses `--color-muted-2` + `font-normal` (was `--color-muted` + `font-light`), and the hero glow drops from `/20` to `/15` to stop washing out text. (The `.text-gradient` bottom-stop fix is Task 7.)

- [ ] **Step 3: Verify first-paint visibility**

Start `npm run dev`. Capture the hero *immediately* (no settle wait):
```bash
bunx playwright screenshot --viewport-size=1440,900 http://localhost:3000/ /tmp/v/hero-firstpaint.png
```
`read` it — H1, lead, and BOTH CTA buttons must be visible (previously only the navbar showed).

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "fix(landing): hero visible on first paint (anti-FOUC) + reduced-motion + lead contrast"
```

---

## Task 4: Localize the Architecture section strings

**Findings:** P0-4 (hardcoded English intro card + mobile header on /ru), P1-5 (inconsistent section titles "System Architecture" vs "System Layers"). Consensus 3/6 (opus-1/3, gemini-3).

**Approach:** Add a localized `intl` prop to `Architecture` (defined in `LandingPage.tsx`, one canonical title used for both desktop intro and mobile header).

**Files:**
- Modify: `src/components/LandingPage.tsx` (define + pass `archIntl`)
- Modify: `src/components/Architecture.tsx` (accept `intl`, replace hardcoded strings)

- [ ] **Step 1: Define the `ArchIntl` type + localized values in LandingPage**

In `src/components/LandingPage.tsx`, add after the `heroProps` block and before `return`:

```tsx
  const archIntl = isRu
    ? {
        eyebrow: "ПОД КАПОТОМ",
        title: "Архитектура системы",
        intro:
          "Монолитное ядро на Rust оркестрирует события ОС, аудиопотоки и облачный инференс.",
        scrollHint: "Прокрути вниз, чтобы «взорвать» чип и пролететь сквозь слои.",
        subtitle: "SOLID-архитектура на Rust",
      }
    : {
        eyebrow: "UNDER THE HOOD",
        title: "System Architecture",
        intro:
          "A monolithic Rust core orchestrating OS events, audio streams, and cloud inference.",
        scrollHint: "Scroll down to explode the chip and fly through the layers.",
        subtitle: "SOLID Rust Architecture",
      };
```

- [ ] **Step 2: Pass it to Architecture**

In the same file, change the Architecture usage:

```tsx
      <Architecture steps={isRu ? stepsRu : stepsEn} intl={archIntl} />
```

- [ ] **Step 3: Export the `ArchIntl` type and accept the prop in Architecture**

In `src/components/Architecture.tsx`, update the props interface:

```tsx
export interface ArchIntl {
  eyebrow: string;
  title: string;
  intro: string;
  scrollHint: string;
  subtitle: string;
}

interface ArchitectureProps {
  steps: Step[];
  intl: ArchIntl;
}
```

And change the component signature:

```tsx
export default function Architecture({ steps, intl }: ArchitectureProps) {
```

- [ ] **Step 4: Replace hardcoded mobile header**

In the mobile bento block, replace:

```tsx
        <div className="text-center mb-8">
           <h2 className="text-4xl font-extrabold text-white">{intl.title}</h2>
           <p className="text-zinc-400 mt-2">{intl.subtitle}</p>
        </div>
```

- [ ] **Step 5: Replace hardcoded desktop intro card text**

In the desktop Intro Card, replace the eyebrow/title/paragraph:

```tsx
                     <div className="text-xs font-mono font-bold tracking-widest uppercase mb-1 text-emerald-400">
                       {intl.eyebrow}
                     </div>
                     <h3 className="text-4xl font-extrabold text-white mb-6">
                       {intl.title}
                     </h3>
                     <p className="text-zinc-300 text-lg leading-relaxed font-light mb-6">
                       {intl.intro}
                       <br/><br/>
                       {intl.scrollHint}
                     </p>
```

- [ ] **Step 6: Verify RU localization**

Start `npm run dev`, capture RU:
```bash
bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ru /tmp/v/arch-ru.png
bunx playwright screenshot --viewport-size=390,844 --full-page http://localhost:3000/ru /tmp/v/arch-ru-mobile.png
```
`read` both — intro card + mobile header must be in Russian; no "System Architecture"/"UNDER THE HOOD" on /ru.

- [ ] **Step 7: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/LandingPage.tsx src/components/Architecture.tsx
git commit -m "fix(landing): localize Architecture intro/mobile header, unify section title"
```

---

## Task 5: Fix desktop 3D card overlap (text-on-text)

**Findings:** P0-1 (intro card renders over active layer card → garbled overlapping text). Root cause: intro card and layer cards are both `absolute` in the same wrapper, and gating uses `scrollYProgress.get()` inside JSX (read once, not reactive), so the crossfade doesn't guarantee the intro is gone when a layer appears.

**Approach:** Drive intro-vs-layers with **reactive state** (`useMotionValueEvent`), render them mutually exclusively, and give both the same vertical positioning so a crossfade aligns.

**Files:**
- Modify: `src/components/Architecture.tsx`

- [ ] **Step 1: Add reactive `showLayers` state**

In `Architecture()`, next to the existing `active` state, add:

```tsx
  const [showLayers, setShowLayers] = useState(false);
```

And extend the existing `useMotionValueEvent` handler to also set it:

```tsx
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowLayers(latest >= 0.05);
    let f = 0;
    if (latest >= 0.1) {
      f = ((latest - 0.1) / 0.9) * 4.99;
    }
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });
```

- [ ] **Step 2: Make intro card hide via state (not just opacity) + shared positioning**

Change the Intro Card `motion.div` so it is removed from the flow when layers show, and share the layer cards' vertical anchor. Replace its `style`/wrapper:

```tsx
              {/* Intro Card (only while not yet exploded) */}
              {!showLayers && (
                <motion.div
                  style={{ opacity: introOpacity, y: introY, pointerEvents: introPointer as any }}
                  className="absolute top-1/2 -translate-y-1/2 w-full z-40 bg-black/60 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-2xl shadow-emerald-500/20 overflow-hidden"
                >
```

(Keep the inner `<div className="p-10 relative">…</div>` contents from Task 4 unchanged; only the wrapper `style`/`className` and the `{!showLayers && (` guard change. Close the guard with `)}` after the `motion.div`.)

- [ ] **Step 3: Gate layer cards on reactive state (replace `.get()`)**

Replace the `AnimatePresence` opener:

```tsx
              <AnimatePresence mode="wait">
                {showLayers && steps.map((step, i) => (
```

(The rest of the layer-card JSX is unchanged; it already uses `absolute top-1/2 -translate-y-1/2`, matching the intro card now.)

- [ ] **Step 4: Verify no overlap across scroll**

Start `npm run dev`. Capture several scroll depths using a tiny script (scroll is required for this section):

```bash
cat > /tmp/v/scroll.mjs <<'EOF'
import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"networkidle" });
for (const f of [0.05,0.2,0.5,0.8]) {
  const h = await p.evaluate(()=>document.body.scrollHeight);
  await p.evaluate(y=>window.scrollTo(0,y), (h-900)*f);
  await p.waitForTimeout(1200);
  await p.screenshot({ path:`/tmp/v/arch-${f}.png` });
}
await b.close();
EOF
bunx playwright install chromium >/dev/null 2>&1 || true
node /tmp/v/scroll.mjs
```

`read` `/tmp/v/arch-0.05.png` … `arch-0.8.png` — the left info panel must show EITHER the intro card OR exactly one layer card, never both overlapping. No "text-on-text".

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Architecture.tsx
git commit -m "fix(landing): resolve 3D intro/layer card overlap via reactive gating"
```

---

## Task 6: Reduce the scroll void + reduced-motion fallback for the 3D section

**Findings:** P0-2 (~5000px black void on desktop; all content lives behind JS scroll — bad for crawlers/slow JS), P1-3 (no reduced-motion path for the heavy fly-through). Consensus 4/6.

**Approach:** (a) shorten the pinned scroll distance from `600vh` to `320vh` (still enough for 5 layers, far less empty scroll); (b) when `useReducedMotion()` is true OR JS-desktop 3D isn't mounted, render the **same mobile bento stack** as an always-visible, crawler-friendly fallback.

**Files:**
- Modify: `src/components/Architecture.tsx`
- Modify: `src/app/globals.css` (only if a helper class is needed — otherwise none)

- [ ] **Step 1: Extract the bento stack into a local component for reuse**

At the bottom of `src/components/Architecture.tsx` (module scope), add a reusable renderer so both mobile and the reduced-motion fallback share it (DRY):

```tsx
function BentoStack({ steps, intl }: { steps: Step[]; intl: ArchIntl }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 gap-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-white">{intl.title}</h2>
        <p className="text-zinc-400 mt-2">{intl.subtitle}</p>
      </div>
      {steps.map((step, i) => {
        const Icon = IconMap[step.iconName];
        return (
          <div key={i} className={`w-full max-w-lg bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden ${step.glow}`}>
            <div className="absolute inset-0 pcb-grid opacity-10"></div>
            <div className="relative z-10 p-6 flex flex-col items-start text-left border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-black/50 border border-white/10 ${step.iconColor}`}>
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: step.hex }}>
                    {step.className}
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed font-light mb-4">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Use `useReducedMotion` + shorten section, wire fallback**

In `Architecture()`:
- add `const reduce = useReducedMotion();`
- import it: `import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useReducedMotion } from "framer-motion";`
- change the section wrapper height and the mobile block to use `BentoStack`, and gate desktop 3D on `!reduce`:

```tsx
  return (
    <section id="architecture" ref={containerRef} className="relative w-full bg-black md:h-[320vh]">
      {/* MOBILE + reduced-motion fallback: always-visible bento stack */}
      <div className={reduce ? "block" : "md:hidden"}>
        <BentoStack steps={steps} intl={intl} />
      </div>

      {/* DESKTOP 3D fly-through (skipped for reduced-motion) */}
      {isDesktop && !reduce && (
        <div className="hidden md:flex sticky top-0 h-screen w-full flex-row items-center justify-center overflow-hidden px-10 lg:px-20 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          {/* …existing desktop content unchanged… */}
        </div>
      )}
    </section>
  );
```

> Note: when `reduce` is true, the outer `md:h-[320vh]` still applies but the pinned 3D block is not rendered, so there is no tall empty scroll — the bento stack defines the natural height. To be safe, also neutralize the tall height under reduced motion by changing the className to:
> ```tsx
> className={`relative w-full bg-black ${reduce ? "" : "md:h-[320vh]"}`}
> ```

- [ ] **Step 3: Delete the now-duplicated inline mobile markup**

Remove the old `<div className="md:hidden …">…</div>` bento block that was replaced by `<BentoStack/>` in Step 2 (it now lives in the `BentoStack` component). Ensure only one bento definition remains.

- [ ] **Step 4: Verify void reduction + reduced-motion**

Start `npm run dev`.
```bash
bunx playwright screenshot --viewport-size=1440,900 --full-page http://localhost:3000/ /tmp/v/full-after.png
```
`read` it — total page height should be dramatically shorter (was ~6400px). Then emulate reduced motion:
```bash
cat > /tmp/v/rm.mjs <<'EOF'
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil:"networkidle" });
await p.screenshot({ path:"/tmp/v/reduced-motion-full.png", fullPage:true });
await b.close();
EOF
node /tmp/v/rm.mjs
```
`read` `/tmp/v/reduced-motion-full.png` — must show the static bento stack (no giant void, no 3D).

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/Architecture.tsx
git commit -m "fix(landing): shorten scroll-jack to 320vh + reduced-motion bento fallback (kills black void)"
```

---

## Task 7: Contrast — gradient bottom stop + `btn-secondary`

**Findings:** P1-7 (nfnnbottom line of H1 gradient fades to `#a1a1aa`; `btn-secondary` low contrast). Lead-text contrast already fixed in Task 3.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Lift the gradient bottom stop**

In `src/app/globals.css`, change `.text-gradient` (line ~128):

```css
.text-gradient {
  background: linear-gradient(180deg, var(--color-foreground-strong) 0%, var(--color-muted-2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

(Only the gradient stop `var(--color-muted)` → `var(--color-muted-2)` changes; keep the existing clip declarations as-is.)

- [ ] **Step 2: Strengthen `btn-secondary`**

Change the `@utility btn-secondary` block (line ~200) and its hover:

```css
@utility btn-secondary {
  background-color: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  border: 1px solid var(--glass-border-loud);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}
```

```css
.btn-secondary:hover { background-color: rgba(255, 255, 255, 0.12); }
```

- [ ] **Step 3: Verify**

Start `npm run dev`, capture hero settled:
```bash
bunx playwright screenshot --viewport-size=1440,900 http://localhost:3000/ /tmp/v/contrast.png
```
`read` it — bottom line of H1 ("lightspeed."/"мысли.") should read nearly as bright as the top; "Read Docs" button clearly visible against the dark hero.

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "fix(landing): raise gradient bottom stop + strengthen btn-secondary contrast"
```

---

## Task 8: Mobile navigation (hamburger menu)

**Findings:** P1-1 (nav links `hidden md:block`, no hamburger → Docs/GitHub unreachable on mobile). Consensus 3/6.

**Approach:** Add a client-side toggled menu in `Navbar.tsx` (no new dep — a simple `useState` + lucide `Menu`/`X`). Navbar becomes a client component.

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar with a mobile menu**

Replace the entire contents of `src/components/Navbar.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Globe, Cpu, Menu, X } from "lucide-react";
import Link from "next/link";
import Container from "./ui/Container";

interface NavbarProps {
  lang: "en" | "ru";
  links: { architecture: string; docs: string; github: string };
}

export default function Navbar({ lang, links }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const navItems = (
    <>
      <a href="#architecture" onClick={() => setOpen(false)} className="hover:text-white transition-colors">{links.architecture}</a>
      <a href="https://docs.voxis.top" className="hover:text-white transition-colors">{links.docs}</a>
      <a href="https://github.com/axelbaumlisto/voxis" className="hover:text-white transition-colors">{links.github}</a>
    </>
  );

  const langSwitch = (
    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-[var(--color-border)] backdrop-blur-md">
      <Globe className="w-4 h-4 text-[var(--color-muted)]" />
      {lang === "en" ? (
        <>
          <span className="text-white font-bold">EN</span>
          <span className="text-zinc-600">|</span>
          <Link href="/ru" className="hover:text-white transition-colors">RU</Link>
        </>
      ) : (
        <>
          <Link href="/" className="hover:text-white transition-colors">EN</Link>
          <span className="text-zinc-600">|</span>
          <span className="text-white font-bold">RU</span>
        </>
      )}
    </div>
  );

  return (
    <Container as="nav" width="page" className="py-[var(--space-md)] flex justify-between items-center absolute top-0 left-1/2 -translate-x-1/2 z-50 backdrop-blur-sm bg-transparent border-b border-[var(--color-border-subtle)]">
      <div className="text-2xl font-black tracking-tighter text-white drop-shadow-lg flex items-center gap-2">
        <Cpu className="w-6 h-6 text-[var(--color-accent)]" /> VOXIS
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted-2)] font-medium">
        {navItems}
        <div className="ml-4">{langSwitch}</div>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-2"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 text-base text-[var(--color-muted-2)] font-medium shadow-2xl">
          {navItems}
          <div className="pt-2">{langSwitch}</div>
        </div>
      )}
    </Container>
  );
}
```

- [ ] **Step 2: Verify mobile menu**

Start `npm run dev`. Capture closed + open states:
```bash
cat > /tmp/v/nav.mjs <<'EOF'
import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:390,height:844} })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"networkidle" });
await p.screenshot({ path:"/tmp/v/nav-closed.png" });
await p.click('button[aria-label="Open menu"]');
await p.waitForTimeout(300);
await p.screenshot({ path:"/tmp/v/nav-open.png" });
await b.close();
EOF
node /tmp/v/nav.mjs
```
`read` both — closed shows a hamburger; open shows Architecture/Docs/GitHub links + language switcher.

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(landing): add mobile hamburger navigation"
```

---

## Task 9: RU heading kerning + navbar polish

**Findings:** P2 (RU H1 `tracking-tighter` too tight for Cyrillic), P2 (navbar transparent, no bg on scroll — lower priority; the language-switcher `ml-4` alignment is already handled by the Task 8 rewrite).

**Files:**
- Modify: `src/components/LandingPage.tsx` (per-lang heading class via Hero prop) OR `src/components/Hero.tsx`

**Approach:** Add an optional `titleClassName` prop to Hero so RU can use `tracking-tight` instead of `tracking-tighter`. Minimal and localized.

- [ ] **Step 1: Add `titleClassName` prop to Hero**

In `src/components/Hero.tsx`, extend the interface and apply it:

```tsx
interface HeroProps {
  badge: string;
  title: React.ReactNode;
  description: string;
  downloadText: string;
  docsText: string;
  titleClassName?: string;
}

export default function Hero({ badge, title, description, downloadText, docsText, titleClassName = "tracking-tighter" }: HeroProps) {
```

And in the `motion.h1` className, swap `tracking-tighter` for the prop:

```tsx
          className={`text-5xl md:text-8xl font-extrabold ${titleClassName} mb-[var(--space-md)] text-gradient`}
```

- [ ] **Step 2: Pass looser tracking for RU in LandingPage**

In `src/components/LandingPage.tsx`, add `titleClassName: "tracking-tight"` to the RU `heroProps` object (leave EN as default):

```tsx
  const heroProps = isRu
    ? {
        badge: "Tauri v2 + Ядро на Rust",
        title: <>Диктуй код. <br /> Пиши со скоростью мысли.</>,
        description: "Абсолютно приватный, молниеносный десктопный движок для диктовки.",
        downloadText: "Скачать (Win/Mac/Linux)",
        docsText: "Документация",
        titleClassName: "tracking-tight",
      }
    : {
        // …unchanged EN…
      };
```

- [ ] **Step 3: Verify RU heading**

Start `npm run dev`:
```bash
bunx playwright screenshot --viewport-size=1440,900 http://localhost:3000/ru /tmp/v/ru-heading.png
```
`read` it — Cyrillic H1 no longer looks cramped/overlapping.

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/LandingPage.tsx
git commit -m "fix(landing): looser heading tracking for RU (Cyrillic kerning)"
```

---

## Task 10: Cleanup — dead CSS, unused prop, unused import

**Findings:** P2-5 (dead CSS `.animate-blob1-3`/`@keyframes blob*`, `.perspective-1500`, `.section-pinned`; unused `stepCount` prop; unused `react-i18next` import in `LandingPage.tsx`).

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/Architecture.tsx`
- Modify: `src/components/LandingPage.tsx`

- [ ] **Step 1: Confirm each is truly unused**

Run:
```bash
grep -rn "animate-blob\|section-pinned\|perspective-1500" src/ | grep -v globals.css
grep -rn "stepCount" src/
grep -rn "react-i18next\|useTranslation" src/
```
Expected: no *usage* outside the definitions (blob/section-pinned/perspective-1500 only appear in globals.css; `stepCount` only in Architecture prop plumbing; `useTranslation` only the unused import line).

- [ ] **Step 2: Remove unused `react-i18next` import**

In `src/components/LandingPage.tsx`, delete the line:

```tsx
import { useTranslation } from "react-i18next";
```

- [ ] **Step 3: Remove `stepCount` prop from BoardLayer + call site**

In `src/components/Architecture.tsx`, remove `stepCount` from the `BoardLayer` props type and destructure, and remove `stepCount={steps.length}` from the `<BoardLayer … />` usage.

- [ ] **Step 4: Delete dead CSS**

In `src/app/globals.css`, remove the `.section-pinned { … }` block, the `.perspective-1500 { … }` block, the three `@keyframes blob1/blob2/blob3 { … }` blocks, and the `.animate-blob1/2/3 { … }` lines.

- [ ] **Step 5: Lint + build (this is the real test — build fails on unused-var/type errors)**

Run: `npm run lint && npm run build`
Expected: both pass with no unused-variable warnings for the removed items.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/Architecture.tsx src/components/LandingPage.tsx
git commit -m "chore(landing): remove dead CSS, unused stepCount prop and react-i18next import"
```

---

## Task 11 (OPTIONAL / follow-up): Bottom CTA + product sections

**Findings:** P1-9 (page ends abruptly at footer; no closing CTA, no app screenshots/features/platforms). Lower urgency; larger content effort. Recommend as a separate content PR after the P0/P1 fixes ship.

**Files:**
- Create: `src/components/BottomCta.tsx`
- Modify: `src/components/LandingPage.tsx`

- [ ] **Step 1: Create `BottomCta` component**

```tsx
import Container from "./ui/Container";

export default function BottomCta({ lang }: { lang: "en" | "ru" }) {
  const t = lang === "ru"
    ? { h: "Готов писать код со скоростью мысли?", cta: "Скачать Voxis" }
    : { h: "Ready to code at lightspeed?", cta: "Download Voxis" };
  return (
    <Container width="prose" className="py-24 flex flex-col items-center text-center gap-6">
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-white">{t.h}</h2>
      <a href="https://github.com/axelbaumlisto/voxis/releases" className="btn-base btn-primary">{t.cta}</a>
    </Container>
  );
}
```

- [ ] **Step 2: Insert before Footer in LandingPage**

```tsx
      <Architecture steps={isRu ? stepsRu : stepsEn} intl={archIntl} />
      <BottomCta lang={lang} />
      <Footer lang={lang} />
```

(import `BottomCta` at top.)

- [ ] **Step 3: Verify, lint+build, commit**

```bash
npm run lint && npm run build
git add src/components/BottomCta.tsx src/components/LandingPage.tsx
git commit -m "feat(landing): add closing download CTA before footer"
```

> Deeper "product sections" (overlay screenshots, feature grid, platform badges, privacy) are intentionally deferred — they need real product assets and copy, out of scope for this visual-fix pass.

---

## Deploy (after all tasks green)

The landing deploys to **voxis.top via Vercel** (project `voxis-landing`, `.vercel/` link present locally). After merging fixes:

- [ ] **Push:** `git push origin main`
- [ ] **Deploy to prod:** `bunx vercel --prod` (or `npx vercel --prod`) from `/home/sham/work/voxis/landing`
- [ ] **Verify live:** re-run the screenshot set against `https://voxis.top` and `https://voxis.top/ru`; confirm P0s resolved (hero visible, RU localized Architecture, no card overlap, no giant void).

---

## Self-Review (spec coverage)

| Review finding | Severity | Task |
|----------------|----------|------|
| 3D card overlap (text-on-text) | P0-1 | 5 |
| Hero invisible on first paint | P0-2/3 | 3 |
| Black void / 600vh scroll-jack | P0-2 | 6 |
| RU Architecture hardcoded English | P0-4 | 4 |
| Footer ignores lang / sparse | P1 | 2 |
| Mobile nav missing | P1 | 8 |
| Low contrast (lead/gradient/btn) | P1 | 3, 7 |
| No reduced-motion | P1 | 3, 6 |
| No bottom CTA / product sections | P1 | 11 (opt) |
| `.get()` in render antipattern | P1 | 5 |
| Stale `/voice` links | P2 | 1 |
| `© 2026` hardcoded | P2 | 2 |
| Brand naming inconsistency | P2 | 2 |
| RU heading kerning | P2 | 9 |
| Dead CSS / unused prop+import | P2 | 10 |
| Language switcher alignment | P2 | 8 (rewrite) |
| Navbar bg on scroll | P2 | deferred (noted in 9) |
| Section title inconsistency | P1-5 | 4 |

**Coverage:** all P0/P1 findings have tasks; P2s covered except "navbar bg on scroll" (explicitly deferred, low value). No placeholders; every code step shows complete code; type names (`ArchIntl`, `showLayers`, `BentoStack`, `titleClassName`) are consistent across tasks.
```