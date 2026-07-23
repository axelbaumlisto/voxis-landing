# Backlog 03 — Motion durations JS bridge

**Goal:** Убрать захардкоженные `0.6`/`0.3` из framer-motion transitions — тянуть из CSS-токенов `--dur-slow`/`--dur-base` через единый JS-модуль. Единая моторика между CSS и framer. (opus-1 3.3)

**Files:** Create `src/lib/motion.ts`; modify `src/components/Hero.tsx`, `src/components/Architecture.tsx`

**Approach:** framer-motion принимает duration в СЕКУНДАХ (не ms). Модуль экспортирует секундные константы + easing-tuple, синхронные с CSS-токенами. Значения дублируют CSS (не читаем `getComputedStyle` на SSR — это единый source-of-truth модуль, а CSS-токены совпадают по значению). Проще и SSR-safe.

---

## Task 1: Создать motion.ts

- [ ] **Step 1.1: Модуль констант**

Создать `src/lib/motion.ts`:
```ts
// Single source of truth for motion timings, mirrored 1:1 with the CSS
// tokens in globals.css (--dur-*, --ease-out-expo). framer-motion wants
// seconds; CSS wants ms — values are kept in sync here by hand.
//
//   CSS            | seconds
//   --dur-fast 200 | 0.2
//   --dur-base 300 | 0.3
//   --dur-slow 600 | 0.6
//   --ease-out-expo cubic-bezier(0.16, 1, 0.3, 1)

export const DUR = {
  fast: 0.2,
  base: 0.3,
  slow: 0.6,
} as const;

// framer-motion cubic-bezier tuple form of --ease-out-expo
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
```

## Task 2: Использовать в Hero

- [ ] **Step 2.1: Импорт + rise()**

В `src/components/Hero.tsx` добавить импорт вверху:
```tsx
import { DUR, EASE_OUT_EXPO } from "../lib/motion";
```

Найти в `rise()`:
```tsx
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
```
Заменить:
```tsx
          transition: { duration: DUR.slow, delay, ease: EASE_OUT_EXPO },
```

## Task 3: Использовать в Architecture

- [ ] **Step 3.1: Импорт + layer-card transition**

В `src/components/Architecture.tsx` добавить импорт:
```tsx
import { DUR, EASE_OUT_EXPO } from "../lib/motion";
```

Найти в layer-card `motion.div`:
```tsx
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
```
Заменить:
```tsx
                      transition={{ duration: DUR.base, ease: EASE_OUT_EXPO }}
```

## Task 4: Verify + commit

- [ ] **Step 4.1: Grep — нет захардкоженных framer durations**
```bash
cd /home/sham/work/voxis-landing
grep -nE "duration: 0\.[0-9]|ease: \[0\.16" src/components/*.tsx
```
Ожидание: 0 (все через DUR/EASE_OUT_EXPO). Если остались CSS `duration-300` в className (Tailwind) — их не трогаем, это CSS-класс, не framer.

- [ ] **Step 4.2: Lint + build**
```bash
npm run lint && npm run build
```

- [ ] **Step 4.3: Commit**
```bash
git add src/lib/motion.ts src/components/Hero.tsx src/components/Architecture.tsx
git commit -m "refactor(landing): motion.ts bridge — framer durations from shared tokens"
```
