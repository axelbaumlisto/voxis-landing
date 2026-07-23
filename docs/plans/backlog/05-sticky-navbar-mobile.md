# Backlog 05 — Sticky navbar on mobile

**Goal:** Navbar сейчас `absolute top-0` — уезжает при скролле, гамбургер недоступен без прокрутки вверх. Сделать `fixed` со scroll-triggered фоном (прозрачный сверху → blur+bg при скролле). (opus-1 8.2, opus-3 L1-adjacent)

**Files:** `src/components/Navbar.tsx`

**Risk:** `fixed` может перекрывать hero-контент — hero имеет `section-hero` с большим top-padding, места достаточно. Проверить что fixed navbar не налезает на badge.

---

## Task 1: absolute → fixed + scroll-bg

- [ ] **Step 1.1: Добавить scroll-состояние**

В `src/components/Navbar.tsx` — Navbar уже client (`"use client"` + useState). Добавить scroll-listener. После `const [open, setOpen] = useState(false);` добавить:
```tsx
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
```
Импорт `useEffect` — добавить в существующий react-импорт:
```tsx
import { useState, useEffect } from "react";
```

- [ ] **Step 1.2: absolute → fixed + условный фон**

Найти:
```tsx
    <Container as="nav" width="page" className="py-[var(--space-md)] flex justify-between items-center absolute top-0 left-1/2 -translate-x-1/2 z-50 backdrop-blur-sm bg-transparent border-b border-[var(--color-border-subtle)]">
```
Заменить:
```tsx
    <Container as="nav" width="page" className={`py-[var(--space-md)] flex justify-between items-center fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-colors duration-300 ease-out ${scrolled ? "backdrop-blur-md bg-black/60 border-b border-[var(--color-border-subtle)]" : "bg-transparent border-b border-transparent"}`}>
```

## Task 2: Verify + commit

- [ ] **Step 2.1: Скриншот mobile — top + scrolled**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
cat > /tmp/nav.mjs <<'EOF'
import { chromium } from "/home/sham/work/voxis-landing/node_modules/playwright/index.js";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:390,height:844} })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(2000);
await p.screenshot({ path:"/tmp/nav-top.png" });          // прозрачный сверху
await p.evaluate(()=>window.scrollTo(0,1200));
await p.waitForTimeout(600);
await p.screenshot({ path:"/tmp/nav-scrolled.png" });     // navbar остался вверху с bg
await b.close();
EOF
node /tmp/nav.mjs; kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` оба — top: прозрачный navbar; scrolled: navbar ЗАКРЕПЛЁН вверху с blur+bg (не уехал), гамбургер доступен.

- [ ] **Step 2.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx
git commit -m "fix(landing): sticky navbar (fixed + scroll-triggered bg) — hamburger always reachable"
```
