# Voxis Landing — Visual Fixes v3 (senior-panel-3)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (or /ado). Steps use checkbox syntax. Worker model: `o/gpt-5.5`. This plan uses **worker/reviewer** agents only — NOT vision-designer (previous v3-areview run showed vision-designer agents did not respect read-only scope and edited code chaotically).

**Goal:** Устранить BLOCKER/HIGH находки консенсусного v3-визуал-ревью (opus-1 + opus-3, независимые): убрать 5-цветную радугу Architecture в cyan-моно, вернуть peek (регресс v2-фичи), брендинг badge-dot + LavaLamp uCol3 в cyan, добавить focus-visible системно, параметризовать magic numbers motion, устранить mobile touch-target < 44px, ослабить hero scrim.

**Context / что уже сделано:** v1 (rename+cleanup+CI), v2 (hero peek + LavaLamp + i18n + 320vh + popLayout stepper + subtitle-eyebrow + code-pill filePath + breathing dot), REV-001 (reactive mobile gate). Прод deploy = `c0f84e3` (стабильный). Все правки v3 идут поверх этого.

**Architecture:** правки в **7 файлов** (globals.css, Hero, Architecture, LavaLampBg, Navbar, LandingPage, data/architecture.ts). Никаких новых зависимостей — если worker захочет `npm install playwright`, отвергнуть (в проекте не нужен). Используем существующие токены `--color-accent`, `--dur-*`, `--ease-*`, `--glass-radius-*`, `--space-*`, `--text-display`, `--text-h1`. Contentные секции (features/screenshots/FAQ) НЕ в этом плане.

**Tech Stack:** Next.js 15, React 19, framer-motion, Tailwind v4 (`@theme` + `@utility`), WebGL 1.0. npm.

**Repo:** `github.com/axelbaumlisto/voxis-landing`, working dir `/home/sham/work/voxis-landing`. Vercel Git integration авто-деплоит `main`. Прод = `voxis.top`.

---

## Conventions per task

- **Verify per task:** `npm run lint && npm run build` — оба чистые, warnings=0.
- **Commit style:** conventional commits, 1 коммит на задачу.
- **Deploy:** после Task 9 — `git push origin main` → Vercel auto-deploy → live-verify через `curl`.
- **Rollback safety:** каждая задача атомарна, можно откатить `git revert <sha>` не ломая остальные.

---

## File Structure

| File | Responsibility | Tasks |
|------|----------------|-------|
| `src/data/architecture.ts` | Убрать 5-цветную радугу, сделать cyan-моно ramp | 1 |
| `src/app/globals.css` | badge-dot cyan, focus-visible global, token adoption | 2, 5, 8 |
| `src/components/LavaLampBg.tsx` | uCol3 purple → deep-cyan | 3 |
| `src/components/Hero.tsx` | fix peek (убрать двойной паддинг), scrim ослабить | 4, 6 |
| `src/components/Architecture.tsx` | параметризовать magic numbers, radius→токены, tightening 320vh→240vh | 7, 8 |
| `src/components/Navbar.tsx` | touch-target гамбургера ≥44px | 5 (bundled) |

---

## Task 1: Убрать 5-цветную радугу Architecture → cyan-моно ramp

**Findings (opus-1 5.2 + opus-3 B1, CONSENSUS BLOCKER):** сейчас 5 stage'ов красятся в cyan/blue/amber/purple/emerald. Amber читается как «warning», emerald как «success». Ломает cyan-бренд и не согласуется с LavaLamp-палитрой.

**Approach:** сохранить визуальную идентификацию через **иконку + eyebrow-номер («STAGE N // …»)**, а не цвет. Все 5 stages получают ОДНУ cyan-палитру. Различия: только формы иконок (Terminal / Cpu / Mic / Brain / Keyboard) + номера в eyebrow.

**Files:** `src/data/architecture.ts`.

- [ ] **Step 1.1: Определить общую cyan-константу**

В `src/data/architecture.ts` — в начале файла, ПЕРЕД `const layers = [`, добавить:

```ts
// Unified cyan brand ramp: stage identity comes from icon + eyebrow number,
// not colour. Keeps cohesion with --color-accent (#22d3ee) and LavaLamp palette.
const CYAN = {
  glow: "shadow-[0_0_40px_rgba(34,211,238,0.4)] border-cyan-400",
  iconColor: "text-cyan-400",
  hex: "#22d3ee",
} as const;
```

- [ ] **Step 1.2: Заменить per-stage цвета на CYAN spread**

В `src/data/architecture.ts` — заменить весь массив `const layers = [ … ]` (5 объектов) целиком. Полный код замены:

```ts
const layers = [
  {
    iconName: "terminal" as IconKey,
    className: "hotkey::HotkeyListener",
    filePath: "src-tauri/src/hotkey/mod.rs",
    ...CYAN,
  },
  {
    iconName: "cpu" as IconKey,
    className: "orchestrator::TranscriptionCoordinator",
    filePath: "src-tauri/src/orchestrator/coordinator.rs",
    ...CYAN,
  },
  {
    iconName: "mic" as IconKey,
    className: "audio::stream",
    filePath: "src-tauri/src/audio/stream.rs",
    ...CYAN,
  },
  {
    iconName: "brain" as IconKey,
    className: "transcription::TranscriptionClient",
    filePath: "src-tauri/src/transcription/mod.rs",
    ...CYAN,
  },
  {
    iconName: "keyboard" as IconKey,
    className: "output::OutputHandler",
    filePath: "src-tauri/src/output/mod.rs",
    ...CYAN,
  },
];
```

- [ ] **Step 1.3: Verify (все stage'ы теперь cyan)**

```bash
cd /home/sham/work/voxis-landing
grep -nE "border-cyan-400|border-blue-500|border-yellow-500|border-purple-500|border-emerald-400" src/data/architecture.ts
```
Ожидание: 5 строк с `border-cyan-400`, ноль остальных.

- [ ] **Step 1.4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 1.5: Commit**

```bash
git add src/data/architecture.ts
git commit -m "fix(landing): unify architecture stages to cyan mono ramp (kill rainbow)"
```

---

## Task 2: badge-dot cyan (был emerald)

**Findings (opus-1 5.1 + opus-3 B2, CONSENSUS BLOCKER):** `badge-dot` background = `#34d399` emerald + emerald glow — самый яркий пиксель выше фолда вне бренда после того как `--color-accent` стал cyan.

**Files:** `src/app/globals.css`.

- [ ] **Step 2.1: Заменить emerald на var(--color-accent)**

Найти в `src/app/globals.css`:

```css
@utility badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #34d399;
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.8);
}
```

Заменить на:

```css
@utility badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--color-accent);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
}
```

- [ ] **Step 2.2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 2.3: Commit**

```bash
git add src/app/globals.css
git commit -m "fix(landing): badge-dot uses --color-accent (was emerald)"
```

---

## Task 3: LavaLamp uCol3 purple → deep cyan

**Findings (opus-3 H2):** LavaLamp сейчас cyan/blue/**purple**/teal. Purple `#a855f7` тянет hero в фиолет вопреки cyan-бренду. По консенсусу пул нужно затянуть в cool cyan-family.

**Files:** `src/components/LavaLampBg.tsx`.

- [ ] **Step 3.1: Заменить uCol3 на deep-cyan**

Найти в `src/components/LavaLampBg.tsx`:

```tsx
    gl.uniform3f(gl.getUniformLocation(prog, "uCol3"), 0.659, 0.333, 0.969); // #a855f7 purple
```

Заменить на:

```tsx
    gl.uniform3f(gl.getUniformLocation(prog, "uCol3"), 0.024, 0.714, 0.831); // #06b6d4 deep cyan
```

- [ ] **Step 3.2: Verify (нет purple в LavaLamp uniform-ах)**

```bash
grep -nE "a855f7|0\.659, 0\.333, 0\.969" src/components/LavaLampBg.tsx
```
Ожидание: 0 совпадений.

- [ ] **Step 3.3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3.4: Commit**

```bash
git add src/components/LavaLampBg.tsx
git commit -m "fix(landing): LavaLamp uCol3 purple -> deep cyan (cohesive brand palette)"
```

---

## Task 4: Hero peek fix — убрать двойной паддинг

**Findings (opus-1 1.1/1.2, BLOCKER):** Hero имеет одновременно:
- `.section-hero` класс с `padding-block: var(--space-4xl)` = 8rem сверху+снизу (из `globals.css`)
- inline `pt-24 pb-16` = 6rem/4rem
- `min-h-[68vh]`

Тройное наложение раздувает hero, из-за чего заявленный peek architecture НЕ виден в первом кадре 1440×900 (появляется только с ~10% скролла).

**Approach:** оставить одну систему — токен-паддинг через `.section-hero` с асимметрией (большой top, малый bottom, чтобы верх Architecture peek'ал в фолд).

**Files:** `src/components/Hero.tsx`, `src/app/globals.css`.

- [ ] **Step 4.1: Убрать inline pt/pb из Hero.tsx**

Найти в `src/components/Hero.tsx` (примерно строка 30):

```tsx
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-[68vh] pt-24 pb-16">
```

Заменить на:

```tsx
    <section className="section-hero flex flex-col items-center justify-center text-center relative z-10 min-h-[68vh]">
```

- [ ] **Step 4.2: Сделать .section-hero асимметричным**

Найти в `src/app/globals.css`:

```css
.section-hero {
  padding-block: var(--space-4xl);
```

Заменить на:

```css
.section-hero {
  padding-block: var(--space-4xl) var(--space-lg);
```

(Так top остаётся большим — под navbar есть воздух, — а bottom становится 2rem вместо 8rem, и верх Architecture заходит в фолд на реальном 1440×900.)

- [ ] **Step 4.3: Verify peek visible через playwright**

```bash
cd /home/sham/work/voxis-landing
npm run dev &
DEV_PID=$!
sleep 8
bunx playwright screenshot --viewport-size=1440,900 http://localhost:3000/ /tmp/v3-peek-check.png
kill $DEV_PID
wait $DEV_PID 2>/dev/null
```

Затем через `read` смотрю `/tmp/v3-peek-check.png` — в нижней 20-30% высоты первого кадра должен виднеться верх bento-стека или sticky-контейнера Architecture. Если нет — уточнить `min-h-[68vh]` до `min-h-[62vh]` или уменьшить `--space-4xl` в globals.css.

- [ ] **Step 4.4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4.5: Commit**

```bash
git add src/components/Hero.tsx src/app/globals.css
git commit -m "fix(landing): hero peek — remove double padding, .section-hero asymmetric"
```

---

## Task 5: Global focus-visible + mobile touch target гамбургер ≥44px

**Findings (opus-1 6.1, HIGH):** 0 совпадений `:focus-visible` в `src/` — кастомного фокуса нет вообще. Ранее `--color-accent` перекрасили в cyan, но перекрашивать было нечего. Плюс **opus-1 8.1**: touch-target гамбургера 40px (button p-2 + w-6 h-6 = 40px), min требуется 44px.

**Files:** `src/app/globals.css`, `src/components/Navbar.tsx`.

- [ ] **Step 5.1: Глобальный focus-visible в globals.css**

Найти в `src/app/globals.css` — в конце файла (или после блока `.btn-*`), добавить:

```css
/* Global focus-visible rings — cyan brand, offset from dark bg */
.btn-base:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 6px;
}

::selection {
  background: rgba(34, 211, 238, 0.3);
  color: #fff;
}
```

- [ ] **Step 5.2: Гамбургер touch-target ≥44px**

Найти в `src/components/Navbar.tsx`:

```tsx
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-2"
      >
```

Заменить на:

```tsx
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-white p-3 -m-1"
      >
```

(`p-3` = 12px padding = 24 (icon) + 24 (padding) = 48px tap area. `-m-1` компенсирует лишний размер визуально, не смещая соседние элементы.)

- [ ] **Step 5.3: Verify focus rings visible**

```bash
cd /home/sham/work/voxis-landing
grep -nE "focus-visible" src/app/globals.css | wc -l
```
Ожидание: минимум 1 совпадение (три селектора в одном правиле = 1 grep line, ок).

- [ ] **Step 5.4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 5.5: Commit**

```bash
git add src/app/globals.css src/components/Navbar.tsx
git commit -m "fix(landing): add global focus-visible cyan rings + hamburger 44px tap target"
```

---

## Task 6: Ослабить hero scrim (вернуть light play LavaLamp)

**Findings (opus-1 2.1, MEDIUM):** scrim центр `rgba(0,0,0,0.72)` гасит blob'а почти в ноль → лава выглядит статично, «light play» пропадает. Задача v2 (читаемость) выполнена, теперь можно ослабить до баланса.

**Files:** `src/components/Hero.tsx`.

- [ ] **Step 6.1: Ослабить scrim**

Найти в `src/components/Hero.tsx`:

```tsx
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
        }}
      />
```

Заменить `background` значение:

```tsx
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(60% 55% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.32) 55%, transparent 100%)",
        }}
      />
```

- [ ] **Step 6.2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 6.3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "fix(landing): ease hero scrim (0.72->0.6) to restore lavalamp light play"
```

---

## Task 7: Параметризовать magic numbers в Architecture motion

**Findings (opus-1 3.1 + opus-3 M2, HIGH):** `p*4.99` захардкожен дважды в разных местах (`BoardLayer` и `useMotionValueEvent`). При добавлении 6-го stage сломается молча. Должно быть выведено из `steps.length`.

**Files:** `src/components/Architecture.tsx`.

- [ ] **Step 7.1: Ввести FLY_MAX через steps.length**

Найти в `src/components/Architecture.tsx` два места где используется `4.99`:

**Место 1** — внутри `BoardLayer`, в `useTransform`:
```tsx
    const fly = p * 4.99;
```

Заменить на:
```tsx
    const fly = p * (stepCount - 0.01);
```

Также ДОБАВИТЬ параметр `stepCount: number` в интерфейс `BoardLayer` пропсов (в начале функции). Прямо перед деструктуризацией пропсов:

```tsx
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
```

(Если `stepCount` уже был в интерфейсе — не дублировать. Проверить `grep -n stepCount src/components/Architecture.tsx` перед редактированием: если найдено, значит уже проброшен, просто использовать.)

**Место 2** — в `Architecture()`, `useMotionValueEvent`:
```tsx
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const f = latest * 4.99;
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });
```

Заменить на:
```tsx
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const f = latest * (steps.length - 0.01);
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(f))));
  });
```

**Место 3** — вызов `<BoardLayer />` — прокинуть `stepCount`:

Найти:
```tsx
              {steps.map((step, i) => (
                <BoardLayer
                  key={i}
                  step={step}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  active={active}
                />
              ))}
```

Заменить на:
```tsx
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
```

- [ ] **Step 7.2: Verify no 4.99 remains**

```bash
grep -n "4\.99" src/components/Architecture.tsx
```
Ожидание: 0 совпадений.

- [ ] **Step 7.3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 7.4: Commit**

```bash
git add src/components/Architecture.tsx
git commit -m "fix(landing): parametrize fly-through from steps.length (no more magic 4.99)"
```

---

## Task 8: Radius tokens в Architecture

**Findings (opus-1 7.1 + opus-3 M1, MEDIUM):** `rounded-[40px]` и `rounded-[32px]` захардкожены. Есть токены `--glass-radius` (24px = 1.5rem) и `--glass-radius-lg` (32px = 2rem).

**Files:** `src/components/Architecture.tsx`.

- [ ] **Step 8.1: Заменить hardcoded radius на token utilities**

В `src/components/Architecture.tsx`:

Заменить все вхождения `rounded-[40px]` → `rounded-[var(--glass-radius-lg)]`:
```bash
sed -i 's|rounded-\[40px\]|rounded-[var(--glass-radius-lg)]|g' src/components/Architecture.tsx
```

Заменить все вхождения `rounded-[32px]` → `rounded-[var(--glass-radius-lg)]`:
```bash
sed -i 's|rounded-\[32px\]|rounded-[var(--glass-radius-lg)]|g' src/components/Architecture.tsx
```

Заменить `rounded-3xl` (24px) на `rounded-[var(--glass-radius)]` в bento-карточках и chip:
```bash
sed -i 's|rounded-3xl|rounded-[var(--glass-radius)]|g' src/components/Architecture.tsx
```

- [ ] **Step 8.2: Verify no hardcoded radii remain**

```bash
grep -nE "rounded-\[(40|32)px\]|rounded-3xl" src/components/Architecture.tsx
```
Ожидание: 0 совпадений.

- [ ] **Step 8.3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 8.4: Commit**

```bash
git add src/components/Architecture.tsx
git commit -m "polish(landing): radius tokens (--glass-radius-lg / --glass-radius) instead of hardcoded"
```

---

## Task 9: Push + deploy verify

- [ ] **Step 9.1: Push**

```bash
cd /home/sham/work/voxis-landing
git push origin main
```

Vercel Git-интеграция авто-деплоит.

- [ ] **Step 9.2: Wait ~90s, verify markers on live voxis.top**

```bash
sleep 90
curl -s https://voxis.top | grep -oE 'rgba\(34, ?211, ?238|border-cyan-400|06b6d4|padding-block: var\(--space-4xl\) var\(--space-lg\)' | sort -u
```

Ожидаемые маркеры:
- `rgba(34, 211, 238` — badge-dot glow (Task 2)
- `border-cyan-400` — cyan-моно ramp архитектуры (Task 1)
- **отсутствует** `#a855f7`/purple в LavaLamp (Task 3)
- **отсутствует** `pt-24 pb-16` в hero (Task 4)

- [ ] **Step 9.3: Playwright скриншоты для визуальной сверки**

```bash
mkdir -p /tmp/v3-final
bunx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 https://voxis.top /tmp/v3-final/en-hero.png
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top /tmp/v3-final/en-full.png
bunx playwright screenshot --viewport-size=390,844 --wait-for-timeout=2500 https://voxis.top /tmp/v3-final/en-mobile.png
bunx playwright screenshot --viewport-size=1440,900 --full-page --wait-for-timeout=2500 https://voxis.top/ru /tmp/v3-final/ru-full.png
```

Verify визуально: (a) badge-dot cyan, не emerald; (b) Architecture stages ВСЕ cyan (нет amber/purple/emerald карточек); (c) LavaLamp без purple лобов; (d) верх Architecture peek'ает в фолд 1440×900.

---

## What is NOT in this plan

**Опционально/следующее** (по консенсусу panel v3, но НЕ в этом плане — big-scope refactors либо контентная работа):

- Content sections (features / product screenshots / install-строка / FAQ / GitHub-stars) — требует продуктовых/копирайт решений
- Token adoption для типографики: `text-display`/`text-h1`/`text-lead` заменить хардкод `text-5xl md:text-8xl` во всех компонентах — big refactor, потенциально ломает существующие спейс-соотношения
- Motion durations через JS-константы (сейчас захардкожены `0.6/0.3` в framer transitions вместо `--dur-*`) — нужен `motion.ts` модуль с `getComputedStyle`, отдельно
- H1 dead-zone: сократить `md:h-[320vh]` → `md:h-[240vh]` + повысить floor opacity → надо тестировать что fly-through не ломается
- Hover cyan (текущий hover на nav-links — `text-white`, а не cyan) — предпочтения дизайнера, не блокер
- Sticky navbar на мобиле (сейчас `absolute top-0` — уезжает при скролле) — UX-фича, но не блокер визуала

---

## Self-Review (coverage)

| Ревью v3-панели | Severity | Task |
|-----------------|----------|------|
| Architecture 5-цвет радуга | 🔴 BLOCKER (opus-1+3) | 1 |
| Badge-dot emerald | 🔴 BLOCKER (opus-1+3) | 2 |
| Peek не виден 1440×900 | 🔴 BLOCKER (opus-1) | 4 |
| LavaLamp uCol3 purple | 🟠 HIGH (opus-3) | 3 |
| Focus-visible отсутствует | 🟠 HIGH (opus-1) | 5 |
| Magic 4.99 не параметризован | 🟠 HIGH (opus-1+3) | 7 |
| Dead-zone 320vh | 🟠 HIGH (opus-3) | *deferred* |
| Scrim переусилен | 🟡 MEDIUM (opus-1) | 6 |
| Touch-target гамбургер | 🟡 MEDIUM (opus-1) | 5 |
| Radius zoo | 🟡 MEDIUM (opus-1+3) | 8 |
| Token drift типо | 🟡 MEDIUM (opus-1+3) | *deferred* |
| Motion duration hardcoded | 🟡 MEDIUM (opus-1) | *deferred* |
| Vertical rhythm 8pt | 🟡 MEDIUM (opus-3) | *deferred* |

**Coverage:** 3/3 BLOCKER + 3/4 HIGH + 3/6 MEDIUM = 9 задач. Осознанно отложены: dead-zone (нужен тест fly-through), token drift типо (big refactor), motion durations (нужен `motion.ts` bridge), 8pt vertical rhythm (косметика).

**Type consistency:** `stepCount` уже был в интерфейсе `BoardLayer` в предыдущих версиях, Task 7.1 упоминает это в проверке перед редактированием — согласовано.

**No placeholders:** каждая задача имеет либо полный код замены (было → стало), либо конкретную grep/sed команду.
