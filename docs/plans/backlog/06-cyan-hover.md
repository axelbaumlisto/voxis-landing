# Backlog 06 — Cyan hover on nav/footer links

**Goal:** Nav-ссылки и footer-ссылки сейчас `hover:text-white` — cyan-бренд появляется только на focus-ring, никогда на hover. Сделать hover → cyan для единого accent-языка. (opus-3 L1)

**Files:** `src/components/Navbar.tsx`, `src/components/Footer.tsx`

---

## Task 1: Navbar links hover → cyan

- [ ] **Step 1.1: Три nav-ссылки + lang-switch**

В `src/components/Navbar.tsx` заменить во всех nav-ссылках и lang-Link `hover:text-white` → `hover:text-[var(--color-accent)]`:

```bash
cd /home/sham/work/voxis-landing
sed -i 's|hover:text-white transition-colors|hover:text-[var(--color-accent)] transition-colors|g' src/components/Navbar.tsx
```

(Затрагивает: `#architecture`, docs, github ссылки + `/ru`/`/` lang-switch Link'и. Логотип VOXIS не трогается — он не имеет hover:text-white.)

## Task 2: Footer links hover → cyan

- [ ] **Step 2.1: Footer nav-ссылки**

В `src/components/Footer.tsx`:
```bash
sed -i 's|hover:text-white transition-colors|hover:text-[var(--color-accent)] transition-colors|g' src/components/Footer.tsx
```

## Task 3: Verify + commit

- [ ] **Step 3.1: Grep — не осталось hover:text-white в nav/footer**
```bash
grep -nE "hover:text-white" src/components/Navbar.tsx src/components/Footer.tsx
```
Ожидание: 0 совпадений.

- [ ] **Step 3.2: Скриншот hover (через playwright :hover)**
```bash
npm run dev > /tmp/dev.log 2>&1 & DEV=$!; sleep 9
cat > /tmp/hover.mjs <<'EOF'
import { chromium } from "/home/sham/work/voxis-landing/node_modules/playwright/index.js";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport:{width:1440,height:900} })).newPage();
await p.goto("http://localhost:3000/", { waitUntil:"domcontentloaded" });
await p.waitForTimeout(1500);
await p.hover('nav a[href="#architecture"]');
await p.waitForTimeout(400);
await p.screenshot({ path:"/tmp/hover-nav.png" });
await b.close();
EOF
node /tmp/hover.mjs; kill $DEV 2>/dev/null; wait $DEV 2>/dev/null
```
`read` `/tmp/hover-nav.png` — «Architecture» ссылка под курсором cyan, не белая.

- [ ] **Step 3.3: Lint + build + commit**
```bash
npm run lint && npm run build
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "polish(landing): cyan hover on nav/footer links (consistent accent language)"
```
