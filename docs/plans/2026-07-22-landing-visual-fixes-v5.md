# Voxis Landing — Visual Fixes v5 (full panel-audit pass)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (or /ado). Worker model: `o/gpt-5.5`. READ-ONLY reviewer at the end. **Worker only — NOT vision-designer** (they don't respect read-only).

**Goal:** Закрыть все находки v4-аудита (4 HIGH + 4 MEDIUM + 8 LOW) от 6-агентной senior-панели. Прод `voxis.top` сейчас на `ffcd8ab` (v4 content sections). Все правки поверх.

**Repo:** `github.com/axelbaumlisto/voxis-landing`, working dir `/home/sham/work/voxis-landing`. Vercel Git integration авто-деплоит `main`.

**Conventions:** `npm run lint && npm run build` после каждой задачи → коммит. Скриншот-верификация где указано. Push ОДИН раз в конце (Task 14).

---

## 🔴 HIGH

### Task 1: Sticky navbar full-width (фон/blur/бордер на всю ширину)

**Finding:** `Container width="page"` ограничивает nav 72rem → при 1440px по ~144px прозрачных полей, хайрлайн обрывается. (gemini-3 BLOCKER, opus-1 HIGH)

**Files:** `src/components/Navbar.tsx`

- [ ] **Step 1.1: Обернуть Container в full-width `<header>`**

Найти:
```tsx
    <Container as="nav" width="page" className={`py-[var(--space-md)] flex justify-between items-center fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-colors duration-300 ease-out ${scrolled ? "backdrop-blur-md bg-black/60 border-b border-[var(--color-border-subtle)]" : "bg-transparent border-b border-transparent"}`}>
```
Заменить:
```tsx
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out ${scrolled ? "backdrop-blur-md bg-black/60 border-b border-[var(--color-border-subtle)]" : "bg-transparent border-b border-transparent"}`}>
    <Container as="nav" width="page" className="py-[var(--space-md)] flex justify-between items-center">
```

- [ ] **Step 1.2: Закрыть `</header>`**

Найти в конце компонента (перед `);`):
```tsx
    </Container>
  );
}
```
Заменить:
```tsx
    </Container>
    </header>
  );
}
```

- [ ] **Step 1.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx
git commit -m "fix(landing): sticky navbar full-width bg/blur (header wrapper, was clipped by Container)"
```

---

### Task 2: RU cyrillic subset для Geist

**Finding:** `Geist`/`Geist_Mono` подключены с `subsets:["latin"]` → кириллица в системном fallback, RU-типографика расходится с EN. (opus-1 HIGH)

**Files:** `src/app/root-layout.shared.tsx`

- [ ] **Step 2.1: Добавить cyrillic subset для Geist Sans**

Найти:
```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```
Заменить:
```tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});
```

- [ ] **Step 2.2: Geist_Mono — попробовать cyrillic, fallback если не поддерживается**

Найти:
```tsx
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```
Заменить:
```tsx
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});
```
> Если `npm run build` упадёт с ошибкой про недоступный subset `cyrillic` для Geist_Mono — откатить Step 2.2 к `subsets: ["latin"]` (моноширинный код-контент латиница, кириллица в моно почти не нужна). Geist Sans cyrillic поддерживает точно.

- [ ] **Step 2.3: Verify build + commit**
```bash
npm run build  # если упало на cyrillic для Mono — откатить Step 2.2
npm run lint
git add src/app/root-layout.shared.tsx
git commit -m "fix(landing): Geist cyrillic subset — RU text renders in brand font, not system fallback"
```

---

### Task 3: Mobile display floor 3rem → 2.5rem

**Finding:** `--text-display: clamp(3rem, 6vw+1rem, 6rem)` — на 390px 3rem ломает RU hero на 3-4 обрывистые строки. (gemini-1 HIGH)

**Files:** `src/app/globals.css`

- [ ] **Step 3.1: Опустить mobile floor**

Найти:
```css
  --text-display: clamp(3rem, 6vw + 1rem, 6rem);
```
Заменить:
```css
  --text-display: clamp(2.5rem, 6vw + 1rem, 6rem);
```

- [ ] **Step 3.2: Скриншот-verify mobile RU hero**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
bunx playwright screenshot --viewport-size=390,844 --wait-for-timeout=2500 http://localhost:3000/ru /tmp/v5-ru-mobile.png
kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` `/tmp/v5-ru-mobile.png` — «Диктуй код. Пиши со скоростью мысли.» не разбито на 4 рваных строки, читается.

- [ ] **Step 3.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/app/globals.css
git commit -m "fix(landing): mobile display floor 3rem->2.5rem (RU hero no longer breaks into 4 lines)"
```

---

### Task 4: Content sections padding → `.section` (responsive mobile)

**Finding:** Features/Showcase/DownloadCta/Faq хардкодят `py-4xl`=128px на всех широтах → на мобиле огромные пустоты. `.section` (2xl→3xl responsive) существует, но не используется. (КОНСЕНСУС 4/4)

**Files:** `src/components/Features.tsx`, `Showcase.tsx`, `DownloadCta.tsx`, `Faq.tsx`

- [ ] **Step 4.1: Заменить в 4 компонентах**

Для каждого из `Features.tsx`, `Showcase.tsx`, `DownloadCta.tsx`, `Faq.tsx`:
```bash
sed -i 's|w-full bg-black py-\[var(--space-4xl)\] relative z-10 border-t border-white/5|section bg-black relative z-10 border-t border-white/5|' src/components/Features.tsx src/components/Showcase.tsx src/components/DownloadCta.tsx src/components/Faq.tsx
```

- [ ] **Step 4.2: Verify — нет хардкода py-4xl в content**
```bash
grep -n "py-\[var(--space-4xl)\]" src/components/Features.tsx src/components/Showcase.tsx src/components/DownloadCta.tsx src/components/Faq.tsx
```
Ожидание: 0 совпадений.

- [ ] **Step 4.3: Скриншот mobile full**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
bunx playwright screenshot --viewport-size=390,844 --full-page --wait-for-timeout=2500 http://localhost:3000/ /tmp/v5-mobile-full.png
kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` — между секциями «дышит» ровнее, нет экран-размерных пустот.

- [ ] **Step 4.4: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Features.tsx src/components/Showcase.tsx src/components/DownloadCta.tsx src/components/Faq.tsx
git commit -m "fix(landing): content sections use .section utility (responsive mobile padding, was 128px hardcoded)"
```

---

## 🟠 MEDIUM

### Task 5: `transition-all` на BoardLayer → `transition-[border-color,box-shadow]`

**Finding:** `transition-all duration-300` на motion.div (управляемом framer каждый кадр) смазывает 3D-слои. (opus-1 MED)

**Files:** `src/components/Architecture.tsx`

- [ ] **Step 5.1: Сузить transition на BoardLayer (строка 82)**

Найти:
```tsx
      className={`absolute inset-0 rounded-[var(--glass-radius-lg)] border flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
```
Заменить:
```tsx
      className={`absolute inset-0 rounded-[var(--glass-radius-lg)] border flex items-center justify-center transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]
```

- [ ] **Step 5.2: То же для чипа (строка 113)**

Найти:
```tsx
          <div className={`w-56 h-56 border-2 ${isActive ? step.glow : 'border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]'} bg-[#050505] rounded-[var(--glass-radius)] flex flex-col items-center justify-center relative transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
```
Заменить:
```tsx
          <div className={`w-56 h-56 border-2 ${isActive ? step.glow : 'border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]'} bg-[#050505] rounded-[var(--glass-radius)] flex flex-col items-center justify-center relative transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]`}>
```

- [ ] **Step 5.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "fix(landing): narrow BoardLayer transition to border/shadow (was fighting framer, 3D jank)"
```

---

### Task 6: Navbar anchor overlap — pt-2xl → pt-4xl

**Finding:** Fixed navbar ~72px, при клике `#architecture` заголовок `pt-2xl`=64px — navbar налезает на h2. (gemini-1 MED)

**Files:** `src/components/Architecture.tsx`

- [ ] **Step 6.1: Увеличить top-padding заголовка**

Найти:
```tsx
          <div className="pt-[var(--space-2xl)] pb-[var(--space-md)] text-center z-40 pointer-events-none shrink-0">
```
Заменить:
```tsx
          <div className="pt-[var(--space-4xl)] pb-[var(--space-md)] text-center z-40 pointer-events-none shrink-0">
```

- [ ] **Step 6.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "fix(landing): architecture heading pt-4xl (clear fixed navbar on anchor jump)"
```

---

### Task 7: Mobile menu/lang tap-target ≥44px

**Finding:** Ссылки в бургер-dropdown — inline, tap-target ~20-24px. (gemini-1 MED, opus-1 MED)

**Files:** `src/components/Navbar.tsx`

- [ ] **Step 7.1: Nav-ссылки в dropdown → block py-3**

Найти `navItems` определение (3 `<a>` ссылки):
```tsx
  const navItems = (
    <>
      <a href="#architecture" onClick={() => setOpen(false)} className="hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.architecture}</a>
      <a href="https://docs.voxis.top" className="hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.docs}</a>
      <a href="https://github.com/axelbaumlisto/voxis" className="hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.github}</a>
    </>
  );
```
Заменить:
```tsx
  const navItems = (
    <>
      <a href="#architecture" onClick={() => setOpen(false)} className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.architecture}</a>
      <a href="https://docs.voxis.top" className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.docs}</a>
      <a href="https://github.com/axelbaumlisto/voxis" className="block py-3 hover:text-[var(--color-accent)] transition-colors duration-200 ease-out">{links.github}</a>
    </>
  );
```

- [ ] **Step 7.2: Lang-switch в dropdown — min-h-44**

В dropdown-блоке (внутри `{open && (...)}`) lang-switch обёрнут в `<div className="pt-2">`. Заменить обёртку lang-switch ссылок так, чтобы тап-зона ≥44px. Найти:
```tsx
          <div className="pt-2">{langSwitch}</div>
```
Заменить:
```tsx
          <div className="pt-2 min-h-[44px] flex items-center">{langSwitch}</div>
```

- [ ] **Step 7.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx
git commit -m "fix(landing): mobile dropdown tap-targets ≥44px (block py-3 + lang min-h)"
```

---

### Task 8: Showcase placeholders cleanup

**Finding:** Плейсхолдеры дублируют caption + выглядят пустыми dev-заглушками. (opus-1 MED, gemini-1 LOW)

**Files:** `src/components/Showcase.tsx`

- [ ] **Step 8.1: Иконка-плейсхолдер + одна подпись**

Найти:
```tsx
              {/* TODO(owner): replace with <img src="/screenshots/xxx.png" .../> */}
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-cyan-950/30 to-black text-zinc-600 text-xs font-mono">
                screenshot: {cap}
              </div>
              <figcaption className="p-[var(--space-sm)] text-center text-sm text-zinc-400">{cap}</figcaption>
```
Заменить:
```tsx
              {/* TODO(owner): replace with <img src="/screenshots/xxx.png" .../> */}
              <div className="aspect-video grid place-items-center bg-gradient-to-br from-[var(--color-surface,#0a0a0a)] to-black">
                <ImageIcon className="w-8 h-8 text-zinc-700" aria-hidden />
              </div>
              <figcaption className="p-[var(--space-sm)] text-center text-sm text-zinc-400">{cap}</figcaption>
```

- [ ] **Step 8.2: Импорт ImageIcon из lucide-react**

Найти в начале `Showcase.tsx`:
```tsx
import Container from "./ui/Container";
```
Заменить:
```tsx
import { ImageIcon } from "lucide-react";
import Container from "./ui/Container";
```

- [ ] **Step 8.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Showcase.tsx
git commit -m "polish(landing): showcase placeholders — icon + single caption (was duplicated, dev-looking)"
```

---

## 🟡 LOW

### Task 9: Dead code cleanup — SectionHeading + мёртвые токены

**Finding:** `SectionHeading.tsx` не импортируется нигде. `--color-accent-{blue,purple,emerald,amber}` + `--glow-{blue,purple,emerald,amber}` не используются после cyan-моно. (opus-1 LOW)

**Files:** delete `src/components/ui/SectionHeading.tsx`; modify `src/app/globals.css`

- [ ] **Step 9.1: Удалить SectionHeading.tsx**
```bash
rm src/components/ui/SectionHeading.tsx
```
Verify:
```bash
grep -rn "SectionHeading" src/ | grep -v "ui/SectionHeading"
```
Ожидание: 0 (только комментарий в Hero упоминает — оставить комментарий, он про паттерн).

- [ ] **Step 9.2: Удалить мёртвые токены из globals.css**

Найти и удалить строки:
```css
  --color-accent-blue:       #3b82f6;
  --color-accent-purple:     #a855f7;
  --color-accent-emerald:    #34d399;
  --color-accent-amber:      #eab308;
```
и:
```css
  --glow-blue:    rgba(59, 130, 246, 0.4);
  --glow-purple:  rgba(168, 85, 247, 0.4);
  --glow-emerald: rgba(52, 211, 153, 0.4);
  --glow-amber:   rgba(234, 179, 8, 0.4);
```

- [ ] **Step 9.3: Verify — нет использований удалённых токенов**
```bash
grep -rn "color-accent-blue\|color-accent-purple\|color-accent-emerald\|color-accent-amber\|glow-blue\|glow-purple\|glow-emerald\|glow-amber" src/
```
Ожидание: 0.

- [ ] **Step 9.4: Lint + build + commit**
```bash
npm run lint && npm run build
git add -A src/components/ui/SectionHeading.tsx src/app/globals.css
git commit -m "chore(landing): remove dead SectionHeading + unused accent/glow tokens (rainbow-era cleanup)"
```

---

### Task 10: Token drift — `cyan-400` → `var(--color-accent)`

**Finding:** `Features.tsx`/`Showcase.tsx` хардкодят `cyan-400`/`cyan-950` вместо токена. (opus-1 LOW)

**Files:** `src/components/Features.tsx`, `src/components/Showcase.tsx`

- [ ] **Step 10.1: Features.tsx**

```bash
sed -i 's|hover:border-cyan-400/40|hover:border-[var(--color-accent)]/40|; s|text-cyan-400|text-[var(--color-accent)]|' src/components/Features.tsx
```

- [ ] **Step 10.2: Showcase.tsx** (Task 8 уже поменял `from-cyan-950/30` на `from-[var(--color-surface,#0a0a0a)]` — проверить)

```bash
grep -n "cyan-950\|cyan-400" src/components/Showcase.tsx
```
Если остались — заменить на `var(--color-surface,#0a0a0a)` (для градиента) или `var(--color-accent)`.

- [ ] **Step 10.3: Verify + commit**
```bash
grep -rn "cyan-400\|cyan-950" src/components/ | grep -v node_modules
```
Ожидание: 0 (или только в architecture data `border-cyan-400` — это ОК, оставляем, оно через CYAN-конст из data).
```bash
npm run lint && npm run build
git add src/components/Features.tsx src/components/Showcase.tsx
git commit -m "polish(landing): cyan-400 → var(--color-accent) token (no drift on rebrand)"
```

---

### Task 11: Magic numbers → токены (Footer + BentoStack)

**Finding:** `py-20` BentoStack, `py-12`/`py-4` Footer — мимо шкалы. (opus-1 LOW)

**Files:** `src/components/Footer.tsx`, `src/components/Architecture.tsx`

- [ ] **Step 11.1: Footer py-12 → py-3xl, py-4 → py-sm**

```bash
sed -i 's|className="py-12 flex|className="py-[var(--space-3xl)] flex|; s|className="py-4 text-center|className="py-[var(--space-sm)] text-center|' src/components/Footer.tsx
```

- [ ] **Step 11.2: BentoStack py-20 → py-3xl**

Найти в `Architecture.tsx`:
```tsx
    <div className="flex flex-col items-center justify-center px-4 py-20 gap-8">
```
Заменить:
```tsx
    <div className="flex flex-col items-center justify-center px-4 py-[var(--space-3xl)] gap-8">
```

- [ ] **Step 11.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Footer.tsx src/components/Architecture.tsx
git commit -m "polish(landing): magic py-20/py-12/py-4 → space tokens (8pt rhythm consistency)"
```

---

### Task 12: Code-pill Stage 2 обрезает имя класса — flex-col на десктопе

**Finding:** `orchestrator::TranscriptionCoordinator` → `TranscriptionCoordina…` на десктопе. (opus-1 LOW)

**Files:** `src/components/Architecture.tsx`

- [ ] **Step 12.1: Desktop code-pill — приоритет имени, filename на вторую строку**

Найти в layer-card (desktop, ~строка 210):
```tsx
                           <div className={`w-full p-4 rounded-xl bg-[#0d1117]/80 border border-white/5 font-mono text-sm shadow-inner ${step.iconColor} flex flex-col md:flex-row md:items-center justify-between gap-2 overflow-hidden`}>
                             <span className="truncate" title={step.className}>{step.className}</span>
                             <span className="text-zinc-600 text-xs shrink-0" title={step.filePath}>
                               {step.filePath.split("/").pop()}
                             </span>
                           </div>
```
Заменить (убрать `md:flex-row`, оставить column; имя `min-w-0`+truncate, filename shrink-0):
```tsx
                           <div className={`w-full p-4 rounded-xl bg-[#0d1117]/80 border border-white/5 font-mono text-sm shadow-inner ${step.iconColor} flex flex-col gap-1 overflow-hidden`}>
                             <span className="truncate min-w-0" title={step.className}>{step.className}</span>
                             <span className="text-zinc-600 text-xs shrink-0" title={step.filePath}>
                               {step.filePath.split("/").pop()}
                             </span>
                           </div>
```

- [ ] **Step 12.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "fix(landing): desktop code-pill flex-col — full className visible (was truncated TranscriptionCoordina…)"
```

---

### Task 13: FAQ accordion через `<details>` + RU i18n star copy

**Finding:** FAQ статичные Q/A — лишняя высота. «Звезда на GitHub» дословно. (opus-1 LOW, gemini-3 MINOR)

**Files:** `src/components/Faq.tsx`, `src/components/DownloadCta.tsx`

- [ ] **Step 13.1: FAQ → нативный `<details>` accordion**

В `src/components/Faq.tsx` найти блок маппинга:
```tsx
          {t.items.map((it, i) => (
            <div key={i} className="rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)]">
              <h3 className="text-lg font-bold text-white mb-[var(--space-2xs)]">{it.q}</h3>
              <p className="text-zinc-400 leading-relaxed">{it.a}</p>
            </div>
          ))}
```
Заменить:
```tsx
          {t.items.map((it, i) => (
            <details key={i} className="group rounded-[var(--glass-radius)] border border-white/10 bg-white/[0.02] p-[var(--space-lg)] open:border-[var(--color-accent)]/30">
              <summary className="text-lg font-bold text-white cursor-pointer list-none flex items-center justify-between gap-[var(--space-md)] marker:hidden">
                <span>{it.q}</span>
                <span className="text-[var(--color-accent)] text-2xl font-light transition-transform duration-300 ease-out group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="text-zinc-400 leading-relaxed mt-[var(--space-sm)]">{it.a}</p>
            </details>
          ))}
```

- [ ] **Step 13.2: DownloadCta RU star copy**

В `src/components/DownloadCta.tsx` найти:
```tsx
    ? { heading: "Готовы писать со скоростью мысли?", sub: "Бесплатно и с открытым исходным кодом.", dl: "Скачать Voxis", star: "Звезда на GitHub" }
```
Заменить:
```tsx
    ? { heading: "Готовы писать со скоростью мысли?", sub: "Бесплатно и с открытым исходным кодом.", dl: "Скачать Voxis", star: "Поставить звезду" }
```

- [ ] **Step 13.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Faq.tsx src/components/DownloadCta.tsx
git commit -m "feat(landing): FAQ accordion (native <details>) + RU star copy fix"
```

---

## 🚀 Deploy + verify

### Task 14: Push + live verify

- [ ] **Step 14.1: Push**
```bash
cd /home/sham/work/voxis-landing
git push origin main
```
Vercel auto-deploy.

- [ ] **Step 14.2: Wait ~90s, verify live markers**
```bash
sleep 90
curl -s https://voxis.top | grep -oE 'fixed inset-x-0|cyrillic|2\.5rem|class="section|<details|Поставить звезду' | sort -u
```
Ожидаемые: `fixed inset-x-0` (Task 1), `<details` (Task 13), `Поставить звезду` (на /ru). Cyrillic subset виден в font preload. `clamp(2.5rem` в CSS (Task 3).

- [ ] **Step 14.3: Playwright live screenshots**
```bash
mkdir -p /tmp/v5-final
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top /tmp/v5-final/en-full.png
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top/ru /tmp/v5-final/ru-full.png
bunx playwright screenshot --viewport-size=390,844 --full-page --wait-for-timeout=2500 https://voxis.top /tmp/v5-final/mobile.png
bunx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 https://voxis.top /tmp/v5-final/en-hero.png
```
Verify визуально: (a) navbar full-width bg при скролле; (b) RU hero/Features/FAQ шрифтом Geist (не системным); (c) mobile hero не разбит на 4 строки; (d) content-секции без экран-пустот; (e) FAQ accordion раскрыт/закрыт; (f) code-pill Stage 2 полное имя.

---

## Self-Review (coverage)

| v4-находка | Severity | Task |
|------------|----------|------|
| Sticky navbar не full-width | 🔴 HIGH | 1 |
| RU cyrillic subset | 🔴 HIGH | 2 |
| Mobile display floor 3rem | 🔴 HIGH | 3 |
| Content py-4xl мобайл пустоты | 🔴 HIGH | 4 |
| transition-all jank 3D | 🟠 MED | 5 |
| Navbar anchor overlap | 🟠 MED | 6 |
| Mobile tap-target <44px | 🟠 MED | 7 |
| Showcase placeholder duplicate | 🟠 MED | 8 |
| SectionHeading dead code | 🟡 LOW | 9 |
| Мёртвые accent/glow токены | 🟡 LOW | 9 |
| cyan-400 token drift | 🟡 LOW | 10 |
| Magic py-20/py-12/py-4 | 🟡 LOW | 11 |
| Code-pill truncate Stage 2 | 🟡 LOW | 12 |
| FAQ accordion | 🟡 LOW | 13 |
| RU star copy | 🟡 LOW | 13 |
| Breathing 2.4s magic | 🟡 LOW | (не в плане — обоснованное значение, единственное место; комментарий излишен) |
| «Major dead-zone Architecture→Why Voxis» (opus-2) | ? | (verify в Task 14.3 — если реальный gap, отдельный фикс) |

**Coverage:** 4/4 HIGH + 4/4 MEDIUM + 7/9 LOW = 13 задач. Опущены: breathing `2.4s` (обоснованное единичное значение, не worth токенизации), opus-2 dead-zone (проверяется в Task 14 — если реальный, добавим task 15).

**Type consistency:** `var(--color-accent)` — единственный brand token после Task 9 (мёртвые удалены). `.section` utility — один резолвер padding для всех content-секций после Task 4. `<details>` — native, zero-JS, a11y из коробки.
