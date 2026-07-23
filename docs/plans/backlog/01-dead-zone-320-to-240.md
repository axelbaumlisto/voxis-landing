# Backlog 01 — Dead-zone: 320vh → 240vh + opacity floor

**Goal:** Сократить скролл-трек Architecture с 320vh до 240vh и поднять нижнюю границу opacity слоёв до 0.06, чтобы убрать «мёртвые» протяжки скролла где 3D-стек почти невидим. (opus-3 H1)

**Files:** `src/components/Architecture.tsx`

**Risk:** fly-through может «спешить» после сокрщения трека — проверить что все 5 слоёв успевают сфокусироваться. Тест обязателен.

---

## Task 1: Сократить трек + поднять opacity floor

- [ ] **Step 1.1: 320vh → 240vh**

Найти:
```tsx
    <section id="architecture" ref={containerRef} className={`relative w-full bg-black ${reduce ? "" : "md:h-[320vh]"}`}>
```
Заменить:
```tsx
    <section id="architecture" ref={containerRef} className={`relative w-full bg-black ${reduce ? "" : "md:h-[240vh]"}`}>
```

- [ ] **Step 1.2: Поднять floor opacity в BoardLayer**

Найти в `BoardLayer` (useTransform для opacity):
```tsx
  const opacity = useTransform(
    currentZ,
    [-3200, -1600, -700, 0, 180, 420],
    [0.04,   0.22,  0.6, 1, 0.12, 0],
    { clamp: true }
  );
```
Заменить массив значений (никогда не в ноль, floor 0.06):
```tsx
  const opacity = useTransform(
    currentZ,
    [-3200, -1600, -700, 0, 180, 420],
    [0.08,   0.28,  0.65, 1, 0.18, 0.06],
    { clamp: true }
  );
```

- [ ] **Step 1.3: Тест fly-through (КРИТИЧНО)**

```bash
cd /home/sham/work/voxis-landing
npm run dev > /tmp/dev.log 2>&1 &
DEV=$!; sleep 9
cat > /tmp/flythrough.mjs <<'EOF'
import { chromium } from "/home/sham/work/voxis-landing/node_modules/playwright/index.js";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(2000);
const total = await p.evaluate(()=>document.body.scrollHeight);
for (const frac of [0.15,0.35,0.55,0.75,0.95]) {
  await p.evaluate(y=>window.scrollTo(0,y), total*frac);
  await p.waitForTimeout(1200);
  await p.screenshot({ path:`/tmp/ft-${frac}.png` });
}
await b.close();
EOF
node /tmp/flythrough.mjs; kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
Через `read` посмотреть `/tmp/ft-*.png` — на каждом кадре 3D-стек виден (не чёрный), активная карточка меняется, все 5 stage'ов достижимы. Если последний stage (Output Engine) не достигается при 0.95 — вернуть 260vh.

- [ ] **Step 1.4: Lint + build**
```bash
npm run lint && npm run build
```

- [ ] **Step 1.5: Commit**
```bash
git add src/components/Architecture.tsx
git commit -m "fix(landing): tighten arch scroll 320->240vh + opacity floor 0.06 (kill dead scrubbing)"
```
