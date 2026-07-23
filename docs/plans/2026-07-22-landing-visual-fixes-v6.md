# Voxis Landing — Visual Fixes v6 (final craft pass)

> Worker model: `o/gpt-5.5`. READ-ONLY reviewer at end. **NOT vision-designer.**

**Goal:** Закрыть все находки v6-аудита (1 BLOCKER + 7 MEDIUM + 9 LOW). Прод `voxis.top` сейчас на `e7da8a3`. Цель — чистый APPROVE от visual-панели без замечаний.

**Repo:** `github.com/axelbaumlisto/voxis-landing`, `/home/sham/work/voxis-landing`. Vercel Git integration.

**Conventions:** `npm run lint && npm run build` после каждой задачи → коммит. Push ОДИН раз в конце (Task 16).

**Conflict resolution (ВАЖНО):** Task 3 оживляет `pill-code` utility → Task 1 НЕ удаляет `pill-code`/`__type`/`__path`. Task 4 делает `--color-surface-2`/`--color-surface-code` живыми → Task 2 НЕ удаляет эти токены.

---

## 🔴 BLOCKER

### Task 0: Reduced-motion — hero виден + Architecture не пустой

**Finding (opus-2 BLOCKER):** под `prefers-reduced-motion: reduce` Hero H1 застревает в `opacity:0.001` (невидим), Architecture на desktop рендерит ни bento (т.к. `md:hidden` при `reduce=false`) ни 3D (т.к. `!reduce` рассинхрон) → 2100px пустоты. Корень: `useReducedMotion()` хук рассинхронен с браузерным MQ.

**Files:** `src/components/LandingPage.tsx`, `src/components/Hero.tsx`, `src/components/Architecture.tsx`

- [ ] **Step 0.1: MotionConfig reducedMotion="user" в LandingPage**

В `src/components/LandingPage.tsx` добавить импорт и обернуть return:
```tsx
import { MotionConfig } from "framer-motion";
```
Обернуть `<main>`:
```tsx
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen relative flex flex-col items-center bg-black w-full">
        ...
      </main>
    </MotionConfig>
  );
```

- [ ] **Step 0.2: Hero rise() — под reduced всегда видим**

В `src/components/Hero.tsx` найти `rise()`:
```tsx
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: 24, opacity: 0.001 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: DUR.slow, delay, ease: EASE_OUT_EXPO },
        };
```
Заменить:
```tsx
  const rise = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { y: 24, opacity: 0.001 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: DUR.slow, delay, ease: EASE_OUT_EXPO },
        };
```
> `initial: false` — framer не применяет initial, элемент рендерится сразу в финальном состоянии.

- [ ] **Step 0.3: Architecture — bento виден на desktop под reduced**

В `src/components/Architecture.tsx` найти:
```tsx
      <div className={reduce ? "block" : "md:hidden"}>
        <BentoStack steps={steps} intl={intl} />
      </div>
```
Заменить (bento всегда рендерится; на desktop без reduce скрывается, под reduce виден):
```tsx
      <div className={reduce ? "block" : "md:hidden"}>
        <BentoStack steps={steps} intl={intl} />
      </div>
```
> Эта ветка уже корректна. Реальный фикс — в Step 0.1 (MotionConfig синхронизирует `useReducedMotion` с браузерным MQ). Если после Step 0.1+0.2 reduced-прогон всё ещё пустой — добавить явный fallback: `{(!isDesktop || reduce) && <BentoStack .../>}` параллельно с desktop-веткой.

- [ ] **Step 0.4: Verify reduced-motion через Playwright**
```bash
npm run build > /tmp/build.log 2>&1 && npm run start > /tmp/start.log 2>&1 & sleep 6
cat > /tmp/reduced-check.mjs <<'EOF'
import { chromium } from "/home/sham/work/voxis-landing/node_modules/playwright/index.js";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil:"networkidle" });
await p.waitForTimeout(3000);
const h1 = await p.evaluate(()=>{ const e=document.querySelector("h1"); return e?getComputedStyle(e).opacity:null; });
const arch = await p.evaluate(()=>{ const s=document.querySelector("#architecture"); return s?{h:s.scrollHeight, visible:s.querySelectorAll("h3").length}:null; });
console.log("h1 opacity:", h1, "| arch:", JSON.stringify(arch));
await b.close();
EOF
node /tmp/reduced-check.mjs
pkill -f "next start" 2>/dev/null
```
Ожидание: `h1 opacity: 1`, `arch.visible ≥ 5`. Если `opacity: 0.001` или `visible: 0` — iterate.

- [ ] **Step 0.5: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/LandingPage.tsx src/components/Hero.tsx src/components/Architecture.tsx
git commit -m "fix(landing): reduced-motion — hero always visible + arch bento fallback (MotionConfig sync)"
```

---

## 🟠 MEDIUM

### Task 1: Удалить мёртвые @utility/keyframes (НЕ трогать pill-code)

**Finding:** `glass-card/glass-card-strong/glass-card-max/glass-tile/pill`, `.bg-grid`, `@keyframes traceFlow` — 0 использований. (opus-1/2/3 M1)

**Files:** `src/app/globals.css`

- [ ] **Step 1.1: Удалить блоки**

Удалить из `globals.css`:
- `.bg-grid { ... }` (строка ~117)
- `@keyframes traceFlow { ... }` (строка ~142)
- `@utility glass-card { ... }` (строка ~147)
- `@utility glass-card-strong { ... }` (строка ~157)
- `@utility glass-card-max { ... }` (строка ~162)
- `@utility glass-tile { ... }` (строка ~167)
- `@utility pill { ... }` (строка ~245)

**НЕ удалять:** `@utility pill-code`, `.pill-code__type`, `.pill-code__path` (оживим в Task 3).

- [ ] **Step 1.2: Verify**
```bash
grep -nE "@utility (glass-card|glass-card-strong|glass-card-max|glass-tile|pill)\b|@keyframes traceFlow|\.bg-grid" src/app/globals.css
```
Ожидание: 0 (pill-code остаётся — `grep pill` без `\b` может匹配 `pill-code`, использовать точный паттерн).

- [ ] **Step 1.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/app/globals.css
git commit -m "chore(landing): remove dead @utility glass-*/pill + .bg-grid + traceFlow keyframes"
```

---

### Task 2: Удалить мёртвые токены (НЕ трогать surface-2/surface-code)

**Finding:** `--text-h3*`, `--text-body*`, `--text-2xs*`, `--font-weight-*`, `--color-muted-4`, `--color-accent-cyan`, `--glow-cyan`, `--glass-fill-solid`, `--glass-blur-max` — 0 исп. (opus-1/2/3)

**Files:** `src/app/globals.css`

- [ ] **Step 2.1: Удалить токены**

Удалить строки:
- `--text-h3`, `--text-h3--line-height`, `--text-h3--letter-spacing` (~19-21)
- `--text-body`, `--text-body--line-height` (~24-25)
- `--text-2xs`, `--text-2xs--line-height` (~26-27)
- `--font-weight-light/normal/medium/semibold/bold/extrabold` (~29-34)
- `--color-muted-4` (~46)
- `--color-accent-cyan` (~52)
- `--glow-cyan` (~53)
- `--glass-fill-solid` (~75)
- `--glass-blur-max` (~84)

**НЕ удалять:** `--color-surface-2`, `--color-surface-code` (нужны для Task 4), `--ease-standard` (может использоваться — проверить `grep -rn ease-standard src/`; если 0 — удалить).

- [ ] **Step 2.2: Verify**
```bash
grep -nE "\-\-text-h3|\-\-text-body|\-\-text-2xs|\-\-font-weight-|\-\-color-muted-4|\-\-color-accent-cyan|\-\-glow-cyan|\-\-glass-fill-solid|\-\-glass-blur-max" src/app/globals.css
```
Ожидание: 0.

- [ ] **Step 2.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/app/globals.css
git commit -m "chore(landing): remove dead tokens (text-h3/body/2xs, font-weight-*, muted-4, accent-cyan, glow-cyan, glass-fill-solid, glass-blur-max)"
```

---

### Task 3: Оживить `pill-code` utility в Architecture

**Finding:** code-pill в 2 местах (desktop:212, bento:292) инлайн-хардкод, при том что `@utility pill-code` + `__type`/`__path` существуют. (opus-1/2/3 M2)

**Files:** `src/components/Architecture.tsx`, `src/app/globals.css` (verify pill-code contract)

- [ ] **Step 3.1: Проверить pill-code contract**

```bash
sed -n '245,290p' src/app/globals.css
```
Прочитать что `pill-code` предоставляет (flex-col, gap, bg, border, padding, font). Если контракт подходит — использовать как есть. Если не хватает — дополнить `@utility pill-code` в globals.css (но минимально).

- [ ] **Step 3.2: Desktop code-pill → pill-code utility**

Найти в `Architecture.tsx` (~212):
```tsx
                           <div className={`w-full p-4 rounded-xl bg-[#0d1117]/80 border border-white/5 font-mono text-sm shadow-inner ${step.iconColor} flex flex-col gap-1 overflow-hidden`}>
                             <span className="truncate min-w-0" title={step.className}>{step.className}</span>
                             <span className="text-zinc-600 text-xs shrink-0" title={step.filePath}>
                               {step.filePath.split("/").pop()}
                             </span>
                           </div>
```
Заменить:
```tsx
                           <div className={`pill-code w-full ${step.iconColor}`}>
                             <span className="pill-code__type" title={step.className}>{step.className}</span>
                             <span className="pill-code__path" title={step.filePath}>
                               {step.filePath.split("/").pop()}
                             </span>
                           </div>
```

- [ ] **Step 3.3: Bento code-pill → pill-code utility**

Найти (~292):
```tsx
              <div className={`w-full mt-auto p-3 rounded-xl bg-[#0d1117]/80 border border-white/5 font-mono text-xs shadow-inner ${step.iconColor} flex items-center justify-between gap-2 overflow-hidden`}>
                <span className="truncate" title={step.className}>{step.className}</span>
                <span className="text-zinc-600 text-xs shrink-0" title={step.filePath}>
                  {step.filePath.split("/").pop()}
                </span>
              </div>
```
Заменить:
```tsx
              <div className={`pill-code w-full mt-auto ${step.iconColor}`}>
                <span className="pill-code__type" title={step.className}>{step.className}</span>
                <span className="pill-code__path" title={step.filePath}>
                  {step.filePath.split("/").pop()}
                </span>
              </div>
```

- [ ] **Step 3.4: Verify pill-code живой**
```bash
grep -rn "pill-code" src/components/
```
Ожидание: ≥2 (Architecture desktop + bento).

- [ ] **Step 3.5: Скриншот-verify code-pill**
```bash
npm run build > /tmp/b.log 2>&1 && npm run start > /tmp/s.log 2>&1 & sleep 6
bunx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 http://localhost:3000/ /tmp/v6-codepill.png
pkill -f "next start" 2>/dev/null
```
`read` — code-pill рендерится корректно (cyan type, muted path, flex-col).

- [ ] **Step 3.6: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx src/app/globals.css
git commit -m "refactor(landing): code-pill uses pill-code utility (DRY, was inline-duplicated)"
```

---

### Task 4: Хардкод HEX → токены

**Finding:** `#050505`, `#0a0a0a`, `#0d1117` вместо `--color-surface-2`/`--color-surface`/`--color-surface-code`. (opus-2 M2, gemini-1/3)

**Files:** `src/components/Architecture.tsx`, `src/components/Showcase.tsx`

- [ ] **Step 4.1: Architecture.tsx — surface-2 + surface**

```bash
sed -i 's|bg-\[#050505\]|bg-[var(--color-surface-2)]|g; s|from-\[#050505\]|from-[var(--color-surface-2)]|g; s|to-\[#0a0a0a\]|to-[var(--color-surface)]|g' src/components/Architecture.tsx
```

- [ ] **Step 4.2: Showcase.tsx — убрать inline fallback**

Найти:
```tsx
              <div className="aspect-video grid place-items-center bg-gradient-to-br from-[var(--color-surface,#0a0a0a)] to-black">
```
Заменить:
```tsx
              <div className="aspect-video grid place-items-center bg-gradient-to-br from-[var(--color-surface)] to-black">
```

- [ ] **Step 4.3: Verify**
```bash
grep -rnE "#050505|#0a0a0a|#0d1117" src/components/
```
Ожидание: 0.

- [ ] **Step 4.4: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx src/components/Showcase.tsx
git commit -m "fix(landing): hardcoded HEX → surface tokens (no drift on rebrand)"
```

---

### Task 5: CSS `@media prefers-reduced-motion` reset

**Finding:** CSS-анимации (btn scale, FAQ rotate, navbar transition-colors) не гасятся под reduced-motion. (opus-3 M4)

**Files:** `src/app/globals.css`

- [ ] **Step 5.1: Глобальный reset**

В конце `globals.css` добавить:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/app/globals.css
git commit -m "fix(landing): global prefers-reduced-motion CSS reset (kill btn/FAQ/nav transitions)"
```

---

### Task 6: Mobile menu a11y — Esc + outside-click + aria-controls

**Finding:** Нет Esc-close, outside-click, `aria-controls`, scroll-lock. (opus-2 m3, opus-3 M5)

**Files:** `src/components/Navbar.tsx`

- [ ] **Step 6.1: Esc + outside-click + scroll-lock**

В `Navbar.tsx` добавить импорт `useEffect` + `useRef`:
```tsx
import { useState, useEffect, useRef } from "react";
```

После `const [scrolled, setScrolled] = useState(false);` добавить:
```tsx
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
    };
  }, [open]);
```

- [ ] **Step 6.2: aria-controls + menu id + ref**

Найти кнопку гамбургера:
```tsx
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-3 -m-1"
      >
```
Заменить:
```tsx
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-3 -m-1"
      >
```

Найти dropdown `<div className="md:hidden absolute top-full ...">`:
```tsx
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 text-base text-[var(--color-muted-2)] font-medium shadow-2xl">
```
Заменить:
```tsx
      {open && (
        <div ref={menuRef} id="mobile-nav" role="dialog" aria-label="Site navigation" className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl p-6 flex flex-col gap-4 text-base text-[var(--color-muted-2)] font-medium shadow-2xl">
```

- [ ] **Step 6.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx
git commit -m "fix(landing): mobile menu a11y — Esc-close, outside-click, aria-controls, scroll-lock"
```

---

### Task 7: SectionHeading компонент (убрать 6× дублирование)

**Finding:** H1-класс `text-[length:var(--text-h1)]…` скопирован дословно 6 раз. (opus-3 M2)

**Files:** Create `src/components/ui/SectionHeading.tsx`; modify `Features.tsx`, `Showcase.tsx`, `DownloadCta.tsx`, `Faq.tsx`, `Architecture.tsx`

- [ ] **Step 7.1: Создать SectionHeading.tsx**

```tsx
import { cn } from "../../lib/cn";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: string;
  subtitleClassName?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, subtitleClassName, className }: SectionHeadingProps) {
  return (
    <div className={cn("text-center mb-[var(--space-2xl)]", className)}>
      <h2 className="text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] font-extrabold text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-[var(--color-muted-2)] mt-[var(--space-sm)] text-lg", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 7.2: Применить в Features.tsx**

Найти блок заголовка и заменить на `<SectionHeading title={t.heading} subtitle={t.sub} />`. Добавить импорт.

- [ ] **Step 7.3: Применить в Showcase.tsx, DownloadCta.tsx, Faq.tsx** тем же паттерном.

- [ ] **Step 7.4: Architecture.tsx** — заголовок НЕ трогать (там особый inline-layout в sticky + uppercase mono subtitle). Оставить как есть.

- [ ] **Step 7.5: Verify — нет дублирования класса**
```bash
grep -rn "text-\[length:var(--text-h1)\]" src/components/
```
Ожидание: 1 (только в SectionHeading.tsx) + Architecture (особый). Цель — убрать из Features/Showcase/DownloadCta/Faq.

- [ ] **Step 7.6: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/ui/SectionHeading.tsx src/components/Features.tsx src/components/Showcase.tsx src/components/DownloadCta.tsx src/components/Faq.tsx
git commit -m "refactor(landing): SectionHeading component — kill 4× H1 class duplication"
```

---

## 🟡 LOW

### Task 8: Architecture.tsx:255 — transition-all → narrow + var token

**Finding:** Единственный оставшийся `transition-all` + хардкод bezier. (opus-1 L2, REV-001)

**Files:** `src/components/Architecture.tsx`

- [ ] **Step 8.1:** Найти:
```tsx
                className={`h-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
```
Заменить:
```tsx
                className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-expo)] ${
```

- [ ] **Step 8.2: Verify + commit**
```bash
grep -n "transition-all" src/components/Architecture.tsx
```
Ожидание: 0.
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "fix(landing): last transition-all → narrow + ease token (REV-001 closed)"
```

---

### Task 9: IIFE иконки → чистый паттерн

**Finding:** `Architecture.tsx:196` — `{IconMap[...] && (() => { const I = ...; return <I/> })()}`. (opus-1 M3, opus-2 m1)

**Files:** `src/components/Architecture.tsx`

- [ ] **Step 9.1:** Найти блок layer-card map (~190) и в начале колбэка добавить `const Icon = IconMap[step.iconName];`, затем заменить IIFE на `{Icon && <Icon className="w-8 h-8" />}`.

- [ ] **Step 9.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "refactor(landing): remove IIFE icon render — clean const pattern"
```

---

### Task 10: Navbar разделитель `|` → токен + aria-hidden

**Finding:** `text-zinc-600` хардкод + скринридер озвучивает «vertical bar». (gemini-2, gemini-3, opus-3)

**Files:** `src/components/Navbar.tsx`

- [ ] **Step 10.1:** Найти 2 вхождения `<span className="text-zinc-600">|</span>` (строки 37, 43), заменить:
```tsx
          <span className="text-[var(--color-muted-4)]" aria-hidden="true">|</span>
```
> Если Task 2 удалил `--color-muted-4` — использовать `text-[var(--color-muted-3)]` вместо него.

- [ ] **Step 10.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx
git commit -m "fix(landing): navbar separator token + aria-hidden (was hardcoded zinc + screenreader noise)"
```

---

### Task 11: Удалить i18next/react-i18next из deps

**Finding:** Пакеты в deps, 0 использований (inline-словари). (opus-3 M3)

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 11.1:**
```bash
npm uninstall i18next react-i18next
```

- [ ] **Step 11.2: Verify**
```bash
grep -n "i18next\|react-i18next" package.json
```
Ожидание: 0.

- [ ] **Step 11.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add package.json package-lock.json
git commit -m "chore(landing): remove unused i18next/react-i18next deps (inline i18n)"
```

---

### Task 12: Container — убрать card/full (0 исп)

**Finding:** Варианты `width="card"`/`"full"` не используются. (opus-1/3)

**Files:** `src/components/ui/Container.tsx`

- [ ] **Step 12.1:** Найти:
```tsx
type Width = "page" | "content" | "prose" | "card" | "full";

const widths: Record<Width, string> = {
  page: "max-w-[var(--container-page)]",
  content: "max-w-[var(--container-content)]",
  prose: "max-w-[var(--container-prose)]",
  card: "max-w-[var(--container-card)]",
  full: "max-w-none",
};
```
Заменить:
```tsx
type Width = "page" | "content" | "prose";

const widths: Record<Width, string> = {
  page: "max-w-[var(--container-page)]",
  content: "max-w-[var(--container-content)]",
  prose: "max-w-[var(--container-prose)]",
};
```

- [ ] **Step 12.2: Verify + commit**
```bash
npm run lint && npm run build
git add src/components/ui/Container.tsx
git commit -m "chore(landing): remove unused Container width variants card/full"
```

---

### Task 13: Architecture.tsx:279 — мёртвый `border-white/5`

**Finding:** Класс без `border`/`border-t` — ничего не рисует. (opus-1 L3)

- [ ] **Step 13.1:** Найти `<div className="relative z-10 p-6 flex flex-col items-start text-left border-white/5">`, заменить на `<div className="relative z-10 p-6 flex flex-col items-start text-left">`.

- [ ] **Step 13.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "chore(landing): remove dead border-white/5 class (no border declared)"
```

---

### Task 14: Architecture.tsx — копипаст «винтов чипа» → map

**Finding:** 4 строки `<div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-zinc-800">` копипаст. (gemini-3)

- [ ] **Step 14.1:** Найти 4 строки винтов (~114-117), заменить на:
```tsx
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full bg-zinc-800`} aria-hidden="true" />
            ))}
```

- [ ] **Step 14.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "refactor(landing): chip screws — map instead of 4× copy-paste"
```

---

### Task 15: RU metadata + hreflang

**Finding:** `/ru` шарит EN metadata/OG, нет hreflang. (opus-1 L4)

**Files:** `src/app/root-layout.shared.tsx`

- [ ] **Step 15.1:** В `metadata` добавить `alternates`:
```tsx
  alternates: {
    canonical: "https://voxis.top",
    languages: { "en": "https://voxis.top", "ru": "https://voxis.top/ru" },
  },
```

- [ ] **Step 15.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/app/root-layout.shared.tsx
git commit -m "fix(landing): hreflang alternates for EN/RU SEO"
```

---

## 🚀 Deploy + verify

### Task 16: Push + live verify

- [ ] **Step 16.1: Clean build + push**
```bash
cd /home/sham/work/voxis-landing
rm -rf .next
npm run lint && npm run build
git push origin main
```

- [ ] **Step 16.2: Wait ~90s, verify live**
```bash
sleep 90
curl -s https://voxis.top | grep -oE 'MotionConfig|pill-code|prefers-reduced-motion|mobile-nav|SectionHeading|hreflang' | sort -u
```
Ожидание: `pill-code`, `mobile-nav` (HTML markers), `prefers-reduced-motion` (CSS), hreflang в `<link rel="alternate">`.

- [ ] **Step 16.3: Playwright live screenshots**
```bash
mkdir -p /tmp/v6-final
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top /tmp/v6-final/en-full.png
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top/ru /tmp/v6-final/ru-full.png
bunx playwright screenshot --viewport-size=390,844 --full-page --wait-for-timeout=2500 https://voxis.top /tmp/v6-final/mobile.png
```
Verify: code-pill через pill-code utility, navbar full-width, FAQ accordion, mobile menu Esc/outside-click работает, reduced-motion hero виден.

---

## Self-Review (coverage)

| v6-находка | Severity | Task |
|------------|----------|------|
| Reduced-motion hero невидим + arch пустой | 🔴 BLOCKER | 0 |
| Мёртвые @utility (glass-*/pill, bg-grid, traceFlow) | 🟠 MED | 1 |
| Мёртвые токены (text-h3/body/2xs, font-weight, muted-4, accent-cyan, glow-cyan, glass-fill-solid, glass-blur-max) | 🟠 MED | 2 |
| code-pill игнорит pill-code utility | 🟠 MED | 3 |
| Хардкод HEX → surface токены | 🟠 MED | 4 |
| Нет CSS prefers-reduced-motion | 🟠 MED | 5 |
| Mobile menu a11y (Esc/outside/aria-controls) | 🟠 MED | 6 |
| SectionHeading 6× дублирование | 🟠 MED | 7 |
| transition-all на stepper (REV-001) | 🟡 LOW | 8 |
| IIFE иконки | 🟡 LOW | 9 |
| Navbar разделитель zinc + не aria-hidden | 🟡 LOW | 10 |
| i18next/react-i18next dead deps | 🟡 LOW | 11 |
| Container card/full 0 исп | 🟡 LOW | 12 |
| Мёртвый border-white/5 | 🟡 LOW | 13 |
| Копипаст винтов чипа | 🟡 LOW | 14 |
| RU metadata/hreflang | 🟡 LOW | 15 |

**Coverage:** 1/1 BLOCKER + 7/7 MEDIUM + 8/9 LOW = 16 задач. Опущено: `--ease-standard` (проверить grep, удалить если 0), `LavaLampBg energy=0.5+0.12` (косметика).
