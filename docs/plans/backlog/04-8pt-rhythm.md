# Backlog 04 — 8pt vertical rhythm in info-card

**Goal:** Убрать `mb-1` (4px) между eyebrow и title в layer-card — слишком тесно, вне 8pt-сетки. Стандартизировать вертикальные отступы карточки на spacing-токены. (opus-3 H3)

**Files:** `src/components/Architecture.tsx`

---

## Task 1: Eyebrow gap + tokenize card spacing

- [ ] **Step 1.1: Desktop layer-card eyebrow gap mb-1 → mb-2**

Найти:
```tsx
                                <div className="text-xs font-mono font-bold tracking-widest uppercase mb-1" style={{ color: step.hex }}>
                                  {step.subtitle}
                                </div>
```
Заменить (`mb-1`=4px → `mb-2`=8px, на 8pt-сетке):
```tsx
                                <div className="text-xs font-mono font-bold tracking-widest uppercase mb-2" style={{ color: step.hex }}>
                                  {step.subtitle}
                                </div>
```

- [ ] **Step 1.2: Layer-card desc margin → token**

Найти:
```tsx
                           <p className="text-zinc-300 text-lg leading-relaxed font-light mb-6">
                             {step.desc}
                           </p>
```
Заменить (`mb-6`=24px → токен `--space-md`=24px, тот же размер но из шкалы):
```tsx
                           <p className="text-zinc-300 text-lg leading-relaxed font-light mb-[var(--space-md)]">
                             {step.desc}
                           </p>
```

- [ ] **Step 1.3: Mobile bento eyebrow gap (если есть mb-1)**

```bash
grep -n "mb-1\b" src/components/Architecture.tsx
```
Если найдены ещё `mb-1` в BentoStack — заменить на `mb-2` тем же паттерном.

## Task 2: Verify + commit

- [ ] **Step 2.1: Скриншот arch scroll**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
cat > /tmp/rhythm.mjs <<'EOF'
import { chromium } from "/home/sham/work/voxis-landing/node_modules/playwright/index.js";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(2000);
const t = await p.evaluate(()=>document.body.scrollHeight);
await p.evaluate(y=>window.scrollTo(0,y), t*0.4);
await p.waitForTimeout(1200);
await p.screenshot({ path:"/tmp/rhythm.png" });
await b.close();
EOF
node /tmp/rhythm.mjs; kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` `/tmp/rhythm.png` — eyebrow→title дышит ровнее.

- [ ] **Step 2.2: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Architecture.tsx
git commit -m "polish(landing): 8pt vertical rhythm in info-card (eyebrow gap + tokenized margins)"
```
